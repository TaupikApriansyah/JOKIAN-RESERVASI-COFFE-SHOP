package reservasi.coffeshop.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import reservasi.coffeshop.entity.*;
import reservasi.coffeshop.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(UserAccountRepository users, CafeTableRepository tables, MenuItemRepository menu, PromoRepository promos, ReservationRepository reservations, CustomerOrderRepository orders, AuditLogRepository auditLogs, PasswordEncoder encoder) {
        return args -> {
            migrateExistingBrand(users, reservations, orders, auditLogs);

            seedUser(users, encoder, "Admin Dika Coffe Shop", "admin@dikacoffeshop.id", "admin123", Role.ADMIN, "081100000001", null, null, null);
            seedUser(users, encoder, "Pegawai Dika Coffe Shop", "pegawai@dikacoffeshop.id", "pegawai123", Role.PEGAWAI, "081100000002", "Backup", LocalTime.of(9, 0), LocalTime.of(21, 0));
            seedUser(users, encoder, "Andi Shift Pagi", "andi@dikacoffeshop.id", "pegawai123", Role.PEGAWAI, "081100000004", "Shift Pagi", LocalTime.of(9, 0), LocalTime.of(15, 0));
            seedUser(users, encoder, "Sinta Shift Sore", "sinta@dikacoffeshop.id", "pegawai123", Role.PEGAWAI, "081100000005", "Shift Sore", LocalTime.of(15, 0), LocalTime.of(21, 0));
            seedUser(users, encoder, "Customer Dika Coffe Shop", "customer@dikacoffeshop.id", "customer123", Role.CUSTOMER, "081100000003", null, null, null);

            List<CafeTableSeed> tableSeeds = List.of(
                    // Lantai 1: 5 indoor, 5 outdoor, 3 meeting room
                    new CafeTableSeed("IN1", "Indoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN2", "Indoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN3", "Indoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN4", "Indoor", "Lantai 1", 6, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN5", "Indoor", "Lantai 1", 2, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD1", "Outdoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD2", "Outdoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD3", "Outdoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD4", "Outdoor", "Lantai 1", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD5", "Outdoor", "Lantai 1", 2, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR1", "Meeting Room", "Lantai 1", 8, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR2", "Meeting Room", "Lantai 1", 8, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR3", "Meeting Room", "Lantai 1", 6, TablePhysicalStatus.AVAILABLE),

                    // Lantai 2: 5 indoor, 5 outdoor, 3 meeting room
                    new CafeTableSeed("IN6", "Indoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN7", "Indoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN8", "Indoor", "Lantai 2", 2, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN9", "Indoor", "Lantai 2", 6, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("IN10", "Indoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD6", "Outdoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD7", "Outdoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD8", "Outdoor", "Lantai 2", 2, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD9", "Outdoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("OD10", "Outdoor", "Lantai 2", 4, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR4", "Meeting Room", "Lantai 2", 6, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR5", "Meeting Room", "Lantai 2", 8, TablePhysicalStatus.AVAILABLE),
                    new CafeTableSeed("MR6", "Meeting Room", "Lantai 2", 10, TablePhysicalStatus.AVAILABLE)
            );

            for (CafeTableSeed seed : tableSeeds) {
                CafeTable table = tables.findByCodeIgnoreCase(seed.code()).orElseGet(CafeTable::new);
                table.setCode(seed.code());
                table.setArea(seed.area());
                table.setFloor(seed.floor());
                table.setCapacity(seed.capacity());
                table.setPhysicalStatus(seed.status());
                tables.save(table);
            }
            cleanupLegacyTableCodes(tables, reservations);

            migrateReservationTiming(reservations);

            if (menu.count() == 0) {
                saveMenu(menu, "Velvet Cappuccino", "Coffee", "Espresso tebal dengan microfoam susu yang lembut.", 38000, "/images/produk-kopi.png");
                saveMenu(menu, "Iced Americano", "Coffee", "Espresso dingin dengan rasa bersih dan ringan.", 32000, "/images/produk-americano.png");
                saveMenu(menu, "Caramel Macchiato", "Coffee", "Espresso, vanilla, dan saus karamel yang lembut.", 45000, "/images/produk-kopi.png");
                saveMenu(menu, "Matcha Fusion", "Non Coffee", "Matcha premium dengan susu segar dan tekstur creamy.", 42000, "/images/produk-utama.png");
                saveMenu(menu, "Butter Croissant", "Snack", "Croissant renyah dengan aroma butter yang kuat.", 28000, "/images/produk-snack.png");
                saveMenu(menu, "Signature Rice Bowl", "Food", "Nasi hangat dengan ayam saus mentega spesial.", 48000, "/images/produk-makanan.png");
                saveMenu(menu, "Classic Tiramisu", "Dessert", "Kue kopi klasik Italia yang lembut dan lumer.", 40000, "/images/produk-utama.png");
            }

            if (promos.count() == 0) {
                savePromo(promos, "Free Classic Tiramisu", "Pesanan di atas Rp300.000 mendapat potongan senilai Classic Tiramisu.", "Rp300K+");
                savePromo(promos, "Coffee Pair", "Beli dua menu coffee dan dapatkan benefit senilai Butter Croissant.", "2 Coffee");
                savePromo(promos, "Lunch Pairing", "Rice Bowl + Coffee mendapat potongan Rp15.000.", "Combo");
            }

            if (reservations.count() == 0) {
                CafeTable indoor = tables.findByCodeIgnoreCase("IN2").orElseThrow();
                CafeTable meeting = tables.findByCodeIgnoreCase("MR5").orElseThrow();
                CafeTable outdoor = tables.findByCodeIgnoreCase("OD9").orElseThrow();

                Reservation r1 = saveReservation(reservations, "BV-1001", "Adi Nugroho", "081234567890", LocalDate.now(), LocalTime.of(10, 30), 2, indoor.getArea(), indoor, ReservationStatus.CONFIRMED, "Dekat jendela jika tersedia.", "Andi Shift Pagi");
                saveReservation(reservations, "BV-1002", "Siti Rahma", "081298765432", LocalDate.now(), LocalTime.of(13, 0), 8, meeting.getArea(), meeting, ReservationStatus.CONFIRMED, "Meeting komunitas lantai 2.", "Andi Shift Pagi");
                Reservation r3 = saveReservation(reservations, "BV-1003", "Raka Pratama", "081355501234", LocalDate.now(), LocalTime.of(19, 0), 4, outdoor.getArea(), outdoor, ReservationStatus.SERVING, "Area tidak terlalu dekat speaker.", "Sinta Shift Sore");

                if (orders.count() == 0) {
                    List<MenuItem> menuItems = menu.findAllByOrderByCategoryAscNameAsc();
                    MenuItem coffee = menuItems.stream().filter(item -> item.getName().equalsIgnoreCase("Velvet Cappuccino")).findFirst().orElse(menuItems.get(0));
                    MenuItem rice = menuItems.stream().filter(item -> item.getName().equalsIgnoreCase("Signature Rice Bowl")).findFirst().orElse(menuItems.get(0));
                    MenuItem tiramisu = menuItems.stream().filter(item -> item.getName().equalsIgnoreCase("Classic Tiramisu")).findFirst().orElse(menuItems.get(0));
                    saveOrder(orders, r1, "ORD-2001", OrderStatus.PROCESSING, "Coffee Pair - Free Butter Croissant", coffee, 2, "Andi Shift Pagi");
                    saveOrder(orders, r3, "ORD-2002", OrderStatus.READY, "Lunch Pairing - Diskon Rp15.000", rice, 2, "Sinta Shift Sore");
                    saveOrder(orders, r3, "ORD-2003", OrderStatus.PENDING_PAYMENT, "Rp300K+ Benefit", tiramisu, 8, null);
                }
            }

            if (auditLogs.count() == 0) {
                AuditLog log = new AuditLog();
                log.setAction("SYSTEM_SEED");
                log.setActor("System");
                log.setDetail("Data awal Dika Coffe Shop dibuat: akun, meja, menu, promo, reservasi, dan pesanan.");
                auditLogs.save(log);
            }
        };
    }


    private void cleanupLegacyTableCodes(CafeTableRepository tables, ReservationRepository reservations) {
        List<String> legacyCodes = List.of("A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5");
        for (String code : legacyCodes) {
            tables.findByCodeIgnoreCase(code).ifPresent(table -> {
                if (table.getId() != null && !reservations.existsByTable_Id(table.getId())) {
                    tables.delete(table);
                } else {
                    table.setPhysicalStatus(TablePhysicalStatus.MAINTENANCE);
                    tables.save(table);
                }
            });
        }
    }

    private void migrateReservationTiming(ReservationRepository reservations) {
        for (Reservation reservation : reservations.findAll()) {
            int durationMinutes = reservation.getDurationMinutes() > 0
                    ? reservation.getDurationMinutes()
                    : (reservation.getTable() != null && reservation.getTable().getArea() != null && reservation.getTable().getArea().equalsIgnoreCase("Meeting Room") ? 180 : 120);
            boolean changed = false;
            if (reservation.getDurationMinutes() <= 0) {
                reservation.setDurationMinutes(durationMinutes);
                changed = true;
            }
            if (reservation.getReservationEndTime() == null && reservation.getReservationTime() != null) {
                reservation.setReservationEndTime(reservation.getReservationTime().plusMinutes(durationMinutes));
                changed = true;
            }
            if (changed) reservations.save(reservation);
        }
    }

    private void migrateExistingBrand(UserAccountRepository users, ReservationRepository reservations, CustomerOrderRepository orders, AuditLogRepository auditLogs) {
        String oldBrand = "Brew" + "Vibe";
        String newBrand = "Dika Coffe Shop";
        String oldDomain = oldBrand.toLowerCase() + ".id";
        String newDomain = "dikacoffeshop.id";

        for (UserAccount user : users.findAll()) {
            boolean changed = false;
            if (user.getFullName() != null && user.getFullName().contains(oldBrand)) {
                user.setFullName(user.getFullName().replace(oldBrand, newBrand));
                changed = true;
            }
            if (user.getEmail() != null && user.getEmail().toLowerCase().endsWith("@" + oldDomain)) {
                String newEmail = user.getEmail().toLowerCase().replace("@" + oldDomain, "@" + newDomain);
                if (!users.existsByEmailIgnoreCase(newEmail)) {
                    user.setEmail(newEmail);
                    changed = true;
                }
            }
            if (changed) users.save(user);
        }

        for (Reservation reservation : reservations.findAll()) {
            boolean changed = false;
            if (reservation.getAssignedEmployee() != null && reservation.getAssignedEmployee().contains(oldBrand)) {
                reservation.setAssignedEmployee(reservation.getAssignedEmployee().replace(oldBrand, newBrand));
                changed = true;
            }
            if (reservation.getHandledBy() != null && reservation.getHandledBy().contains(oldBrand)) {
                reservation.setHandledBy(reservation.getHandledBy().replace(oldBrand, newBrand));
                changed = true;
            }
            if (changed) reservations.save(reservation);
        }

        for (CustomerOrder order : orders.findAll()) {
            if (order.getHandledBy() != null && order.getHandledBy().contains(oldBrand)) {
                order.setHandledBy(order.getHandledBy().replace(oldBrand, newBrand));
                orders.save(order);
            }
        }

        for (AuditLog auditLog : auditLogs.findAll()) {
            boolean changed = false;
            if (auditLog.getActor() != null && auditLog.getActor().contains(oldBrand)) {
                auditLog.setActor(auditLog.getActor().replace(oldBrand, newBrand));
                changed = true;
            }
            if (auditLog.getDetail() != null && auditLog.getDetail().contains(oldBrand)) {
                auditLog.setDetail(auditLog.getDetail().replace(oldBrand, newBrand));
                changed = true;
            }
            if (changed) auditLogs.save(auditLog);
        }
    }

    private void seedUser(UserAccountRepository users, PasswordEncoder encoder, String name, String email, String password, Role role, String phone, String shiftName, LocalTime shiftStart, LocalTime shiftEnd) {
        UserAccount user = users.findByEmailIgnoreCase(email).orElseGet(UserAccount::new);
        boolean baru = user.getId() == null;
        user.setFullName(name);
        user.setEmail(email);
        if (baru || user.getPasswordHash() == null || user.getPasswordHash().isBlank()) {
            user.setPasswordHash(encoder.encode(password));
        }
        user.setRole(role);
        user.setPhone(phone);
        user.setActive(true);
        user.setShiftName(shiftName);
        user.setShiftStart(shiftStart);
        user.setShiftEnd(shiftEnd);
        users.save(user);
    }

    private void saveMenu(MenuItemRepository menu, String name, String category, String desc, int price, String imageUrl) {
        MenuItem item = new MenuItem();
        item.setName(name);
        item.setCategory(category);
        item.setDescription(desc);
        item.setPrice(BigDecimal.valueOf(price));
        item.setImageUrl(imageUrl);
        item.setAvailable(true);
        menu.save(item);
    }

    private void savePromo(PromoRepository promos, String title, String desc, String badge) {
        Promo promo = new Promo();
        promo.setTitle(title);
        promo.setDescription(desc);
        promo.setBadge(badge);
        promo.setActive(true);
        promos.save(promo);
    }

    private Reservation saveReservation(ReservationRepository reservations, String code, String name, String phone, LocalDate date, LocalTime time, int guests, String area, CafeTable table, ReservationStatus status, String note, String handledBy) {
        Reservation reservation = new Reservation();
        reservation.setCode(code);
        reservation.setGuestName(name);
        reservation.setPhone(phone);
        reservation.setReservationDate(date);
        reservation.setReservationTime(time);
        int durationMinutes = table.getArea().equalsIgnoreCase("Meeting Room") ? 180 : 120;
        reservation.setDurationMinutes(durationMinutes);
        reservation.setReservationEndTime(time.plusMinutes(durationMinutes));
        reservation.setGuestCount(guests);
        reservation.setArea(area);
        reservation.setTable(table);
        reservation.setStatus(status);
        reservation.setSpecialRequest(note);
        reservation.setAssignedEmployee(handledBy);
        reservation.setAssignedAt(handledBy == null ? null : LocalDateTime.now().minusHours(1));
        reservation.setHandledBy(handledBy);
        reservation.setHandledAt(handledBy == null ? null : LocalDateTime.now().minusMinutes(30));
        if (status == ReservationStatus.CHECKED_IN || status == ReservationStatus.SERVING) {
            reservation.setCheckedInAt(LocalDateTime.now().minusMinutes(20));
        }
        if (status == ReservationStatus.COMPLETED) {
            reservation.setCompletedAt(LocalDateTime.now().minusMinutes(10));
        }
        reservation.setCreatedAt(LocalDateTime.now().minusHours(2));
        return reservations.save(reservation);
    }

    private void saveOrder(CustomerOrderRepository orders, Reservation reservation, String code, OrderStatus status, String promo, MenuItem menuItem, int quantity, String handledBy) {
        CustomerOrder order = new CustomerOrder();
        order.setCode(code);
        order.setReservation(reservation);
        order.setStatus(status);
        order.setAppliedPromo(promo);
        order.setHandledBy(handledBy);
        order.setHandledAt(handledBy == null ? null : LocalDateTime.now().minusMinutes(20));
        order.setCreatedAt(LocalDateTime.now().minusMinutes(45));

        CustomerOrderItem item = new CustomerOrderItem();
        item.setOrder(order);
        item.setMenuItem(menuItem);
        item.setQuantity(quantity);
        item.setPrice(menuItem.getPrice());
        item.setLineTotal(menuItem.getPrice().multiply(BigDecimal.valueOf(quantity)));
        order.getItems().add(item);

        BigDecimal subtotal = item.getLineTotal();
        BigDecimal discount = subtotal.compareTo(BigDecimal.valueOf(300000)) >= 0 ? BigDecimal.valueOf(40000) : BigDecimal.ZERO;
        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setTotal(subtotal.subtract(discount));
        orders.save(order);
    }

    private record CafeTableSeed(String code, String area, String floor, int capacity, TablePhysicalStatus status) {}
}
