package in.oswinjerome.ArtSell.events;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EventRepo extends JpaRepository<Event, Long> {

    @Query("SELECT new in.oswinjerome.ArtSell.events.EventDTO(e,COUNT(r),false) FROM events e " +
            "LEFT JOIN Registration r on r.event = e WHERE e.owner =:owner " +
            "GROUP BY e")
    Page<EventDTO> findByOwner(User owner, Pageable pageable);

    @Query("SELECT new in.oswinjerome.ArtSell.events.EventDTO(e,COUNT(r),false) FROM events e " +
            "LEFT JOIN Registration r on r.event = e WHERE e.owner =:owner " +
            "GROUP BY e")
    List<EventDTO> findByOwner(User owner);

    @Query("SELECT new in.oswinjerome.ArtSell.events.EventDTO(e,COUNT(r),false) FROM events e " +
            "LEFT JOIN Registration r on r.event = e " +
            "GROUP BY e")
    Page<EventDTO> findAllForWeb(Pageable pageable);





}
