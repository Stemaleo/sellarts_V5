package in.oswinjerome.ArtSell.artist;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterArtistDTO {

    @NotBlank
    private String bio;
    @NotBlank
    private String location;
    private String portfolioUrl;
}
