package in.oswinjerome.ArtSell.favourites;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> addToFav(@RequestBody @Valid AddToFavDTO addToFavDTO){

        return favouriteService.addToFav(addToFavDTO);
    }

    @GetMapping("admin")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getFavStats(){

        return favouriteService.getFavStats();
    }

    @GetMapping()
    public ResponseEntity<ResponseDTO> getMyFav(){

        return favouriteService.getFavorites();
    }

}
