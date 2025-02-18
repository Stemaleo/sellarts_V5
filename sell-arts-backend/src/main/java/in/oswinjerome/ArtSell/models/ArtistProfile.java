package in.oswinjerome.ArtSell.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.artist.ArtistType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Entity(name = "artist_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtistProfile {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String bio;
    @Column(nullable = true)
    private String location;
    @Column(nullable = true)
    private String portfolioUrl;
    
    @Column(nullable = true)
    private Boolean is_deleted;

    @Column(nullable = true)
    private String coverUrl;
    private String coverKey;

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    @Enumerated(EnumType.STRING)
    private ArtistType artistType = ArtistType.ARTIST;




    public String getCoverUrl() {
        return Objects.requireNonNullElse(coverUrl, "https://placehold.co/1600x800/png?text=Cover+Image");
    }
}
