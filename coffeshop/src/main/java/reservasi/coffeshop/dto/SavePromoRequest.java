package reservasi.coffeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record SavePromoRequest(
        @NotBlank(message = "Judul promo wajib diisi.") @Size(max = 100, message = "Judul maksimal 100 karakter.") String title,
        @NotBlank(message = "Deskripsi promo wajib diisi.") @Size(max = 255, message = "Deskripsi maksimal 255 karakter.") String description,
        @Size(max = 40, message = "Badge maksimal 40 karakter.") String badge,
        boolean active,
        LocalDate startDate,
        LocalDate endDate
) {}
