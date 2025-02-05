package in.oswinjerome.ArtSell.colab.request;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.Optional;

public interface ColabRequestRepo extends JpaRepository<ColabRequest, Long> {

    @Query("SELECT req FROM ColabRequest  req WHERE req.requester = :requester")
    Page<ColabRequest> findByRequester(User requester, Pageable pageable);

    @Query("SELECT req FROM ColabRequest  req WHERE req.artist = :artist")
    Page<ColabRequest> findByArtist(User artist, Pageable pageable);


    Optional<ColabRequest> findByRequesterAndArtistAndStatusNotIn(User requester, User artist, Collection<ColabRequestStatus> status);

}
