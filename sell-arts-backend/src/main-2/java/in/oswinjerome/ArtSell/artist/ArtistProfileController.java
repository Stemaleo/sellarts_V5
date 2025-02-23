package in.oswinjerome.ArtSell.artist;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("artists")
public class ArtistProfileController {

    @Autowired
    ArtistService artistService;

    @GetMapping("me")
    public ResponseEntity<ResponseDTO> me() {

        return artistService.getCurrentArtist();
    }

    @GetMapping("me/overview")
    public ResponseEntity<ResponseDTO> overView() {

        return artistService.getCurrentArtistOverview();
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getAllArtists(
            @RequestParam(defaultValue = "ARTIST") String type,
            @RequestParam(defaultValue = "",name = "name") String title,
            @PageableDefault() Pageable pagable
    ) {
        System.out.println("# -------- "+ title);
        return artistService.getAllArtists(type,title,pagable);
    }


    @GetMapping("{artistId}")
    public ResponseEntity<ResponseDTO> getAArtists(@PathVariable Long artistId) {

        return artistService.getArtist(artistId);
    }



    @GetMapping("{artistId}/admin")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> getAArtistForAdmin(@PathVariable Long artistId) {

        return artistService.getArtistAdmin(artistId);
    }

    @PutMapping("{artistId}/admin/verify")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> updateArtistVerification(@PathVariable Long artistId,
                                                                @RequestParam(defaultValue = "no") String verification
                                                                ) {

        return artistService.updateArtistVerification(artistId,verification);
    }


    @PostMapping()
    public ResponseEntity<ResponseDTO> registerArtist( @RequestBody @Valid RegisterArtistDTO artist) {

        return artistService.createArtistProfile(artist);
    }


    @PutMapping()
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> updateArtistProfile( @RequestBody @Valid RegisterArtistDTO artist) {

        return artistService.updateArtistProfile(artist);
    }

    @PostMapping("me/cover-image")
    public ResponseEntity<ResponseDTO> updateProfileImage(@RequestPart("image") MultipartFile image){

        String url = artistService.updateProfileImage(image);

        return ResponseEntity.ok(ResponseDTO.builder().data(url).success(true).build());
    }

}
