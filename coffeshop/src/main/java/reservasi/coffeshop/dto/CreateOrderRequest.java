package reservasi.coffeshop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateOrderRequest(
        @NotBlank(message = "Kode reservasi wajib tersedia sebelum memesan menu.") String reservationCode,
        @NotEmpty(message = "Keranjang belum memiliki menu.") List<@Valid OrderItemRequest> items
) {}
