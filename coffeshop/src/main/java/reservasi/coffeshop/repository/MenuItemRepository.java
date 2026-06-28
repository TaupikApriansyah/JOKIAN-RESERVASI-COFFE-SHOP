package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reservasi.coffeshop.entity.MenuItem;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findAllByOrderByCategoryAscNameAsc();
    List<MenuItem> findByAvailableTrueOrderByCategoryAscNameAsc();
}
