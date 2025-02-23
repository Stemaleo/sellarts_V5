package in.oswinjerome.ArtSell.tickets;


import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TicketRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

}
