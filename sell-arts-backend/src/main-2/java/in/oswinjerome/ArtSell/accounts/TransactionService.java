package in.oswinjerome.ArtSell.accounts;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class TransactionService {


    private final TransactionRepo transactionRepo;
    private final AuthService authService;
    private final UsersRepo usersRepo;

    public TransactionService(TransactionRepo transactionRepo, AuthService authService, UsersRepo usersRepo) {
        this.transactionRepo = transactionRepo;
        this.authService = authService;
        this.usersRepo = usersRepo;
    }

    public ResponseEntity<ResponseDTO> getAllTransactionOfUser(Pageable pageable) {

        User user = authService.getCurrentUser();

        TransactionOverview overview = transactionRepo.findOverviewByUser(user);
        overview.setTransactions(transactionRepo.findByUser(user,pageable));


        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(overview)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllTransactionOfArtist(Long artistId, Pageable pageable) {

        User user = usersRepo.findById((artistId)).orElseThrow(()-> new EntityNotFoundException("Artist not found"));

        TransactionOverview overview = transactionRepo.findOverviewByUser(user);
        overview.setTransactions(transactionRepo.findByUser(user,pageable));


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(overview)
                .build());
    }

    public ResponseEntity<ResponseDTO> payArtist(Long artistId, PayDTO payDTO) {

        User user = usersRepo.findById((artistId)).orElseThrow(()-> new EntityNotFoundException("Artist not found"));
        TransactionOverview overview = transactionRepo.findOverviewByUser(user);

        if(overview.getBalanceAmount().compareTo(payDTO.getAmount()) < 0) {
            throw new InvalidDataException("Artist don't have enough balance");
        }

        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setAmount(payDTO.getAmount());
        transaction.setDescription("Payout");
        transaction.setInitiatorType(InitiatorType.ADMIN);
        transaction.setType(TransactionType.DEBIT);
        transactionRepo.save(transaction);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(transaction)
                .build());
    }
}
