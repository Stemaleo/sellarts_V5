package in.oswinjerome.ArtSell.catalogues;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class CatalogService {
    private final ArtWorkRepo artWorkRepo;
    private final AuthService authService;
    private final CatalogRepo catalogRepo;

    public CatalogService(ArtWorkRepo artWorkRepo, AuthService authService, CatalogRepo catalogRepo) {
        this.artWorkRepo = artWorkRepo;
        this.authService = authService;
        this.catalogRepo = catalogRepo;
    }

    public ResponseEntity<ResponseDTO> store(@Valid StoreCatalogDTO storeCatalogDTO) {
        User user = authService.getCurrentUser();
        List<ArtWork> artWorks = artWorkRepo.findAllById(storeCatalogDTO.getArtWorkIds());

        Catalog catalog = new Catalog();
        catalog.setName(storeCatalogDTO.getName());
        catalog.setDescription(storeCatalogDTO.getDescription());
        catalog.setOwner(user);
        catalog.setArtWorks(artWorks);

        catalogRepo.save(catalog);


        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(catalog)
                .build());
    }

    public ResponseEntity<ResponseDTO> getMine() {

        User user = authService.getCurrentUser();

        List<CatalogDTO> catalogs = catalogRepo.findByOwnerOrderByCreatedAtDesc(user).stream().map(CatalogDTO::new).toList();

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(catalogs)
                .build());
    }

    public ResponseEntity<ResponseDTO> getCatalog(String catalogId) {

        Catalog catalog = catalogRepo.findById(catalogId).orElseThrow();

        CatalogDTO catalogDTO = new CatalogDTO(catalog);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(catalogDTO)
                .build());
    }

    public ResponseEntity<ResponseDTO> deleteCatalog(String catalogId) {
        User user = authService.getCurrentUser();
        Catalog catalog = catalogRepo.findById(catalogId).orElseThrow();

        if(!Objects.equals(catalog.getOwner().getId(), user.getId())) {
            throw new InvalidDataException("You don't own the catalog");
        }

       catalogRepo.delete(catalog);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data("DELETED")
                .build());
    }
}
