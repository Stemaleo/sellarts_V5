package in.oswinjerome.ArtSell.materialTypes;

import in.oswinjerome.ArtSell.dtos.ResponseDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("materialTypes")
public class MaterialTypeController {
    final MaterialTypeService MaterialTypeService;

    public MaterialTypeController(MaterialTypeService MaterialTypeService) {
        this.MaterialTypeService = MaterialTypeService;
    }


    @PostMapping
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> createPaintingType(@RequestBody MaterialType materialType) {

        return MaterialTypeService.createMaterialType(materialType);
    }

    @GetMapping
    public ResponseEntity<ResponseDTO> getAllPaintingTypes() {

        return MaterialTypeService.getAllMaterialTypes();
    }

    @PutMapping("{materialTypeId}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> updatePainting(@RequestBody MaterialType materialType, @PathVariable Long materialTypeId) {

        return MaterialTypeService.updateMaterialType(materialTypeId,materialType);
    }

    @DeleteMapping("{materialTypeId}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<ResponseDTO> deletePainting(@PathVariable Long materialTypeId) {

        return MaterialTypeService.deleteMaterialType(materialTypeId);
    }



}
