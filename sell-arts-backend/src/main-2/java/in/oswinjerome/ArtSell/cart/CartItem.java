package in.oswinjerome.ArtSell.cart;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;


    @ManyToOne
    @JoinColumn(name = "art_work_id")
    private ArtWork artwork;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    private int quantity = 1;

    private BigDecimal price; //without quantity


}
