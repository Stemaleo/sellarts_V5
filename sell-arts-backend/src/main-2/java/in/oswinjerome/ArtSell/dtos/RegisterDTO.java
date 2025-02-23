package in.oswinjerome.ArtSell.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class RegisterDTO {

    @NotBlank
    @Length(min = 3)
    private String name;

    @Email
    private String email;

    @NotBlank
    @Length(min = 8, message = "Password should be minimum 8 character long")
    private String password;

    private MultipartFile image;

    private String type;

}
