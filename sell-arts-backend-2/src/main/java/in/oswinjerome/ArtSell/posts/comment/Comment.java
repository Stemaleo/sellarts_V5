package in.oswinjerome.ArtSell.posts.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.posts.Post;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity(name = "comments")
@Setter
@Getter
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    @CreationTimestamp
    private LocalDateTime createdAt;

}
