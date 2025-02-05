package in.oswinjerome.ArtSell.posts.comment;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.posts.Post;
import in.oswinjerome.ArtSell.posts.PostRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("comments")
public class CommentController {


    private final PostRepo postRepo;
    private final AuthService authService;
    private final CommentRepo commentRepo;

    public CommentController(PostRepo postRepo, AuthService authService, CommentRepo commentRepo) {
        this.postRepo = postRepo;
        this.authService = authService;
        this.commentRepo = commentRepo;
    }

    @PostMapping("{postId}")
    public ResponseEntity<ResponseDTO> comment(@PathVariable Long postId, @RequestBody Comment comment) {

        Post post = postRepo.findById(postId).orElseThrow();
        comment.setPost(post);
        comment.setUser(authService.getCurrentUser());

        commentRepo.save(comment);

        return ResponseEntity.ok(ResponseDTO.builder().success(true)
                        .data(comment)
                .build());
    }

}
