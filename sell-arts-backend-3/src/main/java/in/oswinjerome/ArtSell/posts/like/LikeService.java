package in.oswinjerome.ArtSell.posts.like;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.posts.Post;
import in.oswinjerome.ArtSell.posts.PostRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class LikeService {
    private final PostRepo postRepo;
    private final AuthService authService;
    private final LikeRepo likeRepo;

    public LikeService(PostRepo postRepo, AuthService authService, LikeRepo likeRepo) {
        this.postRepo = postRepo;
        this.authService = authService;
        this.likeRepo = likeRepo;
    }

    public ResponseEntity<ResponseDTO> like(Long postId) {
        User user = authService.getCurrentUser();
        Post post = postRepo.findById(postId).orElseThrow();
        System.out.println("######## "+post.getId());
        Like like = likeRepo.findByPostAndUser(post,user).orElse(null);

        if(like != null) {
            likeRepo.delete(like);
        }else{
            Like like1 = new Like();
            like1.setPost(post);
            like1.setOwner(user);
            likeRepo.save(like1);
        }

        Long count = likeRepo.countByPost(post);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).data(count).build());
    }
}
