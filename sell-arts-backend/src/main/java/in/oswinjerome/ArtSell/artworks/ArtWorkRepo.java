package in.oswinjerome.ArtSell.artworks;

import in.oswinjerome.ArtSell.analytics.TopSellingArtworkDTO;
import in.oswinjerome.ArtSell.enums.PaintingTypes;
import in.oswinjerome.ArtSell.favourites.FavStatsDTO;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ArtWorkRepo extends JpaRepository<ArtWork, String> {

    @EntityGraph(attributePaths = {"medias"})
    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false")
    Page<ArtWork> findAllByOwner(User owner, Pageable pageable);

    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false")
    List<ArtWork> findAllByOwner(User owner);

    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.isFeatured = :featured AND a.is_deleted = false AND a.owner.is_deleted = false")
    List<ArtWork> findAllByOwnerAndFeatured(User owner, boolean featured);

    @Query("SELECT art FROM art_works as art WHERE art.owner = :owner AND art.is_deleted = false AND art.owner.is_deleted = false AND art.title LIKE %:title% AND CONCAT('',art.paintingType.id) LIKE LOWER(CONCAT('%', :paintingType, '%'))")
    Page<ArtWork> findAllByOwner(User owner,String title,String paintingType,  Pageable pageable);

    @Query("SELECT art FROM art_works as art WHERE art.title LIKE %:title% AND CONCAT('',art.paintingType.id) LIKE LOWER(CONCAT('%', :paintingType, '%')) AND art.is_deleted = false AND art.owner.is_deleted = false")
    Page<ArtWork> findAll(String title, String paintingType , Pageable pageable);

    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false ORDER BY a.createdAt ASC")
    Page<ArtWork> findAllByOwnerOrderByCreatedAtAsc(User owner, Pageable pageable);

    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false ORDER BY a.updatedAt DESC")
    Page<ArtWork> findAllByOwnerOrderByUpdatedAtDesc(User owner, Pageable pageable);

    Page<ArtWork> findAll(Specification<ArtWork> spec, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE art_works at SET at.paintingType = :newType WHERE at.paintingType = :oldType AND at.is_deleted = false")
    int updateStatusForUsers(@Param("oldType") PaintingType oldType, @Param("newType") PaintingType newType);

    @Query("SELECT e FROM art_works e WHERE e.is_deleted = false AND e.owner.is_deleted = false AND e.paintingType.id NOT IN (252) ORDER BY random() LIMIT 5")
    List<ArtWork> findRandomRecords();

    @Query("SELECT COUNT(a) FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false")
    Long countByOwner(User owner);

    @Query("SELECT new in.oswinjerome.ArtSell.favourites.FavStatsDTO(a,COUNT (f)) FROM art_works a JOIN Favourite f ON f.artWork = a WHERE a.is_deleted = false AND a.owner.is_deleted = false GROUP BY a ORDER BY COUNT(f) DESC")
    List<FavStatsDTO> getArtWorkWithFavStats();

    @Query("SELECT COUNT(a) FROM art_works a WHERE a.is_deleted = false AND a.owner.is_deleted = false AND a.createdAt BETWEEN :start AND :end")
    Long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(a) FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false AND a.createdAt BETWEEN :createdAt AND :createdAt2")
    Long countByOwnerAndCreatedAtBetween(User owner, LocalDateTime createdAt, LocalDateTime createdAt2);

    @Query("SELECT new in.oswinjerome.ArtSell.analytics.TopSellingArtworkDTO(a,COUNT(oi)) FROM art_works a " +
           "JOIN OrderItem oi ON oi.artWork = a " +
           "WHERE a.is_deleted = false AND a.owner.is_deleted = false " + 
           "GROUP BY a ORDER BY COUNT(oi) DESC LIMIT 5")
    List<TopSellingArtworkDTO> findTopSelling();
    
    @Query("SELECT new in.oswinjerome.ArtSell.analytics.TopSellingArtworkDTO(a,COUNT(oi)) FROM art_works a " +
            "JOIN OrderItem oi ON oi.artWork = a " +
            "WHERE a.is_deleted = false AND a.owner = :user AND a.owner.is_deleted = false GROUP BY a ORDER BY COUNT(oi) DESC LIMIT 5")
    List<TopSellingArtworkDTO> findTopSelling(User user);

    @Query("SELECT a FROM art_works a WHERE a.owner = :owner AND a.is_deleted = false AND a.owner.is_deleted = false")
    List<ArtWork> findAllByOwnerAndIsDeletedFalse(User owner);

}
