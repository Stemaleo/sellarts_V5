package in.oswinjerome.ArtSell.analytics;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import lombok.Data;

@Data
public class TopSellingArtworkDTO {

    private ArtWorkDTO artwork;
    private Long count;

    public TopSellingArtworkDTO(ArtWork artWork, Long count) {
        this.artwork = new ArtWorkDTO(artWork);
        this.count = count;
    }

}
