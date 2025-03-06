package in.oswinjerome.ArtSell.user;

import in.oswinjerome.ArtSell.models.User;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
public class UserInfoDTO {

    private Long id;
    private String name;
    private String email;
    private String type;
    private String profileUrl;
    private LocalDateTime registeredAt;


    public static UserInfoDTO of(User user) {
        UserInfoDTO dto = new UserInfoDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());


        dto.setProfileUrl(user.getProfileImageUrl());
        dto.setRegisteredAt(user.getRegisteredAt());

        Set<String> roles = user.getRoles();
        if(roles.contains("ADMIN")) {
            dto.setType("ADMIN");
        }else if(roles.contains("ARTIST")) {
            dto.setType("ARTIST");        }
        else if(roles.contains("GALLERY")) {
            dto.setType("GALLERY");
        }else{
            dto.setType("USER");
        }


        return dto;
    }

}
