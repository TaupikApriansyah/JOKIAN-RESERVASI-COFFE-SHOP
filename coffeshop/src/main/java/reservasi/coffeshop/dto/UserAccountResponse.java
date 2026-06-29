package reservasi.coffeshop.dto;

import java.time.LocalTime;

public record UserAccountResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        boolean active,
        String shiftName,
        LocalTime shiftStart,
        LocalTime shiftEnd
) {}
