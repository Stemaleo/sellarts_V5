package in.oswinjerome.ArtSell.colab.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ColabRequestPayload {

    @NotNull
    private Long artistId;

}
