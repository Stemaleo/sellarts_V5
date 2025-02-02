package in.oswinjerome.ArtSell.posts.like;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("likes")
public class LikeController {

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("{postId}")
    public ResponseEntity<ResponseDTO> like(@PathVariable Long postId){

        return likeService.like(postId);
    }

}
