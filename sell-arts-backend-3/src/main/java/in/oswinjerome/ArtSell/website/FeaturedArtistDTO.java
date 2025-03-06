package in.oswinjerome.ArtSell.website;

import in.oswinjerome.ArtSell.artist.ArtistProfileDTO;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import lombok.Data;

@Data
public class FeaturedArtistDTO {

    private ArtistProfileDTO artist;
    private ArtWorkDTO artwork;


    public FeaturedArtistDTO(ArtistProfile artist, ArtWork artwork) {
        this.artist = ArtistProfileDTO.fromUser(artist);
        if(artwork != null) {

            this.artwork = new ArtWorkDTO(artwork);
        }
    }

}
