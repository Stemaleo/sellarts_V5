package in.oswinjerome.ArtSell.artworks;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("public/artworks")
public class PublicArtWorkController {

    private final ArtWorkService artWorkService;

    public PublicArtWorkController(ArtWorkService artWorkService) {
        this.artWorkService = artWorkService;
    }

    @GetMapping("")
    public ResponseEntity<ResponseDTO> getMyArtWorks(
            @RequestParam(defaultValue = "") String title,
            @RequestParam(required = false) String paintingType,
            @RequestParam(required = false) String materialType,
            @RequestParam(defaultValue = "0") int price,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @PageableDefault(size = 10, page = 0, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    )  {

        return artWorkService.getAllArtWorks(title,pageable,paintingType,materialType,price);
    }

    @GetMapping("{artworkId}")
    public ResponseEntity<ResponseDTO> getArtWork(
           @PathVariable String artworkId

    )  {
        return artWorkService.getArtWork(artworkId);
    }


    @GetMapping("artist/{artistId}")
    public ResponseEntity<ResponseDTO> getAllFeaturedArtOfArtist(
            @PathVariable Long artistId

    )  {

        return artWorkService.getAllFeaturedArtOfArtist(artistId);
    }

}
