package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.accounts.InitiatorType;
import in.oswinjerome.ArtSell.accounts.Transaction;
import in.oswinjerome.ArtSell.accounts.TransactionRepo;
import in.oswinjerome.ArtSell.accounts.TransactionType;
import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.cart.CartItem;
import in.oswinjerome.ArtSell.cart.CartRepo;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItem;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemRepo;
import in.oswinjerome.ArtSell.services.NotificationService;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CheckoutService {

    private final OrderRepo orderRepo;

    private final OrderItemRepo orderItemRepo;

    private final CartRepo cartRepo;
    private final AuthService authService;
    private final ArtWorkRepo artWorkRepo;
    private final NotificationService notificationService;
    private final TransactionRepo transactionRepo;


    public CheckoutService(OrderRepo orderRepo, OrderItemRepo orderItemRepo, CartRepo cartRepo, AuthService authService, ArtWorkRepo artWorkRepo, NotificationService notificationService, TransactionRepo transactionRepo) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.cartRepo = cartRepo;
        this.authService = authService;
        this.artWorkRepo = artWorkRepo;
        this.notificationService = notificationService;
        this.transactionRepo = transactionRepo;
    }


    @Transactional
    public ResponseEntity<ResponseDTO> createOrder() {
        User user = authService.getCurrentUser();

//        1. Get cart items
        List<CartItem> cartItems = cartRepo.findAllByUser(user);
        if (cartItems.isEmpty()) {
            throw new InvalidDataException("Cart is empty");
        }

//        2. Map to order items

        List<OrderItem> orderItems = new ArrayList<>();
        Order order = new Order();
        BigDecimal total = BigDecimal.ZERO;
        List<Transaction> transactions = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setQuantity(cartItem.getQuantity());
            ArtWork artWork = cartItem.getArtwork();
            BigDecimal itemTotal = cartItem.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            total = total.add(itemTotal);
            orderItem.setPrice(itemTotal);
            orderItem.setAdminShare(itemTotal.multiply(new BigDecimal("0.30")));
            orderItem.setArtistShare(itemTotal.multiply(new BigDecimal("0.70")));

            orderItem.setArtWork(artWork);
            orderItems.add(orderItem);

//                Add artist transaction
            Transaction transaction = new Transaction();
            transaction.setAmount(orderItem.getArtistShare());
            transaction.setInitiatorType(InitiatorType.ORDER);
            transaction.setUser(cartItem.getArtwork().getOwner()); //Artist ref
            transaction.setType(TransactionType.CREDIT);
            transaction.setCreatedAt(now);
            transaction.setDescription("Order: "+artWork.getTitle());
            transactions.add(transaction);


            if (artWork.getStock() < orderItem.getQuantity()) {
                throw new InvalidDataException("Artwork not in stock");
            }
//                FIXME: Update stock after payment completed
            //artWork.setStock(artWork.getStock() - orderItem.getQuantity());
            artWorkRepo.save(artWork);
        }
        order.setOwner(user);
        order.setTotalAmount(total);
        order.setAdminShare(total.multiply(new BigDecimal("0.30")));
        order.setArtistShare(total.multiply(new BigDecimal("0.70")));
        order.setOrderItems(orderItems);
        order.setCreatedAt(LocalDateTime.now());
        orderRepo.save(order);
        transactionRepo.saveAll(transactions);


        cartRepo.deleteAll(cartItems);

        // notificationService.sendOrderPlacedNotification(order);

        return ResponseEntity.ok(ResponseDTO.builder().data(order).success(true).build());
    }

    public ResponseEntity<ResponseDTO> updateOrder(Long orderId, UpdateAddressDTO addressDTO) {

        Order order = orderRepo.findById(orderId).orElseThrow();

        order.setAddress(addressDTO.getAddress());
        order.setCity(addressDTO.getCity());
        order.setState(addressDTO.getState());
        order.setPhone(addressDTO.getPhone());
        order.setPostalCode(addressDTO.getPostalCode());

        orderRepo.save(order);

        return ResponseEntity.ok(ResponseDTO.builder().data("Saved").success(true).build());
    }
}
