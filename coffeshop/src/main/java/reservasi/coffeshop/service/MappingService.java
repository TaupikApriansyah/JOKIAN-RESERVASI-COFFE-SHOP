package reservasi.coffeshop.service;

import org.springframework.stereotype.Service;
import reservasi.coffeshop.dto.*;
import reservasi.coffeshop.entity.*;

@Service
public class MappingService {
    public MenuItemResponse toMenuResponse(MenuItem item) {
        return new MenuItemResponse(item.getId(), item.getName(), item.getCategory(), item.getDescription(), item.getPrice(), item.isAvailable(), item.getImageUrl());
    }

    public PromoResponse toPromoResponse(Promo promo) {
        return new PromoResponse(promo.getId(), promo.getTitle(), promo.getDescription(), promo.getBadge(), promo.isActive(), promo.getStartDate(), promo.getEndDate());
    }

    public ReservationResponse toReservationResponse(Reservation r) {
        return new ReservationResponse(
                r.getId(), r.getCode(), r.getGuestName(), r.getPhone(), r.getReservationDate(), r.getReservationTime(),
                r.getDurationMinutes(), r.getReservationEndTime(),
                r.getGuestCount(), r.getArea(), r.getTable().getFloor(), r.getTable().getCode(), r.getStatus().name(), r.getSpecialRequest(),
                r.getAssignedEmployee(), r.getAssignedAt(), r.getHandledBy(), r.getHandledAt(), r.getCancelReason(),
                r.getCheckedInAt(), r.getCompletedAt(), r.getCancelledAt(), r.getCreatedAt()
        );
    }

    public OrderItemResponse toOrderItemResponse(CustomerOrderItem item) {
        MenuItem menu = item.getMenuItem();
        return new OrderItemResponse(menu.getId(), menu.getName(), menu.getCategory(), item.getQuantity(), item.getPrice(), item.getLineTotal());
    }

    public OrderResponse toOrderResponse(CustomerOrder order) {
        Reservation reservation = order.getReservation();
        CafeTable table = reservation.getTable();
        return new OrderResponse(
                order.getId(),
                order.getCode(),
                reservation.getCode(),
                reservation.getReservationDate(),
                reservation.getReservationTime(),
                reservation.getReservationEndTime(),
                reservation.getGuestName(),
                reservation.getPhone(),
                reservation.getArea(),
                table == null ? null : table.getFloor(),
                table == null ? null : table.getCode(),
                reservation.getAssignedEmployee(),
                reservation.getStatus().name(),
                order.getStatus().name(),
                order.getSubtotal(),
                order.getDiscount(),
                order.getTotal(),
                order.getAppliedPromo(),
                order.getHandledBy(),
                order.getCreatedAt(),
                order.getItems().stream().map(this::toOrderItemResponse).toList()
        );
    }
}
