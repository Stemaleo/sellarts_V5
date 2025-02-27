package in.oswinjerome.ArtSell.user;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsersRepo extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findAllByArtistProfileNotNull();

    Page<User> findAllByRolesContaining(String role,Pageable pageable);

    Long countAllByRegisteredAtBetween(LocalDateTime start, LocalDateTime end);

//    Long countAllByRegisteredAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT (u) FROM users u WHERE u.artistProfile IS NOT NULL AND u.is_deleted = false")
    Long countAllArtists();

    @Query("SELECT COUNT (u) FROM users u WHERE u.artistProfile IS NOT NULL AND u.is_deleted = false AND (u.registeredAt BETWEEN :start AND :end)")
    Long countAllArtistsRegisteredBetween(LocalDateTime start, LocalDateTime end);

}
