package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reservasi.coffeshop.entity.Role;
import reservasi.coffeshop.entity.UserAccount;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    Optional<UserAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<UserAccount> findByRoleAndActiveTrueOrderByFullNameAsc(Role role);
    Optional<UserAccount> findByFullNameIgnoreCaseAndRoleAndActiveTrue(String fullName, Role role);
}
