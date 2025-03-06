package in.oswinjerome.ArtSell.posts;

import in.oswinjerome.ArtSell.posts.comment.Comment;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class PostDTO {
    private Long id;

    private String content;
    private String mediaKey;
    private String mediaUrl;
    private Long likes;

    private UserInfoDTO owner;

    private LocalDateTime createdAt;
    private boolean liked;
    private List<Comment> comments = new ArrayList<>();


    public PostDTO(Post post, Long likes, Long userLikes) {
        this.id = post.getId();
        this.content = post.getContent();
        this.mediaKey = post.getMediaKey();
        this.mediaUrl = post.getMediaUrl();
        this.likes = likes;
        this.createdAt = post.getCreatedAt();

        this.owner = UserInfoDTO.of(post.getOwner());
        this.comments = post.getComments();
//
        if(userLikes>0){
            this.liked = true;
        }

    }


}
