package reservasi.coffeshop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import reservasi.coffeshop.entity.CafeTable;

import java.util.List;
import java.util.Optional;

public interface CafeTableRepository extends JpaRepository<CafeTable, Long> {
    Optional<CafeTable> findByCodeIgnoreCase(String code);
    List<CafeTable> findAllByOrderByFloorAscAreaAscCodeAsc();
    List<CafeTable> findByAreaIgnoreCaseOrderByFloorAscCodeAsc(String area);
    List<CafeTable> findByFloorIgnoreCaseOrderByAreaAscCodeAsc(String floor);
    List<CafeTable> findByAreaIgnoreCaseAndFloorIgnoreCaseOrderByCodeAsc(String area, String floor);
    boolean existsByCodeIgnoreCase(String code);
    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);
}
