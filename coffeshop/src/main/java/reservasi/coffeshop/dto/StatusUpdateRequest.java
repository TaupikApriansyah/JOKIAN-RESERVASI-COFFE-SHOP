package reservasi.coffeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record StatusUpdateRequest(
        @NotBlank(message = "Status wajib dikirim.") String status,
        @Size(max = 120, message = "Nama petugas maksimal 120 karakter.") String actorName,
        @Size(max = 200, message = "Alasan maksimal 200 karakter.") String reason
) {}
