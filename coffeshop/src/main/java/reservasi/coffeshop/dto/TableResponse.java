package reservasi.coffeshop.dto;

public record TableResponse(
        Long id,
        String code,
        String area,
        String floor,
        int capacity,
        String physicalStatus,
        String availabilityStatus,
        String reason
) {}
