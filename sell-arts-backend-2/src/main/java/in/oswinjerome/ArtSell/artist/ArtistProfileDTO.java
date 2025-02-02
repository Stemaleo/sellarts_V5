package in.oswinjerome.ArtSell.artist;

import com.fasterxml.jackson.annotation.JsonIgnore;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.user.UserInfoDTO;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ArtistProfileDTO {

    private Long id;
    private String bio;
    private String location;
    private String portfolioUrl;
    private String coverUrl;
    private Long noOfArtWorks;
    private Long noOfOrders;

    private UserInfoDTO userInfo;

    public ArtistProfileDTO(ArtistProfile artistProfile, Long noOfArtWorks,Long noOfOrders) {
        this.id = artistProfile.getId();
        this.bio = artistProfile.getBio();
        this.location = artistProfile.getLocation();
        this.portfolioUrl = artistProfile.getPortfolioUrl();
        this.coverUrl = artistProfile.getCoverUrl();

        this.userInfo = UserInfoDTO.of(artistProfile.getUser());
        this.noOfArtWorks = noOfArtWorks;
        this.noOfOrders = noOfOrders;
    }


    public static ArtistProfileDTO fromUser(ArtistProfile artistProfile) {

        ArtistProfileDTO dto = new ArtistProfileDTO();
        dto.id = artistProfile.getId();
        dto.bio = artistProfile.getBio();
        dto.location = artistProfile.getLocation();
        dto.portfolioUrl = artistProfile.getPortfolioUrl();

        dto.coverUrl = artistProfile.getCoverUrl();


        dto.userInfo = UserInfoDTO.of(artistProfile.getUser());

        return dto;

    }

}
