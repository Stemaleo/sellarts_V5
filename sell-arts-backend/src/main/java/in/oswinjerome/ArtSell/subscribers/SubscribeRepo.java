package in.oswinjerome.ArtSell.subscribers;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface SubscribeRepo extends CrudRepository<Subscribe, Long> {

    List<Subscribe> findByArtist(User artist);
    Optional<Subscribe> findByUserAndArtist(User user,User artist);

    int countByArtist(User artist);

}
