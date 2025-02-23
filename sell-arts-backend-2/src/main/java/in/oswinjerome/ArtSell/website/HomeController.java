package in.oswinjerome.ArtSell.website;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("home")
public class HomeController {


    private final HomeService homeService;

    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @GetMapping("random/artworks")
    public ResponseEntity<ResponseDTO> getRandomArtworks(){

        return homeService.getRandomArtworks();
    }

    @GetMapping("random/artists")
    public ResponseEntity<ResponseDTO> getRandomArtist(){

        return homeService.getRandomArtists();
    }

    @GetMapping("random/artist")
    public ResponseEntity<ResponseDTO> getARandomArtist(){

        return homeService.getARandomArtists();
    }
    @GetMapping("random/gallery")
    public ResponseEntity<ResponseDTO> getRandomGallery(){

        return homeService.getRandomGallery();
    }



}
