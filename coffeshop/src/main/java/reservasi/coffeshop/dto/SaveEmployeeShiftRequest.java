package reservasi.coffeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record SaveEmployeeShiftRequest(
        @NotBlank(message = "Nama shift wajib diisi.") String shiftName,
        @NotNull(message = "Jam mulai shift wajib diisi.") LocalTime shiftStart,
        @NotNull(message = "Jam selesai shift wajib diisi.") LocalTime shiftEnd,
        boolean active
) {}
