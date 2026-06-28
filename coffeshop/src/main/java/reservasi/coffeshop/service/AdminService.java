package reservasi.coffeshop.service;

import org.springframework.stereotype.Service;
import reservasi.coffeshop.dto.DashboardResponse;
import reservasi.coffeshop.entity.ReservationStatus;
import reservasi.coffeshop.entity.TablePhysicalStatus;
import reservasi.coffeshop.entity.OrderStatus;
import reservasi.coffeshop.repository.CafeTableRepository;
import reservasi.coffeshop.repository.CustomerOrderRepository;
import reservasi.coffeshop.repository.ReservationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class AdminService {
    private final ReservationRepository reservationRepository;
    private final CafeTableRepository tableRepository;
    private final CustomerOrderRepository orderRepository;

    public AdminService(ReservationRepository reservationRepository, CafeTableRepository tableRepository, CustomerOrderRepository orderRepository) {
        this.reservationRepository = reservationRepository;
        this.tableRepository = tableRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardResponse dashboard() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        var reservations = reservationRepository.findByReservationDateOrderByReservationTimeAsc(today);
        long pending = reservations.stream().filter(r -> r.getStatus() == ReservationStatus.PENDING).count();
        long activeTables = tableRepository.findAllByOrderByFloorAscAreaAscCodeAsc().stream().filter(t -> t.getPhysicalStatus() == TablePhysicalStatus.AVAILABLE).count();
        long ordersToday = orderRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end).size();
        return new DashboardResponse(reservations.size(), pending, activeTables, ordersToday, orderRepository.sumRevenueBetween(start, end, OrderStatus.CANCELLED));
    }
}
