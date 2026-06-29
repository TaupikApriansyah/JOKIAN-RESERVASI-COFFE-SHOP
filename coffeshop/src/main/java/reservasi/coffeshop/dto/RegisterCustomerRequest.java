package reservasi.coffeshop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterCustomerRequest(
        @NotBlank(message = "Nama lengkap wajib diisi.") String fullName,
        @NotBlank(message = "Email wajib diisi.") @Email(message = "Format email tidak valid.") String email,
        @NotBlank(message = "Password wajib diisi.") @Size(min = 6, message = "Password minimal 6 karakter.") String password,
        @NotBlank(message = "Nomor WhatsApp wajib diisi.") String phone
) {}
