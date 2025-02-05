package in.oswinjerome.ArtSell.bids;

import in.oswinjerome.ArtSell.artworks.ArtWorkService;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.cart.CartItem;
import in.oswinjerome.ArtSell.cart.CartRepo;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.Order;
import in.oswinjerome.ArtSell.services.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BidService {
    private final AuthService authService;
    private final ArtWorkService artWorkService;
    private final BidRepo bidRepo;
    private final CartRepo cartRepo;
    private final NotificationService notificationService;

    public BidService(AuthService authService, ArtWorkService artWorkService, BidRepo bidRepo, CartRepo cartRepo, NotificationService notificationService) {
        this.authService = authService;
        this.artWorkService = artWorkService;
        this.bidRepo = bidRepo;
        this.cartRepo = cartRepo;
        this.notificationService = notificationService;
    }

    public ResponseEntity<ResponseDTO> createBid(CreateBidDTO createBidDTO) {

        User user = authService.getCurrentUser();
        ArtWork artWork = artWorkService.findOrFailById(createBidDTO.getArtworkId());

        Bid bid = new Bid();
        bid.setUser(user);
        bid.setArtWork(artWork);
        bid.setAmount(createBidDTO.getAmount());

        bidRepo.save(bid);


        return ResponseEntity.ok( ResponseDTO.builder()
                        .data(bid)
                        .success(true)
                .build());
    }

    public ResponseEntity<ResponseDTO> getMyBids() {
        User user = authService.getCurrentUser();
        List<Bid> bids = bidRepo.findByUser(user);
        return ResponseEntity.ok( ResponseDTO.builder()
                .data(bids.stream().map(BidDTO::convertToDto))
                .success(true)
                .build());
    }

    public ResponseEntity<ResponseDTO> getArtistBids() {
        User user = authService.getCurrentUser();
        List<Bid> bids = bidRepo.findByArtist(user);
        return ResponseEntity.ok( ResponseDTO.builder()
                .data(bids.stream().map(BidDTO::convertToDto))
                .success(true)
                .build());
    }

    @Transactional
    public ResponseEntity<ResponseDTO> updateBid(Long bidId, UpdateBidDTO updateBidDTO) {

        Bid bid = bidRepo.findById(bidId).orElseThrow(()->  new EntityNotFoundException("Bid not found"));

        if(updateBidDTO.getStatus().equals(BidStatus.APPROVED)){
            bid.setStatus(updateBidDTO.getStatus());
           CartItem cartItem = new CartItem();
           cartItem.setArtwork(bid.getArtWork());
           cartItem.setUser(bid.getUser());
           cartItem.setPrice(bid.getAmount());
           cartItem.setQuantity(1);

           cartRepo.save(cartItem);

           notificationService.sendBidApprovedNotification(bid.getUser(),bid.getArtWork());

        }else{
            bid.setStatus(BidStatus.REJECTED);
        }

        bidRepo.save(bid);

        return ResponseEntity.ok( ResponseDTO.builder()
                .data(bid)
                .success(true)
                .build());
    }
}
