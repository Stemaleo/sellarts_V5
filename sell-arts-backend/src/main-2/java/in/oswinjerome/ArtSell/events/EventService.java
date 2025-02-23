package in.oswinjerome.ArtSell.events;

import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.exceptions.UnAuthorizedActionException;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.Media;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.services.S3Service;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class EventService {
    private final AuthService authService;
    private final EventRepo eventRepo;
    private final S3Service s3Service;

    private final String ARTWORK_BUCKET = "EVENT";
    private final RegistrationRepo registrationRepo;
    private final ArtistProfileRepo artistProfileRepo;

    public EventService(AuthService authService, EventRepo eventRepo, S3Service s3Service, RegistrationRepo registrationRepo, ArtistProfileRepo artistProfileRepo) {
        this.authService = authService;
        this.eventRepo = eventRepo;
        this.s3Service = s3Service;
        this.registrationRepo = registrationRepo;
        this.artistProfileRepo = artistProfileRepo;
    }

    @Transactional
    public ResponseEntity<ResponseDTO> create(StoreEventDTO payload, List<MultipartFile> files) throws IOException {
        User user = authService.getCurrentUser();
        EventOwnerType ownerType = EventOwnerType.GALLERY;

        if(authService.hasAnyRole(List.of("ROLE_ADMIN"))){
            ownerType = EventOwnerType.ADMIN;
        }

        Event event = new Event();
        event.setOwnerType(ownerType);
        event.setOwner(user);
        event.setTitle(payload.getTitle());
        event.setDescription(payload.getDescription());
        event.setLocation(payload.getLocation());
        event.setEndDate(payload.getEndDate());
        event.setMaxRegistration(payload.getMaxRegistration());
        event.setMediaKeys(new ArrayList<>());
        event =  eventRepo.save(event);


        for (MultipartFile file : files) {
            String ext = s3Service.getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
            String key = ARTWORK_BUCKET + "/" + event.getId() + "/"+file.hashCode()+"." + ext;
            PutObjectResponse response =  s3Service.uploadFile(file,key);

            event.getMediaKeys().add(key);
            event.getMediaUrls().add(s3Service.getPublicUrlFromPreSignedUrl(s3Service.generatePreSignedUrl(key)));
        }
        eventRepo.save(event);


        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(event)
                .build());
    }

    public ResponseEntity<ResponseDTO> getForDashboard(Pageable pageable) {
        User user = authService.getCurrentUser();
        EventOwnerType ownerType = EventOwnerType.GALLERY;

        if(authService.hasAnyRole(List.of("ROLE_ADMIN"))){
            ownerType = EventOwnerType.ADMIN;
        }

        Page<EventDTO> events = eventRepo.findByOwner(user, pageable);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(events)
                .build());
    }

    public ResponseEntity<ResponseDTO> delete(Long eventId) {

        User user = authService.getCurrentUser();
        Event event = eventRepo.findById(eventId).orElseThrow(()->new EntityNotFoundException("Event not found"));

        if(!event.getOwner().getId().equals(user.getId())){
            throw new InvalidDataException("You do not have permission to delete this event");
        }

        eventRepo.delete(event);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data("DELETED")
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllEvents(Pageable pageable) {

        Page<EventDTO> events = eventRepo.findAllForWeb(pageable);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(events)
                .build());
    }

    public ResponseEntity<ResponseDTO> registerEvent(Long eventId) {
        User user = authService.getCurrentUser();
        Event event = eventRepo.findById(eventId).orElseThrow(()->new EntityNotFoundException("Event not found"));


        Optional<Registration> old = registrationRepo.findByUserAndEvent(user,event);
        if(old.isPresent()){
            throw new InvalidDataException("You have already registered this event");
        }

        if(event.getMaxRegistration()>0){
            int count = registrationRepo.countByEvent(event);
            if(count>=event.getMaxRegistration()){
                throw new InvalidDataException("Registration exceeded maximum number of events");
            }
        }

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);
        registrationRepo.save(registration);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(registration)
                .build());
    }

    public ResponseEntity<ResponseDTO> getEventForDashboard(Long eventId) {
        Event event = eventRepo.findById(eventId).orElseThrow(()->new EntityNotFoundException("Event not found"));

        EventDTO eventDTO = new EventDTO(event,event.getRegistrations());


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(eventDTO)
                .build());
    }

    public ResponseEntity<ResponseDTO> getAGalleryEvents(Long galleryId) {

        ArtistProfile artist = artistProfileRepo.findById(galleryId).orElseThrow();
        User user = artist.getUser();

        List<EventDTO> events = eventRepo.findByOwner(user);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(events)
                .build());
    }
}
