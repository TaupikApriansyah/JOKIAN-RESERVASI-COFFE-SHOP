package reservasi.coffeshop.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reservasi.coffeshop.entity.AuditLog;
import reservasi.coffeshop.repository.AuditLogRepository;

@Service
public class AuditLogService {
    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void save(String action, String actor, String detail) {
        String safeActor = actor == null || actor.isBlank() ? "System" : actor.trim();
        AuditLog auditLog = new AuditLog();
        auditLog.setAction(action);
        auditLog.setActor(safeActor);
        auditLog.setDetail(detail == null || detail.isBlank() ? "-" : detail.trim());
        auditLogRepository.save(auditLog);
        log.info("Audit {} oleh {}: {}", action, safeActor, auditLog.getDetail());
    }
}
