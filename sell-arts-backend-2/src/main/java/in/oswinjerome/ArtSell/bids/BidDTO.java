package in.oswinjerome.ArtSell.bids;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.User;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BidDTO {

    private Long id;
    private ArtWorkDTO artwork;
    private User user;
    private BigDecimal amount;
    private BidStatus status;


    public static  BidDTO convertToDto(Bid bid){
        BidDTO dto = new BidDTO();
        dto.id = bid.getId();
        dto.setStatus(bid.getStatus());
        dto.setAmount(bid.getAmount());
        dto.setUser(bid.getUser());
        dto.setArtwork(ArtWorkDTO.convertToDTO(bid.getArtWork()));
        return dto;
    }

}
