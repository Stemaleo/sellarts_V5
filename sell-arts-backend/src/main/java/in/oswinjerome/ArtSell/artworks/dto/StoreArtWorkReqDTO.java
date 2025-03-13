package in.oswinjerome.ArtSell.artworks.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import in.oswinjerome.ArtSell.enums.PaintingTypes;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class StoreArtWorkReqDTO {

    private String id;
    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private Long paintingTypeId;

    @NotBlank
    private Long materialTypeId;
    private Boolean is_deleted = false;

    @NotBlank
    private String materialUsed;
    private double width;
    private double height;
    private double price;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("size")
    private Integer size;

    private Long artistId;
}
