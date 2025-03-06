package in.oswinjerome.ArtSell.orders.orderItems;

import in.oswinjerome.ArtSell.orders.OrderOverview;
import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface OrderItemRepo extends JpaRepository<OrderItem, String> {


    @Query("SELECT oi FROM OrderItem oi WHERE oi.artWork.owner = :user ORDER BY oi.order.createdAt DESC")
    Page<OrderItem> findArtWorkByArtistUser(User user, Pageable pageable);

    @Query("SELECT new in.oswinjerome.ArtSell.orders.OrderOverview(COUNT(*), SUM(oi.artistShare), SUM(oi.adminShare), CAST(SUM(oi.price * oi.quantity) AS long ) ) FROM OrderItem oi WHERE oi.artWork.owner = :user")
    OrderOverview getArtistStats(User user);

//    FIXME: Omit unfulfilled orders
    @Query("SELECT COUNT(*) FROM OrderItem  oi WHERE oi.artWork.owner = :artist")
    Long getCountByArtist(User artist);

    @Query("SELECT oi FROM OrderItem oi WHERE oi.artWork.owner = :user " +
            "AND (oi.order.createdAt BETWEEN :from AND :to) " +
            "ORDER BY oi.order.createdAt DESC")
    Page<OrderItem> findArtWorkByArtistUser(User user,
                                            @Param("from") LocalDateTime from,
                                            @Param("to") LocalDateTime to, Pageable pageable);

    @Query("SELECT new in.oswinjerome.ArtSell.orders.OrderOverview(COUNT(*), SUM(oi.artistShare), SUM(oi.adminShare), CAST(SUM(oi.price * oi.quantity) AS long ) ) FROM OrderItem oi " +
            "WHERE oi.artWork.owner = :user AND (oi.order.createdAt BETWEEN :from AND :to) ")
    OrderOverview getArtistStats(User user, @Param("from") LocalDateTime from,
                                 @Param("to") LocalDateTime to);

}
