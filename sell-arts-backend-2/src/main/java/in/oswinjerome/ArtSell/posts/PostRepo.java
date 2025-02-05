package in.oswinjerome.ArtSell.posts;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepo extends JpaRepository<Post, Long> {



    @Query("SELECT new in.oswinjerome.ArtSell.posts.PostDTO(p,COUNT(l), COUNT(ul)) FROM Post  p " +
            "LEFT JOIN likes  l ON l.post = p " +
            "LEFT JOIN likes ul ON ul.post = p AND ul.owner = :user "+
            "WHERE p.owner = :owner GROUP BY p")
    List<PostDTO> findMyPosts(User owner,User user);

    @Query("SELECT new in.oswinjerome.ArtSell.posts.PostDTO(p,COUNT(l),COUNT (ul)) FROM Post  p " +
            "LEFT JOIN likes  l ON l.post = p " +
            "LEFT JOIN likes ul ON ul.post = p AND ul.owner = :user "+
            "GROUP BY p")
    Page<PostDTO> findAllPosts(Pageable pageable,User user);

}
