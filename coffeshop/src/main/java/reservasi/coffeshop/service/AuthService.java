package reservasi.coffeshop.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reservasi.coffeshop.dto.LoginRequest;
import reservasi.coffeshop.dto.LoginResponse;
import reservasi.coffeshop.dto.RegisterCustomerRequest;
import reservasi.coffeshop.entity.Role;
import reservasi.coffeshop.entity.UserAccount;
import reservasi.coffeshop.exception.BadRequestException;
import reservasi.coffeshop.repository.UserAccountRepository;

@Service
public class AuthService {
    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserAccountRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResponse registerCustomer(RegisterCustomerRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new BadRequestException("Email sudah terdaftar. Silakan login atau gunakan email lain.");
        }
        UserAccount user = new UserAccount();
        user.setFullName(request.fullName().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone().trim());
        user.setRole(Role.CUSTOMER);
        user.setActive(true);
        UserAccount saved = userRepository.save(user);
        return new LoginResponse(
                saved.getId(),
                saved.getFullName(),
                saved.getEmail(),
                saved.getPhone(),
                saved.getRole().name(),
                "Registrasi customer berhasil.",
                saved.getShiftName(),
                saved.getShiftStart(),
                saved.getShiftEnd()
        );
    }

    public LoginResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadRequestException("Email atau password tidak sesuai."));
        if (!user.isActive()) {
            throw new BadRequestException("Akun tidak aktif. Hubungi administrator.");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Email atau password tidak sesuai.");
        }
        return new LoginResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().name(),
                "Login berhasil.",
                user.getShiftName(),
                user.getShiftStart(),
                user.getShiftEnd()
        );
    }
}
