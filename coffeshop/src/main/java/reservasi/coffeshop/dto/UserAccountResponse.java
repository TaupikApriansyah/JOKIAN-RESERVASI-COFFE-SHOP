package reservasi.coffeshop.dto;

public record UserAccountResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String role,
        boolean active
) {}
