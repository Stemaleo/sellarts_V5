package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.enums.OrderStatus;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderDTO {

    private Long id;
    private User owner;
    private BigDecimal totalAmount;
    private BigDecimal artistShare;
    private BigDecimal adminShare;
    private List<OrderItemDTO> orderItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private OrderStatus status;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String postalCode;

    public static OrderDTO from(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.owner = order.getOwner();
        dto.totalAmount = order.getTotalAmount();
        dto.artistShare = order.getArtistShare();
        dto.adminShare = order.getAdminShare();
        dto.orderItems = order.getOrderItems().stream().map(OrderItemDTO::from).toList();
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.status = order.getStatus();

        dto.phone = order.getPhone();
        dto.address = order.getAddress();
        dto.city = order.getCity();
        dto.state = order.getState();
        dto.postalCode = order.getPostalCode();

        return dto;
    }
    public static OrderDTO fromWithoutOwner(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.totalAmount = order.getTotalAmount();
        dto.artistShare = order.getArtistShare();
        dto.adminShare = order.getAdminShare();
        dto.orderItems = order.getOrderItems().stream().map(OrderItemDTO::from).toList();
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.status = order.getStatus();

        dto.phone = order.getPhone();
        dto.address = order.getAddress();
        dto.city = order.getCity();
        dto.state = order.getState();
        dto.postalCode = order.getPostalCode();

        return dto;
    }

    public static OrderDTO fromWithoutOwnerAndOrderItems(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.id = order.getId();
        dto.totalAmount = order.getTotalAmount();
        dto.artistShare = order.getArtistShare();
        dto.adminShare = order.getAdminShare();
        dto.createdAt = order.getCreatedAt();
        dto.updatedAt = order.getUpdatedAt();
        dto.status = order.getStatus();

        return dto;
    }

}
