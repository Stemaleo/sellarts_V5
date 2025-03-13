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
        if (user.getIs_deleted()) {
            throw new EntityNotFoundException("User has been deleted");
        }
        
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
        
        if (user.getIs_deleted()) {
            throw new EntityNotFoundException("User has been deleted");
        }
        
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

        Specification<ArtWork> spec = Specification.where((root, query, criteriaBuilder) ->
                criteriaBuilder.and(
                    criteriaBuilder.equal(root.get("is_deleted"), false),
                    criteriaBuilder.equal(root.get("owner").get("is_deleted"), false)
                )
        );

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
        ArtWork artWork = artWorkRepo.findById(artworkId).orElseThrow(() -> new EntityNotFoundException("Artwork not found"));
        
        if (artWork.getOwner().getIs_deleted()) {
            throw new EntityNotFoundException("Artwork not found: the owner has been deleted");
        }
        
        return artWork;
    }

    public ResponseEntity<ResponseDTO> getAllFeaturedArtOfArtist(Long artistId) {
        ArtistProfile artistProfile1 = artistProfileRepo.findById(artistId).orElseThrow();
        
        if (artistProfile1.getUser().getIs_deleted() || artistProfile1.getIs_deleted()) {
            throw new EntityNotFoundException("Artist not found");
        }

        List<ArtWork> artWorks = artWorkRepo.findAllByOwnerAndFeatured(artistProfile1.getUser(), true);
        List<ArtWorkDTO> artWorkDTOS = artWorks.stream().map(ArtWorkDTO::convertToDTO).toList();

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(artWorkDTOS)
                .build());
    }
    public ResponseEntity<ResponseDTO> updateFeatured(String artworkId) {
        User user = authService.getCurrentUser();
        
        if (user.getIs_deleted()) {
            throw new EntityNotFoundException("User has been deleted");
        }

        System.out.println("artworkId: " + artworkId);
        
        ArtWork artWork = findOrFailById(artworkId);
        System.out.println("artWork: " + artWork);

        // if(!Objects.equals(user.getId(), artWork.getOwner().getId())){
        //     throw new InvalidDataException("You can't update this artwork");
        // }

        // Toggle the featured status
        artWork.setFeatured(!artWork.isFeatured());
        
        try {
            // Ensure changes are persisted by explicitly setting the updated field
            // artWork.setUpdatedAt(LocalDateTime.now());
            
            // Save the artwork and flush to ensure immediate persistence
            ArtWork savedArtwork = artWorkRepo.saveAndFlush(artWork);
            
            // Refresh the entity from the database to ensure we have the latest state
            // artWorkRepo.refresh(savedArtwork);
            
            return ResponseEntity.ok(ResponseDTO.builder()
                    .success(true)
                    .data(ArtWorkDTO.convertToDTO(savedArtwork))
                    .message("Artwork featured status updated successfully")
                    .build());
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            return ResponseEntity.status(500).body(ResponseDTO.builder()
                    .success(false)
                    .message("Failed to update artwork: " + e.getMessage())
                    .build());
        }
    }

    @SneakyThrows
    @Transactional
    public ResponseEntity<ResponseDTO> update(StoreArtWorkReqDTO storeDTO, List<MultipartFile> files) {
        User user = authService.getCurrentUser();
        
        if (user.getIs_deleted()) {
            throw new EntityNotFoundException("User has been deleted");
        }
        
        ArtWork artWork = findOrFailById(storeDTO.getId());
        
        // Check if user has permission to update this artwork
        if (!authService.hasAnyRole(List.of("ROLE_ADMIN")) && !Objects.equals(user.getId(), artWork.getOwner().getId())) {
            throw new InvalidDataException("You don't have permission to update this artwork");
        }
        
        // Update artwork properties
        PaintingType paintingType = paintingTypeService.getPaintingTypeOrFail(storeDTO.getPaintingTypeId());
        MaterialType materialType = materialTypeService.getMaterialTypeOrFail(storeDTO.getMaterialTypeId());
        
        // Save old values that shouldn't be updated
        User owner = artWork.getOwner();
        User artist = artWork.getArtist();
        boolean featured = artWork.isFeatured();
        
        // Update all fields from DTO
        BeanUtils.copyProperties(storeDTO, artWork);
        
        // Restore fields that shouldn't be updated
        artWork.setOwner(owner);
        artWork.setArtist(artist);
        artWork.setFeatured(featured);
        artWork.setPaintingType(paintingType);
        artWork.setMaterialType(materialType);
        
        // Handle file uploads if provided
        if (files != null && !files.isEmpty()) {
            // Correctly handle orphaned collections by maintaining the original collection reference
            if (artWork.getMedias() != null) {
                artWork.getMedias().clear();
            } else {
                artWork.setMedias(new ArrayList<>());
            }
            
            // Upload new files
            for (MultipartFile file : files) {
                String ext = s3Service.getFileExtension(Objects.requireNonNull(file.getOriginalFilename()));
                String key = ARTWORK_BUCKET + "/" + artWork.getId() + "/" + file.hashCode() + "." + ext;
                s3Service.uploadFile(file, key);
                Media media = new Media();
                media.setArtWork(artWork);
                media.setKey(key);
                media.setContentType(file.getContentType());
                media.setContentSize(String.valueOf(file.getSize()));
                media.setPublicUrl(s3Service.getPublicUrlFromPreSignedUrl(s3Service.generatePreSignedUrl(key)));
                artWork.getMedias().add(media);
            }
            
            // Save the media items via the artwork's cascade
            mediaRepo.saveAll(artWork.getMedias());
        }
        
        artWorkRepo.save(artWork);
        
        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(ArtWorkDTO.convertToDTO(artWork))
                .message("Artwork updated successfully")
                .build());
    }

     // Ajout de la méthode pour supprimer une œuvre d'art
     @Transactional
     public boolean deleteArtWork(String artworkId) {
         ArtWork artwork = findOrFailById(artworkId);
         
         if (artwork.getOwner().getIs_deleted()) {
             throw new EntityNotFoundException("Owner has been deleted");
         }
         
         // Soft delete instead of physical delete
         artwork.setIs_deleted(true);
         artWorkRepo.save(artwork);
         return true;
     }
}
