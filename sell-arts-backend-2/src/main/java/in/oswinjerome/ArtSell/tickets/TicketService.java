package in.oswinjerome.ArtSell.tickets;


import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.blog.Blog;
import in.oswinjerome.ArtSell.cart.CartItem;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.services.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Objects;

@Service
public class TicketService {

    @Autowired
    private TicketRepo ticketRepo;

    @Autowired
    NotificationService notificationService;

    @Autowired
    private AuthService authService;

    public ResponseEntity<ResponseDTO> getTicket() {

        User user = authService.getCurrentUser();
        List<Ticket> tickets = ticketRepo.findAllByUser(user);
        return ResponseEntity.ok(ResponseDTO.builder()
                .data(tickets)
                .message("Tickets Get successfully")
                .success(true)
                .build());

    }
    public ResponseEntity<ResponseDTO> createTicket(TicketRequestDTO ticketRequestDTO) {
        User user = authService.getCurrentUser();
        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setTitle(ticketRequestDTO.getTitle());
        ticket.setDescription(ticketRequestDTO.getDescription());
        ticketRepo.save(ticket);
        notificationService.sendRaiseTicket(user,ticket);
        return ResponseEntity.ok(ResponseDTO.builder()
                .data(ticket)
                .message("Tickets Created successfully")
                .success(true)
                .build());

    }


    public ResponseEntity<ResponseDTO> deleteTicket(String ticketId)  {

        User user = authService.getCurrentUser();

        Ticket ticket = ticketRepo.findById(ticketId)
                .orElseThrow(() -> new EntityNotFoundException("Ticket not found with ID: " + ticketId));

        System.out.println(user.getId());
        if (Objects.equals(ticket.getUser().getId(), user.getId())) {
            ticketRepo.deleteById(ticketId);
        } else {
            throw new EntityNotFoundException("You don't have permission to delete this ticket");
        }



        return ResponseEntity.ok(ResponseDTO.builder()
                .data(null)
                .message("Blog deleted successfully")
                .success(true)
                .build());
    }


}
