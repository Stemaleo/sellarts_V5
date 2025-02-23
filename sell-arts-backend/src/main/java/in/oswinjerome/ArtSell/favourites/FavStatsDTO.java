package in.oswinjerome.ArtSell.favourites;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import lombok.Data;

@Data
public class FavStatsDTO {
    private ArtWorkDTO artwork;
    private Long count;

    public FavStatsDTO(ArtWork artwork, Long count) {
        this.artwork = ArtWorkDTO.convertToDTO(artwork);
        this.count = count;
    }
}
