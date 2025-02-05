package in.oswinjerome.ArtSell.artist;

import in.oswinjerome.ArtSell.accounts.TransactionOverview;
import in.oswinjerome.ArtSell.accounts.TransactionRepo;
import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.orders.orderItems.OrderItemRepo;
import in.oswinjerome.ArtSell.services.S3Service;
import in.oswinjerome.ArtSell.subscribers.Subscribe;
import in.oswinjerome.ArtSell.subscribers.SubscribeRepo;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.validation.Valid;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class ArtistService {

    @Autowired
    ArtistProfileRepo artistProfileRepo;
    @Autowired
    private AuthService authService;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private ArtWorkRepo artWorkRepo;
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private S3Service s3Service;

    @Autowired
    private TransactionRepo transactionRepo;
    @Autowired
    private SubscribeRepo subscribeRepo;

    public ResponseEntity<ResponseDTO> createArtistProfile(@Valid RegisterArtistDTO artist) {


       User user = authService.getCurrentUser();
       if(user.getArtistProfile()!=null) {
           throw new InvalidDataException("Artist profile already exists");
       }

        ArtistProfile artistProfile = new ArtistProfile();
        BeanUtils.copyProperties(artist, artistProfile);
        artistProfile.setUser(user);
        artistProfileRepo.save(artistProfile);
        user.setArtistProfile(artistProfile);
        Set<String> roles = user.getRoles();
        roles.add("ARTIST");
        user.setRoles(roles);
        user = usersRepo.save(user);

        return ResponseEntity.ok(ResponseDTO.builder()
                        .data(user)
                        .success(true)
                .build());
    }

    public ResponseEntity<ResponseDTO> updateArtistProfile(@Valid RegisterArtistDTO artist) {
        User user = authService.getCurrentUser();
        ArtistProfile artistProfile = user.getArtistProfile();
        if(artistProfile==null) {
            throw new InvalidDataException("Artist profile does not exist");
        }
        BeanUtils.copyProperties(artist, artistProfile);
        artistProfile.setUser(user);
        artistProfileRepo.save(artistProfile);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(artistProfile).build());
    }

    public ResponseEntity<ResponseDTO> getCurrentArtist() {
        User user = authService.getCurrentUser();
        ArtistProfile artistProfile = user.getArtistProfile();
        if(artistProfile==null) {
            throw new InvalidDataException("Artist profile does not exist");
        }
        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(ArtistProfileDTO.fromUser(artistProfile)).build());
    }

    public ResponseEntity<ResponseDTO> getAllArtists(String type, String name, Pageable pagable) {

        ArtistType artistType = ArtistType.valueOf(type);

        if(name.isEmpty()){
            name = null;
        }

        Page<ArtistProfileDTO> artistProfiles = artistProfileRepo.getAllWithStats(artistType,name,pagable);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(artistProfiles).build());
    }

    public ResponseEntity<ResponseDTO> getArtist(Long artistId) {

        User user = authService.getCurrentUser();

        ArtistProfileDTO artistProfile = artistProfileRepo.getArtistWithStats(artistId).orElseThrow();
        ArtistProfile artistProfile1 = artistProfileRepo.findById(artistId).orElseThrow();
        List<ArtWork> artWorks = artWorkRepo.findAllByOwner(artistProfile1.getUser());
        List<ArtWorkDTO> artWorksDtp = artWorks.stream().map(ArtWorkDTO::convertToDTO).toList();

        ArtistDetailsDTO artistDetailsDTO = new ArtistDetailsDTO();
        artistDetailsDTO.setNoOfArtWorks(artistProfile.getNoOfArtWorks());
        artistDetailsDTO.setNoOfOrders(artistProfile.getNoOfOrders());
        artistDetailsDTO.setUser(artistProfile1.getUser());
        artistDetailsDTO.setArtWorks(artWorksDtp);
        artistDetailsDTO.setSubscribeCount(subscribeRepo.countByArtist(artistProfile1.getUser()));
        if(user==null){
            artistDetailsDTO.setSubscribed(false);
        }else{
            Subscribe s = subscribeRepo.findByUserAndArtist(user,artistProfile1.getUser()).orElse(null);

            artistDetailsDTO.setSubscribed(s!=null);
        }


        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(artistDetailsDTO).build());
    }

    public ResponseEntity<ResponseDTO> getArtistAdmin(Long artistId) {

        User user = usersRepo.findById(artistId).orElseThrow();
        ArtistProfile artistProfile = user.getArtistProfile();
        if(artistProfile==null) {
            throw new InvalidDataException("Artist profile does not exist");
        }
        List<ArtWork> artWorks = artWorkRepo.findAllByOwner(artistProfile.getUser());
        List<ArtWorkDTO> artWorksDtp = artWorks.stream().map(ArtWorkDTO::convertToDTO).toList();

        ArtistDetailsDTO artistDetailsDTO = new ArtistDetailsDTO();

        artistDetailsDTO.setUser(artistProfile.getUser());
        artistDetailsDTO.setArtWorks(artWorksDtp);

        artistDetailsDTO.setNoOfOrders(orderItemRepo.getCountByArtist(artistProfile.getUser()));
        artistDetailsDTO.setNoOfArtWorks((long) artWorksDtp.size());


        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(artistDetailsDTO).build());
    }

    @SneakyThrows
    public String updateProfileImage(MultipartFile image) {
        User user = authService.getCurrentUser();
        String url = uploadArtistCoverImage(image, user);
        return url;
    }

    public String uploadArtistCoverImage(MultipartFile image, User user) throws IOException {
        ArtistProfile artistProfile = user.getArtistProfile();

        String url ="";
        String ext =  s3Service.getFileExtension(Objects.requireNonNull(image.getOriginalFilename()));
        String key = "COVER/"+ user.getId()+"."+ext;
        artistProfile.setCoverKey(key);

        s3Service.uploadFile(image, key);
        url = s3Service.generatePreSignedUrl(key);

        artistProfile.setCoverUrl(s3Service.getPublicUrlFromPreSignedUrl(url));
        artistProfileRepo.save(artistProfile);
        return url;
    }


    public ResponseEntity<ResponseDTO> getCurrentArtistOverview() {
        User user = authService.getCurrentUser();
        ArtistProfile artistProfile = user.getArtistProfile();
        if(artistProfile==null) {
            throw new InvalidDataException("Artist profile does not exist");
        }

        TransactionOverview transactionOverview = transactionRepo.findOverviewByUser(user);

        ProfileOverviewDTO profileOverviewDTO = new ProfileOverviewDTO();

        if(transactionOverview.getTotalAmount() !=null){
            profileOverviewDTO.setTotalRevenue(transactionOverview.getTotalAmount().longValue());
        }
        profileOverviewDTO.setNoOfOrders(orderItemRepo.getCountByArtist(user));
        profileOverviewDTO.setNoOfArtWorks(artWorkRepo.countByOwner(user));



        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(profileOverviewDTO).build());

    }

    public ResponseEntity<ResponseDTO> updateArtistVerification(Long artistId, String verification) {

        User user = usersRepo.findById(artistId).orElseThrow();

        if(verification.equals("yes")){
            user.setVerified(true);
        }else{
            user.setVerified(false);
        }

        usersRepo.save(user);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data("DONE").build());

    }
}
