package in.oswinjerome.ArtSell.favourites;

import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Favourite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "art_work_id")
    private ArtWork artWork;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
