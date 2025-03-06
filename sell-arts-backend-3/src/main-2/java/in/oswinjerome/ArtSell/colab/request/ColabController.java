package in.oswinjerome.ArtSell.colab.request;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("colab")
public class ColabController {

    private final ColabRequestService colabRequestService;

    public ColabController(ColabRequestService colabRequestService) {
        this.colabRequestService = colabRequestService;
    }

    @PostMapping("request")
    @Secured({"ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> createColabRequest(@RequestBody @Valid ColabRequestPayload payload) {

       return colabRequestService.createColabRequest(payload);
    }

    @GetMapping("request")
    @Secured({"ROLE_GALLERY","ROLE_ARTIST"})
    public ResponseEntity<ResponseDTO> getAllColabRequest(
            HttpServletRequest request,
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        boolean isGallery = request.isUserInRole("ROLE_GALLERY");
        return colabRequestService.getAllColabRequest(isGallery,pageable);
    }


    @PutMapping("request/{requestId}")
    @Secured({"ROLE_GALLERY","ROLE_ARTIST"})
    public ResponseEntity<ResponseDTO> updateColabRequest(
            HttpServletRequest request,
            @RequestBody @Valid UpdateColabPayload payload,
            @PathVariable Long requestId) {
        boolean isGallery = request.isUserInRole("ROLE_GALLERY");
        return colabRequestService.updateColabRequest(isGallery,payload,requestId);
    }


    @GetMapping("artists")
    @Secured({"ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getAllColabArtists(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return colabRequestService.getAllColabArtists(pageable);
    }


    @GetMapping("{artistId}/colab")
    public ResponseEntity<ResponseDTO> getColabOfArtist(

            @PathVariable Long artistId) {
        return colabRequestService.getColabOfArtist(artistId);
    }



}
