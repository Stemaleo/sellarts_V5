package in.oswinjerome.ArtSell.notification;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UsersRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("notifications")
public class NotificationController {


    @Autowired
    DBNotificationService notificationService;

    @GetMapping()
    public ResponseEntity<ResponseDTO> getNotifications() {
        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(notificationService.getNotificationsByUserId())
                .build());
    }

    @PatchMapping("/read")
    public ResponseEntity<ResponseDTO> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data("Marked")
                .build());
    }


}
