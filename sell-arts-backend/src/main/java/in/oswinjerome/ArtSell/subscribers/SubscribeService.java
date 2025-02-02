package in.oswinjerome.ArtSell.subscribers;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscribeService {
    private final AuthService authService;
    private final SubscribeRepo subscribeRepo;

    public SubscribeService(AuthService authService, SubscribeRepo subscribeRepo) {
        this.authService = authService;
        this.subscribeRepo = subscribeRepo;
    }

    public ResponseEntity<ResponseDTO> subscribe(Long artistId) {

        User artist = authService.findOrFailById(artistId);
        User user =authService.getCurrentUser();

        Subscribe subscribe = subscribeRepo.findByUserAndArtist(user,artist).orElse(null);

        if(subscribe == null) {
           Subscribe newSubscribe = new Subscribe();
            newSubscribe.setUser(user);
            newSubscribe.setArtist(artist);
            newSubscribe.setCreatedAt(LocalDateTime.now());
            subscribeRepo.save(newSubscribe);
        }else{
            subscribeRepo.delete(subscribe);
        }

        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                .build());

    }
}
