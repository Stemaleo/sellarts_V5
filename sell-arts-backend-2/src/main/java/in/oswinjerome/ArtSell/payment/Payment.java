package in.oswinjerome.ArtSell.payment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.enums.PaymentStatus;
import in.oswinjerome.ArtSell.orders.Order;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paymentId;

    @Enumerated(EnumType.STRING)
    private PaymentStatus orderStatus;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = true)
    @JsonIgnore
    private Order order;

    @Column(nullable = true)
    private LocalDateTime createdAt;

}
