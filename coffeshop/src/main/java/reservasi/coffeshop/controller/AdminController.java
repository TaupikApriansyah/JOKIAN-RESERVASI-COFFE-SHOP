package reservasi.coffeshop.controller;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import reservasi.coffeshop.dto.CreateTableRequest;
import reservasi.coffeshop.dto.DashboardResponse;
import reservasi.coffeshop.dto.MenuItemResponse;
import reservasi.coffeshop.dto.OrderResponse;
import reservasi.coffeshop.dto.PromoResponse;
import reservasi.coffeshop.dto.ReservationResponse;
import reservasi.coffeshop.dto.SaveMenuItemRequest;
import reservasi.coffeshop.dto.SavePromoRequest;
import reservasi.coffeshop.dto.StatusUpdateRequest;
import reservasi.coffeshop.dto.TableResponse;
import reservasi.coffeshop.dto.SaveEmployeeAccountRequest;
import reservasi.coffeshop.dto.SaveEmployeeShiftRequest;
import reservasi.coffeshop.dto.UpdateTableRequest;
import reservasi.coffeshop.dto.UserAccountResponse;
import reservasi.coffeshop.service.AdminService;
import reservasi.coffeshop.service.MenuService;
import reservasi.coffeshop.service.OrderService;
import reservasi.coffeshop.service.PromoService;
import reservasi.coffeshop.service.ReportService;
import reservasi.coffeshop.service.ReservationService;
import reservasi.coffeshop.service.TableService;
import reservasi.coffeshop.service.UserAccountService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ReservationService reservationService;
    private final MenuService menuService;
    private final PromoService promoService;
    private final TableService tableService;
    private final OrderService orderService;
    private final ReportService reportService;
    private final UserAccountService userAccountService;

    public AdminController(
            AdminService adminService,
            ReservationService reservationService,
            MenuService menuService,
            PromoService promoService,
            TableService tableService,
            OrderService orderService,
            ReportService reportService,
            UserAccountService userAccountService
    ) {
        this.adminService = adminService;
        this.reservationService = reservationService;
        this.menuService = menuService;
        this.promoService = promoService;
        this.tableService = tableService;
        this.orderService = orderService;
        this.reportService = reportService;
        this.userAccountService = userAccountService;
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.dashboard();
    }

    @GetMapping("/reservations")
    public List<ReservationResponse> reservations(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return reservationService.findAll(start, end);
    }

    @PutMapping("/reservations/{id}/status")
    public ReservationResponse updateReservationStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        return reservationService.updateStatus(id, request);
    }

    // Admin tidak melakukan assign manual. Pegawai ditentukan otomatis berdasarkan shift reservasi.

    @GetMapping("/employees")
    public List<UserAccountResponse> employees() {
        return userAccountService.activeEmployees();
    }

    @PostMapping("/employees")
    public UserAccountResponse createEmployee(@Valid @RequestBody SaveEmployeeAccountRequest request) {
        return userAccountService.createEmployee(request);
    }

    @PutMapping("/employees/{id}/shift")
    public UserAccountResponse updateEmployeeShift(
            @PathVariable Long id,
            @Valid @RequestBody SaveEmployeeShiftRequest request
    ) {
        return userAccountService.updateEmployeeShift(id, request);
    }

    @GetMapping("/orders")
    public List<OrderResponse> allOrders() {
        return orderService.findAll();
    }

    @GetMapping("/orders/today")
    public List<OrderResponse> todayOrders() {
        return orderService.findToday();
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request
    ) {
        String actorName = request.actorName() == null ? "Admin" : request.actorName();
        return orderService.updateStatus(id, request.status(), actorName);
    }

    @GetMapping("/menu")
    public List<MenuItemResponse> allMenu() {
        return menuService.findAll();
    }

    @PostMapping(value = "/menu/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadMenuImage(@RequestParam("file") MultipartFile file) {
        return Map.of("imageUrl", menuService.saveImage(file));
    }

    @PostMapping("/menu")
    public MenuItemResponse createMenu(@Valid @RequestBody SaveMenuItemRequest request) {
        return menuService.create(request);
    }

    @PutMapping("/menu/{id}")
    public MenuItemResponse updateMenu(
            @PathVariable Long id,
            @Valid @RequestBody SaveMenuItemRequest request
    ) {
        return menuService.update(id, request);
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/promos")
    public List<PromoResponse> allPromos() {
        return promoService.findAll();
    }

    @PostMapping("/promos")
    public PromoResponse createPromo(@Valid @RequestBody SavePromoRequest request) {
        return promoService.create(request);
    }

    @PutMapping("/promos/{id}")
    public PromoResponse updatePromo(
            @PathVariable Long id,
            @Valid @RequestBody SavePromoRequest request
    ) {
        return promoService.update(id, request);
    }

    @DeleteMapping("/promos/{id}")
    public ResponseEntity<Void> deletePromo(@PathVariable Long id) {
        promoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tables")
    public List<TableResponse> allTables() {
        return tableService.findAllMaster();
    }

    @PostMapping("/tables")
    public TableResponse createTable(@Valid @RequestBody CreateTableRequest request) {
        return tableService.create(request);
    }

    @PutMapping("/tables/{id}")
    public TableResponse updateTable(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTableRequest request
    ) {
        return tableService.update(id, request);
    }

    @DeleteMapping("/tables/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports")
    public Map<String, Object> reports(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return reportService.buildReports(start, end);
    }
}
