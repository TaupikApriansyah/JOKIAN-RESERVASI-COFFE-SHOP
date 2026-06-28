package reservasi.coffeshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull(message = "Menu wajib dipilih.") Long menuItemId,
        @Min(value = 1, message = "Jumlah item minimal 1.") int quantity
) {}
