package in.oswinjerome.ArtSell.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private String secretkey = "";

    JwtService(){
        try {

            secretkey = Base64.getEncoder().encodeToString(
                    "451b19819d58bcd46271c98a77d71ee10b4d303d84cfb178e3d5d85d8420c69b".getBytes()
            );
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String generateToken(String username) {

        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder().claims().add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() * (60 * 60 * 60)))
                    .and().signWith(getSignKey()).compact();

    }

    private Claims extractAllClaims(String token) throws JwtException {

        return Jwts.parser().verifyWith(getSignKey()).build().parseSignedClaims(token).getPayload();

    }

    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) throws JwtException {
        final Claims claims = extractAllClaims(token);

        return claimsTFunction.apply(claims);
    }

    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretkey);
        return Keys.hmacShaKeyFor(keyBytes);
    }


    public String extractUserName(String token) throws JwtException {

        return extractClaims(token, Claims::getSubject);
    }

    private boolean isTokenExpired(String token) {

        return extractClaims(token, Claims::getExpiration).before(new Date());
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        String uName = extractUserName(token);
        return uName.equals(userDetails.getUsername()) && !isTokenExpired(token);
    }
}
