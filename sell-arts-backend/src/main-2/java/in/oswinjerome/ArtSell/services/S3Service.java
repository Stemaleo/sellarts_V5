package in.oswinjerome.ArtSell.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.*;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class S3Service {
    private final S3Client s3Client;
    private final String bucketName;
    private final String cdnEndPoint;

    @Autowired
    private S3Presigner preSigner;

    public S3Service(@Value("${cloud.aws.s3.endpoint}") String endpoint,
                     @Value("${cloud.aws.credentials.access-key}") String accessKey,
                     @Value("${cloud.aws.credentials.secret-key}") String secretKey,
                     @Value("${cloud.aws.s3.bucket.name}") String bucketName, @Value("${cloud.aws.s3.cdnurl}") String cdnEndPoint) {
        this.cdnEndPoint = cdnEndPoint;

        AwsBasicCredentials awsCredentials =  AwsBasicCredentials.create(accessKey, secretKey);

        this.s3Client = S3Client.builder()
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .endpointOverride(URI.create(endpoint))
                .region(Region.US_EAST_1)

                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .serviceConfiguration(
                        S3Configuration.builder()
                                .pathStyleAccessEnabled(true) // Enable path-style access
                                .build()
                )
                .build();

        this.bucketName = bucketName;

        try{
            s3Client.headBucket(HeadBucketRequest.builder().bucket(bucketName).build());
        }catch (Exception e){
            s3Client.createBucket(CreateBucketRequest.builder().bucket(bucketName).build());
        }

    }

    public PutObjectResponse uploadFile(MultipartFile file, String key) throws IOException {
        InputStream inputStream = file.getInputStream();
        Map<String, String> metadata = new HashMap<>();
        metadata.put("Content-Length", String.valueOf(file.getSize()));
        metadata.put("Content-Type", file.getContentType());
        metadata.put("x-amz-acl", "public-read");

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .metadata(metadata)
                .contentLength(file.getSize())
                .contentType(file.getContentType())
                .acl("public-read")
                .build();

        // Upload the file to S3
        return s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(inputStream, file.getSize()));
    }

    // Method to generate a pre-signed URL
    public String generatePreSignedUrl(String objectKey) {
        // Create a GetObjectRequest
//        GetObjectRequest getObjectRequest =  GetObjectRequest.builder()
//
//                .bucket(bucketName)
//                .key(objectKey)
//                .build();
//        Date expiration = new Date();
//        long expTimeMillis = expiration.getTime();
//        expTimeMillis += 600; // Set expiration time
//        expiration.setTime(expTimeMillis);
//
//        GetObjectPresignRequest getObjectPresignRequest =  GetObjectPresignRequest.builder()
//                .getObjectRequest(getObjectRequest)
//
//
//                .signatureDuration(Duration.ofSeconds(600))
//                .build();
//
//
//        PresignedGetObjectRequest preSignedRequest = preSigner.presignGetObject(getObjectPresignRequest);
//        URL url = preSignedRequest.url();
//
//        System.out.println("URL: "+url.toString());
        System.out.println(cdnEndPoint+"/"+objectKey);
        return cdnEndPoint+"/"+objectKey;
    }


     /**
     * 🔥 **Ajout de la méthode pour supprimer un fichier S3**
     */
    public void deleteFile(String fileKey) {
        try {
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.deleteObject(deleteObjectRequest);
            System.out.println("Fichier supprimé avec succès : " + fileKey);
        } catch (S3Exception e) {
            throw new RuntimeException("Erreur lors de la suppression du fichier S3 : " + fileKey, e);
        }
    }

    public String getFileExtension(String fileName){
        String ext = "";

        String[] arr = fileName.split("\\.");
        if(arr.length > 0){
            ext = arr[arr.length-1];
        }

        return ext;
    }

    public String getPublicUrlFromPreSignedUrl(String preSignedUrl){

        String url = "";
       String[]  arr = preSignedUrl.split("\\?");

       if(arr.length==0){
           return url;
       }

//       return arr[0];
       return  preSignedUrl;
    }

}
