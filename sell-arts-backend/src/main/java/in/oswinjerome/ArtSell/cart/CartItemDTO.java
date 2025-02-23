package in.oswinjerome.ArtSell.cart;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Data
public class CartItemDTO {

    private String id;


    private ArtWorkDTO artwork;

    private int quantity;

    private BigDecimal price;


    public static CartItemDTO convertToDTO(CartItem cartItem){

        CartItemDTO cartItemDTO = new CartItemDTO();
        cartItemDTO.setId(cartItem.getId());
        cartItemDTO.setQuantity(cartItem.getQuantity());
        cartItemDTO.setArtwork(ArtWorkDTO.convertToDTO(cartItem.getArtwork()));
        cartItemDTO.setPrice(cartItem.getPrice());
        return cartItemDTO;

    }


}
