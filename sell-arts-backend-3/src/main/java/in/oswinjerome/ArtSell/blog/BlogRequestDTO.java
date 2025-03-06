package in.oswinjerome.ArtSell.blog;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogRequestDTO {

    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private boolean isPublish;

    @NotBlank
    private String content;

    private int duration;

}
