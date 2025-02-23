package in.oswinjerome.ArtSell.orders.orderItems;

import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.orders.OrderDTO;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDTO {
    private String id;
    private int quantity;
    private BigDecimal price;
    private BigDecimal artistShare;
    private BigDecimal adminShare;
    private ArtWorkDTO artWork;
    private OrderDTO order;

    public static  OrderItemDTO from(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.id = orderItem.getId();
        dto.quantity = orderItem.getQuantity();
        dto.price = orderItem.getPrice();
        dto.artistShare = orderItem.getArtistShare();
        dto.adminShare = orderItem.getAdminShare();
        dto.artWork = ArtWorkDTO.convertToDTO(orderItem.getArtWork());
        return dto;
    }

    public static  OrderItemDTO withOrder(OrderItem orderItem) {
        OrderItemDTO dto = OrderItemDTO.from(orderItem);
        dto.order = OrderDTO.fromWithoutOwnerAndOrderItems(orderItem.getOrder());
        return dto;
    }



}
