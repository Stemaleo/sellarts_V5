package in.oswinjerome.ArtSell.catalogues;

import in.oswinjerome.ArtSell.artist.ArtistProfileDTO;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class CatalogDTO {
    private String id;
    private String name;
    private String description;
    private List<ArtWorkDTO> artWorks;
    private ArtistProfileDTO owner;
    private LocalDateTime createdAt;


    public CatalogDTO(Catalog catalog) {

        this.id = catalog.getId();
        this.name = catalog.getName();
        this.description = catalog.getDescription();
        this.artWorks = catalog.getArtWorks().stream().map(ArtWorkDTO::convertToDTO).toList();
        this.createdAt = catalog.getCreatedAt();
        this.owner =ArtistProfileDTO.fromUser(catalog.getOwner().getArtistProfile());

    }


}
