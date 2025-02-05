package in.oswinjerome.ArtSell.catalogues;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("catalogues")
public class CatalogController {


    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @PostMapping
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
   public ResponseEntity<ResponseDTO> store(@RequestBody @Valid StoreCatalogDTO storeCatalogDTO) {

        return catalogService.store(storeCatalogDTO);
   }

    @GetMapping("/me")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getMine() {

        return catalogService.getMine();
    }

    @GetMapping("/{catalogId}")
    public ResponseEntity<ResponseDTO> getCatalog(@PathVariable String catalogId) {

        return catalogService.getCatalog(catalogId);
    }

    @DeleteMapping("/{catalogId}")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> deleteCatalog(@PathVariable String catalogId) {

        return catalogService.deleteCatalog(catalogId);
    }

}
