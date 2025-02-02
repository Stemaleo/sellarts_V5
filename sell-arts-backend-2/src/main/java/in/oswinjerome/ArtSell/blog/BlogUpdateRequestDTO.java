package in.oswinjerome.ArtSell.blog;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogUpdateRequestDTO {

    @NotBlank
    private String id;
    @NotBlank
    private String title;

    private boolean isPublish;
    @NotBlank
    private String author;
    @NotBlank
    private String content;
    private int duration;

}
