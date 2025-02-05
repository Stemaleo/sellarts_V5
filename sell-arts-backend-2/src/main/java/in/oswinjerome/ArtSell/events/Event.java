package in.oswinjerome.ArtSell.events;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity(name = "events")
@Setter
@Getter
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String location;

    @Enumerated(EnumType.STRING)
    private EventOwnerType ownerType = EventOwnerType.GALLERY;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;

    private int maxRegistration = 0;
    private LocalDateTime endDate;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @ElementCollection()
    private List<String> mediaUrls = new ArrayList<>();

    @ElementCollection
    private List<String> mediaKeys = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Registration> registrations = new ArrayList<>();

}
