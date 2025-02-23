package in.oswinjerome.ArtSell.catalogues;

import in.oswinjerome.ArtSell.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CatalogRepo extends CrudRepository<Catalog, String> {

    List<Catalog> findByOwnerOrderByCreatedAtDesc(User owner);

}
