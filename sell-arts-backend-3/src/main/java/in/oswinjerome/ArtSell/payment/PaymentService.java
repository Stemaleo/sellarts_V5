package in.oswinjerome.ArtSell.payment;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.enums.OrderStatus;
import in.oswinjerome.ArtSell.enums.PaymentStatus;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.orders.Order;
import in.oswinjerome.ArtSell.orders.OrderRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {


    private final OrderRepo orderRepo;
    private final PaymentRepo paymentRepo;

    public PaymentService(OrderRepo orderRepo, PaymentRepo paymentRepo) {
        this.orderRepo = orderRepo;
        this.paymentRepo = paymentRepo;
    }

    public ResponseEntity<ResponseDTO> handleCallback(PaymentCallbackDTO callbackDTO) {

        Payment payment = new Payment();
        payment.setPaymentId(callbackDTO.getId_order());
        payment.setCreatedAt(LocalDateTime.now());

        if(callbackDTO.getStatus_order().equals("success")){
            Long orderId = Long.valueOf(callbackDTO.getId_transaction());
            Order order = orderRepo.findById(orderId).orElseThrow(()->new InvalidDataException("Order not found"));
            if(!order.getStatus().equals(OrderStatus.WAITING_PAYMENT)){
                throw new InvalidDataException("Payment already made.");
            }
            payment.setOrder(order);
            payment.setOrderStatus(PaymentStatus.SUCCESS);
            order.setStatus(OrderStatus.PENDING);
            order.setPaymentStatus(PaymentStatus.SUCCESS);
            orderRepo.save(order);
        }else{
            Long orderId = Long.valueOf(callbackDTO.getId_transaction());
            Order order = orderRepo.findById(orderId).orElseThrow(()->new InvalidDataException("Order not found"));
            order.setPaymentStatus(PaymentStatus.FAILED);
            payment.setOrder(order);
            payment.setOrderStatus(PaymentStatus.FAILED);
            orderRepo.save(order);
        }

        paymentRepo.save(payment);

        return ResponseEntity.ok().body(new ResponseDTO());
    }

    public ResponseEntity<ResponseDTO> getAllPayments(Pageable pageable) {


        Page<PaymentResponseDTO> payments = paymentRepo.findAll(pageable).map(PaymentResponseDTO::from);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(payments).build());
    }
}
