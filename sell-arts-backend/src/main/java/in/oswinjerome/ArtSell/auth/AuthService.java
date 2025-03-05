package in.oswinjerome.ArtSell.auth;


import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.artist.ArtistType;
import in.oswinjerome.ArtSell.dtos.LoginDTO;
import in.oswinjerome.ArtSell.dtos.RegisterDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.dtos.TokenResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.services.JwtService;
import in.oswinjerome.ArtSell.services.NotificationService;
import in.oswinjerome.ArtSell.services.S3Service;
import in.oswinjerome.ArtSell.user.UpdateInfoDTO;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import jakarta.validation.Validator;
import jakarta.validation.constraints.NotNull;
import lombok.SneakyThrows;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.SecureRandom;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;


@Service
public class AuthService {

    @Autowired
    UsersRepo usersRepo;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtService jwtService;

    @Autowired
    S3Service s3Service;

    @Autowired
    private Validator validator;
    @Autowired
    private ArtistProfileRepo artistProfileRepo;
    @Autowired
    private NotificationService notificationService;

    public User getCurrentUser(){

        try{
            return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        } catch (Exception e) {
            return null;
        }
    }

    public boolean isUserLoggedIn(){
     Authentication authentication =  SecurityContextHolder.getContext().getAuthentication();

     return authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof User;
    }

    public boolean hasAnyRole(List<String> roles) {
        // Get the current authentication
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Extract granted authorities from authentication
        Set<String> grantedAuthorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        // Check if any of the roles are present in the granted authorities
        return roles.stream().anyMatch(grantedAuthorities::contains);
    }


    public ResponseEntity<ResponseDTO> register(@Valid RegisterDTO registerDTO) {
        User old = usersRepo.findByEmail(registerDTO.getEmail()).orElse(null);
        if(old != null) {
            return  new ResponseEntity<>(new ResponseDTO(null,"User already registered",false), HttpStatus.UNPROCESSABLE_ENTITY);
        }
        User user = storeUser(registerDTO);


        user.setPassword(null);

        notificationService.sendWelcomeNotification(user);

        return new ResponseEntity<>( new ResponseDTO(user,"",true), HttpStatus.CREATED);
    }

    public User storeUser(RegisterDTO registerDTO) {
        User old = usersRepo.findByEmail(registerDTO.getEmail()).orElse(null);
        if(old != null) {
            return  null;
        }
        User user = new User();
        Set<String> userRoles = new HashSet<>();
        userRoles.add("USER");

//        FIXME: Remove in prod
        if(registerDTO.getEmail().equals("admin@app.com")){
            userRoles.add("ADMIN");
        }
        user.setRoles(userRoles);
        user.setEmail(registerDTO.getEmail());
        if(registerDTO.getPassword().startsWith("$")){
            user.setPassword(registerDTO.getPassword());
        }else{
            user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        }

        user.setName(registerDTO.getName());

        user = usersRepo.save(user);

        if(registerDTO.getType().equals("artist")){
            ArtistProfile artistProfile = new ArtistProfile();
            artistProfile.setUser(user);
            artistProfile =  artistProfileRepo.save(artistProfile);
            Set<String> roles = user.getRoles();
            roles.add("ARTIST");
            user.setRoles(roles);
            user.setArtistProfile(artistProfile);
            user = usersRepo.save(user);
        }else  if(registerDTO.getType().equals("gallery")){
            ArtistProfile artistProfile = new ArtistProfile();
            artistProfile.setUser(user);
            artistProfile.setArtistType(ArtistType.GALLERY);
            artistProfile =  artistProfileRepo.save(artistProfile);
            Set<String> roles = user.getRoles();
            roles.add("GALLERY");
            user.setRoles(roles);
            user.setArtistProfile(artistProfile);
            user = usersRepo.save(user);
        }
        return user;
    }


    public ResponseEntity<ResponseDTO> login(@Valid LoginDTO loginDTO) {

        User user = usersRepo.findByEmail(loginDTO.getEmail()).orElseThrow(()->new EntityNotFoundException("User not registered in our system"));

        if(!passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())){
            throw  new InvalidDataException("Incorrect password");
        }

        String token = jwtService.generateToken(user.getUsername());

        TokenResponseDTO tokenResponseDTO = new TokenResponseDTO();
        tokenResponseDTO.setToken(token);
        tokenResponseDTO.setId(user.getId());
        user.setPassword(null);
        try{
            String url = s3Service.generatePreSignedUrl(user.getProfileImage());

            user.setProfileImageUrl(s3Service.getPublicUrlFromPreSignedUrl(url));
        } catch (Exception e) {

        }

        tokenResponseDTO.setUser(user);

        return new ResponseEntity<>(new ResponseDTO(tokenResponseDTO,"",true), HttpStatus.OK);
    }

    @SneakyThrows
    public String updateProfileImage(MultipartFile image) {
        User user = getCurrentUser();

//      Generate Key
        String url = uploadAndGetUserProfile(image, user);
        return url;
    }

    public String uploadAndGetUserProfile(MultipartFile image, User user) throws IOException {
        String url ="";
        String ext =  s3Service.getFileExtension(Objects.requireNonNull(image.getOriginalFilename()));
        String key = "USERS/"+ user.getId()+"."+ext;
        user.setProfileImage(key);

//        Upload
        s3Service.uploadFile(image, key);
        url = s3Service.generatePreSignedUrl(key);

//        Update model
        user.setProfileImageUrl(s3Service.getPublicUrlFromPreSignedUrl(url));
        usersRepo.save(user);
        return url;
    }



    public ResponseEntity<ResponseDTO> updateProfileInfo(UpdateInfoDTO updateInfo) {

        User user = getCurrentUser();
        if(updateInfo.getName() != null){
            user.setName(updateInfo.getName());
        }

        user = usersRepo.save(user);

        return ResponseEntity.ok(ResponseDTO.builder()
                        .data(user)
                        .success(true)
                .build());

    }

    public ResponseEntity<ResponseDTO> getAllUsers(String type, Pageable pageable) {

        Page<UserInfoDTO> users =null;

        if(type.equals("artist")){
           users=  usersRepo.findAllByRolesContaining("ARTIST",pageable).map(UserInfoDTO::of);
        }else if(type.equals("admin")){
            users=   usersRepo.findAllByRolesContaining("ADMIN",pageable).map(UserInfoDTO::of);

        }else if(type.equals("user")){
            users=    usersRepo.findAllByRolesContaining("USER",pageable).map(UserInfoDTO::of);

        }else{
            users=   usersRepo.findAll(pageable).map(UserInfoDTO::of);
        }

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(users).build());
    }

    public User findOrFailById(@NotNull Long artistId) {
        return usersRepo.findById(artistId).orElseThrow(()->new EntityNotFoundException("User not found"));
    }

    @Transactional
    public ResponseEntity<ResponseDTO> resetPassword(RegisterDTO registerDTO) {

        User user = usersRepo.findByEmail(registerDTO.getEmail()).orElseThrow(()->new EntityNotFoundException("User not found"));

        char[] possibleCharacters = ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~`!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?").toCharArray();
        String randomStr = RandomStringUtils.random( 10, 0, possibleCharacters.length-1, false, false, possibleCharacters, new SecureRandom() );

        user.setPassword(passwordEncoder.encode(randomStr));

        user = usersRepo.save(user);

        notificationService.sendPasswordResetNotification(user,randomStr);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data("PASSWORD_RESET").build());

    }

    public ResponseEntity<ResponseDTO> updatePassword(RegisterDTO registerDTO) {
        User user = getCurrentUser();
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
        user = usersRepo.save(user);
        return ResponseEntity.ok(ResponseDTO.builder().success(true).data("PASSWORD_RESET").build());

    }
}
