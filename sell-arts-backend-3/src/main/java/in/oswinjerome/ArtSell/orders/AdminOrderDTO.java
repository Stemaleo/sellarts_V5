package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.enums.OrderStatus;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemDTO;
import in.oswinjerome.ArtSell.payment.Payment;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdminOrderDTO {

    private Long id;
    private User owner;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> orderItems;
    private List<Payment> payments;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrderStatus status;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String postalCode;


    public static AdminOrderDTO from(Order order) {
        AdminOrderDTO dto = new AdminOrderDTO();
        dto.id = order.getId();
        dto.owner = order.getOwner();
        dto.totalAmount = order.getTotalAmount();
        dto.orderItems = order.getOrderItems().stream().map(OrderItemDTO::from).toList();
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.status = order.getStatus();

        dto.phone = order.getPhone();
        dto.address = order.getAddress();
        dto.city = order.getCity();
        dto.state = order.getState();
        dto.postalCode = order.getPostalCode();
        dto.payments = order.getPayments();

        return dto;
    }

}
