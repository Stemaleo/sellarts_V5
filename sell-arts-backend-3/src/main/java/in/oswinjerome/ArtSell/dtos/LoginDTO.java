package in.oswinjerome.ArtSell.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {

    @Email
    private String email;
    @NotBlank
    private String password;
}
