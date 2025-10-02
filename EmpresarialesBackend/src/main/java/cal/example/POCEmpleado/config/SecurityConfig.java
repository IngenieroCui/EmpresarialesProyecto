package cal.example.POCEmpleado.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Deshabilitar CSRF, necesario para APIs REST consumidas por clientes externos
        http.csrf().disable();

        // Configurar CORS - ESTO ES LO IMPORTANTE PARA EL FRONTEND
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // Configurar la autorización de las peticiones
        http.authorizeHttpRequests(auth -> auth
                // Permitir acceso a un endpoint público sin autenticación (ej. /publico/**)
                .requestMatchers("/publico/**").permitAll()
                // Permitir acceso a la API de Carros sin autenticación (para desarrollo)
                .requestMatchers("/api/v1/carros/**").permitAll()
                // Permitir acceso a endpoints de empleados sin autenticación (legacy)
                .requestMatchers("/empleados/**").permitAll()
                // Permitir acceso a health checks
                .requestMatchers("/actuator/health").permitAll()
                // Requerir autenticación para cualquier otra petición
                .anyRequest().authenticated()
        );

        // Habilitar la autenticación básica (usuario:contraseña)
        http.httpBasic();

        // Construir y retornar el SecurityFilterChain
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir orígenes específicos (en producción, especifica tu dominio)
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));

        // Permitir todos los métodos HTTP
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Permitir todos los headers
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // Permitir credenciales
        configuration.setAllowCredentials(true);

        // Aplicar configuración a todos los paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}