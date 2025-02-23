package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItem;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemDTO;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemRepo;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
public class OrderService {


    private final AuthService authService;
    private final OrderRepo orderRepo;
    private final OrderItemRepo orderItemRepo;
    private final UsersRepo usersRepo;

    public OrderService(AuthService authService, OrderRepo orderRepo, OrderItemRepo orderItemRepo, UsersRepo usersRepo) {
        this.authService = authService;
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.usersRepo = usersRepo;
    }

    public ResponseEntity<ResponseDTO> getAllUserOrders() {

        User user = authService.getCurrentUser();

        List<OrderDTO> orders = orderRepo.findAllByOwnerOrderByCreatedAtDesc(user).stream().map(OrderDTO::fromWithoutOwner).toList();

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(orders).build());
    }

    public ResponseEntity<ResponseDTO> getUserOrder(Long orderId) {
        User user = authService.getCurrentUser();
        Order order = orderRepo.findByOwnerAndId(user, orderId).orElseThrow(()-> new EntityNotFoundException("Order not found"));

//        FIXME: add separate for admin
        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(OrderDTO.from(order)).build());
    }

    public ResponseEntity<ResponseDTO> getArtistUserOrderItems(Pageable pageable,String range) {
        User user = authService.getCurrentUser();

        List<LocalDateTime> dateRange = getDateRange(range);

        Page<OrderItem> orderItemDTOS = orderItemRepo.findArtWorkByArtistUser(user,dateRange.getFirst(),dateRange.get(1),pageable);
        OrderOverview overview = orderItemRepo.getArtistStats(user,dateRange.getFirst(),dateRange.get(1));
        
        overview.setOrdersPage(orderItemDTOS.map(OrderItemDTO::withOrder));

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data( overview).build());

    }

    public List<LocalDateTime> getDateRange(String range){
        LocalDateTime from = LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime to = LocalDateTime.now();
        LocalDateTime now = LocalDateTime.now();


        if(range.equals("last_month")){
            from = now.minusMonths(1).with(TemporalAdjusters.firstDayOfMonth());
            to=   now.minusMonths(1).with(TemporalAdjusters.lastDayOfMonth());
        }

        if(range.equals("this_month")){
            from = now.with(TemporalAdjusters.firstDayOfMonth());
            to =    now;
        }

        if(range.equals("this_year")){
            from = now.with(java.time.temporal.TemporalAdjusters.firstDayOfYear());
            to =    now;
        }

        if(range.equals("last_year")){
            from = now.minusYears(1).with(java.time.temporal.TemporalAdjusters.firstDayOfYear());
            to = now.minusYears(1).with(java.time.temporal.TemporalAdjusters.lastDayOfYear());
        }

        return List.of(from,to);
    }

    public ResponseEntity<ResponseDTO> getArtistUserOrderItems(Long artistId, Pageable pageable) {

        User user = usersRepo.findById(artistId).orElseThrow(()-> new EntityNotFoundException("User not found"));

        Page<OrderItem> orderItemDTOS = orderItemRepo.findArtWorkByArtistUser(user,pageable);
        OrderOverview overview = orderItemRepo.getArtistStats(user);

        overview.setOrdersPage(orderItemDTOS.map(OrderItemDTO::withOrder));

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data( overview).build());
    }

    public ResponseEntity<ResponseDTO> getAllAdminOrders(Pageable pageable, String orderId) {
        Page<OrderDTO> orders = orderRepo.findByIdLike(orderId,pageable).map(OrderDTO::from);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(orders).build());
    }

    public ResponseEntity<ResponseDTO> getAdminOrder(Long orderId) {
        Order order = orderRepo.findById(orderId).orElseThrow(()-> new EntityNotFoundException("Order not found"));
        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(AdminOrderDTO.from(order)).build());
    }


}
