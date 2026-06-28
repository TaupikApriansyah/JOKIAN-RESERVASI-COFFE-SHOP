package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reservasi.coffeshop.entity.CustomerOrder;
import reservasi.coffeshop.entity.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {
    Optional<CustomerOrder> findByCodeIgnoreCase(String code);
    List<CustomerOrder> findByReservation_CodeIgnoreCaseOrderByCreatedAtDesc(String reservationCode);
    List<CustomerOrder> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    @Query("select coalesce(sum(o.total), 0) from CustomerOrder o where o.createdAt between :start and :end and o.status <> :excludedStatus")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end, @Param("excludedStatus") OrderStatus excludedStatus);
}
