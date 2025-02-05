package in.oswinjerome.ArtSell;

import com.fasterxml.jackson.databind.ObjectMapper;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.LoginDTO;
import in.oswinjerome.ArtSell.dtos.RegisterDTO;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthTest {

    @Autowired
    AuthService authService;

    @Autowired
    MockMvc mockMvc;

    @Test
    public void testIfUserIsAbleToRegister(){

        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@app.com");
        registerDTO.setPassword("123456");
        registerDTO.setName("Test");

       ResponseEntity<ResponseDTO> response = authService.register(registerDTO);
        Assertions.assertEquals(201, response.getStatusCode().value());

    }

    @Test
    public void testIfDuplicateUsersAreNotAbleToRegister(){

        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test2@app.com");
        registerDTO.setPassword("123456");
        registerDTO.setName("Test");

        ResponseEntity<ResponseDTO> response = authService.register(registerDTO);
        ResponseEntity<ResponseDTO> response2 = authService.register(registerDTO);
        Assertions.assertEquals(201, response.getStatusCode().value());
        Assertions.assertEquals(422, response2.getStatusCode().value());

    }

    @Test
    public void testIfUnRegisteredUsersNotAbleToLogin() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test3@app.com");
        loginDTO.setPassword("123456");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().is4xxClientError());

    }

    @Test
    public void testIfRegisteredUsersAbleToLogin() throws Exception {

        RegisterDTO registerDTO = new RegisterDTO();
        registerDTO.setEmail("test@app.com");
        registerDTO.setPassword("123456");
        registerDTO.setName("Test");

        ResponseEntity<ResponseDTO> response = authService.register(registerDTO);
        Assertions.assertEquals(201, response.getStatusCode().value());

        ObjectMapper objectMapper = new ObjectMapper();

        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@app.com");
        loginDTO.setPassword("123456");
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().is2xxSuccessful());

    }

}
