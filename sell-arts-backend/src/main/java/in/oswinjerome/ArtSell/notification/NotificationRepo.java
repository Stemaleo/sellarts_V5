package in.oswinjerome.ArtSell.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {


    @Query("SELECT n FROM Notification n ORDER BY n.timestamp DESC LIMIT 5")
    List<Notification> findByUserIdAndReadStatusFalseOrderByTimestampDesc(Long userId);

    @Query("SELECT n FROM Notification n ORDER BY n.timestamp DESC LIMIT 5")
    List<Notification> findByUserIdOrderByReadStatusDesc(Long userId);

}