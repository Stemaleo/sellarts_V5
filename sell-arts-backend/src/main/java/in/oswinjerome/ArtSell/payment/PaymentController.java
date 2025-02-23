package in.oswinjerome.ArtSell.payment;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("payments")
public class PaymentController {


    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("callback")
    public ResponseEntity<ResponseDTO> paymentCallback(@RequestBody PaymentCallbackDTO callbackDTO){

        return paymentService.handleCallback(callbackDTO);
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getAllPayments(
            @PageableDefault(page = 0, size = 10, sort = "createdAt") Pageable pageable
    ){

        return paymentService.getAllPayments(pageable);
    }


}
