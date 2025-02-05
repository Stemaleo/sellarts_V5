package in.oswinjerome.ArtSell.artworks.dto;

import in.oswinjerome.ArtSell.enums.PaintingTypes;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class StoreArtWorkReqDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private Long paintingTypeId;

    @NotBlank
    private Long materialTypeId;

    @NotBlank
    private String materialUsed;
    private double width;
    private double height;
    private double price;

    @NotBlank
    //private double size;

    private Long artistId;
}
