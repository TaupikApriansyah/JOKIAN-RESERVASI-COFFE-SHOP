package reservasi.coffeshop.dto;

import java.time.LocalTime;

public record LoginResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        String message,
        String shiftName,
        LocalTime shiftStart,
        LocalTime shiftEnd
) {}
