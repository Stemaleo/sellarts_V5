package in.oswinjerome.ArtSell.artist;


import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.website.FeaturedArtistDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ArtistProfileRepo extends JpaRepository<ArtistProfile, Long> {

    @Query(value = "SELECT * FROM artist_profiles WHERE is_deleted = false ORDER BY RANDOM() LIMIT 5", nativeQuery = true)
    List<ArtistProfile> findRandomRecords();

    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(ap, COUNT(DISTINCT aw), COUNT(DISTINCT oi)) " +
            "FROM ArtistProfile ap " +
            "LEFT JOIN ap.user u " +
            "LEFT JOIN ArtWork aw ON aw.owner = u " +
            "LEFT JOIN OrderItem oi ON oi.artWork = aw " +
            "WHERE ap.artistType = :type AND (:name IS NULL OR u.name LIKE %:name%) AND ap.isDeleted = false AND u.isDeleted = false " +
            "GROUP BY ap")
    Page<ArtistProfileDTO> getAllWithStats(ArtistType type, String name, Pageable pagable);

    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(ap, COUNT(DISTINCT aw), COUNT(DISTINCT oi)) " +
            "FROM ArtistProfile ap " +
            "LEFT JOIN ap.user u " +
            "LEFT JOIN ArtWork aw ON aw.owner = u " +
            "LEFT JOIN OrderItem oi ON oi.artWork = aw " +
            "WHERE ap.id = :artistId AND ap.isDeleted = false AND u.isDeleted = false " +
            "GROUP BY ap")
    Optional<ArtistProfileDTO> getArtistWithStats(Long artistId);

    @Query("SELECT new in.oswinjerome.ArtSell.website.FeaturedArtistDTO(ap, aw) " +
            "FROM ArtistProfile ap " +
            "JOIN ArtWork aw ON aw.owner = ap.user " +
            "WHERE ap.isDeleted = false AND ap.user.isDeleted = false " +
            "GROUP BY ap, aw " +
            "ORDER BY FUNCTION('RANDOM') " +
            "LIMIT 5")
    List<FeaturedArtistDTO> findRandomArtistWithArtWorks();

    @Query("SELECT new in.oswinjerome.ArtSell.website.FeaturedArtistDTO(ap, aw) " +
            "FROM ArtistProfile ap " +
            "JOIN ArtWork aw ON aw.owner = ap.user " +
            "WHERE ap.artistType = in.oswinjerome.ArtSell.artist.ArtistType.GALLERY " +
            "AND ap.isDeleted = false AND ap.user.isDeleted = false " +
            "GROUP BY ap, aw " +
            "ORDER BY FUNCTION('RANDOM') " +
            "LIMIT 3")
    List<FeaturedArtistDTO> findRandomGalleryWithArtWorks();

}
