package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.orders.orderItems.OrderItem;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemDTO;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;

@Data
public class OrderOverview {
    private Long count;
    private BigDecimal total;
    private BigDecimal adminShare;
    private Long totalAmount;
    private Page<OrderItemDTO> ordersPage;

    public OrderOverview(Long count, BigDecimal total, BigDecimal adminShare, Long totalAmount) {
        this.count = count;
        this.total = total;
        this.adminShare = adminShare;
        this.totalAmount = totalAmount;
    }

}
