package reservasi.coffeshop.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long menuItemId,
        String menuName,
        String category,
        int quantity,
        BigDecimal price,
        BigDecimal lineTotal
) {}
