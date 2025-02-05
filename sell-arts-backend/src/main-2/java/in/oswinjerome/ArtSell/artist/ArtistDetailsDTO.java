package in.oswinjerome.ArtSell.artist;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class ArtistDetailsDTO {

    private User user;
    private List<ArtWorkDTO> artWorks = new ArrayList<>();
    private Long noOfArtWorks;
    private Long noOfOrders;
    private boolean subscribed;
    private int subscribeCount;

}
