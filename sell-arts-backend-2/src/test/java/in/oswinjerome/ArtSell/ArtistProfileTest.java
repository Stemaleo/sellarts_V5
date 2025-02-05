package in.oswinjerome.ArtSell;

import in.oswinjerome.ArtSell.artist.ArtistService;
import in.oswinjerome.ArtSell.artist.RegisterArtistDTO;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.RegisterDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.checkerframework.checker.units.qual.A;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.MethodArgumentNotValidException;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class ArtistProfileTest {

    @Autowired
    private MockMvc mvc;

    @Autowired
    ArtistService artistService;
    @Autowired
    private AuthService authService;


    @BeforeEach
    public void init() throws MethodArgumentNotValidException {
        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setName("Test user");
        registerDTO.setEmail("test@test.com");
        registerDTO.setPassword("password");
        authService.register(registerDTO);
    }


    @Test
    @WithUserDetails(value = "test@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    public void testIfUserIsAbleToRegister() {

        RegisterArtistDTO registerArtistDTO = new RegisterArtistDTO();


      ResponseEntity<ResponseDTO> res =  artistService.createArtistProfile(registerArtistDTO);
        Assertions.assertTrue(res.getStatusCode().is2xxSuccessful());
    }
}