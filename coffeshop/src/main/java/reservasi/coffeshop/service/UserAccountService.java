package reservasi.coffeshop.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reservasi.coffeshop.dto.SaveEmployeeAccountRequest;
import reservasi.coffeshop.dto.SaveEmployeeShiftRequest;
import reservasi.coffeshop.dto.UserAccountResponse;
import reservasi.coffeshop.entity.Role;
import reservasi.coffeshop.entity.UserAccount;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.exception.NotFoundException;
import reservasi.coffeshop.repository.UserAccountRepository;

import java.util.Comparator;
import java.util.List;

@Service
public class UserAccountService {
    private final UserAccountRepository userRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    public UserAccountService(UserAccountRepository userRepository, AuditLogService auditLogService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserAccountResponse createEmployee(SaveEmployeeAccountRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BadRequestException("Email pegawai sudah digunakan.");
        }
        UserAccount employee = new UserAccount();
        employee.setFullName(request.fullName().trim());
        employee.setEmail(request.email().trim().toLowerCase());
        employee.setPasswordHash(passwordEncoder.encode(request.password()));
        employee.setPhone(request.phone() == null ? "" : request.phone().trim());
        employee.setRole(Role.PEGAWAI);
        employee.setShiftName(request.shiftName().trim());
        employee.setShiftStart(request.shiftStart());
        employee.setShiftEnd(request.shiftEnd());
        employee.setActive(request.active());
        UserAccount saved = userRepository.save(employee);
        auditLogService.save("EMPLOYEE_CREATE", "Admin", "Membuat akun pegawai " + saved.getFullName() + " untuk " + saved.getShiftName());
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserAccountResponse> activeEmployees() {
        return userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == Role.PEGAWAI)
                .sorted(Comparator.comparing(UserAccount::getFullName, String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public UserAccountResponse updateEmployeeShift(Long id, SaveEmployeeShiftRequest request) {
        UserAccount employee = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Pegawai tidak ditemukan."));
        if (employee.getRole() != Role.PEGAWAI) {
            throw new BadRequestException("Jadwal shift hanya dapat diatur untuk akun pegawai.");
        }
        employee.setShiftName(request.shiftName().trim());
        employee.setShiftStart(request.shiftStart());
        employee.setShiftEnd(request.shiftEnd());
        employee.setActive(request.active());
        UserAccount saved = userRepository.save(employee);
        auditLogService.save("EMPLOYEE_SHIFT_UPDATE", "Admin", "Memperbarui shift pegawai " + saved.getFullName() + " menjadi " + saved.getShiftName());
        return toResponse(saved);
    }

    private UserAccountResponse toResponse(UserAccount u) {
        return new UserAccountResponse(
                u.getId(),
                u.getFullName(),
                u.getEmail(),
                u.getPhone(),
                u.getRole().name(),
                u.isActive(),
                u.getShiftName(),
                u.getShiftStart(),
                u.getShiftEnd()
        );
    }
}
