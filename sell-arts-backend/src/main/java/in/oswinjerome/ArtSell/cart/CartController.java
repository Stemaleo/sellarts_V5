package in.oswinjerome.ArtSell.cart;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }


    @PostMapping
    public ResponseEntity<ResponseDTO> addToCart(@RequestBody CartDto cart) {

        return cartService.addToCart(cart.artId);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getCart() {

        return cartService.getCartItem();
    }

    @DeleteMapping("{cartId}")
    public ResponseEntity<ResponseDTO> deleteCartItem(@PathVariable String cartId) {

        return cartService.deleteCartItem(cartId);
    }

    public record CartDto(String artId){}

}
