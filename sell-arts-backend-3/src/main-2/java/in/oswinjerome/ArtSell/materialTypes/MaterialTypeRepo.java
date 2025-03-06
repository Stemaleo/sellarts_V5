package in.oswinjerome.ArtSell.materialTypes;

import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface MaterialTypeRepo extends JpaRepository<MaterialType, Long> {
    Optional<MaterialType> findByName(String name);

}
