package in.oswinjerome.ArtSell.tickets;


import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @GetMapping()
    public ResponseEntity<ResponseDTO> tickets() {
        return ticketService.getTicket();
    }

    @PostMapping()
    public ResponseEntity<ResponseDTO> tickets(@Valid @RequestBody TicketRequestDTO ticketRequestDTO) {
        return ticketService.createTicket(ticketRequestDTO);
    }

    @DeleteMapping("{ticketId}")
    public ResponseEntity<ResponseDTO> delete(@PathVariable String ticketId) {
        return ticketService.deleteTicket(ticketId);
    }

}
