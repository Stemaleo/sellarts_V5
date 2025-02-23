package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("orders")
public class OrderController {


    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getAllUserOrders() {

       return  orderService.getAllUserOrders();
    }

    @GetMapping("admin")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getAllOrderForAdmin(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(required = false, defaultValue = "") String orderId
    ) {
        return  orderService.getAllAdminOrders(pageable,orderId);
    }

    @GetMapping("{orderId}/admin")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getOrderForAdmin(@PathVariable Long orderId) {

        return  orderService.getAdminOrder(orderId);
    }


    @GetMapping("{orderId}")
    public ResponseEntity<ResponseDTO> getUserOrder(@PathVariable Long orderId) {

        return  orderService.getUserOrder(orderId);
    }

    @GetMapping("artists/orderItems")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getArtistOrderItems(
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false, defaultValue = "all") String range
    ) {

        return  orderService.getArtistUserOrderItems(pageable,range);
    }


    @GetMapping("artists/{artistId}/orderItems")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getAArtistOrderItems(
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.DESC) Pageable pageable,
            @PathVariable Long artistId) {

        return  orderService.getArtistUserOrderItems(artistId,pageable);
    }


}
