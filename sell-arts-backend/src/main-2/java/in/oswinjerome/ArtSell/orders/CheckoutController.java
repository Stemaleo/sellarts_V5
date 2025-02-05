package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("checkout")
public class CheckoutController {

    final CheckoutService service;

    public CheckoutController(CheckoutService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> createOrder(){


        return service.createOrder();
    }

    @PutMapping("/{orderId}/address")
    public ResponseEntity<ResponseDTO> updateAddress(@PathVariable Long orderId, @Valid @RequestBody UpdateAddressDTO addressDTO){


        return service.updateOrder(orderId, addressDTO);
    }


}
