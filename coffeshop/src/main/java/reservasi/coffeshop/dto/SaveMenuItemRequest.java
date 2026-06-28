package reservasi.coffeshop.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record SaveMenuItemRequest(
        @NotBlank(message = "Nama menu wajib diisi.") @Size(max = 80, message = "Nama maksimal 80 karakter.") String name,
        @NotBlank(message = "Kategori menu wajib diisi.") @Size(max = 40, message = "Kategori maksimal 40 karakter.") String category,
        @NotBlank(message = "Deskripsi menu wajib diisi.") @Size(max = 255, message = "Deskripsi maksimal 255 karakter.") String description,
        @NotNull(message = "Harga wajib diisi.") @DecimalMin(value = "0.0", inclusive = false, message = "Harga harus lebih dari 0.") BigDecimal price,
        boolean available,
        @Size(max = 500, message = "URL gambar maksimal 500 karakter.") String imageUrl
) {}
