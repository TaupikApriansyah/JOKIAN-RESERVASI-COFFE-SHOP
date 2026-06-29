package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.CreateOrderRequest;
import reservasi.coffeshop.dto.OrderResponse;
import reservasi.coffeshop.entity.*;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.CustomerOrderRepository;
import reservasi.coffeshop.repository.MenuItemRepository;
import reservasi.coffeshop.repository.ReservationRepository;
import reservasi.coffeshop.repository.UserAccountRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.Optional;
import java.util.Comparator;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED_ORDER_FLOW = Map.of(
            OrderStatus.PENDING_PAYMENT, Set.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED),
            OrderStatus.PROCESSING, Set.of(OrderStatus.READY, OrderStatus.CANCELLED),
            OrderStatus.READY, Set.of(OrderStatus.COMPLETED, OrderStatus.CANCELLED),
            OrderStatus.COMPLETED, Set.of(OrderStatus.COMPLETED),
            OrderStatus.CANCELLED, Set.of(OrderStatus.CANCELLED)
    );
    private final CustomerOrderRepository orderRepository;
    private final ReservationRepository reservationRepository;
    private final UserAccountRepository userRepository;
    private final MenuItemRepository menuRepository;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public OrderService(CustomerOrderRepository orderRepository, ReservationRepository reservationRepository, UserAccountRepository userRepository, MenuItemRepository menuRepository, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.orderRepository = orderRepository;
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.menuRepository = menuRepository;
        this.mapper = mapper;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        Reservation reservation = reservationRepository.findByCodeIgnoreCase(request.reservationCode())
                .orElseThrow(() -> new NotFoundException("Kode reservasi tidak ditemukan. Selesaikan reservasi meja terlebih dahulu."));
        if (reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.COMPLETED || reservation.getStatus() == ReservationStatus.NO_SHOW) {
            throw new BadRequestException("Reservasi sudah tidak aktif. Pesanan menu tidak dapat dibuat.");
        }
        if (reservation.getStatus() == ReservationStatus.PENDING) {
            throw new BadRequestException("Reservasi belum terkonfirmasi. Tunggu sistem mengonfirmasi meja dan shift terlebih dahulu.");
        }

        CustomerOrder order = new CustomerOrder();
        order.setCode(generateCode("ORD"));
        order.setReservation(reservation);
        order.setStatus(OrderStatus.PENDING_PAYMENT);

        BigDecimal subtotal = BigDecimal.ZERO;
        Map<String, Integer> categoryQty = new LinkedHashMap<>();
        boolean hasRiceBowl = false;
        boolean hasCoffee = false;

        for (var itemRequest : request.items()) {
            MenuItem menu = menuRepository.findById(itemRequest.menuItemId())
                    .orElseThrow(() -> new NotFoundException("Menu dengan ID " + itemRequest.menuItemId() + " tidak ditemukan."));
            if (!menu.isAvailable()) {
                throw new BadRequestException("Menu " + menu.getName() + " sedang tidak tersedia.");
            }
            CustomerOrderItem item = new CustomerOrderItem();
            item.setOrder(order);
            item.setMenuItem(menu);
            item.setQuantity(itemRequest.quantity());
            item.setPrice(menu.getPrice());
            item.setLineTotal(menu.getPrice().multiply(BigDecimal.valueOf(itemRequest.quantity())));
            order.getItems().add(item);
            subtotal = subtotal.add(item.getLineTotal());

            String category = menu.getCategory().toLowerCase(Locale.ROOT);
            categoryQty.merge(category, itemRequest.quantity(), Integer::sum);
            hasCoffee = hasCoffee || category.contains("coffee");
            hasRiceBowl = hasRiceBowl || menu.getName().toLowerCase(Locale.ROOT).contains("rice bowl");
        }

        PromoResult promo = calculatePromo(subtotal, categoryQty, hasCoffee, hasRiceBowl);
        order.setSubtotal(subtotal);
        order.setDiscount(promo.discount());
        order.setTotal(subtotal.subtract(promo.discount()));
        order.setAppliedPromo(promo.description());
        CustomerOrder saved = orderRepository.save(order);
        log.info("Pesanan dibuat: {} untuk reservasi {}", saved.getCode(), reservation.getCode());
        auditLogService.save("ORDER_CREATE", reservation.getGuestName(), "Membuat pesanan " + saved.getCode() + " untuk reservasi " + reservation.getCode());
        realtimeService.publish("order_created");
        return mapper.toOrderResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findByReservation(String reservationCode) {
        if (reservationCode == null || reservationCode.isBlank()) {
            throw new BadRequestException("Kode reservasi wajib diisi untuk melihat pesanan.");
        }
        return orderRepository.findByReservation_CodeIgnoreCaseOrderByCreatedAtDesc(reservationCode).stream().map(mapper::toOrderResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findToday() {
        return findToday(null);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findToday(String employeeName) {
        if (employeeName != null && !employeeName.isBlank()) {
            // Workspace pegawai harus membaca pesanan dari jadwal reservasi, bukan dari tanggal pesanan dibuat.
            // Ini membuat pembayaran/pesanan customer muncul di pegawai shift yang sama seperti reservasi.
            LocalDate startDate = LocalDate.now();
            LocalDate endDate = startDate.plusDays(30);
            List<CustomerOrder> scheduledOrders = orderRepository.findByReservationDateBetweenOrderByReservationSchedule(startDate, endDate)
                    .stream()
                    .filter(this::isVisibleInEmployeeWorkspace)
                    .sorted(Comparator
                            .comparing((CustomerOrder order) -> order.getReservation().getReservationDate())
                            .thenComparing(order -> order.getReservation().getReservationTime())
                            .thenComparing(CustomerOrder::getCreatedAt))
                    .toList();

            String cleanEmployee = employeeName.trim();
            return findActiveEmployeeByIdentity(cleanEmployee)
                    .map(employee -> filterOrdersForEmployeeShift(scheduledOrders, employee))
                    .orElseGet(() -> scheduledOrders.stream()
                            .filter(order -> order.getReservation() != null && cleanEmployee.equalsIgnoreCase(cleanNullable(order.getReservation().getAssignedEmployee())))
                            .toList())
                    .stream()
                    .map(mapper::toOrderResponse)
                    .toList();
        }

        LocalDateTime start = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime end = LocalDateTime.now().with(LocalTime.MAX);
        List<CustomerOrder> todayOrders = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end);
        return todayOrders.stream().map(mapper::toOrderResponse).toList();
    }


    private boolean isVisibleInEmployeeWorkspace(CustomerOrder order) {
        if (order == null || order.getReservation() == null) return false;
        boolean activeOrder = order.getStatus() == OrderStatus.PENDING_PAYMENT
                || order.getStatus() == OrderStatus.PROCESSING
                || order.getStatus() == OrderStatus.READY;
        boolean activeReservation = order.getReservation().getStatus() == ReservationStatus.CONFIRMED
                || order.getReservation().getStatus() == ReservationStatus.CHECKED_IN
                || order.getReservation().getStatus() == ReservationStatus.SERVING;
        return activeOrder && activeReservation;
    }

    private Optional<UserAccount> findActiveEmployeeByIdentity(String identity) {
        if (identity == null || identity.trim().isBlank()) return Optional.empty();
        String cleanIdentity = identity.trim();
        Optional<UserAccount> byEmail = userRepository.findByEmailIgnoreCase(cleanIdentity)
                .filter(user -> user.getRole() == Role.PEGAWAI && user.isActive());
        if (byEmail.isPresent()) return byEmail;
        return userRepository.findByFullNameIgnoreCaseAndRoleAndActiveTrue(cleanIdentity, Role.PEGAWAI);
    }

    private List<CustomerOrder> filterOrdersForEmployeeShift(List<CustomerOrder> orders, UserAccount employee) {
        String shiftName = employee.getShiftName() == null ? "" : employee.getShiftName().toLowerCase(Locale.ROOT);
        if (shiftName.contains("backup")) {
            return orders;
        }
        LocalTime shiftStart = employee.getShiftStart();
        LocalTime shiftEnd = employee.getShiftEnd();
        if (shiftStart == null || shiftEnd == null) {
            return orders.stream()
                    .filter(order -> order.getReservation() != null && employee.getFullName().equalsIgnoreCase(cleanNullable(order.getReservation().getAssignedEmployee())))
                    .toList();
        }
        return orders.stream()
                .filter(order -> order.getReservation() != null && order.getReservation().getReservationTime() != null)
                .filter(order -> isReservationOverlappingShift(order.getReservation(), shiftStart, shiftEnd)
                        || employee.getFullName().equalsIgnoreCase(cleanNullable(order.getReservation().getAssignedEmployee())))
                .toList();
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

    private boolean isTimeInsideShift(LocalTime time, LocalTime start, LocalTime end) {
        if (start.equals(end)) return true;
        if (start.isBefore(end)) {
            boolean insideMainRange = !time.isBefore(start) && time.isBefore(end);
            boolean closingTime = time.equals(end) && end.equals(LocalTime.of(21, 0));
            return insideMainRange || closingTime;
        }
        return !time.isBefore(start) || time.isBefore(end);
    }

    private String cleanNullable(String value) { return value == null || value.trim().isBlank() ? null : value.trim(); }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(mapper::toOrderResponse).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String statusValue) {
        return updateStatus(id, statusValue, "Pegawai");
    }

    @Transactional
    public OrderResponse updateStatus(Long id, String statusValue, String actorName) {
        CustomerOrder order = orderRepository.findById(id).orElseThrow(() -> new NotFoundException("Pesanan tidak ditemukan."));
        OrderStatus status;
        try {
            status = OrderStatus.valueOf(statusValue.trim().toUpperCase(Locale.ROOT));
        } catch (Exception ex) {
            throw new BadRequestException("Status pesanan tidak valid.");
        }
        validateOrderTransition(order.getStatus(), status);
        validateOrderOperationalRules(order, status);
        order.setStatus(status);
        order.setHandledBy(actorName == null || actorName.isBlank() ? "Pegawai" : actorName.trim());
        order.setHandledAt(LocalDateTime.now());
        if (status == OrderStatus.PROCESSING) {
            order.getReservation().setStatus(ReservationStatus.SERVING);
            order.getReservation().setHandledBy(order.getHandledBy());
            order.getReservation().setHandledAt(LocalDateTime.now());
            if (order.getReservation().getAssignedEmployee() == null || order.getReservation().getAssignedEmployee().isBlank()) {
                order.getReservation().setAssignedEmployee(order.getHandledBy());
                order.getReservation().setAssignedAt(LocalDateTime.now());
            }
        }
        CustomerOrder saved = orderRepository.save(order);
        log.info("Status pesanan {} diubah menjadi {}", saved.getCode(), saved.getStatus());
        auditLogService.save("ORDER_STATUS", saved.getHandledBy(), "Mengubah status pesanan " + saved.getCode() + " menjadi " + saved.getStatus());
        realtimeService.publish("order_updated");
        return mapper.toOrderResponse(saved);
    }

    private void validateOrderTransition(OrderStatus current, OrderStatus next) {
        if (!ALLOWED_ORDER_FLOW.getOrDefault(current, Set.of()).contains(next)) {
            throw new BadRequestException("Alur pesanan tidak valid. Gunakan alur PENDING_PAYMENT → PROCESSING → READY → COMPLETED atau CANCELLED.");
        }
    }

    private void validateOrderOperationalRules(CustomerOrder order, OrderStatus next) {
        ReservationStatus reservationStatus = order.getReservation().getStatus();
        if (next == OrderStatus.PROCESSING && reservationStatus != ReservationStatus.CHECKED_IN && reservationStatus != ReservationStatus.SERVING) {
            throw new BadRequestException("Pesanan baru dapat dibayar dan diproses setelah customer check-in.");
        }
        if (next == OrderStatus.COMPLETED && order.getStatus() != OrderStatus.READY) {
            throw new BadRequestException("Pesanan hanya dapat diselesaikan setelah status READY.");
        }
    }

    private PromoResult calculatePromo(BigDecimal subtotal, Map<String, Integer> categoryQty, boolean hasCoffee, boolean hasRiceBowl) {
        if (subtotal.compareTo(BigDecimal.valueOf(300000)) >= 0) {
            return new PromoResult(BigDecimal.valueOf(40000), "Promo Rp300K: gratis Classic Tiramisu senilai Rp40.000.");
        }
        int coffeeQty = categoryQty.entrySet().stream()
                .filter(e -> e.getKey().contains("coffee"))
                .mapToInt(Map.Entry::getValue)
                .sum();
        if (coffeeQty >= 2) {
            return new PromoResult(BigDecimal.valueOf(28000), "Promo Coffee Pair: gratis Butter Croissant senilai Rp28.000.");
        }
        if (hasCoffee && hasRiceBowl) {
            return new PromoResult(BigDecimal.valueOf(15000), "Promo Lunch Pairing: potongan Rp15.000 untuk Rice Bowl + Coffee.");
        }
        return new PromoResult(BigDecimal.ZERO, null);
    }

    private String generateCode(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT);
    }

    private record PromoResult(BigDecimal discount, String description) {}
}
