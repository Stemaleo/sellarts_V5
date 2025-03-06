package in.oswinjerome.ArtSell.cart;

import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepo extends JpaRepository<CartItem,String> {
    Optional<CartItem> findByUserAndArtwork(User user, ArtWork artwork);
    List<CartItem> findAllByUser(User user);

}
