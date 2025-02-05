package in.oswinjerome.ArtSell.config;


import in.oswinjerome.ArtSell.user.MyUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {



    @Autowired
    MyUserDetailsService userDetailsService;

    @Autowired
    JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain configSecurity(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable);
        http.httpBasic(Customizer.withDefaults());
        http.authorizeHttpRequests(c->
                c.requestMatchers("/auth/register","/auth/login","/callbacks/judge0","/public/**","/home/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/paintingTypes").permitAll()
                .requestMatchers(HttpMethod.GET,"/materialTypes").permitAll()
                        .requestMatchers(HttpMethod.GET,"/events").permitAll()
                        .requestMatchers(HttpMethod.GET,"/events/{eventId}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/blogs").permitAll()
                        .requestMatchers(HttpMethod.GET,"/blogs/all").permitAll()
                        .requestMatchers(HttpMethod.GET,"/blogs/{blogId}").permitAll()
                        .requestMatchers(HttpMethod.GET,"/colab/{artistId}/colab").permitAll()
                .requestMatchers(HttpMethod.GET,"/download-pdf").permitAll()
                .requestMatchers(HttpMethod.GET,"/logo.png").permitAll()
                .requestMatchers(HttpMethod.GET,"/events/owners/{galleryId}/gallery").permitAll()
                .requestMatchers(HttpMethod.POST,"/payments/callback").permitAll()
                .requestMatchers(HttpMethod.GET,"/artists/{artistId}").permitAll()
                .requestMatchers(HttpMethod.GET,"/artists").permitAll()
                .requestMatchers(HttpMethod.GET,"/colab/{galleryId}/colab").permitAll()
                .requestMatchers(HttpMethod.GET,"/posts").permitAll()
                .requestMatchers(HttpMethod.GET,"/posts/artist/{artistId}").permitAll()
                .requestMatchers(HttpMethod.GET,"/catalogues/{catalogId}").permitAll()
                .requestMatchers(HttpMethod.POST,"/auth/reset").permitAll()
                .requestMatchers("/actuator/**").permitAll() // Autorise tous les endpoints Actuator

                        .anyRequest().authenticated());


        http.sessionManagement(session->session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }


    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        authenticationProvider.setUserDetailsService(userDetailsService);

        return authenticationProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
