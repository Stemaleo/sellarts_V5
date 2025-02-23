package in.oswinjerome.ArtSell.events;

import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class EventDTO {
    private Long id;

    private String title;
    private String description;
    private String location;
    private int maxRegistration = 0;
    private LocalDateTime endDate;
    private List<String> mediaUrls = new ArrayList<>();

    private boolean amIRegistered = false;
    private Long noOfRegistrations;

    private List<UserInfoDTO> participants = new ArrayList<>();

    public EventDTO(Event event, Long noOfRegistrations, boolean amIRegistered) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.location = event.getLocation();
        this.maxRegistration = event.getMaxRegistration();
        this.endDate = event.getEndDate();
        this.mediaUrls = event.getMediaUrls();
        this.amIRegistered = amIRegistered;
        this.noOfRegistrations = noOfRegistrations;
    }

    public EventDTO(Event event, List<Registration> registrations) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.description = event.getDescription();
        this.location = event.getLocation();
        this.maxRegistration = event.getMaxRegistration();
        this.endDate = event.getEndDate();
        this.mediaUrls = event.getMediaUrls();
        this.noOfRegistrations = (long) registrations.size();

        registrations.forEach(registration -> {
            participants.add(UserInfoDTO.of(registration.getUser()));
        });

    }


}
