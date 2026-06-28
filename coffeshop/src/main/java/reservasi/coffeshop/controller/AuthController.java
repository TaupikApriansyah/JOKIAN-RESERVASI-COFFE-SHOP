package reservasi.coffeshop.controller;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import reservasi.coffeshop.dto.LoginRequest;
import reservasi.coffeshop.dto.LoginResponse;
import reservasi.coffeshop.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
