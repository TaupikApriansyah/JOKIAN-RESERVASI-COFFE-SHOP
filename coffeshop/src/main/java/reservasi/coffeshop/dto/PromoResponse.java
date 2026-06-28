package reservasi.coffeshop.dto;

import java.time.LocalDate;

public record PromoResponse(
        Long id,
        String title,
        String description,
        String badge,
        boolean active,
        LocalDate startDate,
        LocalDate endDate
) {}
