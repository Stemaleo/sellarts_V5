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

    @Query("SELECT u FROM users u WHERE u.artistProfile IS NOT NULL AND u.is_deleted = false")
    List<User> findAllByArtistProfileNotNull();

    @Query("SELECT u FROM users u WHERE u.roles LIKE %:role% AND u.is_deleted = false")
    Page<User> findAllByRolesContaining(String role, Pageable pageable);

    @Query("SELECT COUNT(u) FROM users u WHERE u.is_deleted = false AND u.registeredAt BETWEEN :start AND :end")
    Long countAllByRegisteredAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT (u) FROM users u WHERE u.artistProfile IS NOT NULL AND u.is_deleted = false")
    Long countAllArtists();

    @Query("SELECT COUNT (u) FROM users u WHERE u.artistProfile IS NOT NULL AND u.is_deleted = false AND (u.registeredAt BETWEEN :start AND :end)")
    Long countAllArtistsRegisteredBetween(LocalDateTime start, LocalDateTime end);

}
