package reservasi.coffeshop.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public record CreateReservationRequest(
        @NotNull(message = "Tanggal kunjungan wajib dipilih.") @FutureOrPresent(message = "Tanggal kunjungan tidak boleh berada di masa lalu.") LocalDate reservationDate,
        @NotNull(message = "Jam kunjungan wajib dipilih.") LocalTime reservationTime,
        @Min(value = 1, message = "Jumlah tamu minimal 1 orang.") @Max(value = 12, message = "Jumlah tamu maksimal 12 orang.") int guestCount,
        @NotBlank(message = "Preferensi area wajib dipilih.") String area,
        @NotBlank(message = "Meja wajib dipilih sebelum konfirmasi reservasi.") String tableCode,
        @Min(value = 60, message = "Durasi minimal 60 menit.") @Max(value = 240, message = "Durasi maksimal 240 menit.") Integer durationMinutes,
        @NotBlank(message = "Nama lengkap wajib diisi.") @Size(min = 2, max = 100, message = "Nama lengkap harus 2 sampai 100 karakter.") String guestName,
        @NotBlank(message = "Nomor WhatsApp wajib diisi.") @Pattern(regexp = "^(08|62)\\d{8,13}$", message = "Nomor WhatsApp harus diawali 08 atau 62 dan berisi 10 sampai 15 digit.") String phone,
        @Size(max = 200, message = "Catatan khusus maksimal 200 karakter.") String specialRequest
) {}
