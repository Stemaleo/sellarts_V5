package in.oswinjerome.ArtSell.colab.request;


import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ColabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private User artist;

    @Enumerated(EnumType.STRING)
    private ColabRequestStatus status = ColabRequestStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
