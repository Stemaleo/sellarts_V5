package in.oswinjerome.ArtSell.blog;

import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.models.User;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
public class BlogService {

    @Autowired
    BlogRepo blogRepo;

    @Autowired
    private AuthService authService;

    public ResponseEntity<ResponseDTO> create(BlogRequestDTO blogRequestDTO) {

        Blog blog = new Blog();
        BeanUtils.copyProperties(blogRequestDTO, blog);

        blogRepo.save(blog);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(blog)
                .build());

    }

    public ResponseEntity<ResponseDTO> getBlogs() {

        List<Blog> blogs = blogRepo.findAll();

        ResponseDTO responseDTO = ResponseDTO.builder()
                .success(true)
                .message("Success")
                .data(blogs).build();

        return ResponseEntity.ok(responseDTO);
    }

    public ResponseEntity<ResponseDTO> getPublishBlogs() {

        List<Blog> blogs = blogRepo.findByPublishIsTrue();

        ResponseDTO responseDTO = ResponseDTO.builder()
                .success(true)
                .message("Success")
                .data(blogs).build();

        return ResponseEntity.ok(responseDTO);
    }




    public ResponseEntity<ResponseDTO> updateBlog(@Valid BlogUpdateRequestDTO blogUpdateRequestDTO) {

        Blog blog = blogRepo.findById(blogUpdateRequestDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Blog not found with ID: " + blogUpdateRequestDTO.getId()));

        blog.setTitle(blogUpdateRequestDTO.getTitle());
        blog.setAuthor(blogUpdateRequestDTO.getAuthor());
        blog.setContent(blogUpdateRequestDTO.getContent());
        blog.setPublish(blogUpdateRequestDTO.isPublish());


        blogRepo.save(blog);

        return ResponseEntity.ok(ResponseDTO.builder()
                .data(blog).message("").success(true).build());

    }

    public ResponseEntity<ResponseDTO> deleteBlog(String blogId)  {

        Blog blog = blogRepo.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Blog not found with ID: " + blogId));

        blogRepo.deleteById(blogId);

        return ResponseEntity.ok(ResponseDTO.builder()
                .data(null)
                .message("Blog deleted successfully")
                .success(true)
                .build());
    }
    public ResponseEntity<ResponseDTO> getSingleBlog(String blogId)  {

        Blog blog = blogRepo.findById(blogId)
                .orElseThrow(() -> new EntityNotFoundException("Blog not found with ID: " + blogId));

        return ResponseEntity.ok(ResponseDTO.builder()
                .data(blog)
                .message("Blog Found successfully")
                .success(true)
                .build());
    }


}
