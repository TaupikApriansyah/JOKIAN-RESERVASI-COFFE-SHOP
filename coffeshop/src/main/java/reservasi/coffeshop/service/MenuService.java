package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import reservasi.coffeshop.dto.MenuItemResponse;
import reservasi.coffeshop.dto.SaveMenuItemRequest;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.entity.MenuItem;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.MenuItemRepository;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class MenuService {
    private static final Logger log = LoggerFactory.getLogger(MenuService.class);
    private final MenuItemRepository menuRepository;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDirectory;

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

    public String saveImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File gambar wajib dipilih.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.toLowerCase().startsWith("image/")) {
            throw new BadRequestException("File harus berupa gambar.");
        }
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new BadRequestException("Ukuran gambar maksimal 2 MB.");
        }

        String originalName = file.getOriginalFilename() == null ? "menu.png" : file.getOriginalFilename();
        String extension = ".png";
        int dotIndex = originalName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < originalName.length() - 1) {
            extension = originalName.substring(dotIndex).toLowerCase();
        }
        if (!List.of(".jpg", ".jpeg", ".png", ".webp").contains(extension)) {
            throw new BadRequestException("Format gambar harus JPG, PNG, atau WEBP.");
        }

        try {
            Path uploadDir = Paths.get(uploadDirectory, "menu").toAbsolutePath().normalize();
            java.nio.file.Files.createDirectories(uploadDir);
            String fileName = UUID.randomUUID() + extension;
            Path target = uploadDir.resolve(fileName).normalize();
            if (!target.startsWith(uploadDir)) {
                throw new BadRequestException("Nama file gambar tidak valid.");
            }
            file.transferTo(target);
            log.info("Gambar menu diupload: {}", fileName);
            return "/uploads/menu/" + fileName;
        } catch (IOException ex) {
            throw new BadRequestException("Gagal menyimpan gambar menu.");
        }
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
