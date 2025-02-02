package in.oswinjerome.ArtSell.accounts;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("transactions")
public class TransactionController {


    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping("artists")
    @Secured({"ROLE_ARTIST","ROLE_ADMIN","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getAllTransactionsOfArtist(
         @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {

        return transactionService.getAllTransactionOfUser(pageable);
    }

    @GetMapping("artists/{artistId}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> getAllTransactionsOfArtistAdmin(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable,
            @PathVariable Long artistId) {

        return transactionService.getAllTransactionOfArtist(artistId,pageable);
    }

    @PostMapping("artists/{artistId}/pay")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> payArtist(
            @PathVariable Long artistId, @Valid @RequestBody PayDTO payDTO) {

        return transactionService.payArtist(artistId, payDTO);
    }

}
