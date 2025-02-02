package in.oswinjerome.ArtSell.promo;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromoService {


    private final PromoRepo promoRepo;
    private final AuthService authService;

    public PromoService(PromoRepo promoRepo, AuthService authService) {
        this.promoRepo = promoRepo;
        this.authService = authService;
    }

    public ResponseEntity<ResponseDTO> create(StorePromoDTO promo) {

        User user = authService.getCurrentUser();
        Promo pro = new Promo();
        pro.setCode(promo.getCode());
        pro.setPercentage(promo.isPercentage());
        pro.setAmount(promo.getAmount());
        pro.setUser(user);

        promoRepo.save(pro);

        return ResponseEntity.ok(ResponseDTO.builder().data(pro).success(true).build());
    }

    public ResponseEntity<ResponseDTO> getMine() {
        User user = authService.getCurrentUser();
        List<Promo> promos = promoRepo.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(ResponseDTO.builder().data(promos).success(true).build());
    }

    public ResponseEntity<ResponseDTO> delete(Long promoId) {

        Promo promo = promoRepo.findById(promoId).orElseThrow(()-> new EntityNotFoundException("Promo Code not found"));

        promoRepo.delete(promo);

        return ResponseEntity.ok(ResponseDTO.builder().data("deleted").success(true).build());

    }

    public ResponseEntity<ResponseDTO> updateStatus(Long promoId, String status) {

        Promo promo = promoRepo.findById(promoId).orElseThrow(()-> new EntityNotFoundException("Promo Code not found"));

        promo.setActive(status.equals("active"));
        promoRepo.save(promo);

        return ResponseEntity.ok(ResponseDTO.builder().data("updated").success(true).build());

    }
}
