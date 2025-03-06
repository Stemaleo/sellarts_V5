package in.oswinjerome.ArtSell.blog;


import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @PostMapping
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> createBlogs(@Valid @RequestBody BlogRequestDTO blogRequestDTO) {
        return blogService.create(blogRequestDTO);
    }

    @GetMapping
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> getBlogs() {
        return blogService.getBlogs();
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseDTO> getPublishBlogs() {
        return blogService.getPublishBlogs();
    }

    @PutMapping()
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> updateBlog(@Valid @RequestBody BlogUpdateRequestDTO blogUpdateRequestDTO) {
        return blogService.updateBlog(blogUpdateRequestDTO);
    }

    @DeleteMapping("{blogId}")
    @Secured({"ROLE_ADMIN"})
    public ResponseEntity<ResponseDTO> delete(@PathVariable String blogId) {
        return blogService.deleteBlog(blogId);
    }

    @GetMapping("{blogId}")
    public ResponseEntity<ResponseDTO> getSingleBlog(@PathVariable String blogId) {
        return blogService.getSingleBlog(blogId);
    }


}
