package in.oswinjerome.ArtSell.dtos;

import in.oswinjerome.ArtSell.models.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponseDTO {

    private Long id;
    private String token;
    private User user;

}
