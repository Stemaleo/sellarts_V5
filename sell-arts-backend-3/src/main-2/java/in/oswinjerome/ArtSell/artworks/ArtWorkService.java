package in.oswinjerome.ArtSell.artworks;

import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.artworks.dto.ArtWorkDTO;
import in.oswinjerome.ArtSell.artworks.dto.StoreArtWorkReqDTO;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.favourites.Favourite;
import in.oswinjerome.ArtSell.favourites.FavouriteRepo;
import in.oswinjerome.ArtSell.materialTypes.MaterialType;
import in.oswinjerome.ArtSell.materialTypes.MaterialTypeService;
import in.oswinjerome.ArtSell.models.ArtWork;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.Media;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import in.oswinjerome.ArtSell.paintingTypes.PaintingTypeService;
import in.oswinjerome.ArtSell.services.S3Service;
import in.oswinjerome.ArtSell.user.UsersRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.SneakyThrows;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.model.PutObjectResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class ArtWorkService {

    @Autowired
    ArtWorkRepo artRepo;
    @Autowired
    private AuthService authService;
    @Autowired
    private S3Service s3Service;
    @Autowired
    private in.oswinjerome.ArtSell.repos.mediaRepo mediaRepo;

    public String ARTWORK_BUCKET = "artworks";
    @Autowired
    private ArtWorkRepo artWorkRepo;
    @Autowired
    private PaintingTypeService paintingTypeService;
    @Autowired
    private MaterialTypeService materialTypeService;
    @Autowired
    private FavouriteRepo favouriteRepo;
    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private ArtistProfileRepo artistProfileRepo;

    @SneakyThrows
    @Transactional
    public ResponseEntity<ResponseDTO> store(StoreArtWorkReqDTO storeDTO, List<MultipartFile> files) {

        User user = authService.getCurrentUser();


        ArtWork artWork = handleArtworkUpload(storeDTO, files, user);

        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(ArtWorkDTO.convertToDTO(artWork))
                        .build());
    }

    public ArtWork handleArtworkUpload(StoreArtWorkReqDTO storeDTO, List<MultipartFile> files, User user) throws IOException {
        PaintingType paintingType = paintingTypeService.getPaintingTypeOrFail(storeDTO.getPaintingTypeId());
        MaterialType materialType = materialTypeService.getMaterialTypeOrFail(storeDTO.getMaterialTypeId());

        ArtWork artWork = new ArtWork();
        BeanUtils.copyProperties(storeDTO, artWork);
        artWork.setOwner(user);

        if(authService.hasAnyRole(List.of("ROLE_GALLERY")) && storeDTO.getArtistId()!=null){
            System.out.println(storeDTO.getArtistId());
            ArtistProfile artist = artistProfileRepo.findById(storeDTO.getArtistId()).orElseThrow(()->new EntityNotFoundException("Artist not found"));
            artWork.setArtist(artist.getUser());
        }else{
            artWork.setArtist(user);
        }

        artWork.setPaintingType(paintingType);
        artWork.setMaterialType(materialType);
        artRepo.save(artWork);

        List<Media> mediaList = new ArrayList<>();
        for (MultipartFile file : files) {
            String ext = s3Service.getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
            String key = ARTWORK_BUCKET + "/" + artWork.getId() + "/"+file.hashCode()+"." + ext;
            PutObjectResponse response =  s3Service.uploadFile(file,key);
            Media media = new Media();
            media.setArtWork(artWork);
            media.setKey(key);
            media.setContentType(file.getContentType());
            media.setContentSize(String.valueOf(file.getSize()));
            media.setPublicUrl(s3Service.getPublicUrlFromPreSignedUrl(s3Service.generatePreSignedUrl(key)));
            mediaList.add(media);
        }

        mediaRepo.saveAll(mediaList);
        artWork.setMedias(mediaList);
        return artWork;
    }

    public ResponseEntity<ResponseDTO> getUsersArtWork(String title, String paintingType, Pageable pageable ) {

        User user = authService.getCurrentUser();
        Page<ArtWork> artWorks;
        if(authService.hasAnyRole(List.of("ROLE_ADMIN"))){
            artWorks =  artWorkRepo.findAll(title,paintingType,pageable);
        }else{

            artWorks = artWorkRepo.findAllByOwner(user,title,paintingType,pageable);;
        }




        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(artWorks.map(ArtWorkDTO::convertToDTO))
                .build());
    }

    public ResponseEntity<ResponseDTO> getAllArtWorks(String title, Pageable pageable, String paintingType, String materialType, int price) {


        Specification<ArtWork> spec = Specification.where(null);

        if(title!=null && !title.isEmpty()){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%"+title.toLowerCase()+"%")
            );
        }


        if (paintingType != null && !paintingType.isEmpty()) {
            String[] categories = paintingType.split(",");

            // Add the paintingType filter condition to the specification
            spec = spec.and((root, query, criteriaBuilder) ->
                    root.get("paintingType").get("name").in((Object[]) categories)
            );
        }
        if (materialType != null && !materialType.isEmpty()) {
            String[] categories = materialType.split(",");

            // Add the paintingType filter condition to the specification
            spec = spec.and((root, query, criteriaBuilder) ->
                    root.get("materialType").get("id").in((Object[]) categories)
            );
        }

        if (price == 1) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.lessThanOrEqualTo(root.get("price"), 3000)
            );
        }else if(price==2){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.between(root.get("price"), 3000,5000)
            );
        }else if(price==3){
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.greaterThanOrEqualTo(root.get("price"), 5000)
            );
        }


        Page<ArtWork> artWorks = artWorkRepo.findAll(spec,pageable);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data( artWorks.map(ArtWorkDTO::convertToDTO))
                .build());
    }

    public ResponseEntity<ResponseDTO> getArtWork(String artworkId) {

        ArtWork artWork = findOrFailById(artworkId);
        List<ArtWork> artWorks = artWorkRepo.findRandomRecords();
        ArtWorkWithRelatedDTO  artWorkWithRelatedDTO = new ArtWorkWithRelatedDTO();
        ArtWorkDTO artWorkDTO = ArtWorkDTO.convertToDTO(artWork);
        System.out.println("FAV: "+authService.isUserLoggedIn());

        if(authService.isUserLoggedIn()){
            User user = authService.getCurrentUser();
            Optional<Favourite> favourite = favouriteRepo.findByUserAndArtWork(user, artWork);
            System.out.println("FAV: "+favourite.isPresent());
           artWorkDTO.setFav(favourite.isPresent());
        }
        artWorkWithRelatedDTO.setArtwork(artWorkDTO);


        artWorkWithRelatedDTO.setRelatedArtworks(artWorks.stream().map(ArtWorkDTO::convertToDTO).toList());


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(artWorkWithRelatedDTO)
                .build());
    }


    public ArtWork findOrFailById(String artworkId) {

        return artWorkRepo.findById(artworkId).orElseThrow(()-> new EntityNotFoundException("Artwork not found"));
    }

    public ResponseEntity<ResponseDTO> getAllFeaturedArtOfArtist(Long artistId) {
        ArtistProfile artistProfile1 = artistProfileRepo.findById(artistId).orElseThrow();

        List<ArtWork> artWorks = artWorkRepo.findAllByOwnerAndFeatured(artistProfile1.getUser(),true);
        List<ArtWorkDTO> artWorkDTOS = artWorks.stream().map(ArtWorkDTO::convertToDTO).toList();

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(artWorkDTOS)
                .build());
    }

    public ResponseEntity<ResponseDTO> updateFeatured(String artworkId) {
        User user = authService.getCurrentUser();
        ArtWork artWork = findOrFailById(artworkId);

        if(!Objects.equals(user.getId(), artWork.getOwner().getId())){
            throw new InvalidDataException("You can't update this");
        }

        if(artWork.isFeatured()){
            artWork.setFeatured(false);
        }else {
            artWork.setFeatured(true);
        }

        artWorkRepo.save(artWork);


        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data("DONE")
                .build());
    }


     // Ajout de la méthode pour supprimer une œuvre d'art
     @Transactional
     public boolean deleteArtWork(String artworkId) {
         Optional<ArtWork> artwork = artWorkRepo.findById(artworkId);
 
         if (artwork.isPresent()) {
             // Supprimer les fichiers associés dans S3
             for (Media media : artwork.get().getMedias()) {
                 s3Service.deleteFile(media.getKey());  // Méthode qui supprime le fichier S3 associé
             }
 
             // Supprimer l'œuvre d'art de la base de données
             artWorkRepo.delete(artwork.get());
             return true;
         } else {
             throw new InvalidDataException("Artwork not found");
         }
     }
}
