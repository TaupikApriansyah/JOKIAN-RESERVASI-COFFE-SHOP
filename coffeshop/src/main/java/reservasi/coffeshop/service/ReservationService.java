package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.AssignEmployeeRequest;
import reservasi.coffeshop.dto.CancelReservationRequest;
import reservasi.coffeshop.dto.CreateReservationRequest;
import reservasi.coffeshop.dto.ReservationResponse;
import reservasi.coffeshop.dto.StatusUpdateRequest;
import reservasi.coffeshop.entity.*;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.CafeTableRepository;
import reservasi.coffeshop.repository.ReservationRepository;
import reservasi.coffeshop.repository.UserAccountRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class ReservationService {
    private static final Logger log = LoggerFactory.getLogger(ReservationService.class);
    private static final Map<ReservationStatus, Set<ReservationStatus>> ALLOWED_FLOW = Map.of(
            ReservationStatus.PENDING, Set.of(ReservationStatus.CONFIRMED, ReservationStatus.CHECKED_IN, ReservationStatus.CANCELLED),
            ReservationStatus.CONFIRMED, Set.of(ReservationStatus.CHECKED_IN, ReservationStatus.CANCELLED, ReservationStatus.NO_SHOW),
            ReservationStatus.CHECKED_IN, Set.of(ReservationStatus.SERVING, ReservationStatus.COMPLETED, ReservationStatus.CANCELLED),
            ReservationStatus.SERVING, Set.of(ReservationStatus.COMPLETED, ReservationStatus.CANCELLED),
            ReservationStatus.COMPLETED, Set.of(ReservationStatus.COMPLETED),
            ReservationStatus.CANCELLED, Set.of(ReservationStatus.CANCELLED),
            ReservationStatus.NO_SHOW, Set.of(ReservationStatus.NO_SHOW)
    );

    private final ReservationRepository reservationRepository;
    private final CafeTableRepository tableRepository;
    private final UserAccountRepository userRepository;
    private final TableService tableService;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public ReservationService(ReservationRepository reservationRepository, CafeTableRepository tableRepository, UserAccountRepository userRepository, TableService tableService, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
        this.tableService = tableService;
        this.mapper = mapper;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public ReservationResponse create(CreateReservationRequest request) {
        validateBusinessRules(request);
        CafeTable table = tableRepository.findByCodeIgnoreCase(request.tableCode())
                .orElseThrow(() -> new NotFoundException("Meja yang dipilih tidak ditemukan."));
        if (!table.getArea().equalsIgnoreCase(request.area())) {
            throw new BadRequestException("Meja tidak sesuai dengan preferensi area yang dipilih.");
        }
        if (table.getPhysicalStatus() == TablePhysicalStatus.MAINTENANCE) {
            throw new BadRequestException("Meja sedang tidak tersedia untuk reservasi.");
        }
        if (request.guestCount() > table.getCapacity()) {
            throw new BadRequestException("Jumlah tamu melebihi kapasitas meja yang dipilih.");
        }
        if (tableService.hasConflict(table.getCode(), request.reservationDate(), request.reservationTime())) {
            throw new BadRequestException("Mohon maaf, meja tersebut sudah terisi pada waktu yang dipilih. Silakan pilih meja atau jam alternatif.");
        }

        Reservation reservation = new Reservation();
        reservation.setCode(generateCode("RSV"));
        reservation.setGuestName(clean(request.guestName()));
        reservation.setPhone(clean(request.phone()));
        reservation.setReservationDate(request.reservationDate());
        reservation.setReservationTime(request.reservationTime());
        reservation.setGuestCount(request.guestCount());
        reservation.setArea(clean(request.area()));
        reservation.setTable(table);
        reservation.setSpecialRequest(cleanNullable(request.specialRequest()));
        reservation.setStatus(ReservationStatus.PENDING);
        Reservation saved = reservationRepository.save(reservation);
        log.info("Reservasi dibuat: {} untuk meja {}", saved.getCode(), table.getCode());
        auditLogService.save("RESERVATION_CREATE", saved.getGuestName(), "Membuat reservasi " + saved.getCode() + " untuk meja " + table.getCode());
        realtimeService.publish("reservation_created");
        return mapper.toReservationResponse(saved);
    }

    public List<ReservationResponse> findAll(LocalDate start, LocalDate end) {
        LocalDate safeStart = start != null ? start : LocalDate.now().minusDays(30);
        LocalDate safeEnd = end != null ? end : LocalDate.now().plusDays(30);
        return reservationRepository.findByReservationDateBetweenOrderByReservationDateDescReservationTimeDesc(safeStart, safeEnd)
                .stream().map(mapper::toReservationResponse).toList();
    }

    public List<ReservationResponse> findByDate(LocalDate date) {
        LocalDate safeDate = date != null ? date : LocalDate.now();
        return reservationRepository.findByReservationDateOrderByReservationTimeAsc(safeDate).stream().map(mapper::toReservationResponse).toList();
    }

    public List<ReservationResponse> findCustomerReservations(String phone, String code) {
        if (code != null && !code.isBlank()) {
            return reservationRepository.findByCodeIgnoreCase(code).stream().map(mapper::toReservationResponse).toList();
        }
        if (phone == null || phone.isBlank()) {
            throw new BadRequestException("Masukkan kode reservasi atau nomor WhatsApp untuk melihat data reservasi.");
        }
        return reservationRepository.findByPhoneContainingIgnoreCaseOrderByReservationDateDescReservationTimeDesc(phone).stream().map(mapper::toReservationResponse).toList();
    }

    @Transactional
    public ReservationResponse assignEmployee(Long id, AssignEmployeeRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservasi tidak ditemukan."));
        if (reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.COMPLETED || reservation.getStatus() == ReservationStatus.NO_SHOW) {
            throw new BadRequestException("Reservasi yang sudah selesai, batal, atau no-show tidak dapat di-assign ulang.");
        }
        String employeeName = clean(request.employeeName());
        userRepository.findByFullNameIgnoreCaseAndRoleAndActiveTrue(employeeName, Role.PEGAWAI)
                .orElseThrow(() -> new BadRequestException("Pegawai aktif tidak ditemukan."));
        reservation.setAssignedEmployee(employeeName);
        reservation.setAssignedAt(LocalDateTime.now());
        if (reservation.getStatus() == ReservationStatus.PENDING) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        }
        Reservation saved = reservationRepository.save(reservation);
        log.info("Reservasi {} di-assign ke {}", saved.getCode(), employeeName);
        auditLogService.save("RESERVATION_ASSIGN", "Admin", "Menugaskan reservasi " + saved.getCode() + " kepada " + employeeName);
        realtimeService.publish("reservation_assigned");
        return mapper.toReservationResponse(saved);
    }

    @Transactional
    public ReservationResponse updateStatus(Long id, StatusUpdateRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservasi tidak ditemukan."));
        ReservationStatus status = parseStatus(request.status());
        validateStatusTransition(reservation.getStatus(), status);
        applyStatus(reservation, status, request.actorName(), request.reason());
        Reservation saved = reservationRepository.save(reservation);
        log.info("Status reservasi {} diubah menjadi {}", saved.getCode(), saved.getStatus());
        auditLogService.save("RESERVATION_STATUS", safeActor(request.actorName()), "Mengubah status " + saved.getCode() + " menjadi " + saved.getStatus());
        realtimeService.publish("reservation_updated");
        return mapper.toReservationResponse(saved);
    }

    @Transactional
    public ReservationResponse cancelByCustomer(Long id, CancelReservationRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservasi tidak ditemukan."));
        if (reservation.getStatus() == ReservationStatus.CHECKED_IN || reservation.getStatus() == ReservationStatus.SERVING || reservation.getStatus() == ReservationStatus.COMPLETED || reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.NO_SHOW) {
            throw new BadRequestException("Reservasi ini tidak dapat dibatalkan lagi.");
        }
        if (request.phone() != null && !request.phone().isBlank() && !reservation.getPhone().equalsIgnoreCase(request.phone().trim())) {
            throw new BadRequestException("Nomor WhatsApp tidak sesuai dengan data reservasi.");
        }
        applyStatus(reservation, ReservationStatus.CANCELLED, reservation.getGuestName(), request.reason());
        Reservation saved = reservationRepository.save(reservation);
        log.info("Reservasi {} dibatalkan customer", saved.getCode());
        auditLogService.save("RESERVATION_CANCEL", saved.getGuestName(), "Membatalkan reservasi " + saved.getCode());
        realtimeService.publish("reservation_cancelled");
        return mapper.toReservationResponse(saved);
    }

    private void applyStatus(Reservation reservation, ReservationStatus status, String actor, String reason) {
        reservation.setStatus(status);
        reservation.setHandledBy(safeActor(actor));
        reservation.setHandledAt(LocalDateTime.now());
        if (isEmployeeActor(actor) && !hasText(reservation.getAssignedEmployee())) {
            reservation.setAssignedEmployee(safeActor(actor));
            reservation.setAssignedAt(LocalDateTime.now());
        }
        if (status == ReservationStatus.CHECKED_IN && reservation.getCheckedInAt() == null) reservation.setCheckedInAt(LocalDateTime.now());
        if (status == ReservationStatus.COMPLETED && reservation.getCompletedAt() == null) reservation.setCompletedAt(LocalDateTime.now());
        if (status == ReservationStatus.CANCELLED) {
            reservation.setCancelledAt(LocalDateTime.now());
            reservation.setCancelReason(cleanNullable(reason));
        }
        if (status == ReservationStatus.NO_SHOW) {
            reservation.setCancelReason(cleanNullable(reason == null ? "Customer tidak hadir." : reason));
        }
    }

    private void validateStatusTransition(ReservationStatus current, ReservationStatus next) {
        if (!ALLOWED_FLOW.getOrDefault(current, Set.of()).contains(next)) {
            throw new BadRequestException("Alur status tidak valid. Gunakan alur PENDING → CONFIRMED → CHECKED_IN → SERVING → COMPLETED, atau CANCELLED/NO_SHOW sesuai kondisi.");
        }
    }

    private ReservationStatus parseStatus(String value) {
        try {
            return ReservationStatus.valueOf(value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Status reservasi tidak valid.");
        }
    }

    private void validateBusinessRules(CreateReservationRequest request) {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (request.reservationDate().isEqual(today) && request.reservationTime().isBefore(now.plusMinutes(30))) {
            throw new BadRequestException("Reservasi hari ini minimal dilakukan 30 menit sebelum waktu kedatangan.");
        }
        if (request.reservationTime().isBefore(LocalTime.of(9, 0)) || request.reservationTime().isAfter(LocalTime.of(21, 0))) {
            throw new BadRequestException("Jam reservasi tersedia pukul 09.00 sampai 21.00.");
        }
    }

    private String generateCode(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    private boolean isEmployeeActor(String actor) {
        return actor != null && !actor.isBlank() && !actor.toLowerCase(Locale.ROOT).contains("admin") && !actor.toLowerCase(Locale.ROOT).contains("customer");
    }

    private boolean hasText(String value) { return value != null && !value.isBlank(); }
    private String safeActor(String actor) { return actor == null || actor.isBlank() ? "System" : actor.trim(); }
    private String clean(String value) { return value == null ? "" : value.trim(); }
    private String cleanNullable(String value) { return value == null || value.trim().isBlank() ? null : value.trim(); }
}
