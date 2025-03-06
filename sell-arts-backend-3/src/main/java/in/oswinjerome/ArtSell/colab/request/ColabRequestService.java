package in.oswinjerome.ArtSell.colab.request;

import in.oswinjerome.ArtSell.artist.ArtistProfileDTO;
import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.artist.ArtistService;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.colab.Colab;
import in.oswinjerome.ArtSell.colab.ColabRepo;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ColabRequestService {
    private final AuthService authService;
    private final ColabRequestRepo colabRequestRepo;
    private final ColabRepo colabRepo;
    private final ArtistService artistService;
    private final ArtistProfileRepo artistProfileRepo;

    public ColabRequestService(AuthService authService, ColabRequestRepo colabRequestRepo, ColabRepo colabRepo, ArtistService artistService, ArtistProfileRepo artistProfileRepo) {
        this.authService = authService;
        this.colabRequestRepo = colabRequestRepo;
        this.colabRepo = colabRepo;
        this.artistService = artistService;
        this.artistProfileRepo = artistProfileRepo;
    }

    public ResponseEntity<ResponseDTO> createColabRequest(@Valid ColabRequestPayload payload) {

        User gallery = authService.getCurrentUser();
        User artist = authService.findOrFailById(payload.getArtistId());

        if(artist.getArtistProfile()==null){
            throw new InvalidDataException("Artist profile not found");
        }

       Optional<ColabRequest> old = colabRequestRepo.findByRequesterAndArtistAndStatusNotIn(gallery,artist, List.of(ColabRequestStatus.REVOKED, ColabRequestStatus.REJECTED));

        if(old.isPresent()){
            throw new InvalidDataException("Request already exists");
        }

        ColabRequest colabRequest = new ColabRequest();
        colabRequest.setArtist(artist);
        colabRequest.setRequester(gallery);

        colabRequestRepo.save(colabRequest);

        return ResponseEntity.ok(ResponseDTO.builder()
                        .data(colabRequest)
                        .success(true)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllColabRequest(boolean isGallery, Pageable pageable) {

        User user = authService.getCurrentUser();

        Page<ColabRequest> colabRequests;
        if(isGallery){
            colabRequests = colabRequestRepo.findByRequester(user, pageable);
        }else{
            colabRequests = colabRequestRepo.findByArtist(user, pageable);
        }

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true).data(colabRequests).build());
    }

    public ResponseEntity<ResponseDTO> updateColabRequest(boolean isGallery, UpdateColabPayload payload, Long requestId) {

        User user = authService.getCurrentUser();
        ColabRequest colabRequest = colabRequestRepo.findById(requestId).orElseThrow(()-> new InvalidDataException("Colab request not found"));

        if(payload.getStatus().equals(ColabRequestStatus.REVOKED)){
            if(isGallery){
                colabRequest.setStatus(ColabRequestStatus.REVOKED);
                colabRequestRepo.save(colabRequest);
                return ResponseEntity.ok(ResponseDTO.builder().data(colabRequest).success(true).build());
            }else{
                throw new InvalidDataException("You are not allowed to revoke this request");
            }
        }

        colabRequest.setStatus(payload.getStatus());

        if(payload.getStatus().equals(ColabRequestStatus.ACCEPTED)){
            Colab colab = new Colab();
            colab.setArtist(colabRequest.getArtist());
            colab.setRequester(colabRequest.getRequester());
            colabRepo.save(colab);
        }

        colabRequestRepo.save(colabRequest);
        return ResponseEntity.ok(ResponseDTO.builder().data(colabRequest).success(true).build());

    }

    public ResponseEntity<ResponseDTO> getAllColabArtists(Pageable pageable) {
        User user = authService.getCurrentUser();

        Page<Colab> colabs  = colabRepo.findByRequester(user,pageable);

        return ResponseEntity.ok(ResponseDTO.builder().data(colabs).success(true).build());

    }

    public ResponseEntity<ResponseDTO> getColabOfArtist(Long artistId) {

       ArtistProfile artist = artistProfileRepo.findById(artistId).orElseThrow();
       User user = artist.getUser();

        List<ArtistProfileDTO> colabs  = colabRepo.findAllColab(user);

        return ResponseEntity.ok(ResponseDTO.builder().data(colabs).success(true).build());
    }
}
