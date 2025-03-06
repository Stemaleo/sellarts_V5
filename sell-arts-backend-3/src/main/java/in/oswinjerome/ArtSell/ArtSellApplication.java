package in.oswinjerome.ArtSell;

import in.oswinjerome.ArtSell.artist.ArtistProfileRepo;
import in.oswinjerome.ArtSell.artist.ArtistService;
import in.oswinjerome.ArtSell.artworks.ArtWorkRepo;
import in.oswinjerome.ArtSell.artworks.ArtWorkService;
import in.oswinjerome.ArtSell.artworks.dto.StoreArtWorkReqDTO;
import in.oswinjerome.ArtSell.auth.AuthService;
import in.oswinjerome.ArtSell.config.FileMultipartFile;
import in.oswinjerome.ArtSell.dtos.RegisterDTO;
import in.oswinjerome.ArtSell.materialTypes.MaterialType;
import in.oswinjerome.ArtSell.materialTypes.MaterialTypeRepo;
import in.oswinjerome.ArtSell.models.ArtistProfile;
import in.oswinjerome.ArtSell.models.User;
import in.oswinjerome.ArtSell.paintingTypes.PaintingType;
import in.oswinjerome.ArtSell.paintingTypes.PaintingTypeRepo;
import in.oswinjerome.ArtSell.user.UsersRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
@EnableAsync
public class ArtSellApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArtSellApplication.class, args);
	}


//	@Bean
	public CommandLineRunner importUsers(AuthService authService, UsersRepo usersRepo, ArtistProfileRepo artistProfileRepo, ArtistService artistService) {
		return args -> {

			String url = "jdbc:mysql://localhost:3306/dds";
			String username = "root";
			String password = "password";

			try (Connection connection = DriverManager.getConnection(url, username, password)) {
				System.out.println("Connected to MySQL database!");

				// Query example: Fetch data from 'users' table
				String query = "SELECT  * FROM user_details";
				try (PreparedStatement statement = connection.prepareStatement(query)) {
					ResultSet resultSet = statement.executeQuery();

					while (resultSet.next()) {
						String email = resultSet.getString("email");
						String passwordHash = resultSet.getString("password");
						String profile_type = resultSet.getString("profile_type");
						System.out.println("########### MIGRATING: "+profile_type+" ##############");

						RegisterDTO registerDTO = new RegisterDTO();
						registerDTO.setEmail(email);
						registerDTO.setPassword(passwordHash);
						registerDTO.setName(resultSet.getString("name"));
						registerDTO.setType(profile_type);

						authService.storeUser(registerDTO);

						User user = usersRepo.findByEmail(email).orElseThrow();

						if(resultSet.getString("profile_picture").startsWith("/user_profiles")) {
							try{
								File file = new File("/Users/oswinjerome/Downloads"+resultSet.getString("profile_picture"));
								new FileMultipartFile(file.toPath());
								authService.uploadAndGetUserProfile(new FileMultipartFile(file.toPath()),user);
							} catch (Exception e) {

							}
						}

						if(!resultSet.getString("profile_type").equals("client")) {
							System.out.println("Creating profile");
							ArtistProfile profile = user.getArtistProfile();
							if(profile != null) {
								profile.setLocation(resultSet.getString("location"));
								profile.setBio(resultSet.getString("bio"));
								artistProfileRepo.save(profile);
								if(resultSet.getString("cover_picture").startsWith("/user_profiles")) {
									try{
										File file = new File("/Users/oswinjerome/Downloads"+resultSet.getString("profile_picture"));
										new FileMultipartFile(file.toPath());
										artistService.uploadArtistCoverImage(new FileMultipartFile(file.toPath()),user);
									} catch (Exception e) {

									}
								}
							}
						}


						System.out.println("User: " + passwordHash + ", Email: " + email);
					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		};
	}
	String url = "jdbc:mysql://localhost:3306/dds";
	String username = "root";
	String password = "password";


//	@Bean
	public CommandLineRunner importMaterialTypes(MaterialTypeRepo materialTypeRepo) {
		return args -> {

			try (Connection connection = DriverManager.getConnection(url, username, password)) {
				System.out.println("Connected to MySQL database!");

				// Query example: Fetch data from 'users' table
				String query = "SELECT  * FROM artpiece_materials";
				try (PreparedStatement statement = connection.prepareStatement(query)) {
					ResultSet resultSet = statement.executeQuery();

					while (resultSet.next()) {
						System.out.println("########### MIGRATING: "+resultSet.getString("name")+" ##############");

						MaterialType materialType = new MaterialType();
						materialType.setName(resultSet.getString("name"));
						materialTypeRepo.save(materialType);

					}

					MaterialType materialType = new MaterialType();
					materialType.setName("Other");
					materialTypeRepo.save(materialType);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		};
	}

//	@Bean
	public CommandLineRunner importArtType(PaintingTypeRepo paintingTypeRepo) {
		return args -> {

			try (Connection connection = DriverManager.getConnection(url, username, password)) {
				System.out.println("Connected to MySQL database!");

				// Query example: Fetch data from 'users' table
				String query = "SELECT  * FROM artpiece_styles";
				try (PreparedStatement statement = connection.prepareStatement(query)) {
					ResultSet resultSet = statement.executeQuery();

					while (resultSet.next()) {
						System.out.println("########### MIGRATING: "+resultSet.getString("name")+" ##############");

						PaintingType materialType = new PaintingType();
						materialType.setName(resultSet.getString("name"));
						paintingTypeRepo.save(materialType);

					}

					PaintingType materialType = new PaintingType();
					materialType.setName("Other");
					paintingTypeRepo.save(materialType);

				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		};
	}


//	@Bean
	public CommandLineRunner importArtworks(ArtWorkRepo artworkRepo, ArtWorkService artWorkService, UsersRepo usersRepo, MaterialTypeRepo materialTypeRepo, PaintingTypeRepo paintingTypeRepo) {
		return args -> {

			try (Connection connection = DriverManager.getConnection(url, username, password)) {
				System.out.println("Connected to MySQL database!");

				// Query example: Fetch data from 'users' table
				String query = "SELECT  * FROM artworks";
				try (PreparedStatement statement = connection.prepareStatement(query)) {
					ResultSet resultSet = statement.executeQuery();

					while (resultSet.next()) {
						System.out.println("########### MIGRATING: "+resultSet.getString("title")+" ##############");
						String email = resultSet.getString("email");

						User user = usersRepo.findByEmail(email).orElseThrow();
						String dimensions = resultSet.getString("dimensions");
						String[] temp = dimensions.split("x");

						StoreArtWorkReqDTO storeArtWorkReqDTO = new StoreArtWorkReqDTO();
						storeArtWorkReqDTO.setTitle(resultSet.getString("title"));
						storeArtWorkReqDTO.setDescription(resultSet.getString("description"));
						storeArtWorkReqDTO.setHeight(Double.parseDouble(temp[0]));
						storeArtWorkReqDTO.setWidth(Double.parseDouble(temp[1]));
						storeArtWorkReqDTO.setPrice(resultSet.getDouble("price"));
						storeArtWorkReqDTO.setMaterialTypeId(materialTypeRepo.findByName(resultSet.getString("material_name")).orElseThrow().getId());
						storeArtWorkReqDTO.setPaintingTypeId(paintingTypeRepo.findByName(resultSet.getString("style_name")).orElseThrow().getId());

						storeArtWorkReqDTO.setMaterialUsed(resultSet.getString("material_name"));
						ArtistProfile artistProfile = new ArtistProfile();
						storeArtWorkReqDTO.setArtistId(artistProfile.getId());
//						File file = new File("/Users/oswinjerome/Downloads"+resultSet.getString("profile_picture"));
//						new FileMultipartFile(file.toPath());

						List<MultipartFile> materialFiles = getMediaOfArtWorks(resultSet.getString("id"));

						artWorkService.handleArtworkUpload(storeArtWorkReqDTO,materialFiles,user);



					}
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

		};
	}

	private List<MultipartFile> getMediaOfArtWorks(String id) {
		List<MultipartFile> files = new ArrayList<>();
		try (Connection connection = DriverManager.getConnection(url, username, password)) {
			System.out.println("Connected to MySQL database!");

			// Query example: Fetch data from 'users' table
			String query = "SELECT  * FROM artpiece_media WHERE artpiece_id = "+id;
			try (PreparedStatement statement = connection.prepareStatement(query)) {
				ResultSet resultSet = statement.executeQuery();

				while (resultSet.next()) {
					System.out.println("########### MIGRATING:  ##############");
						File file = new File("/Users/oswinjerome/Downloads"+resultSet.getString("file_path"));
						files.add(new FileMultipartFile(file.toPath()));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return files;
	}

}
