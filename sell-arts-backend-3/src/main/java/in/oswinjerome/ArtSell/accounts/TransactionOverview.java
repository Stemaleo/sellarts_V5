package in.oswinjerome.ArtSell.accounts;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

@Data
public class TransactionOverview {
    private BigDecimal totalAmount;
    private BigDecimal balanceAmount;
    private Page<Transaction> transactions;

    public TransactionOverview(BigDecimal totalAmount, BigDecimal balanceAmount) {
        this.totalAmount = totalAmount;
        this.balanceAmount = balanceAmount;
    }



}
