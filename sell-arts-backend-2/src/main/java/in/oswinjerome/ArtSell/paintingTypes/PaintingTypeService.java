package in.oswinjerome.ArtSell.paintingTypes;

import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import in.oswinjerome.ArtSell.exceptions.InvalidDataException;
import in.oswinjerome.ArtSell.models.ArtWork;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaintingTypeService {

    final PaintingTypeRepo paintingTypeRepo;
    private final ArtWorkRepo artWorkRepo;

    @Autowired
    public PaintingTypeService(PaintingTypeRepo paintingTypeRepo, ArtWorkRepo artWorkRepo) {
        this.paintingTypeRepo = paintingTypeRepo;
        this.artWorkRepo = artWorkRepo;
    }

    public PaintingType getPaintingType(Long id) {
       return paintingTypeRepo.findById(id).orElse(null);
    }

    public PaintingType getPaintingTypeOrFail(Long id) {
        return paintingTypeRepo.findById(id).orElseThrow(()-> new InvalidDataException("Painting type not found"));
    }

    public PaintingType getPaintingTypeByName(String name) {
        return paintingTypeRepo.findByName(name).orElse(null);
    }


    public ResponseEntity<ResponseDTO> createPaintingType(PaintingType paintingType) {

        PaintingType paintingType1 = getPaintingTypeByName(paintingType.getName());
        if (paintingType1 != null) {
            throw new InvalidDataException("Painting type already exists");
        }

        paintingTypeRepo.save(paintingType);
        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(paintingType)
                .build());
    }

    public ResponseEntity<ResponseDTO> updatePaintingType(Long paintingTypeId, PaintingType paintingType) {

        PaintingType paintingType1 = getPaintingType(paintingTypeId);
        if (paintingType1 == null) {
            throw new InvalidDataException("Painting type not found");
        }

        paintingType1.setName(paintingType.getName());
        paintingTypeRepo.save(paintingType1);

        return ResponseEntity.ok(ResponseDTO.builder()
                .success(true)
                .data(paintingType1)
                .build());

    }

    public ResponseEntity<ResponseDTO> deletePaintingType(Long paintingTypeId) {
        PaintingType paintingType1 = getPaintingType(paintingTypeId);
        if (paintingType1 == null) {
            throw new InvalidDataException("Painting type not found");
        }
        PaintingType defaultPainting = getPaintingTypeByName("Other");
        if (defaultPainting == null) {
            throw new InvalidDataException("Default (Other) Painting type not found");
        }

        artWorkRepo.updateStatusForUsers(paintingType1,defaultPainting);
        paintingTypeRepo.delete(paintingType1);

        return ResponseEntity.ok(ResponseDTO.builder().success(true).message("Deleted").build());
    }

    public ResponseEntity<ResponseDTO> getAllPaintingTypes() {
        List<PaintingType> paintingTypes = paintingTypeRepo.findAll();

        return ResponseEntity.ok(ResponseDTO.builder()
                        .success(true)
                        .data(paintingTypes)
                .build());
    }
}
