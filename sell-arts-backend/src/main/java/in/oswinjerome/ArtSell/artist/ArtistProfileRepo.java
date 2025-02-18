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

    @Query("SELECT e FROM artist_profiles e  ORDER BY random() LIMIT 5")
    List<ArtistProfile> findRandomRecords();


//    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(e) FROM artist_profiles e ")
    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(ap, COUNT(DISTINCT aw),COUNT( DISTINCT oi)) " +
            "FROM artist_profiles ap " +
            "LEFT JOIN ap.user u " +
            "LEFT JOIN art_works aw ON aw.owner = u " +
            "LEFT JOIN OrderItem  oi ON oi.artWork = aw "+
            "WHERE ap.artistType = :type AND (:name IS NULL OR u.name LIKE %:name%) AND ap.is_deleted = false AND u.is_deleted=false " +
            "GROUP BY ap")
    Page<ArtistProfileDTO> getAllWithStats(ArtistType type, String name, Pageable pagable);


    @Query("SELECT new in.oswinjerome.ArtSell.artist.ArtistProfileDTO(ap, COUNT(DISTINCT aw),COUNT( DISTINCT oi)) " +
            "FROM artist_profiles ap " +
            "LEFT JOIN ap.user u " +
            "LEFT JOIN art_works aw ON aw.owner = u " +
            "LEFT JOIN OrderItem  oi ON oi.artWork = aw "+
            "where ap.id = :artistId ap.is_deleted = false AND u.is_deleted=false "+
            "GROUP BY ap")
   Optional< ArtistProfileDTO> getArtistWithStats(Long artistId);


    @Query("SELECT new in.oswinjerome.ArtSell.website.FeaturedArtistDTO(e, a) FROM artist_profiles e " +
            "JOIN art_works a ON a.owner = e.user " +
            "GROUP BY e, a ORDER BY random() LIMIT 5")
    List<FeaturedArtistDTO> findRandomArtistWithArtWorks();

    @Query("SELECT new in.oswinjerome.ArtSell.website.FeaturedArtistDTO(e, a) FROM artist_profiles e " +
            "JOIN art_works a ON a.owner = e.user AND e.artistType = in.oswinjerome.ArtSell.artist.ArtistType.GALLERY " +
            "GROUP BY e, a ORDER BY random() LIMIT 3")
    List<FeaturedArtistDTO> findRandomGalleryWithArtWorks();

}
