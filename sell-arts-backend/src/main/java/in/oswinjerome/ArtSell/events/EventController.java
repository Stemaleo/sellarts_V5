package in.oswinjerome.ArtSell.events;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import in.oswinjerome.ArtSell.artworks.dto.StoreArtWorkReqDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("events")
public class EventController {


    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    @Secured({"ROLE_ADMIN","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> create(@RequestPart("data") String jsonData, @RequestPart(value = "images",required = false) List<MultipartFile> files) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        StoreEventDTO payload = mapper.readValue(jsonData, StoreEventDTO.class);
        if(files==null || files.isEmpty()){
            throw new InvalidDataException("Images can't be empty");
        }


        return eventService.create(payload,files);
    }

    @GetMapping()
    public ResponseEntity<ResponseDTO> getAllEvents(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){

        return eventService.getAllEvents(pageable);
    }

    @GetMapping("owners")
    // @Secured({"ROLE_ADMIN","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getForDashboard(
            @PageableDefault(sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ){

        return eventService.getForDashboard(pageable);
    }

    @GetMapping("owners/{galleryId}/gallery")
    public ResponseEntity<ResponseDTO> getAGalleryEvents(

            @PathVariable Long galleryId){

        return eventService.getAGalleryEvents(galleryId);
    }

    @GetMapping("owners/{eventId}")
    // @Secured({"ROLE_ADMIN","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> getEventForDashboard(

            @PathVariable Long eventId){

        return eventService.getEventForDashboard(eventId);
    }



    @DeleteMapping("{eventId}")
    // @Secured({"ROLE_ADMIN","ROLE_GALLERY"})
    public ResponseEntity<ResponseDTO> delete(

            @PathVariable Long eventId){

        return eventService.delete(eventId);
    }

    @PostMapping("{eventId}/register")
    public ResponseEntity<ResponseDTO> register(

            @PathVariable Long eventId){

        return eventService.registerEvent(eventId);
    }

}
