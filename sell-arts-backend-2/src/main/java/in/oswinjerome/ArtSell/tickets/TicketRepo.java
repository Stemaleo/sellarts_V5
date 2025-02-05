package in.oswinjerome.ArtSell.tickets;

import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepo extends JpaRepository<Ticket, String> {
    List<Ticket> findAllByUser(User user);
}
