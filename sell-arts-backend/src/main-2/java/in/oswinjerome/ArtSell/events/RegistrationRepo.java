package in.oswinjerome.ArtSell.events;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegistrationRepo extends JpaRepository<Registration, Long> {

    Optional<Registration> findByUserAndEvent(User user, Event event);
    List<Registration> findByEvent(Event event);
    int countByEvent(Event event);
}
