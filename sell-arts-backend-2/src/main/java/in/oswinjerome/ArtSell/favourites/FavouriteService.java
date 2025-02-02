package in.oswinjerome.ArtSell.favourites;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.artworks.ArtWorkService;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FavouriteService {
    private final AuthService authService;
    private final ArtWorkService artWorkService;
    private final FavouriteRepo favouriteRepo;
    private final ArtWorkRepo artWorkRepo;

    public FavouriteService(AuthService authService, ArtWorkService artWorkService, FavouriteRepo favouriteRepo, ArtWorkRepo artWorkRepo) {
        this.authService = authService;
        this.artWorkService = artWorkService;
        this.favouriteRepo = favouriteRepo;
        this.artWorkRepo = artWorkRepo;
    }

    public ResponseEntity<ResponseDTO> addToFav(@Valid AddToFavDTO addToFavDTO) {

        User user = authService.getCurrentUser();
        ArtWork artWork = artWorkService.findOrFailById(addToFavDTO.getArtworkId());
        Optional<Favourite> prev = favouriteRepo.findByUserAndArtWork(user, artWork);
        if(prev.isPresent()) {
            return deleteFav(prev.get());
        }
        Favourite favourite = new Favourite();
        favourite.setUser(user);
        favourite.setArtWork(artWork);
        favouriteRepo.save(favourite);

        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data("ADDED")
                .build());
    }

    public ResponseEntity<ResponseDTO> deleteFav(Favourite prev) {

        favouriteRepo.delete(prev);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data("REMOVED")
                .build());
    }

    public ResponseEntity<ResponseDTO> getFavStats() {

        List<FavStatsDTO> favStatsDTOS =  artWorkRepo.getArtWorkWithFavStats();

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(favStatsDTOS)
                .build());
    }

    public ResponseEntity<ResponseDTO> getFavorites() {
        User currentUser = authService.getCurrentUser();
        List<ArtWorkDTO> favourites = favouriteRepo.findUsersFavs(currentUser);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(favourites)
                .build());
    }
}
