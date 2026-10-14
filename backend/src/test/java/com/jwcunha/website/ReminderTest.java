package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.time.Instant;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.icegreen.greenmail.util.GreenMail;
import com.icegreen.greenmail.util.GreenMailUtil;
import com.icegreen.greenmail.util.ServerSetup;
import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestStatus;
import com.jwcunha.website.contact.ServiceArea;
import com.jwcunha.website.notification.ReminderService;

/** Digest e-mail for requests nobody has picked up (status still NEW). */
class ReminderTest extends IntegrationTestBase {

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
        r.add("app.mail.to", () -> "jw@cunha.ao");
        r.add("app.reminder.after-hours", () -> "48");
        r.add("spring.mail.host", () -> "127.0.0.1");
        r.add("spring.mail.port", () -> String.valueOf(SMTP_PORT));
        r.add("spring.mail.properties.mail.smtp.auth", () -> "false");
        r.add("spring.mail.properties.mail.smtp.starttls.enable", () -> "false");
    }

    @Autowired
    ReminderService reminders;

    @BeforeEach
    void resetMailbox() throws Exception {
        if (SMTP.getSmtp() == null || !SMTP.getSmtp().isRunning()) {
            SMTP.start();
        }
        SMTP.purgeEmailFromAllMailboxes();
    }

    @AfterAll
    static void stopSmtp() {
        SMTP.stop();
    }

    private ProposalRequest save(String company) {
        return repository.save(new ProposalRequest("Ana Silva", company, "ana@example.com", null,
                ServiceArea.FACILITY_MANAGEMENT, "Luanda", "Preciso de manutenção.", true, "pt"));
    }

    @Test
    void nothingIsSentWhileRequestsAreRecent() {
        save("Alfa Energia");
        assertThat(reminders.remind(Instant.now().plus(Duration.ofHours(47)))).isFalse();
        assertThat(SMTP.getReceivedMessages()).isEmpty();
    }

    @Test
    void overdueNewRequestsAreListedInOneDigest() throws Exception {
        save("Alfa Energia");
        save("Beta Lda");
        assertThat(reminders.remind(Instant.now().plus(Duration.ofHours(49)))).isTrue();

        var messages = SMTP.getReceivedMessages();
        assertThat(messages).hasSize(1);
        assertThat(messages[0].getSubject()).contains("2 pedidos de proposta sem resposta");
        String body = GreenMailUtil.getBody(messages[0]);
        assertThat(body).contains("Alfa Energia").contains("Beta Lda").contains("48 horas").contains("/admin");
    }

    @Test
    void requestsAlreadyPickedUpAreLeftOut() {
        var handled = save("Alfa Energia");
        handled.changeStatus(RequestStatus.IN_REVIEW);
        repository.save(handled);
        assertThat(reminders.remind(Instant.now().plus(Duration.ofHours(72)))).isFalse();
        assertThat(SMTP.getReceivedMessages()).isEmpty();
    }

    @Test
    void aFailingMailServerIsNotFatalAndTheNextRunTriesAgain() {
        save("Alfa Energia");
        SMTP.stop();
        assertThat(reminders.remind(Instant.now().plus(Duration.ofHours(72)))).isFalse();

        SMTP.start();
        assertThat(reminders.remind(Instant.now().plus(Duration.ofHours(72)))).isTrue();
        assertThat(SMTP.getReceivedMessages()).hasSize(1);
    }

    @Test
    void thresholdParsingIsForgiving() {
        assertThat(ReminderService.parse(null)).isEqualTo(48);
        assertThat(ReminderService.parse("")).isEqualTo(48);
        assertThat(ReminderService.parse("abc")).isEqualTo(48);
        assertThat(ReminderService.parse(" 24 ")).isEqualTo(24);
        assertThat(ReminderService.parse("0")).isZero();
        assertThat(ReminderService.parse("-5")).isZero();
    }
}
