package com.jwcunha.website.config;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /** Single admin account, defined by environment. No default credentials exist. */
    @Bean
    UserDetailsService userDetailsService(AppProperties props) {
        var admin = props.admin();
        if (admin == null || !admin.configured()) {
            logAdminState(admin);
            return new InMemoryUserDetailsManager();
        }
        log.info("Admin account '{}' is configured.", admin.username());
        return new InMemoryUserDetailsManager(
                User.withUsername(admin.username()).password(admin.passwordHash()).roles("ADMIN").build());
    }

    /** Says why the admin is locked, without ever printing the hash. */
    private static void logAdminState(AppProperties.Admin admin) {
        boolean user = admin != null && admin.hasUsername();
        boolean hash = admin != null && admin.passwordHash() != null && !admin.passwordHash().isEmpty();
        if (!user && !hash) {
            log.info("Admin API is locked: ADMIN_USERNAME and ADMIN_PASSWORD_HASH are not set.");
        } else if (!user) {
            log.warn("Admin API is LOCKED: ADMIN_USERNAME is empty.");
        } else if (!hash) {
            log.warn("Admin API is LOCKED: ADMIN_PASSWORD_HASH is empty.");
        } else {
            log.warn("Admin API is LOCKED: ADMIN_PASSWORD_HASH is not a valid bcrypt hash ({} characters, starts with "
                    + "'{}'). Generate it with 'java -jar app.jar hash-password' and paste the whole value (60 characters, "
                    + "starting with $2a$).", admin.passwordHash().length(),
                    admin.passwordHash().substring(0, Math.min(3, admin.passwordHash().length())));
        }
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
