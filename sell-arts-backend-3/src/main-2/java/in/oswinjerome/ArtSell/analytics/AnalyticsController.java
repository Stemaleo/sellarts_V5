package in.oswinjerome.ArtSell.analytics;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("analytics")
public class AnalyticsController {


    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("admin")
    public ResponseEntity<ResponseDTO> adminDashboard(){


        return analyticsService.adminDashboard();
    }

    @GetMapping("artist")
    public ResponseEntity<ResponseDTO> artistDashboard(){


        return analyticsService.artistDashboard();
    }


}
