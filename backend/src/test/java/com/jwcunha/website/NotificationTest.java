package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Duration;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetup;
import com.jwcunha.website.contact.NotificationStatus;
import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.notification.NotificationService;

import jakarta.mail.internet.MimeMessage;

/** E-mail notifications against a real (in-memory) SMTP server. */
class NotificationTest extends IntegrationTestBase {

    /** A free port picked once, so the server can be stopped and restarted on the same address. */
    static final int SMTP_PORT = freePort();
    static final GreenMail SMTP = new GreenMail(new ServerSetup(SMTP_PORT, "127.0.0.1", ServerSetup.PROTOCOL_SMTP));

    static {
        SMTP.start();
    }

    private static int freePort() {
        try (var socket = new java.net.ServerSocket(0)) {
            return socket.getLocalPort();
        } catch (java.io.IOException e) {
            throw new IllegalStateException(e);
        }
    }

    @DynamicPropertySource
    static void mailProps(DynamicPropertyRegistry r) {
        r.add("app.mail.enabled", () -> "true");
        r.add("app.mail.from", () -> "noreply@cunha.ao");
        r.add("app.mail.to", () -> "jw@cunha.ao, equipa@cunha.ao");
        r.add("app.mail.retry-min-age-seconds", () -> "0");
        r.add("spring.mail.host", () -> "127.0.0.1");
        r.add("spring.mail.port", () -> String.valueOf(SMTP_PORT));
        r.add("spring.mail.properties.mail.smtp.auth", () -> "false");
        r.add("spring.mail.properties.mail.smtp.starttls.enable", () -> "false");
    }

    @Autowired
    NotificationService notifications;

    @BeforeEach
    void resetMailbox() throws Exception {
        if (SMTP.getSmtp() == null || !SMTP.getSmtp().isRunning()) { // a previous test stopped it
            SMTP.start();
        }
        SMTP.purgeEmailFromAllMailboxes();
    }

    @AfterAll
    static void stopSmtp() {
        SMTP.stop();
    }

    private void submit(String json) throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(json))
                .andExpect(status().isCreated());
    }

    private java.util.Set<String> recipientsReached() throws Exception {
        var out = new java.util.TreeSet<String>();
        for (MimeMessage m : SMTP.getReceivedMessages()) {
            for (var a : m.getAllRecipients()) {
                out.add(a.toString());
            }
        }
        return out;
    }

    private ProposalRequest only() {
        var all = repository.findAll();
        assertThat(all).hasSize(1);
        return all.get(0);
    }

    @Test
    void newRequestIsEmailedToEveryRecipientWithReplyToTheVisitor() throws Exception {
        submit(validJson());

        await().atMost(Duration.ofSeconds(8)).until(() -> SMTP.getReceivedMessages().length >= 1);
        await().atMost(Duration.ofSeconds(5)).until(() -> recipientsReached().size() == 2); // both addresses
        MimeMessage m = SMTP.getReceivedMessages()[0];
        assertThat(m.getFrom()[0].toString()).isEqualTo("noreply@cunha.ao");
        assertThat(m.getReplyTo()[0].toString()).isEqualTo("ana@example.com");
        assertThat(m.getSubject()).contains("Example Energy Ltd").contains("Facility Management");
        String body = GreenMailUtil.getBody(m);
        assertThat(body).contains("Ana Silva").contains("ana@example.com").contains("+244 900 000 000")
                .contains("We need integrated facility management").contains(only().getId().toString());

        await().atMost(Duration.ofSeconds(5)).untilAsserted(() -> {
            var saved = only();
            assertThat(saved.getNotificationStatus()).isEqualTo(NotificationStatus.SENT);
            assertThat(saved.getNotificationAttempts()).isEqualTo(1);
            assertThat(saved.getNotifiedAt()).isNotNull();
        });
    }

    @Test
    void mailServerDownNeverLosesTheRequestAndTheRetrySendsIt() throws Exception {
        SMTP.stop();
        submit(validJson()); // the visitor still gets a confirmation: the request is saved

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            var saved = only();
            assertThat(saved.getNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
            assertThat(saved.getNotificationAttempts()).isEqualTo(1);
            assertThat(saved.getNotificationError()).isNotBlank();
        });

        SMTP.start();
        notifications.retryPending();

        await().atMost(Duration.ofSeconds(8)).until(() -> SMTP.getReceivedMessages().length >= 1);
        var saved = only();
        assertThat(saved.getNotificationStatus()).isEqualTo(NotificationStatus.SENT);
        assertThat(saved.getNotificationAttempts()).isEqualTo(2);
    }

    @Test
    void retryStopsAfterTheAttemptLimit() throws Exception {
        SMTP.stop();
        submit(validJson());
        await().atMost(Duration.ofSeconds(10)).until(() -> only().getNotificationAttempts() == 1);
        for (int i = 0; i < 6; i++) {
            notifications.retryPending();
        }
        assertThat(only().getNotificationAttempts()).isEqualTo(5); // app.mail.max-attempts
        assertThat(only().getNotificationStatus()).isEqualTo(NotificationStatus.FAILED);
    }

    @Test
    void visitorTextCannotInjectMailHeaders() throws Exception {
        String evil = validJson().replace("Example Energy Ltd", "Evil\\r\\nBcc: attacker@evil.example\\r\\nX-Injected: 1");
        submit(evil);

        await().atMost(Duration.ofSeconds(8)).until(() -> SMTP.getReceivedMessages().length >= 1);
        MimeMessage m = SMTP.getReceivedMessages()[0];
        assertThat(m.getSubject()).doesNotContain("\r").doesNotContain("\n");
        assertThat(m.getHeader("X-Injected")).isNull();
        assertThat(m.getHeader("Bcc")).isNull();
        assertThat(recipientsReached()).containsExactlyInAnyOrder("jw@cunha.ao", "equipa@cunha.ao"); // no injected Bcc
    }
}
