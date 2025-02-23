package in.oswinjerome.ArtSell.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
public class AwsConfig {

    @Value("${cloud.aws.credentials.access-key}")
    String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    String secretKey;
    @Value("${cloud.aws.s3.endpoint}")
    String endpoint;
    @Bean
    public S3Presigner s3Presigner() {

        AwsBasicCredentials awsCredentials =  AwsBasicCredentials.create(accessKey, secretKey);


        return S3Presigner.builder()
                .serviceConfiguration(S3Configuration.builder().pathStyleAccessEnabled(true).build())
                .region(Region.US_EAST_1) // replace with your desired region
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .build();
    }
}
