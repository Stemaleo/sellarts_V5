package in.oswinjerome.ArtSell.user;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.services.S3Service;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("users")
public class UserController {

    private final AuthService authService;
    private final S3Service s3Service;

    public UserController(AuthService authService, S3Service s3Service) {
        this.authService = authService;
        this.s3Service = s3Service;
    }

    @GetMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getAllUsers(
            @RequestParam(defaultValue = "all") String type,
            @PageableDefault(size = 10, page = 0, direction = Sort.Direction.DESC) Pageable pageable
    ) {

        return authService.getAllUsers(type,pageable);
    }

    @GetMapping("me")
    public ResponseEntity<ResponseDTO> getMe(){
        User user = authService.getCurrentUser();
        if(user.getProfileImage() != null) {
            user.setProfileImageUrl(s3Service.generatePreSignedUrl(user.getProfileImage()));
        }
        return ResponseEntity.ok(ResponseDTO.builder()
                        .data(user)
                        .success(true)
                .build());
    }

    @PostMapping("me/profile-image")
    public ResponseEntity<ResponseDTO> updateProfileImage(@RequestPart("image") MultipartFile image){

        String url = authService.updateProfileImage(image);

        return ResponseEntity.ok(ResponseDTO.builder().data(url).success(true).build());
    }

    @PutMapping("me")
    public ResponseEntity<ResponseDTO> updateUserInfo(@RequestBody UpdateInfoDTO updateInfo){


        return authService.updateProfileInfo(updateInfo);

    }

}
