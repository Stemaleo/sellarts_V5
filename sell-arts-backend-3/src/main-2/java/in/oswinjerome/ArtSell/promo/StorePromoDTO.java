package in.oswinjerome.ArtSell.promo;

import lombok.Data;

@Data
public class StorePromoDTO {

    private String code;
    private double amount;
    private boolean isPercentage;
}
