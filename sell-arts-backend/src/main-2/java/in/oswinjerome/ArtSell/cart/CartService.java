package in.oswinjerome.ArtSell.cart;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.exceptions.UnAuthorizedActionException;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

@Service
public class CartService {

    final CartRepo cartRepo;
    private final AuthService authService;
    private final ArtWorkRepo artWorkRepo;

    public CartService(CartRepo cartRepo, AuthService authService, ArtWorkRepo artWorkRepo) {
        this.cartRepo = cartRepo;
        this.authService = authService;
        this.artWorkRepo = artWorkRepo;
    }

    public ResponseEntity<ResponseDTO> addToCart(String artId) {
        User user = authService.getCurrentUser();
        ArtWork artWork = artWorkRepo.findById(artId).orElseThrow(() -> new RuntimeException("Art not found"));

        if(!artWork.getInStock()){
            throw new InvalidDataException("Art not in stock");
        }

        CartItem old = cartRepo.findByUserAndArtwork(user,artWork).orElse(null);
        CartItem cartItem = new CartItem();
        if(old == null) {
            cartItem.setUser(user);
            cartItem.setArtwork(artWork);
            cartItem.setPrice(BigDecimal.valueOf(artWork.getPrice()));
            cartRepo.save(cartItem);

        }else{
            cartItem = old;
        }



        return ResponseEntity.ok(ResponseDTO.builder()
                        .message("Added")
                .success(true).build());

    }

    public ResponseEntity<ResponseDTO> getCartItem() {

        User user = authService.getCurrentUser();
        List<CartItem> cartItems = cartRepo.findAllByUser(user);
        List<CartItemDTO> cartItemDTOS = cartItems.stream().map(CartItemDTO::convertToDTO).toList();

        return ResponseEntity.ok(ResponseDTO.builder()
                        .data(cartItemDTOS)
                        .success(true)
                .build());
    }

    public ResponseEntity<ResponseDTO> deleteCartItem(String cartId) {
        User user = authService.getCurrentUser();
        CartItem cartItem = cartRepo.findById(cartId).orElseThrow(() -> new EntityNotFoundException("Cart Item not found"));

        if(!Objects.equals(cartItem.getUser().getId(), user.getId())) {
                throw new UnAuthorizedActionException("You do not have permission to delete this cart item");
//                throw new SecurityException("You do not have permission to delete this cart item");
        }

        cartItem.setUser(null);
        cartItem.setArtwork(null);
        cartRepo.delete(cartItem);

        return ResponseEntity.ok(
                ResponseDTO.builder()
                        .success(true)
                        .data("Deleted")
                            .build()
        );
    }
}
