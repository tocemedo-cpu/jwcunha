package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.jwcunha.website.config.AppProperties.Admin;

/** The admin variables are pasted by hand into .env files and hosting dashboards: tolerate the usual slips. */
class AdminCredentialsTest {

    private static final String HASH = new BCryptPasswordEncoder(4).encode("a-long-test-password-1");

    @Test
    void plainValuesAreConfigured() {
        assertThat(new Admin("admin", HASH).configured()).isTrue();
    }

    @Test
    void quotesSpacesAndLineBreaksAroundTheValuesAreIgnored() {
        assertThat(new Admin("admin", "'" + HASH + "'").passwordHash()).isEqualTo(HASH);
        assertThat(new Admin("admin", "\"" + HASH + "\"").passwordHash()).isEqualTo(HASH);
        assertThat(new Admin("admin", " " + HASH + "\r\n").passwordHash()).isEqualTo(HASH);
        assertThat(new Admin(" 'admin' ", HASH).username()).isEqualTo("admin");
        assertThat(new Admin(" 'admin' ", "'" + HASH + "'").configured()).isTrue();
    }

    @Test
    void anythingThatIsNotAWholeBcryptHashStaysLocked() {
        assertThat(new Admin("admin", HASH.substring(0, 40)).configured()).isFalse(); // truncated while copying
        assertThat(new Admin("admin", "$2a$12$short").configured()).isFalse();
        assertThat(new Admin("admin", "a-long-test-password-1").configured()).isFalse(); // the password, not its hash
        assertThat(new Admin("admin", "").configured()).isFalse();
        assertThat(new Admin("admin", null).configured()).isFalse();
        assertThat(new Admin("", HASH).configured()).isFalse();
        assertThat(new Admin(null, null).configured()).isFalse();
    }
}
