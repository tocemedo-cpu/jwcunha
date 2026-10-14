package com.jwcunha.website.config;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Application settings. Admin credentials come exclusively from the environment;
 * when no hash is configured the admin API stays locked.
 */
@ConfigurationProperties(prefix = "app")
public record AppProperties(Admin admin, List<String> allowedOrigins, RateLimit rateLimit, Mail mail, AdminThrottle adminThrottle) {

    public record Admin(String username, String passwordHash) {

        private static final java.util.regex.Pattern BCRYPT = java.util.regex.Pattern.compile("^\\$2[aby]\\$\\d{2}\\$.{53}$");

        /** Pasted values often carry spaces, a line break or quotes (.env files, hosting dashboards): drop them. */
        public Admin {
            username = clean(username);
            passwordHash = clean(passwordHash);
        }

        static String clean(String value) {
            if (value == null) {
                return null;
            }
            String v = value.strip();
            while (v.length() >= 2 && (v.startsWith("'") && v.endsWith("'") || v.startsWith("\"") && v.endsWith("\""))) {
                v = v.substring(1, v.length() - 1).strip();
            }
            return v;
        }

        public boolean hasUsername() {
            return username != null && !username.isBlank();
        }

        public boolean hasValidHash() {
            return passwordHash != null && BCRYPT.matcher(passwordHash).matches();
        }

        public boolean configured() {
            return hasUsername() && hasValidHash();
        }
    }

    public record RateLimit(int maxRequests, int windowSeconds) {
    }

    /** Blocks an address after too many failed admin logins (HTTP 401) inside the window. */
    public record AdminThrottle(int maxFailures, int windowSeconds) {
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
