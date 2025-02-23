package in.oswinjerome.ArtSell.accounts;

import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayDTO {

    @Min(1)
    private BigDecimal amount;

}
