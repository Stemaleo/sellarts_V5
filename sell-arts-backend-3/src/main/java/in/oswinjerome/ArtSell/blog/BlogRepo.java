package in.oswinjerome.ArtSell.blog;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BlogRepo extends JpaRepository<Blog, String> {

    @Query("SELECT b FROM blogs b WHERE b.isPublish = true")
    List<Blog> findByPublishIsTrue();

}
