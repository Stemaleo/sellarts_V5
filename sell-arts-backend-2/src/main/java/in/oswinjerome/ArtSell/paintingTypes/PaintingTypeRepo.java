package in.oswinjerome.ArtSell.paintingTypes;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface PaintingTypeRepo extends JpaRepository<PaintingType, Long> {

    Optional<PaintingType> findByName(String name);


}
