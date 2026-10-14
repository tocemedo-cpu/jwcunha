package com.jwcunha.website.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application settings. Admin credentials come exclusively from the environment;
 * when no hash is configured the admin API stays locked.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Admin admin, List<String> allowedOrigins, RateLimit rateLimit, Mail mail) {

    public record Admin(String username, String passwordHash) {
        public boolean configured() {
            return username != null && !username.isBlank()
                    && passwordHash != null && passwordHash.startsWith("$2");
        }
    }

    public record RateLimit(int maxRequests, int windowSeconds) {
    }

    /**
     * E-mail notification to the company. Off unless explicitly enabled and fully configured
     * (SMTP settings live under spring.mail.*).
     */
    public record Mail(Boolean enabled, String from, List<String> to, int maxAttempts, long retryDelayMs,
            long retryMinAgeSeconds) {

        /** An empty or unset MAIL_ENABLED (hosting dashboards send unfilled variables as empty) means off. */
        public boolean isEnabled() {
            return Boolean.TRUE.equals(enabled);
        }
    }
}
