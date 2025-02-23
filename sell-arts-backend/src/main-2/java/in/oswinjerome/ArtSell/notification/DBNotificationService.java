package in.oswinjerome.ArtSell.notification;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DBNotificationService {
    private final UsersRepo usersRepo;
    private final NotificationRepo notificationRepo;
    private final AuthService authService;

    public DBNotificationService(UsersRepo usersRepo, NotificationRepo notificationRepo, AuthService authService) {
        this.usersRepo = usersRepo;
        this.notificationRepo = notificationRepo;
        this.authService = authService;
    }

    public Notification createNotification(Long userId, String message,String description) {
        User user = usersRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setDescription(description);

        return notificationRepo.save(notification);
    }

    public List<Notification> getNotificationsByUserId() {
        User user = authService.getCurrentUser();
        return notificationRepo.findByUserIdOrderByReadStatusDesc(user.getId());
    }

    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepo.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setReadStatus(true);
        return notificationRepo.save(notification);
    }

    @Transactional
    public void markAllAsRead() {

        User user = authService.getCurrentUser();

        List<Notification> notifications = notificationRepo.findByUserIdAndReadStatusFalseOrderByTimestampDesc(user.getId());
        notifications.forEach(notification -> notification.setReadStatus(true));
        notificationRepo.saveAll(notifications); // Persist changes in the database
    }

}
