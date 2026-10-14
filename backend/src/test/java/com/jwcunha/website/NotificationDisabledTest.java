package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.jwcunha.website.contact.NotificationStatus;

/** With mail off (the default) a submission works and no notification is attempted. */
class NotificationDisabledTest extends IntegrationTestBase {

    @Test
    void mailOffMarksTheRequestDisabled() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated());
        var saved = repository.findAll().get(0);
        assertThat(saved.getNotificationStatus()).isEqualTo(NotificationStatus.DISABLED);
        assertThat(saved.getNotificationAttempts()).isZero();
    }
}
