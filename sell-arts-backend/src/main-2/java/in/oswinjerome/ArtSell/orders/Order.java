package in.oswinjerome.ArtSell.orders;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.enums.OrderStatus;
import in.oswinjerome.ArtSell.enums.PaymentStatus;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItem;
import in.oswinjerome.ArtSell.payment.Payment;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {

    @Id
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private BigDecimal totalAmount;
    private BigDecimal artistShare;
    private BigDecimal adminShare;


    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Payment> payments;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.WAITING_PAYMENT;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String postalCode;




    @PrePersist
    public void generateRandomId() {
        if (id == null) {
            id = generateRandom8DigitId();
        }
    }

    private Long generateRandom8DigitId() {
        Random random = new Random();
        return 10000000 + (long) (random.nextDouble() * 90000000);
    }

}
