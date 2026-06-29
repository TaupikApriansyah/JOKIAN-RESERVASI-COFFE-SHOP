package reservasi.coffeshop.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String code,
        String reservationCode,
        LocalDate reservationDate,
        LocalTime reservationTime,
        LocalTime reservationEndTime,
        String guestName,
        String phone,
        String area,
        String floor,
        String tableCode,
        String assignedEmployee,
        String reservationStatus,
        String status,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal total,
        String appliedPromo,
        String handledBy,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {}
