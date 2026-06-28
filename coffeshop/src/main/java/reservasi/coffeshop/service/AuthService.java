package reservasi.coffeshop.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reservasi.coffeshop.dto.LoginRequest;
import reservasi.coffeshop.dto.LoginResponse;
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

    public LoginResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new BadRequestException("Email atau password tidak sesuai."));
        if (!user.isActive()) {
            throw new BadRequestException("Akun tidak aktif. Hubungi administrator.");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadRequestException("Email atau password tidak sesuai.");
        }
        return new LoginResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), "Login berhasil.");
    }
}
