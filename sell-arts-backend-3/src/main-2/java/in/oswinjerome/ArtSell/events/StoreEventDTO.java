package in.oswinjerome.ArtSell.events;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StoreEventDTO {
    private String title;
    private String description;
    private String location;
    private LocalDateTime endDate;
    private int maxRegistration;
}
