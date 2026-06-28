package reservasi.coffeshop.dto;

import jakarta.validation.constraints.*;

public record UpdateTableRequest(
        @NotBlank(message = "Kode meja wajib diisi.") @Size(max = 20, message = "Kode meja maksimal 20 karakter.") String code,
        @NotBlank(message = "Area wajib diisi.") @Size(max = 40, message = "Area maksimal 40 karakter.") String area,
        @NotBlank(message = "Lantai wajib diisi.") @Size(max = 20, message = "Lantai maksimal 20 karakter.") String floor,
        @Min(value = 1, message = "Kapasitas minimal 1 orang.") @Max(value = 30, message = "Kapasitas maksimal 30 orang.") int capacity,
        @NotBlank(message = "Status fisik wajib diisi.") String physicalStatus
) {}
