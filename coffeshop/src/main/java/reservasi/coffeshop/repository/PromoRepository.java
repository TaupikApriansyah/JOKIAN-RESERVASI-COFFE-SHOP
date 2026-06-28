package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reservasi.coffeshop.entity.Promo;

import java.util.List;

public interface PromoRepository extends JpaRepository<Promo, Long> {
    List<Promo> findAllByOrderByActiveDescTitleAsc();
    List<Promo> findByActiveTrueOrderByTitleAsc();
}
