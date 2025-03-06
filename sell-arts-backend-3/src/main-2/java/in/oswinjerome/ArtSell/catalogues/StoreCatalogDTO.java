package in.oswinjerome.ArtSell.catalogues;

import in.oswinjerome.ArtSell.models.ArtWork;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class StoreCatalogDTO {

    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotEmpty
    private List<String> artWorkIds;

}
