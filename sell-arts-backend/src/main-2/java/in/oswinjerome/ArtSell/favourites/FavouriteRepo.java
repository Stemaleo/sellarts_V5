package in.oswinjerome.ArtSell.favourites;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepo extends JpaRepository<Favourite, Long> {

    Optional<Favourite> findByUserAndArtWork(User user, ArtWork artWork);


    @Query("SELECT new in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO(f.artWork) FROM Favourite f WHERE f.user = :user")
    List<ArtWorkDTO> findUsersFavs(User user);
}
