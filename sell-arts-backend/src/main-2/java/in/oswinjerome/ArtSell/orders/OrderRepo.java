package in.oswinjerome.ArtSell.orders;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepo extends JpaRepository<Order, Long> {

    List<Order> findAllByOwnerOrderByCreatedAtDesc(User owner);
    Optional<Order> findByOwnerAndId(User owner ,Long orderId);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC ")
    Page<Order> findAllOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT o FROM Order o WHERE cast(o.id as STRING ) LIKE :id% ORDER BY o.createdAt DESC ")
    Page<Order> findByIdLike(String id,Pageable pageable);


    @Query("SELECT SUM(o.adminShare) FROM Order o")
    BigDecimal sumOfAdminShare();

    @Query("SELECT SUM(o.adminShare) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    BigDecimal sumOfAdminShareBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT SUM(o.artistShare) FROM OrderItem o WHERE o.artWork.owner = :user")
    BigDecimal sumOfArtistShare(User user);

//    FIXME: add creation ts to orderitems
    @Query("SELECT SUM(o.artistShare) FROM OrderItem o WHERE o.artWork.owner = :user AND (o.order.createdAt BETWEEN :start AND :end)")
    BigDecimal sumOfArtistShareBetween(User user,LocalDateTime start, LocalDateTime end);


    @Query("SELECT COUNT(o) FROM Order  o WHERE o.createdAt BETWEEN :start AND :end")
    Long countAllBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(o) FROM OrderItem  o WHERE o.artWork.owner = :user")
    Long countArtistOrder(User user);

    @Query("SELECT COUNT(o) FROM OrderItem  o WHERE o.artWork.owner = :user AND ( o.order.createdAt BETWEEN :start AND :end)")
    Long countAllBetween(User user,LocalDateTime start, LocalDateTime end);

    @Query("SELECT AVG (o.totalAmount) FROM Order o")
    Long averageValue();

    @Query("SELECT AVG (o.artistShare) FROM OrderItem o WHERE o.artWork.owner = :user")
    Long averageValue(User user);

    @Query("SELECT AVG (o.artistShare) FROM OrderItem o WHERE o.artWork.owner = :user AND (o.order.createdAt BETWEEN :start AND :end)")
    Long averageValueBetween(User user, LocalDateTime start, LocalDateTime end);


    @Query("SELECT AVG (o.totalAmount) FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    Long averageValueBetween(LocalDateTime start, LocalDateTime end);

}
