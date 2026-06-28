package reservasi.coffeshop.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.entity.*;
import reservasi.coffeshop.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ReportService {
    private final ReservationRepository reservationRepository;
    private final CustomerOrderRepository orderRepository;
    private final CafeTableRepository tableRepository;
    private final MenuItemRepository menuRepository;
    private final PromoRepository promoRepository;
    private final UserAccountRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public ReportService(ReservationRepository reservationRepository, CustomerOrderRepository orderRepository, CafeTableRepository tableRepository, MenuItemRepository menuRepository, PromoRepository promoRepository, UserAccountRepository userRepository, AuditLogRepository auditLogRepository) {
        this.reservationRepository = reservationRepository;
        this.orderRepository = orderRepository;
        this.tableRepository = tableRepository;
        this.menuRepository = menuRepository;
        this.promoRepository = promoRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> buildReports(LocalDate start, LocalDate end) {
        LocalDate safeStart = start != null ? start : LocalDate.now().minusDays(30);
        LocalDate safeEnd = end != null ? end : LocalDate.now().plusDays(30);
        LocalDateTime startAt = safeStart.atStartOfDay();
        LocalDateTime endAt = safeEnd.atTime(LocalTime.MAX);

        List<Reservation> reservations = reservationRepository.findByReservationDateBetweenOrderByReservationDateDescReservationTimeDesc(safeStart, safeEnd);
        List<CustomerOrder> orders = orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(o -> !o.getCreatedAt().isBefore(startAt) && !o.getCreatedAt().isAfter(endAt))
                .toList();
        List<CafeTable> tables = tableRepository.findAllByOrderByFloorAscAreaAscCodeAsc();
        List<MenuItem> menus = menuRepository.findAllByOrderByCategoryAscNameAsc();
        List<Promo> promos = promoRepository.findAllByOrderByActiveDescTitleAsc();
        List<UserAccount> users = userRepository.findAll();
        List<AuditLog> auditLogs = auditLogRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(startAt, endAt);

        Map<String, Long> reservationStatus = reservations.stream()
                .collect(Collectors.groupingBy(r -> r.getStatus().name(), LinkedHashMap::new, Collectors.counting()));
        Map<String, Long> tableUsage = reservations.stream()
                .collect(Collectors.groupingBy(r -> r.getTable().getCode(), LinkedHashMap::new, Collectors.counting()));
        Map<String, Long> areaUsage = reservations.stream()
                .collect(Collectors.groupingBy(Reservation::getArea, LinkedHashMap::new, Collectors.counting()));
        BigDecimal revenue = orders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .map(CustomerOrder::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        long completedOrders = orders.stream().filter(o -> o.getStatus() == OrderStatus.COMPLETED).count();
        long cancelledReservations = reservations.stream().filter(r -> r.getStatus() == ReservationStatus.CANCELLED).count();
        long noShowReservations = reservations.stream().filter(r -> r.getStatus() == ReservationStatus.NO_SHOW).count();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("periode", Map.of("start", safeStart, "end", safeEnd));
        result.put("summary", Map.of(
                "totalReservations", reservations.size(),
                "cancelledReservations", cancelledReservations,
                "noShowReservations", noShowReservations,
                "totalOrders", orders.size(),
                "completedOrders", completedOrders,
                "totalTables", tables.size(),
                "totalMenu", menus.size(),
                "totalPromo", promos.size(),
                "revenue", revenue
        ));
        result.put("reservations", reservationRows(reservations));
        result.put("orders", orderRows(orders));
        result.put("shift", shiftRows(reservations, orders));
        result.put("finance", financeRows(orders));
        result.put("tables", tableRows(tables, tableUsage));
        result.put("customers", customerRows(reservations));
        result.put("cancellations", cancellationRows(reservations));
        result.put("noShows", noShowRows(reservations));
        result.put("flow", flowRows(reservations));
        result.put("menu", menuRows(menus, orders));
        result.put("promos", promoRows(promos, orders));
        result.put("maintenance", maintenanceRows(tables));
        result.put("audit", auditRows(auditLogs));
        result.put("charts", Map.of(
                "reservationStatus", reservationStatus,
                "areaUsage", areaUsage,
                "tableUsage", tableUsage
        ));
        return result;
    }

    private List<Map<String, Object>> reservationRows(List<Reservation> reservations) {
        return reservations.stream().map(r -> row(
                "kode", r.getCode(),
                "customer", r.getGuestName(),
                "tanggal", r.getReservationDate(),
                "jam", r.getReservationTime(),
                "meja", r.getTable().getCode(),
                "area", r.getArea(),
                "lantai", r.getTable().getFloor(),
                "tamu", r.getGuestCount(),
                "status", r.getStatus().name(),
                "pegawaiDitugaskan", emptyDash(r.getAssignedEmployee()),
                "ditanganiOleh", emptyDash(r.getHandledBy())
        )).toList();
    }

    private List<Map<String, Object>> orderRows(List<CustomerOrder> orders) {
        return orders.stream().map(o -> row(
                "kode", o.getCode(),
                "reservasi", o.getReservation().getCode(),
                "customer", o.getReservation().getGuestName(),
                "tanggal", o.getCreatedAt().toLocalDate(),
                "status", o.getStatus().name(),
                "subtotal", o.getSubtotal(),
                "diskon", o.getDiscount(),
                "total", o.getTotal(),
                "promo", emptyDash(o.getAppliedPromo()),
                "pegawai", emptyDash(o.getHandledBy())
        )).toList();
    }

    private List<Map<String, Object>> shiftRows(List<Reservation> reservations, List<CustomerOrder> orders) {
        Set<String> employeeNames = new TreeSet<>();
        reservations.stream().map(Reservation::getAssignedEmployee).filter(this::hasText).forEach(employeeNames::add);
        reservations.stream().map(Reservation::getHandledBy).filter(this::hasText).filter(name -> !name.toLowerCase().contains("admin")).forEach(employeeNames::add);
        orders.stream().map(CustomerOrder::getHandledBy).filter(this::hasText).filter(name -> !name.toLowerCase().contains("admin")).forEach(employeeNames::add);
        if (employeeNames.isEmpty()) employeeNames.add("Pegawai");
        return employeeNames.stream().map(name -> {
            long assignedReservations = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee()))).count();
            long handledReservations = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) || name.equalsIgnoreCase(nullToEmpty(r.getHandledBy()))).count();
            long checkIn = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) && r.getStatus() == ReservationStatus.CHECKED_IN).count();
            long serving = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) && r.getStatus() == ReservationStatus.SERVING).count();
            long completed = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) && r.getStatus() == ReservationStatus.COMPLETED).count();
            long cancelled = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) && r.getStatus() == ReservationStatus.CANCELLED).count();
            long noShow = reservations.stream().filter(r -> name.equalsIgnoreCase(nullToEmpty(r.getAssignedEmployee())) && r.getStatus() == ReservationStatus.NO_SHOW).count();
            long handledOrders = orders.stream().filter(o -> name.equalsIgnoreCase(nullToEmpty(o.getHandledBy()))).count();
            BigDecimal orderTotal = orders.stream().filter(o -> name.equalsIgnoreCase(nullToEmpty(o.getHandledBy())) && o.getStatus() != OrderStatus.CANCELLED).map(CustomerOrder::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
            return row("pegawai", name, "reservasiDitugaskan", assignedReservations, "reservasiDitangani", handledReservations, "checkIn", checkIn, "serving", serving, "completed", completed, "cancelled", cancelled, "noShow", noShow, "pesananDitangani", handledOrders, "nilaiPesanan", orderTotal);
        }).toList();
    }

    private List<Map<String, Object>> financeRows(List<CustomerOrder> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().toLocalDate(), TreeMap::new, Collectors.toList()))
                .entrySet().stream()
                .map(entry -> {
                    List<CustomerOrder> daily = entry.getValue();
                    BigDecimal subtotal = daily.stream().map(CustomerOrder::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal discount = daily.stream().map(CustomerOrder::getDiscount).reduce(BigDecimal.ZERO, BigDecimal::add);
                    BigDecimal total = daily.stream().filter(o -> o.getStatus() != OrderStatus.CANCELLED).map(CustomerOrder::getTotal).reduce(BigDecimal.ZERO, BigDecimal::add);
                    return row("tanggal", entry.getKey(), "jumlahPesanan", daily.size(), "subtotal", subtotal, "diskon", discount, "totalPendapatan", total);
                })
                .toList();
    }

    private List<Map<String, Object>> tableRows(List<CafeTable> tables, Map<String, Long> tableUsage) {
        return tables.stream().map(t -> row(
                "kode", t.getCode(),
                "area", t.getArea(),
                "lantai", t.getFloor(),
                "kapasitas", t.getCapacity(),
                "status", t.getPhysicalStatus().name(),
                "totalDipakai", tableUsage.getOrDefault(t.getCode(), 0L)
        )).toList();
    }

    private List<Map<String, Object>> customerRows(List<Reservation> reservations) {
        return reservations.stream()
                .collect(Collectors.groupingBy(Reservation::getPhone, LinkedHashMap::new, Collectors.toList()))
                .values().stream()
                .map(list -> {
                    Reservation first = list.get(0);
                    long done = list.stream().filter(r -> r.getStatus() == ReservationStatus.COMPLETED || r.getStatus() == ReservationStatus.CHECKED_IN).count();
                    long cancelled = list.stream().filter(r -> r.getStatus() == ReservationStatus.CANCELLED).count();
                    return row("customer", first.getGuestName(), "phone", first.getPhone(), "totalReservasi", list.size(), "berhasil", done, "batal", cancelled, "terakhirReservasi", first.getReservationDate());
                }).toList();
    }

    private List<Map<String, Object>> cancellationRows(List<Reservation> reservations) {
        return reservations.stream().filter(r -> r.getStatus() == ReservationStatus.CANCELLED).map(r -> row(
                "kode", r.getCode(),
                "customer", r.getGuestName(),
                "tanggal", r.getReservationDate(),
                "meja", r.getTable().getCode(),
                "alasan", emptyDash(r.getCancelReason()),
                "pegawai", emptyDash(r.getHandledBy())
        )).toList();
    }


    private List<Map<String, Object>> noShowRows(List<Reservation> reservations) {
        return reservations.stream().filter(r -> r.getStatus() == ReservationStatus.NO_SHOW).map(r -> row(
                "kode", r.getCode(),
                "customer", r.getGuestName(),
                "tanggal", r.getReservationDate(),
                "jam", r.getReservationTime(),
                "meja", r.getTable().getCode(),
                "pegawai", emptyDash(r.getAssignedEmployee()),
                "catatan", emptyDash(r.getCancelReason())
        )).toList();
    }

    private List<Map<String, Object>> flowRows(List<Reservation> reservations) {
        return reservations.stream().map(r -> row(
                "kode", r.getCode(),
                "customer", r.getGuestName(),
                "meja", r.getTable().getCode(),
                "status", r.getStatus().name(),
                "dibuat", r.getCreatedAt(),
                "ditugaskanKe", emptyDash(r.getAssignedEmployee()),
                "waktuAssign", emptyDash(r.getAssignedAt()),
                "checkIn", emptyDash(r.getCheckedInAt()),
                "selesai", emptyDash(r.getCompletedAt()),
                "batal", emptyDash(r.getCancelledAt())
        )).toList();
    }

    private List<Map<String, Object>> menuRows(List<MenuItem> menus, List<CustomerOrder> orders) {
        Map<Long, Integer> quantity = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(i -> i.getMenuItem().getId(), Collectors.summingInt(CustomerOrderItem::getQuantity)));
        Map<Long, BigDecimal> revenue = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .collect(Collectors.groupingBy(i -> i.getMenuItem().getId(), Collectors.mapping(CustomerOrderItem::getLineTotal, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
        return menus.stream().map(m -> row(
                "menu", m.getName(),
                "kategori", m.getCategory(),
                "harga", m.getPrice(),
                "tersedia", m.isAvailable() ? "Ya" : "Tidak",
                "jumlahTerjual", quantity.getOrDefault(m.getId(), 0),
                "pendapatan", revenue.getOrDefault(m.getId(), BigDecimal.ZERO)
        )).toList();
    }

    private List<Map<String, Object>> promoRows(List<Promo> promos, List<CustomerOrder> orders) {
        Map<String, Long> used = orders.stream().map(CustomerOrder::getAppliedPromo).filter(this::hasText).collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        return promos.stream().map(p -> row(
                "promo", p.getTitle(),
                "badge", p.getBadge(),
                "aktif", p.isActive() ? "Ya" : "Tidak",
                "mulai", emptyDash(p.getStartDate()),
                "selesai", emptyDash(p.getEndDate()),
                "dipakai", used.entrySet().stream().filter(e -> e.getKey().toLowerCase().contains(p.getBadge() == null ? p.getTitle().toLowerCase() : p.getBadge().toLowerCase())).mapToLong(Map.Entry::getValue).sum()
        )).toList();
    }

    private List<Map<String, Object>> maintenanceRows(List<CafeTable> tables) {
        return tables.stream().filter(t -> t.getPhysicalStatus() == TablePhysicalStatus.MAINTENANCE).map(t -> row(
                "kode", t.getCode(),
                "area", t.getArea(),
                "lantai", t.getFloor(),
                "kapasitas", t.getCapacity(),
                "status", t.getPhysicalStatus().name(),
                "catatan", "Meja tidak muncul sebagai tersedia untuk customer."
        )).toList();
    }

    private List<Map<String, Object>> auditRows(List<AuditLog> auditLogs) {
        return auditLogs.stream().limit(100).map(a -> row(
                "waktu", a.getCreatedAt(),
                "aktor", a.getActor(),
                "aksi", a.getAction(),
                "detail", a.getDetail()
        )).toList();
    }

    private Map<String, Object> row(Object... values) {
        Map<String, Object> row = new LinkedHashMap<>();
        for (int i = 0; i < values.length; i += 2) {
            row.put(String.valueOf(values[i]), values[i + 1]);
        }
        return row;
    }

    private boolean hasText(String value) { return value != null && !value.isBlank(); }
    private String nullToEmpty(String value) { return value == null ? "" : value; }
    private Object emptyDash(Object value) { return value == null || String.valueOf(value).isBlank() ? "-" : value; }
}
