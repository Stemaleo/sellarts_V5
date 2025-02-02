package in.oswinjerome.ArtSell.posts.like;

import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.posts.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface LikeRepo extends JpaRepository<Like, Long> {

    Long countByPost(Post post);

    @Query("SELECT l FROM likes l WHERE l.post = :post AND l.owner = :user")
    Optional<Like> findByPostAndUser(Post post, User user);

}

