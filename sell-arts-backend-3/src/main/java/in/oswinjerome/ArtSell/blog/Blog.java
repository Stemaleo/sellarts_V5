package in.oswinjerome.ArtSell.blog;

import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.validator.constraints.UUID;

import java.time.LocalDateTime;

@Entity(name = "blogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    @Id
    @UUID
    @UuidGenerator(style = UuidGenerator.Style.RANDOM)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
    private int duration;
    private String author;
    private boolean isPublish = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


}
