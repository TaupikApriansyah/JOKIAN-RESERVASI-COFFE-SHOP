package reservasi.coffeshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String code,
        String reservationCode,
        String status,
        BigDecimal subtotal,
        BigDecimal discount,
        BigDecimal total,
        String appliedPromo,
        String handledBy,
        LocalDateTime createdAt,
        List<OrderItemResponse> items
) {}
