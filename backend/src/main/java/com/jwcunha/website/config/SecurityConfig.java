package com.jwcunha.website.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /** Single admin account, defined by environment. No default credentials exist. */
    @Bean
    UserDetailsService userDetailsService(AppProperties props) {
        var admin = props.admin();
        if (admin == null || !admin.configured()) {
            return new InMemoryUserDetailsManager();
        }
        return new InMemoryUserDetailsManager(
                User.withUsername(admin.username()).password(admin.passwordHash()).roles("ADMIN").build());
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // stateless API, no cookies, Basic auth only
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .headers(h -> h
                .contentTypeOptions(Customizer.withDefaults())
                .frameOptions(f -> f.deny())
                .referrerPolicy(r -> r.policy(
                        org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER)))
            .authorizeHttpRequests(a -> a
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()
                .requestMatchers("/actuator/health", "/actuator/health/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().denyAll())
            .httpBasic(b -> b.authenticationEntryPoint(adminEntryPoint()));
        return http.build();
    }

    /**
     * Tools (curl, scripts) get the standard Basic challenge. The administration page marks its calls with
     * {@code X-Requested-With}; for those the 401 carries no {@code WWW-Authenticate}, otherwise browsers would
     * open their own login dialog on top of the page instead of letting it show its error message.
     */
    private static AuthenticationEntryPoint adminEntryPoint() {
        var basic = new BasicAuthenticationEntryPoint();
        basic.setRealmName("Jelson & Wilson Cunha - administration");
        return (request, response, exception) -> {
            if ("XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
                response.getWriter().write("{\"title\":\"Unauthorized\",\"status\":401}");
            } else {
                basic.commence(request, response, exception);
            }
        };
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(AppProperties props) {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(props.allowedOrigins() == null ? List.of() : props.allowedOrigins());
        cfg.setAllowedMethods(List.of("GET", "POST", "PATCH", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Content-Type", "Authorization", "Accept-Language", "X-Requested-With"));
        cfg.setMaxAge(3600L);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", cfg);
        return source;
    }
}
