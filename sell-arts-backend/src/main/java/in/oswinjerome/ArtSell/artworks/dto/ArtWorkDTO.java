package in.oswinjerome.ArtSell.artworks.dto;

import in.oswinjerome.ArtSell.materialTypes.MaterialType;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.Media;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class ArtWorkDTO {
    private String id;
    private String title;
    private String description;
    private PaintingType paintingType;
    private MaterialType materialType;
    private double width;
    private double height;
    private double price;
    private Integer size; // Ajout du champ manquant
    private String ownerName; // to display owner's name instead of full User details

    private List<String> mediaUrls;
    private Integer stock;
    private boolean isInStock;
    private LocalDateTime createdAt;
    private boolean isFav = false;
    private ArtistProfile artistProfile;
    private ArtistProfile credits;
    private String artistName;

    private boolean isFeatured;
    private Boolean is_deleted;

    public ArtWorkDTO(ArtWork artWork) {
        List<String> mediaUrl = artWork.getMedias()
                .stream()
                .map(Media::getPublicUrl) // assuming Media has a getS3Url() method
                .collect(Collectors.toList());

        User artistProfile = artWork.getArtist();
        if(artistProfile == null) {
            artistProfile = artWork.getOwner();
        }

       id = artWork.getId();
       title = artWork.getTitle();
       description = artWork.getDescription();
       paintingType = artWork.getPaintingType();
       materialType = artWork.getMaterialType();
       width = artWork.getWidth();
       height = artWork.getHeight();
       price = artWork.getPrice();
       ownerName = artWork.getOwner().getName();
       mediaUrls = mediaUrl;
       stock = artWork.getStock();
       isInStock = artWork.getInStock();
       createdAt = artWork.getCreatedAt();
       credits = artistProfile.getArtistProfile();
       artistName = artistProfile.getName();
        isFeatured = artWork.isFeatured();
        is_deleted = artWork.getIs_deleted();
    }

    public static ArtWorkDTO convertToDTO(ArtWork artWork) {
        List<String> mediaUrls = artWork.getMedias()
                .stream()
                .map(Media::getPublicUrl) // assuming Media has a getS3Url() method
                .collect(Collectors.toList());

        User artist = artWork.getArtist();

        if(artist==null){
            artist = artWork.getOwner();
        }

        return new ArtWorkDTO(
                artWork.getId(),
                artWork.getTitle(),
                artWork.getDescription(),
                artWork.getPaintingType(),
                artWork.getMaterialType(),
                artWork.getWidth(),
                artWork.getHeight(),
                artWork.getPrice(),
                artWork.getSize(),
                artWork.getOwner().getName(),
                mediaUrls,
                artWork.getStock(),
                artWork.getInStock(),
                artWork.getUpdatedAt(),
                false,
                artWork.getOwner().getArtistProfile(),
                artist.getArtistProfile(),
                artist.getName(),
                artWork.isFeatured(),
                artWork.getIs_deleted()

        );
    }

    public ArtWorkDTO(String id, String title, String description, PaintingType paintingType,
                     MaterialType materialType, double width, double height, double price,
                     Integer size, String ownerName, List<String> mediaUrls, Integer stock,
                     boolean isInStock, LocalDateTime createdAt, boolean isFav,
                     ArtistProfile artistProfile, ArtistProfile credits, String artistName,
                     boolean isFeatured, Boolean is_deleted) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.paintingType = paintingType;
        this.materialType = materialType;
        this.width = width;
        this.height = height;
        this.price = price;
        this.size = size;
        this.ownerName = ownerName;
        this.mediaUrls = mediaUrls;
        this.stock = stock;
        this.isInStock = isInStock;
        this.createdAt = createdAt;
        this.isFav = isFav;
        this.artistProfile = artistProfile;
        this.credits = credits;
        this.artistName = artistName;
        this.isFeatured = isFeatured;
        this.is_deleted = is_deleted;
    }

}
