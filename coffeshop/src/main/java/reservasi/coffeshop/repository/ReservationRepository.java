package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import reservasi.coffeshop.entity.Reservation;
import reservasi.coffeshop.entity.ReservationStatus;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByCodeIgnoreCase(String code);
    boolean existsByTable_Id(Long tableId);
    List<Reservation> findByPhoneContainingIgnoreCaseOrderByReservationDateDescReservationTimeDesc(String phone);
    List<Reservation> findByReservationDateOrderByReservationTimeAsc(LocalDate date);
    List<Reservation> findByReservationDateBetweenOrderByReservationDateDescReservationTimeDesc(LocalDate start, LocalDate end);
    List<Reservation> findAllByOrderByReservationDateDescReservationTimeDesc();

    @Query("""
        select r from Reservation r
        where r.table.code = :tableCode
          and r.reservationDate = :date
          and r.status not in :excludedStatuses
    """)
    List<Reservation> findActiveByTableAndDate(@Param("tableCode") String tableCode,
                                                @Param("date") LocalDate date,
                                                @Param("excludedStatuses") Collection<ReservationStatus> excludedStatuses);
}
