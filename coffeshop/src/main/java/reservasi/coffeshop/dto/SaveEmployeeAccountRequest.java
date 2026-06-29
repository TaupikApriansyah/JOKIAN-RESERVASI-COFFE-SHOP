package reservasi.coffeshop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;

public record SaveEmployeeAccountRequest(
        @NotBlank(message = "Nama pegawai wajib diisi.") String fullName,
        @NotBlank(message = "Email wajib diisi.") @Email(message = "Format email tidak valid.") String email,
        @NotBlank(message = "Password wajib diisi.") @Size(min = 6, message = "Password minimal 6 karakter.") String password,
        String phone,
        @NotBlank(message = "Nama shift wajib diisi.") String shiftName,
        @NotNull(message = "Jam mulai shift wajib diisi.") LocalTime shiftStart,
        @NotNull(message = "Jam selesai shift wajib diisi.") LocalTime shiftEnd,
        boolean active
) {}
