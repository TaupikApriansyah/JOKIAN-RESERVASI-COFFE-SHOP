package reservasi.coffeshop.service;

import org.springframework.stereotype.Service;
import reservasi.coffeshop.dto.UserAccountResponse;
import reservasi.coffeshop.entity.Role;
import reservasi.coffeshop.repository.UserAccountRepository;

import java.util.List;

@Service
public class UserAccountService {
    private final UserAccountRepository userRepository;

    public UserAccountService(UserAccountRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserAccountResponse> activeEmployees() {
        return userRepository.findByRoleAndActiveTrueOrderByFullNameAsc(Role.PEGAWAI)
                .stream()
                .map(u -> new UserAccountResponse(u.getId(), u.getFullName(), u.getEmail(), u.getPhone(), u.getRole().name(), u.isActive()))
                .toList();
    }
}
