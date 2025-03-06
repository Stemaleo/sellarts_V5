package in.oswinjerome.ArtSell.payment;

import lombok.Data;

@Data
public class PaymentCallbackDTO {

    private String id_order;
    private String status_order;
    private String id_transaction;


}
