package reservasi.coffeshop.dto;

public record LoginResponse(
        Long id,
        String fullName,
        String email,
        String role,
        String message
) {}
