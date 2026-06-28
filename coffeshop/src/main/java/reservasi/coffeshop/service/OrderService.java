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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Service
public class OrderService {
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    private final CustomerOrderRepository orderRepository;
    private final ReservationRepository reservationRepository;
    private final MenuItemRepository menuRepository;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public OrderService(CustomerOrderRepository orderRepository, ReservationRepository reservationRepository, MenuItemRepository menuRepository, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.orderRepository = orderRepository;
        this.reservationRepository = reservationRepository;
        this.menuRepository = menuRepository;
        this.mapper = mapper;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {
        Reservation reservation = reservationRepository.findByCodeIgnoreCase(request.reservationCode())
                .orElseThrow(() -> new NotFoundException("Kode reservasi tidak ditemukan. Selesaikan reservasi meja terlebih dahulu."));
        if (reservation.getStatus() == ReservationStatus.CANCELLED || reservation.getStatus() == ReservationStatus.COMPLETED) {
            throw new BadRequestException("Reservasi sudah tidak aktif. Pesanan menu tidak dapat dibuat.");
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
        LocalDateTime start = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime end = LocalDateTime.now().with(LocalTime.MAX);
        return orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end).stream().map(mapper::toOrderResponse).toList();
    }

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
        order.setStatus(status);
        order.setHandledBy(actorName == null || actorName.isBlank() ? "Pegawai" : actorName.trim());
        order.setHandledAt(LocalDateTime.now());
        if (status == OrderStatus.PROCESSING && order.getReservation().getStatus() == ReservationStatus.CHECKED_IN) {
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
