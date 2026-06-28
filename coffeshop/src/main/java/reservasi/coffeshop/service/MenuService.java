package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.MenuItemResponse;
import reservasi.coffeshop.dto.SaveMenuItemRequest;
import reservasi.coffeshop.entity.MenuItem;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.MenuItemRepository;

import java.util.List;

@Service
public class MenuService {
    private static final Logger log = LoggerFactory.getLogger(MenuService.class);
    private final MenuItemRepository menuRepository;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public MenuService(MenuItemRepository menuRepository, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.menuRepository = menuRepository;
        this.mapper = mapper;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    public List<MenuItemResponse> findAvailable() {
        return menuRepository.findByAvailableTrueOrderByCategoryAscNameAsc().stream().map(mapper::toMenuResponse).toList();
    }

    public List<MenuItemResponse> findAll() {
        return menuRepository.findAllByOrderByCategoryAscNameAsc().stream().map(mapper::toMenuResponse).toList();
    }

    @Transactional
    public MenuItemResponse create(SaveMenuItemRequest request) {
        MenuItem item = new MenuItem();
        apply(item, request);
        MenuItem saved = menuRepository.save(item);
        log.info("Menu dibuat: {}", saved.getName());
        auditLogService.save("MENU_CREATE", "Admin", "Menambah menu " + saved.getName());
        realtimeService.publish("menu_created");
        return mapper.toMenuResponse(saved);
    }

    @Transactional
    public MenuItemResponse update(Long id, SaveMenuItemRequest request) {
        MenuItem item = menuRepository.findById(id).orElseThrow(() -> new NotFoundException("Menu tidak ditemukan."));
        apply(item, request);
        MenuItem saved = menuRepository.save(item);
        log.info("Menu diperbarui: {}", saved.getName());
        auditLogService.save("MENU_UPDATE", "Admin", "Memperbarui menu " + saved.getName());
        realtimeService.publish("menu_updated");
        return mapper.toMenuResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        MenuItem item = menuRepository.findById(id).orElseThrow(() -> new NotFoundException("Menu tidak ditemukan."));
        menuRepository.delete(item);
        log.info("Menu dihapus: {}", item.getName());
        auditLogService.save("MENU_DELETE", "Admin", "Menghapus menu " + item.getName());
        realtimeService.publish("menu_deleted");
    }

    private void apply(MenuItem item, SaveMenuItemRequest request) {
        item.setName(request.name().trim());
        item.setCategory(request.category().trim());
        item.setDescription(request.description().trim());
        item.setPrice(request.price());
        item.setAvailable(request.available());
        item.setImageUrl(request.imageUrl() == null || request.imageUrl().isBlank() ? "/images/produk-utama.png" : request.imageUrl().trim());
    }
}
