package reservasi.coffeshop.dto;

import java.math.BigDecimal;

public record DashboardResponse(
        long totalReservationsToday,
        long pendingReservations,
        long activeTables,
        long totalOrdersToday,
        BigDecimal revenueToday
) {}
