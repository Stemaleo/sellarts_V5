package in.oswinjerome.ArtSell.posts;

import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.services.S3Service;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.util.List;
import java.util.Objects;

@Service
public class PostService {


    private final S3Service s3Service;
    private final PostRepo postRepo;
    private final AuthService authService;
    private final ArtistProfileRepo artistProfileRepo;

    public PostService(S3Service s3Service, PostRepo postRepo, AuthService authService, ArtistProfileRepo artistProfileRepo) {
        this.s3Service = s3Service;
        this.postRepo = postRepo;
        this.authService = authService;
        this.artistProfileRepo = artistProfileRepo;
    }

    @SneakyThrows
    public ResponseEntity<ResponseDTO> store(StorePostDTO payload, MultipartFile file) {
        User user = authService.getCurrentUser();

        Post post = new Post();
        post.setOwner(user);
        post.setContent(payload.getContent());
        postRepo.save(post);

        String ext = s3Service.getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
        String key = "POSTS" + "/" + post.getId() + "/"+file.hashCode()+"." + ext;
        PutObjectResponse response =  s3Service.uploadFile(file,key);

        post.setMediaKey(key);
        post.setMediaUrl(s3Service.getPublicUrlFromPreSignedUrl(s3Service.generatePreSignedUrl(key)));

        postRepo.save(post);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(post)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAll(Pageable pageable) {
        User user = authService.getCurrentUser();
        Page<PostDTO> posts = postRepo.findAllPosts(pageable,user);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(posts)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllOfArtist(Long artistId) {
User u = authService.getCurrentUser();

        ArtistProfile artistProfile = artistProfileRepo.findById(artistId).orElseThrow();

        User user = artistProfile.getUser();


        List<PostDTO> posts = postRepo.findMyPosts(user,u);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(posts)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllOfArtist() {
        User user = authService.getCurrentUser();

        List<PostDTO> posts = postRepo.findMyPosts(user,user);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(posts)
                .build());
    }
}
