package in.oswinjerome.ArtSell.artworks;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.oswinjerome.ArtSell.artworks.dto.StoreArtWorkReqDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController()
@RequestMapping("artists/artworks")
public class ArtistArtWorkController {

    @Autowired
    ArtWorkService artWorkService;

    // Créer une œuvre d'art
    @PostMapping
    @Secured({"ROLE_ARTIST", "ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> createArtWork(@RequestPart("data") String jsonData,
                                                     @RequestPart(value = "images", required = false) List<MultipartFile> files) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        StoreArtWorkReqDTO storeDTO = mapper.readValue(jsonData, StoreArtWorkReqDTO.class);
        if (files == null || files.isEmpty()) {
            throw new InvalidDataException("Images can't be empty");
        }

        // Vérifier si size est bien reçu
        System.out.println("Size reçu : " + storeDTO.getSize()); // 🔍 Debugging
        return artWorkService.store(storeDTO, files);
    }

    // Récupérer les œuvres d'art de l'artiste
    @GetMapping
    @Secured({"ROLE_ARTIST", "ROLE_GALLERY", "ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> getMyArtWorks(
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "") String paintingType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Pageable pageable) {
        return artWorkService.getUsersArtWork(title, paintingType, pageable);
    }

    // Mettre à jour le statut "featured" d'une œuvre d'art
    @PostMapping("{artworkId}/featured") // TEMPORAIRE : Accepte aussi POST
    @PutMapping("{artworkId}/featured")
    @Secured({"ROLE_ARTIST", "ROLE_GALLERY", "ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> updateFeatured(@PathVariable String artworkId) {
        return artWorkService.updateFeatured(artworkId);
    }

    @PutMapping("{artworkId}")
    @Secured({"ROLE_ARTIST", "ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> updateArtWork(
            @PathVariable String artworkId,
            @RequestPart("data") String jsonData,
            @RequestPart(value = "images", required = false) List<MultipartFile> files) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        StoreArtWorkReqDTO storeDTO = mapper.readValue(jsonData, StoreArtWorkReqDTO.class);

        return artWorkService.updateFeatured(artworkId);
        //return artWorkService.updateFeatured(artworkId, storeDTO, files);
    }


    @DeleteMapping("{artworkId}")
    @Secured({"ROLE_ARTIST", "ROLE_GALLERY", "ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> deleteArtWork(@PathVariable String artworkId) {
        boolean isDeleted = artWorkService.deleteArtWork(artworkId);
    
        if (isDeleted) {
            return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .message("Artwork deleted successfully")
                .build());
        } else {
            return ResponseEntity.badRequest().body(ResponseDTO.builder()
                .success(false)
                .message("Failed to delete artwork")
                .build());
        }
    }
    
}
