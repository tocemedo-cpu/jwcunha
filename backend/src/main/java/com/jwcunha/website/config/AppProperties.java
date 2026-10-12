package com.jwcunha.website.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application settings. Admin credentials come exclusively from the environment;
 * when no hash is configured the admin API stays locked.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Admin admin, List<String> allowedOrigins, RateLimit rateLimit) {

    public record Admin(String username, String passwordHash) {
        public boolean configured() {
            return username != null && !username.isBlank()
                    && passwordHash != null && passwordHash.startsWith("$2");
        }
    }

    public record RateLimit(int maxRequests, int windowSeconds) {
    }
}
