package in.oswinjerome.ArtSell.colab;

import in.oswinjerome.ArtSell.artist.ArtistProfileDTO;
import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ColabRepo extends JpaRepository<Colab, Long> {

    Page<Colab> findByRequester(User requester, Pageable pageable);
    List<Colab> findByRequester(User requester);


    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(ap,null,null) FROM Colab c " +
            "JOIN users u ON c.artist = u " +
            "JOIN artist_profiles ap ON ap.user=u " +
            "WHERE c.requester = :requester")
    List<ArtistProfileDTO> findAllColab(User requester);
}
