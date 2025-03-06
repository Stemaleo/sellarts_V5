package in.oswinjerome.ArtSell.website;

import in.oswinjerome.ArtSell.artist.ArtistDetailsDTO;
import in.oswinjerome.ArtSell.artist.ArtistProfileDTO;
import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.artist.ArtistService;
import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeService {
    private final ArtWorkRepo artWorkRepo;
    private final ArtistProfileRepo artistProfileRepo;
    private final ArtistService artistService;

    public HomeService(ArtWorkRepo artWorkRepo, ArtistProfileRepo artistProfileRepo, ArtistService artistService) {
        this.artWorkRepo = artWorkRepo;
        this.artistProfileRepo = artistProfileRepo;
        this.artistService = artistService;
    }

    public ResponseEntity<ResponseDTO> getRandomArtworks() {

        List<ArtWorkDTO> artWorks =  artWorkRepo.findRandomRecords().stream().map(ArtWorkDTO::convertToDTO).toList();

        return ResponseEntity.ok(ResponseDTO.builder().data(artWorks).success(true).build());
    }

    public ResponseEntity<ResponseDTO> getRandomArtists() {
        List<FeaturedArtistDTO> artWorks = artistProfileRepo.findRandomArtistWithArtWorks()
                .stream()
                .filter(artist -> artist.getArtwork() != null)
                .toList();

        while (artWorks.size() < 5 && !artWorks.isEmpty()) {
            List<FeaturedArtistDTO> temp = artistProfileRepo.findRandomArtistWithArtWorks()
                    .stream()
                    .filter(artist -> artist.getArtwork() != null)
                    .toList();
            if(temp.isEmpty()){
                break;
            }
            artWorks.addAll(temp);
        }

        return ResponseEntity.ok(ResponseDTO.builder().data(artWorks).success(true).build());
    }

    public ResponseEntity<ResponseDTO> getRandomGallery() {
        List<FeaturedArtistDTO> artWorks = artistProfileRepo.findRandomGalleryWithArtWorks()
                .stream()
                .filter(artist -> artist.getArtwork() != null)
                .toList();

        while (artWorks.size() < 3 && !artWorks.isEmpty()) {
            List<FeaturedArtistDTO> temp = artistProfileRepo.findRandomGalleryWithArtWorks()
                    .stream()
                    .filter(artist -> artist.getArtwork() != null)
                    .toList();
            if(temp.isEmpty()){
                break;
            }
            artWorks.addAll(temp);
        }

        return ResponseEntity.ok(ResponseDTO.builder().data(artWorks).success(true).build());
    }


    public ResponseEntity<ResponseDTO> getARandomArtists() {
        List<ArtistProfileDTO> artWorks = new java.util.ArrayList<>(artistProfileRepo.findRandomRecords().stream().map(ArtistProfileDTO::fromUser).toList());

        return artistService.getArtist(artWorks.getFirst().getId());
    }
}
