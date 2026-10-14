package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;

import com.jwcunha.website.contact.NotificationStatus;

/** MAIL_ENABLED=true without sender/recipients/host must be treated as off, never fail a submission. */
@TestPropertySource(properties = {"app.mail.enabled=true", "app.mail.from=", "app.mail.to="})
class NotificationMisconfiguredTest extends IntegrationTestBase {

    @Test
    void enabledButIncompleteIsTreatedAsOff() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated());
        assertThat(repository.findAll().get(0).getNotificationStatus()).isEqualTo(NotificationStatus.DISABLED);
    }
}
