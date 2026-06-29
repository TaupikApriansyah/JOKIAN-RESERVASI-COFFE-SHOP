package reservasi.coffeshop.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record ReservationResponse(
        Long id,
        String code,
        String guestName,
        String phone,
        LocalDate reservationDate,
        LocalTime reservationTime,
        int durationMinutes,
        LocalTime reservationEndTime,
        int guestCount,
        String area,
        String floor,
        String tableCode,
        String status,
        String specialRequest,
        String assignedEmployee,
        LocalDateTime assignedAt,
        String handledBy,
        LocalDateTime handledAt,
        String cancelReason,
        LocalDateTime checkedInAt,
        LocalDateTime completedAt,
        LocalDateTime cancelledAt,
        LocalDateTime createdAt
) {}
