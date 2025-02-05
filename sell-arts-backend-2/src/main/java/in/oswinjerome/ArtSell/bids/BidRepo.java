package in.oswinjerome.ArtSell.bids;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BidRepo extends JpaRepository<Bid, Long> {

    List<Bid> findByUser(User user);

    @Query("SELECT b FROM Bid b WHERE b.artWork.owner = :artist ORDER BY b.createdAt DESC")
    List<Bid> findByArtist(User artist);

}
