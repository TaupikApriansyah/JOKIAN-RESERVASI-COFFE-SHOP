package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.CancelReservationRequest;
import reservasi.coffeshop.dto.CreateReservationRequest;
import reservasi.coffeshop.dto.ReservationResponse;
import reservasi.coffeshop.dto.StatusUpdateRequest;
import reservasi.coffeshop.entity.*;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.CafeTableRepository;
import reservasi.coffeshop.repository.CustomerOrderRepository;
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
import java.util.Optional;
import java.util.Comparator;

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
    private final CustomerOrderRepository orderRepository;
    private final TableService tableService;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public ReservationService(ReservationRepository reservationRepository, CafeTableRepository tableRepository, UserAccountRepository userRepository, CustomerOrderRepository orderRepository, TableService tableService, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
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
        int durationMinutes = tableService.resolveDuration(table, request.durationMinutes());
        if (request.reservationTime().plusMinutes(durationMinutes).isAfter(LocalTime.of(21, 0))) {
            throw new BadRequestException("Jam selesai reservasi melewati jam operasional. Pilih jam lebih awal atau durasi lebih pendek.");
        }
        if (tableService.hasConflict(table.getCode(), request.reservationDate(), request.reservationTime(), durationMinutes)) {
            throw new BadRequestException("Mohon maaf, meja tersebut sudah terisi pada rentang waktu yang dipilih. Silakan pilih meja atau jam alternatif.");
        }

        Reservation reservation = new Reservation();
        reservation.setCode(generateCode("RSV"));
        reservation.setGuestName(clean(request.guestName()));
        reservation.setPhone(clean(request.phone()));
        reservation.setReservationDate(request.reservationDate());
        reservation.setReservationTime(request.reservationTime());
        reservation.setDurationMinutes(durationMinutes);
        reservation.setReservationEndTime(request.reservationTime().plusMinutes(durationMinutes));
        reservation.setGuestCount(request.guestCount());
        reservation.setArea(clean(request.area()));
        reservation.setTable(table);
        reservation.setSpecialRequest(cleanNullable(request.specialRequest()));

        UserAccount shiftEmployee = findEmployeeByShift(request.reservationTime());
        if (shiftEmployee == null) {
            throw new BadRequestException("Belum ada pegawai aktif pada jam reservasi tersebut. Silakan hubungi admin atau pilih jam lain.");
        }
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservation.setAssignedEmployee(shiftEmployee.getFullName());
        reservation.setAssignedAt(LocalDateTime.now());

        Reservation saved = reservationRepository.save(reservation);
        log.info("Reservasi dibuat dan otomatis masuk ke shift: {} untuk meja {} ditangani {}", saved.getCode(), table.getCode(), saved.getAssignedEmployee());
        auditLogService.save("RESERVATION_CREATE", saved.getGuestName(), "Membuat reservasi " + saved.getCode() + " untuk meja " + table.getCode());
        auditLogService.save("RESERVATION_SHIFT_ASSIGN", "System", "Reservasi " + saved.getCode() + " otomatis masuk ke shift " + shiftEmployee.getFullName());
        realtimeService.publish("reservation_created");
        return mapper.toReservationResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findAll(LocalDate start, LocalDate end) {
        LocalDate safeStart = start != null ? start : LocalDate.now().minusDays(30);
        LocalDate safeEnd = end != null ? end : LocalDate.now().plusDays(30);
        return reservationRepository.findByReservationDateBetweenOrderByReservationDateDescReservationTimeDesc(safeStart, safeEnd)
                .stream().map(mapper::toReservationResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findByDate(LocalDate date) {
        return findByDate(date, null);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findByDate(LocalDate date, String employeeName) {
        List<Reservation> reservations;
        boolean workspaceMode = date == null && hasText(employeeName);

        if (workspaceMode) {
            // Workspace pegawai harus menampilkan reservasi aktif sesuai shift,
            // termasuk reservasi mendatang. Ini penting untuk demo ketika customer booking besok.
            reservations = reservationRepository.findByReservationDateBetweenOrderByReservationDateDescReservationTimeDesc(
                    LocalDate.now(),
                    LocalDate.now().plusDays(30)
            ).stream()
                    .filter(this::isVisibleInEmployeeWorkspace)
                    .sorted(Comparator
                            .comparing(Reservation::getReservationDate)
                            .thenComparing(Reservation::getReservationTime))
                    .toList();
        } else {
            LocalDate safeDate = date != null ? date : LocalDate.now();
            reservations = reservationRepository.findByReservationDateOrderByReservationTimeAsc(safeDate);
        }

        if (hasText(employeeName)) {
            String cleanEmployee = employeeName.trim();
            return findActiveEmployeeByIdentity(cleanEmployee)
                    .map(employee -> filterReservationsForEmployeeShift(reservations, employee))
                    .orElseGet(() -> reservations.stream()
                            .filter(reservation -> cleanEmployee.equalsIgnoreCase(cleanNullable(reservation.getAssignedEmployee())))
                            .toList())
                    .stream()
                    .map(mapper::toReservationResponse)
                    .toList();
        }
        return reservations.stream().map(mapper::toReservationResponse).toList();
    }

    private boolean isVisibleInEmployeeWorkspace(Reservation reservation) {
        return reservation.getStatus() == ReservationStatus.PENDING
                || reservation.getStatus() == ReservationStatus.CONFIRMED
                || reservation.getStatus() == ReservationStatus.CHECKED_IN
                || reservation.getStatus() == ReservationStatus.SERVING;
    }

    private Optional<UserAccount> findActiveEmployeeByIdentity(String identity) {
        if (!hasText(identity)) return Optional.empty();
        String cleanIdentity = identity.trim();
        Optional<UserAccount> byEmail = userRepository.findByEmailIgnoreCase(cleanIdentity)
                .filter(user -> user.getRole() == Role.PEGAWAI && user.isActive());
        if (byEmail.isPresent()) return byEmail;
        return userRepository.findByFullNameIgnoreCaseAndRoleAndActiveTrue(cleanIdentity, Role.PEGAWAI);
    }

    private List<Reservation> filterReservationsForEmployeeShift(List<Reservation> reservations, UserAccount employee) {
        String shiftName = employee.getShiftName() == null ? "" : employee.getShiftName().toLowerCase(Locale.ROOT);
        if (shiftName.contains("backup")) {
            return reservations;
        }
        LocalTime shiftStart = employee.getShiftStart();
        LocalTime shiftEnd = employee.getShiftEnd();
        if (shiftStart == null || shiftEnd == null) {
            return reservations.stream()
                    .filter(reservation -> employee.getFullName().equalsIgnoreCase(cleanNullable(reservation.getAssignedEmployee())))
                    .toList();
        }
        return reservations.stream()
                .filter(reservation -> reservation.getReservationTime() != null)
                .filter(reservation -> isReservationOverlappingShift(reservation, shiftStart, shiftEnd)
                        || employee.getFullName().equalsIgnoreCase(cleanNullable(reservation.getAssignedEmployee())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findCustomerReservations(String phone, String code) {
        if (code != null && !code.isBlank()) {
            return reservationRepository.findByCodeIgnoreCase(code).stream().map(mapper::toReservationResponse).toList();
        }
        if (phone == null || phone.isBlank()) {
            throw new BadRequestException("Masukkan kode reservasi atau nomor WhatsApp untuk melihat data reservasi.");
        }
        return reservationRepository.findByPhoneContainingIgnoreCaseOrderByReservationDateDescReservationTimeDesc(phone).stream().map(mapper::toReservationResponse).toList();
    }

    /*
     * Alur terbaru tidak memakai assign manual dari admin.
     * Reservasi otomatis masuk ke pegawai sesuai shift saat customer membuat reservasi.
     */

    @Transactional
    public ReservationResponse updateStatus(Long id, StatusUpdateRequest request) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Reservasi tidak ditemukan."));
        ReservationStatus status = parseStatus(request.status());
        validateStatusTransition(reservation.getStatus(), status);
        validateOperationalRules(reservation, status);
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
        LocalDateTime reservationStart = LocalDateTime.of(reservation.getReservationDate(), reservation.getReservationTime());
        if (LocalDateTime.now().isAfter(reservationStart.minusHours(1))) {
            throw new BadRequestException("Reservasi hanya dapat dibatalkan maksimal 1 jam sebelum waktu kedatangan.");
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

    private void validateOperationalRules(Reservation reservation, ReservationStatus next) {
        if (next == ReservationStatus.COMPLETED) {
            boolean hasUnfinishedOrders = orderRepository.existsByReservation_IdAndStatusNotIn(
                    reservation.getId(),
                    Set.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED)
            );
            if (hasUnfinishedOrders) {
                throw new BadRequestException("Reservasi belum dapat diselesaikan karena masih ada pesanan yang belum selesai atau belum dibayar.");
            }
        }
        if (next == ReservationStatus.NO_SHOW && reservation.getStatus() == ReservationStatus.CONFIRMED) {
            LocalDateTime tolerance = LocalDateTime.of(reservation.getReservationDate(), reservation.getReservationTime()).plusMinutes(30);
            if (LocalDateTime.now().isBefore(tolerance)) {
                throw new BadRequestException("No-show hanya dapat ditandai setelah melewati toleransi 30 menit dari jam reservasi.");
            }
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
        Integer duration = request.durationMinutes();
        if (duration != null && (duration < 60 || duration > 240)) {
            throw new BadRequestException("Durasi reservasi harus 60 sampai 240 menit.");
        }
    }

    private boolean isReservationOverlappingShift(Reservation reservation, LocalTime shiftStart, LocalTime shiftEnd) {
        LocalTime reservationStart = reservation.getReservationTime();
        LocalTime reservationEnd = reservation.getReservationEndTime();
        if (reservationEnd == null && reservationStart != null) {
            int duration = reservation.getDurationMinutes() > 0 ? reservation.getDurationMinutes() : 120;
            reservationEnd = reservationStart.plusMinutes(duration);
        }
        if (reservationStart == null) return false;
        if (reservationEnd == null || reservationEnd.equals(reservationStart)) {
            return isTimeInsideShift(reservationStart, shiftStart, shiftEnd);
        }
        if (shiftStart.equals(shiftEnd)) return true;
        if (shiftStart.isBefore(shiftEnd)) {
            return reservationStart.isBefore(shiftEnd) && reservationEnd.isAfter(shiftStart);
        }
        return !reservationStart.isBefore(shiftStart) || reservationEnd.isAfter(shiftStart) || reservationStart.isBefore(shiftEnd);
    }

    private UserAccount findEmployeeByShift(LocalTime reservationTime) {
        List<UserAccount> employees = userRepository.findByRoleAndActiveTrueOrderByFullNameAsc(Role.PEGAWAI);
        return employees.stream()
                .filter(employee -> employee.getShiftStart() != null && employee.getShiftEnd() != null)
                .sorted((left, right) -> Integer.compare(shiftPriority(left), shiftPriority(right)))
                .filter(employee -> isTimeInsideShift(reservationTime, employee.getShiftStart(), employee.getShiftEnd()))
                .findFirst()
                .orElseGet(() -> fallbackEmployeeByTime(employees, reservationTime));
    }

    private UserAccount fallbackEmployeeByTime(List<UserAccount> employees, LocalTime reservationTime) {
        String keyword = reservationTime.isBefore(LocalTime.of(15, 0)) ? "pagi" : "sore";
        return employees.stream()
                .filter(employee -> employee.getFullName() != null && employee.getFullName().toLowerCase(Locale.ROOT).contains(keyword))
                .findFirst()
                .orElse(employees.isEmpty() ? null : employees.get(0));
    }

    private int shiftPriority(UserAccount employee) {
        String shift = employee.getShiftName() == null ? "" : employee.getShiftName().toLowerCase(Locale.ROOT);
        return shift.contains("backup") ? 1 : 0;
    }

    private boolean isTimeInsideShift(LocalTime time, LocalTime start, LocalTime end) {
        if (start.equals(end)) return true;
        if (start.isBefore(end)) {
            boolean insideMainRange = !time.isBefore(start) && time.isBefore(end);
            boolean closingTime = time.equals(end) && end.equals(LocalTime.of(21, 0));
            return insideMainRange || closingTime;
        }
        return !time.isBefore(start) || time.isBefore(end);
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
