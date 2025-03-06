package in.oswinjerome.ArtSell.payment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.enums.PaymentStatus;
import in.oswinjerome.ArtSell.orders.Order;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {


    private Long id;
    private String paymentId;
    private PaymentStatus orderStatus;
    private Long orderId;
    private LocalDateTime createdAt;
    private Long ownerId;
    private String ownerName;
    private BigDecimal amount;


    public static PaymentResponseDTO from(Payment payment) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.id = payment.getId();
        dto.paymentId = payment.getPaymentId();
        dto.orderStatus = payment.getOrderStatus();
        dto.createdAt = payment.getCreatedAt();
        dto.orderId = payment.getOrder().getId();
        dto.ownerId = payment.getOrder().getOwner().getId();
        dto.ownerName = payment.getOrder().getOwner().getName();
        dto.amount = payment.getOrder().getTotalAmount();
        return dto;
    }

}
