package in.oswinjerome.ArtSell.posts;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.events.StoreEventDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("posts")
public class PostController {


    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})

    public ResponseEntity<ResponseDTO> store(
            @RequestPart("data") String jsonData, @RequestPart(value = "image",required = false) MultipartFile file
    ) throws JsonProcessingException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        StorePostDTO payload = mapper.readValue(jsonData, StorePostDTO.class);
        if(file==null){
            throw new InvalidDataException("Images can't be empty");
        }

        return postService.store(payload,file);

    }


    @GetMapping
    public ResponseEntity<ResponseDTO> getAll(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){

        return postService.getAll(pageable);
    }


    @GetMapping("artist/{artistId}")
    public ResponseEntity<ResponseDTO> getAllOfArtist(

            @PathVariable Long artistId){

        return postService.getAllOfArtist(artistId);
    }

    @GetMapping("artist")
    @Secured({"ROLE_ARTIST","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getAllOfArtist(){

        return postService.getAllOfArtist();
    }

}
