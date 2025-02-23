package in.oswinjerome.ArtSell.materialTypes;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialTypeService {

    final MaterialTypeRepo materialTypeRepo;
    private final ArtWorkRepo artWorkRepo;

    @Autowired
    public MaterialTypeService(MaterialTypeRepo paintingTypeRepo, ArtWorkRepo artWorkRepo) {
        this.materialTypeRepo = paintingTypeRepo;
        this.artWorkRepo = artWorkRepo;
    }

    public MaterialType getMaterialType(Long id) {
       return materialTypeRepo.findById(id).orElse(null);
    }

    public MaterialType getMaterialTypeOrFail(Long id) {
        return materialTypeRepo.findById(id).orElseThrow(()-> new InvalidDataException("Painting type not found"));
    }

    public MaterialType getMaterialTypeByName(String name) {
        return materialTypeRepo.findByName(name).orElse(null);
    }


    public ResponseEntity<ResponseDTO> createMaterialType(MaterialType paintingType) {

        MaterialType paintingType1 = getMaterialTypeByName(paintingType.getName());
        if (paintingType1 != null) {
            throw new InvalidDataException("Painting type already exists");
        }

        materialTypeRepo.save(paintingType);
        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(paintingType)
                .build());
    }

    public ResponseEntity<ResponseDTO> updateMaterialType(Long paintingTypeId, MaterialType paintingType) {

        MaterialType paintingType1 = getMaterialType(paintingTypeId);
        if (paintingType1 == null) {
            throw new InvalidDataException("Painting type not found");
        }

        paintingType1.setName(paintingType.getName());
        materialTypeRepo.save(paintingType1);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(paintingType1)
                .build());

    }

    public ResponseEntity<ResponseDTO> deleteMaterialType(Long paintingTypeId) {
        MaterialType paintingType1 = getMaterialType(paintingTypeId);
        if (paintingType1 == null) {
            throw new InvalidDataException("Painting type not found");
        }
        MaterialType defaultPainting = getMaterialTypeByName("Other");
        if (defaultPainting == null) {
            throw new InvalidDataException("Default (Other) Painting type not found");
        }

//        artWorkRepo.updateStatusForUsers(paintingType1,defaultPainting);
        materialTypeRepo.delete(paintingType1);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).message("Deleted").build());
    }

    public ResponseEntity<ResponseDTO> getAllMaterialTypes() {
        List<MaterialType> paintingTypes = materialTypeRepo.findAll();

        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(paintingTypes)
                .build());
    }
}
