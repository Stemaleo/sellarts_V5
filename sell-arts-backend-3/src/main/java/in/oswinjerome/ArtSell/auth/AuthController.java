package in.oswinjerome.ArtSell.auth;


import com.fasterxml.jackson.core.JsonProcessingException;
import in.oswinjerome.ArtSell.dtos.LoginDTO;
import in.oswinjerome.ArtSell.dtos.RegisterDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.services.S3Service;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Objects;

@RestController
@RequestMapping("auth")
public class AuthController {

    @Autowired
    S3Service s3Service;

    @Autowired
    private AuthService authService;
    @Autowired
    private Validator validator;

    @PostMapping("login")
    public ResponseEntity<ResponseDTO> login(@RequestBody @Valid LoginDTO loginDTO) {


        return  authService.login(loginDTO);
    }

    @PostMapping(value = "register")
    public ResponseEntity<ResponseDTO> register(@RequestBody @Valid RegisterDTO registerDTO
                                               ) throws JsonProcessingException {


        return  authService.register(registerDTO);
    }

    @PostMapping(value = "reset")
    public ResponseEntity<ResponseDTO> resetPassword(@RequestBody RegisterDTO registerDTO
    ) throws JsonProcessingException {

        return  authService.resetPassword(registerDTO);
    }

    @PostMapping(value = "change-password")
    public ResponseEntity<ResponseDTO> updatePassword(@RequestBody RegisterDTO registerDTO
    ) throws JsonProcessingException {

        return  authService.updatePassword(registerDTO);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("image") MultipartFile file) throws IOException {

        String key = "TEST" + "/"+file.hashCode()+"." + s3Service.getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));

        s3Service.uploadFile(file, key);
       String url =  s3Service.generatePreSignedUrl(file.getOriginalFilename());

        return ResponseEntity.ok().body(url);
    }

}
