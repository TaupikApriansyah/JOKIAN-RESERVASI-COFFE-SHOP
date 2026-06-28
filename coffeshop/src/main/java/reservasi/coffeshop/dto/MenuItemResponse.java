package reservasi.coffeshop.dto;

import java.math.BigDecimal;

public record MenuItemResponse(
        Long id,
        String name,
        String category,
        String description,
        BigDecimal price,
        boolean available,
        String imageUrl
) {}
