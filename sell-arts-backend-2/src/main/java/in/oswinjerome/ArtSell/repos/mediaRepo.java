package in.oswinjerome.ArtSell.repos;

import in.oswinjerome.ArtSell.models.Media;
import org.springframework.data.jpa.repository.JpaRepository;

public interface mediaRepo extends JpaRepository<Media, String> {
}
