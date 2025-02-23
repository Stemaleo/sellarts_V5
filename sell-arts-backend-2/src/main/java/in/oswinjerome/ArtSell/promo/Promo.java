package in.oswinjerome.ArtSell.promo;

import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
public class Promo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String code;

    private boolean isPercentage = false;
    private boolean isActive = true;

    private double amount;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int count = 0;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
