package in.oswinjerome.ArtSell.models;


import in.oswinjerome.ArtSell.enums.PaintingTypes;
import in.oswinjerome.ArtSell.materialTypes.MaterialType;
import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.validator.constraints.UUID;

import java.time.LocalDateTime;
import java.util.List;

@Entity(name = "art_works")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArtWork {

    @Id
    @GeneratedValue
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    String id;

    private String title;
    @Column(columnDefinition = "TEXT")
    private String description;

    private double width;
    private double height;

    private double price;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private Integer stock = 1;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    @ManyToOne
    @JoinColumn(name = "artist_id", nullable = true)
    private User artist;

    @OneToMany(mappedBy = "artWork", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.LAZY)
    private List<Media> medias;

    @ManyToOne(optional = false)
    @JoinColumn(name = "painting_type_id")
    private PaintingType paintingType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "material_type_id")
    private MaterialType materialType;

    private boolean isFeatured = false;

    public boolean getInStock() {
        if(stock == null) {
            return false;
        }
        return stock > 0;
    }

}
