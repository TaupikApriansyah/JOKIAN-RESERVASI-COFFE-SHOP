package reservasi.coffeshop.dto;

import jakarta.validation.constraints.Size;

public record CancelReservationRequest(
        @Size(max = 30, message = "Nomor WhatsApp maksimal 30 karakter.") String phone,
        @Size(max = 200, message = "Alasan maksimal 200 karakter.") String reason
) {}
