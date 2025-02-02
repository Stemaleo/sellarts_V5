package in.oswinjerome.ArtSell.accounts;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TransactionRepo extends JpaRepository<Transaction, Long> {

    @Query("SELECT new in.oswinjerome.ArtSell.accounts.TransactionOverview(" +
            "CAST(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END) AS BIGDECIMAL), " +
            "CAST(SUM(CASE WHEN t.type = 'CREDIT' THEN t.amount ELSE 0 END) - SUM(CASE WHEN t.type = 'DEBIT' THEN t.amount ELSE 0 END) AS BIGDECIMAL)) " +
            "FROM Transaction t where t.user = :user")
    TransactionOverview findOverviewByUser(User user);

    Page<Transaction> findByUser(User user, Pageable pageable);
}
