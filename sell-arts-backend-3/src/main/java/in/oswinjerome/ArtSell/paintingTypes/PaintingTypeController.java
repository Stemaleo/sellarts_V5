package in.oswinjerome.ArtSell.paintingTypes;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("paintingTypes")
public class PaintingTypeController {
    final PaintingTypeService paintingTypeService;

    public PaintingTypeController(PaintingTypeService paintingTypeService) {
        this.paintingTypeService = paintingTypeService;
    }


    @PostMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> createPaintingType(@RequestBody PaintingType paintingType) {

        return paintingTypeService.createPaintingType(paintingType);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getAllPaintingTypes() {

        return paintingTypeService.getAllPaintingTypes();
    }

    @PutMapping("{paintingTypeId}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> updatePainting(@RequestBody PaintingType paintingType, @PathVariable Long paintingTypeId) {

        return paintingTypeService.updatePaintingType(paintingTypeId,paintingType);
    }

    @DeleteMapping("{paintingTypeId}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> deletePainting(@PathVariable Long paintingTypeId) {

        return paintingTypeService.deletePaintingType(paintingTypeId);
    }



}
