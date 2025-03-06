package in.oswinjerome.ArtSell.bids;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("bids")
public class BidController {


    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> createBid( @RequestBody CreateBidDTO createBidDTO) {

       return bidService.createBid(createBidDTO);
    }


    @GetMapping("/my")
    public ResponseEntity<ResponseDTO> getMyBids(){

        return bidService.getMyBids();
    }

    @GetMapping("/artist")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getArtistBids(){

        return bidService.getArtistBids();
    }

    @PutMapping("{bidId}")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> updateBid(@PathVariable Long bidId, @RequestBody UpdateBidDTO updateBidDTO) {



        return bidService.updateBid(bidId,updateBidDTO);
    }

}
