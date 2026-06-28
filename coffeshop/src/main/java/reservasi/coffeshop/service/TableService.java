package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.CreateTableRequest;
import reservasi.coffeshop.dto.TableResponse;
import reservasi.coffeshop.dto.UpdateTableRequest;
import reservasi.coffeshop.entity.CafeTable;
import reservasi.coffeshop.entity.Reservation;
import reservasi.coffeshop.entity.ReservationStatus;
import reservasi.coffeshop.entity.TablePhysicalStatus;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.CafeTableRepository;
import reservasi.coffeshop.repository.ReservationRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class TableService {
    private static final Logger log = LoggerFactory.getLogger(TableService.class);
    private static final int RESERVATION_BUFFER_MINUTES = 120;
    private final CafeTableRepository tableRepository;
    private final ReservationRepository reservationRepository;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public TableService(CafeTableRepository tableRepository, ReservationRepository reservationRepository, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.tableRepository = tableRepository;
        this.reservationRepository = reservationRepository;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    public List<TableResponse> findAllMaster() {
        return tableRepository.findAllByOrderByFloorAscAreaAscCodeAsc().stream()
                .map(table -> new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "MASTER", "Data master meja"))
                .toList();
    }

    public List<TableResponse> getAvailability(LocalDate date, LocalTime time, int guests, String area, String floor) {
        List<CafeTable> tables = loadTables(area, floor);
        return tables.stream().map(table -> toAvailability(table, date, time, guests)).toList();
    }

    public boolean hasConflict(String tableCode, LocalDate date, LocalTime time) {
        List<Reservation> activeReservations = reservationRepository.findActiveByTableAndDate(
                tableCode,
                date,
                Set.of(ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.NO_SHOW)
        );
        return activeReservations.stream().anyMatch(r -> Math.abs(java.time.Duration.between(r.getReservationTime(), time).toMinutes()) < RESERVATION_BUFFER_MINUTES);
    }

    @Transactional
    public TableResponse create(CreateTableRequest request) {
        if (tableRepository.existsByCodeIgnoreCase(request.code())) {
            throw new BadRequestException("Kode meja sudah digunakan.");
        }
        CafeTable table = new CafeTable();
        apply(table, request.code(), request.area(), request.floor(), request.capacity(), request.physicalStatus());
        CafeTable saved = tableRepository.save(table);
        log.info("Master meja dibuat: {} {} {}", saved.getCode(), saved.getFloor(), saved.getArea());
        auditLogService.save("TABLE_CREATE", "Admin", "Menambah meja " + saved.getCode());
        realtimeService.publish("table_created");
        return new TableResponse(saved.getId(), saved.getCode(), saved.getArea(), saved.getFloor(), saved.getCapacity(), saved.getPhysicalStatus().name(), "MASTER", "Data master meja");
    }

    @Transactional
    public TableResponse update(Long id, UpdateTableRequest request) {
        CafeTable table = tableRepository.findById(id).orElseThrow(() -> new NotFoundException("Data meja tidak ditemukan."));
        if (tableRepository.existsByCodeIgnoreCaseAndIdNot(request.code(), id)) {
            throw new BadRequestException("Kode meja sudah digunakan oleh data lain.");
        }
        apply(table, request.code(), request.area(), request.floor(), request.capacity(), request.physicalStatus());
        CafeTable saved = tableRepository.save(table);
        log.info("Master meja diperbarui: {}", saved.getCode());
        auditLogService.save("TABLE_UPDATE", "Admin", "Memperbarui meja " + saved.getCode());
        realtimeService.publish("table_updated");
        return new TableResponse(saved.getId(), saved.getCode(), saved.getArea(), saved.getFloor(), saved.getCapacity(), saved.getPhysicalStatus().name(), "MASTER", "Data master meja");
    }

    @Transactional
    public void delete(Long id) {
        CafeTable table = tableRepository.findById(id).orElseThrow(() -> new NotFoundException("Data meja tidak ditemukan."));
        if (reservationRepository.existsByTable_Id(id)) {
            throw new BadRequestException("Meja tidak dapat dihapus karena sudah memiliki riwayat reservasi. Ubah status ke MAINTENANCE jika tidak ingin digunakan.");
        }
        tableRepository.delete(table);
        log.info("Master meja dihapus: {}", table.getCode());
        auditLogService.save("TABLE_DELETE", "Admin", "Menghapus meja " + table.getCode());
        realtimeService.publish("table_deleted");
    }

    private List<CafeTable> loadTables(String area, String floor) {
        boolean hasArea = area != null && !area.isBlank() && !area.equalsIgnoreCase("Semua");
        boolean hasFloor = floor != null && !floor.isBlank() && !floor.equalsIgnoreCase("Semua");
        if (hasArea && hasFloor) return tableRepository.findByAreaIgnoreCaseAndFloorIgnoreCaseOrderByCodeAsc(area, floor);
        if (hasArea) return tableRepository.findByAreaIgnoreCaseOrderByFloorAscCodeAsc(area);
        if (hasFloor) return tableRepository.findByFloorIgnoreCaseOrderByAreaAscCodeAsc(floor);
        return tableRepository.findAllByOrderByFloorAscAreaAscCodeAsc();
    }

    private void apply(CafeTable table, String code, String area, String floor, int capacity, String statusValue) {
        table.setCode(cleanUpper(code));
        table.setArea(clean(area));
        table.setFloor(clean(floor));
        table.setCapacity(capacity);
        table.setPhysicalStatus(parseStatus(statusValue));
    }

    private TablePhysicalStatus parseStatus(String statusValue) {
        if (statusValue == null || statusValue.isBlank()) return TablePhysicalStatus.AVAILABLE;
        try {
            return TablePhysicalStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Status fisik meja tidak valid. Gunakan AVAILABLE atau MAINTENANCE.");
        }
    }

    private TableResponse toAvailability(CafeTable table, LocalDate date, LocalTime time, int guests) {
        if (table.getPhysicalStatus() == TablePhysicalStatus.MAINTENANCE) {
            return new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "MAINTENANCE", "Meja sedang tidak digunakan.");
        }
        if (guests > table.getCapacity()) {
            return new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "CAPACITY_MISMATCH", "Kapasitas meja tidak sesuai jumlah tamu.");
        }
        if (date != null && time != null) {
            List<Reservation> activeReservations = reservationRepository.findActiveByTableAndDate(
                    table.getCode(), date, Set.of(ReservationStatus.CANCELLED, ReservationStatus.COMPLETED, ReservationStatus.NO_SHOW)
            );
            Reservation matched = activeReservations.stream()
                    .filter(r -> Math.abs(java.time.Duration.between(r.getReservationTime(), time).toMinutes()) < RESERVATION_BUFFER_MINUTES)
                    .findFirst()
                    .orElse(null);
            if (matched != null && (matched.getStatus() == ReservationStatus.CHECKED_IN || matched.getStatus() == ReservationStatus.SERVING)) {
                return new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "OCCUPIED", "Customer sudah check-in atau sedang dilayani.");
            }
            if (matched != null) {
                return new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "RESERVED", "Meja sudah memiliki reservasi pada jam tersebut.");
            }
        }
        return new TableResponse(table.getId(), table.getCode(), table.getArea(), table.getFloor(), table.getCapacity(), table.getPhysicalStatus().name(), "AVAILABLE", "Tersedia untuk reservasi.");
    }

    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String cleanUpper(String value) { return clean(value).toUpperCase(Locale.ROOT); }
}
