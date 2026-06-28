package reservasi.coffeshop.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import reservasi.coffeshop.dto.OrderResponse;
import reservasi.coffeshop.dto.ReservationResponse;
import reservasi.coffeshop.dto.StatusUpdateRequest;
import reservasi.coffeshop.service.OrderService;
import reservasi.coffeshop.service.ReservationService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    private final ReservationService reservationService;
    private final OrderService orderService;

    public EmployeeController(ReservationService reservationService, OrderService orderService) {
        this.reservationService = reservationService;
        this.orderService = orderService;
    }

    @GetMapping("/reservations")
    public List<ReservationResponse> reservations(@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return reservationService.findByDate(date);
    }

    @PutMapping("/reservations/{id}/status")
    public ReservationResponse updateReservationStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return reservationService.updateStatus(id, request);
    }

    @GetMapping("/orders/today")
    public List<OrderResponse> todayOrders() {
        return orderService.findToday();
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return orderService.updateStatus(id, request.status(), request.actorName());
    }
}
