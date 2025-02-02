package in.oswinjerome.ArtSell.bids;

import in.oswinjerome.ArtSell.models.ArtWork;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBidDTO {

    private BigDecimal amount;
    private String artworkId;

}
