package in.oswinjerome.ArtSell.promo;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("promo")
public class PromoController {


    private final PromoService promoService;

    public PromoController(PromoService promoService) {
        this.promoService = promoService;
    }

    @PostMapping
    public ResponseEntity<ResponseDTO> createPromoCode(@RequestBody StorePromoDTO promo) {

        return promoService.create(promo);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getMyPromos() {

        return promoService.getMine();
    }

    @DeleteMapping("{promoId}")
    public ResponseEntity<ResponseDTO> deletePromo(@PathVariable Long promoId) {

        return promoService.delete(promoId);
    }

    @PatchMapping("{promoId}")
    public ResponseEntity<ResponseDTO> updateStatus(@PathVariable Long promoId, @RequestParam(required = true) String status) {

        return promoService.updateStatus(promoId,status);
    }

}
