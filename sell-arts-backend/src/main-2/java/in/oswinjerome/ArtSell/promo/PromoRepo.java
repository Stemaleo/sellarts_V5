package in.oswinjerome.ArtSell.promo;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PromoRepo extends JpaRepository<Promo, Long> {

    List<Promo> findByUserOrderByCreatedAtDesc(User user);

}
