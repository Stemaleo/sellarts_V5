package in.oswinjerome.ArtSell.artworks;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import lombok.Data;

import java.util.List;

@Data
public class ArtWorkWithRelatedDTO {
    private ArtWorkDTO artwork;
    private List<ArtWorkDTO> relatedArtworks;

}
