package in.oswinjerome.ArtSell.materialTypes;


import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.models.ArtWork;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MaterialType {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "materialType")
    @JsonIgnore
    private List<ArtWork> artWorks;
}
