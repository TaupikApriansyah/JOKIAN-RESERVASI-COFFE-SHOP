package reservasi.coffeshop.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import reservasi.coffeshop.dto.*;
import reservasi.coffeshop.service.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PublicController {
    private final MenuService menuService;
    private final PromoService promoService;
    private final TableService tableService;
    private final ReservationService reservationService;
    private final OrderService orderService;

    @Value("${server.port:8081}")
    private String serverPort;

    public PublicController(MenuService menuService, PromoService promoService, TableService tableService, ReservationService reservationService, OrderService orderService) {
        this.menuService = menuService;
        this.promoService = promoService;
        this.tableService = tableService;
        this.reservationService = reservationService;
        this.orderService = orderService;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "Dika Coffe Shop Backend", "port", serverPort);
    }

    @GetMapping("/menu")
    public List<MenuItemResponse> menu() {
        return menuService.findAvailable();
    }

    @GetMapping("/promos")
    public List<PromoResponse> promos() {
        return promoService.findActive();
    }

    @GetMapping("/tables")
    public List<TableResponse> tables(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(pattern = "HH:mm") LocalTime time,
            @RequestParam(defaultValue = "1") int guests,
            @RequestParam(required = false) String area,
            @RequestParam(required = false) String floor,
            @RequestParam(required = false) Integer durationMinutes
    ) {
        return tableService.getAvailability(date, time, guests, area, floor, durationMinutes);
    }

    @PostMapping("/reservations")
    public ReservationResponse createReservation(@Valid @RequestBody CreateReservationRequest request) {
        return reservationService.create(request);
    }

    @GetMapping("/reservations")
    public List<ReservationResponse> customerReservations(@RequestParam(required = false) String phone, @RequestParam(required = false) String code) {
        return reservationService.findCustomerReservations(phone, code);
    }

    @PutMapping("/reservations/{id}/cancel")
    public ReservationResponse cancelReservation(@PathVariable Long id, @Valid @RequestBody CancelReservationRequest request) {
        return reservationService.cancelByCustomer(id, request);
    }

    @PostMapping("/orders")
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping("/orders")
    public List<OrderResponse> orders(@RequestParam String reservationCode) {
        return orderService.findByReservation(reservationCode);
    }
}
