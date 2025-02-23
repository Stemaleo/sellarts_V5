package in.oswinjerome.ArtSell.subscribers;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("subscribe")
public class SubscribeController {


    private final SubscribeService subscribeService;

    public SubscribeController(SubscribeService subscribeService) {
        this.subscribeService = subscribeService;
    }

    @PostMapping("{artistId}")
    public ResponseEntity<ResponseDTO> subscribe(@PathVariable Long artistId) {

        return subscribeService.subscribe(artistId);
    }

}
