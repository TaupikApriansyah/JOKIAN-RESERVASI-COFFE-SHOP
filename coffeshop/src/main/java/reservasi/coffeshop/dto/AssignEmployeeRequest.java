package reservasi.coffeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssignEmployeeRequest(
        @NotBlank(message = "Nama pegawai wajib dipilih.")
        @Size(max = 120, message = "Nama pegawai maksimal 120 karakter.")
        String employeeName
) {}
