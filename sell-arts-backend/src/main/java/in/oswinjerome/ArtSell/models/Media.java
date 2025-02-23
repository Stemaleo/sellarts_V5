package in.oswinjerome.ArtSell.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.validator.constraints.UUID;

@Entity(name = "medias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    @UUID
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    String id;
    
    @Column(name = "`key`") 
    private String key;
    private String contentSize;
    private String contentType;

    @Column(columnDefinition = "TEXT")
    private String publicUrl;

    @ManyToOne
    @JoinColumn(name = "art_work_id")
    @JsonIgnore
    private ArtWork artWork;

}
