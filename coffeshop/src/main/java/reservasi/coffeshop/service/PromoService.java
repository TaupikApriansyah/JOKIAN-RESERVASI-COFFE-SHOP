package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.PromoResponse;
import reservasi.coffeshop.dto.SavePromoRequest;
import reservasi.coffeshop.entity.Promo;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.PromoRepository;

import java.util.List;

@Service
public class PromoService {
    private static final Logger log = LoggerFactory.getLogger(PromoService.class);
    private final PromoRepository promoRepository;
    private final MappingService mapper;
    private final RealtimeService realtimeService;
    private final AuditLogService auditLogService;

    public PromoService(PromoRepository promoRepository, MappingService mapper, RealtimeService realtimeService, AuditLogService auditLogService) {
        this.promoRepository = promoRepository;
        this.mapper = mapper;
        this.realtimeService = realtimeService;
        this.auditLogService = auditLogService;
    }

    public List<PromoResponse> findActive() {
        return promoRepository.findByActiveTrueOrderByTitleAsc().stream().map(mapper::toPromoResponse).toList();
    }

    public List<PromoResponse> findAll() {
        return promoRepository.findAllByOrderByActiveDescTitleAsc().stream().map(mapper::toPromoResponse).toList();
    }

    @Transactional
    public PromoResponse create(SavePromoRequest request) {
        Promo promo = new Promo();
        apply(promo, request);
        Promo saved = promoRepository.save(promo);
        log.info("Promo dibuat: {}", saved.getTitle());
        auditLogService.save("PROMO_CREATE", "Admin", "Menambah promo " + saved.getTitle());
        realtimeService.publish("promo_created");
        return mapper.toPromoResponse(saved);
    }

    @Transactional
    public PromoResponse update(Long id, SavePromoRequest request) {
        Promo promo = promoRepository.findById(id).orElseThrow(() -> new NotFoundException("Promo tidak ditemukan."));
        apply(promo, request);
        Promo saved = promoRepository.save(promo);
        log.info("Promo diperbarui: {}", saved.getTitle());
        auditLogService.save("PROMO_UPDATE", "Admin", "Memperbarui promo " + saved.getTitle());
        realtimeService.publish("promo_updated");
        return mapper.toPromoResponse(saved);
    }

    @Transactional
    public void delete(Long id) {
        Promo promo = promoRepository.findById(id).orElseThrow(() -> new NotFoundException("Promo tidak ditemukan."));
        promoRepository.delete(promo);
        log.info("Promo dihapus: {}", promo.getTitle());
        auditLogService.save("PROMO_DELETE", "Admin", "Menghapus promo " + promo.getTitle());
        realtimeService.publish("promo_deleted");
    }

    private void apply(Promo promo, SavePromoRequest request) {
        promo.setTitle(request.title().trim());
        promo.setDescription(request.description().trim());
        promo.setBadge(request.badge() == null || request.badge().isBlank() ? "Promo" : request.badge().trim());
        promo.setActive(request.active());
        promo.setStartDate(request.startDate());
        promo.setEndDate(request.endDate());
    }
}
