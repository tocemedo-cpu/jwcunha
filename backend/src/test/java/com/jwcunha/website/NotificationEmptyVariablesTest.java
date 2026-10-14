package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;

import com.jwcunha.website.contact.NotificationStatus;

/**
 * Hosting dashboards (Render "sync: false") send variables that were never filled in as EMPTY strings. The
 * application must still start and treat mail as off.
 */
@TestPropertySource(properties = {"app.mail.enabled=", "app.mail.from=", "app.mail.to=", "spring.mail.host=",
        "spring.mail.username=", "spring.mail.password="})
class NotificationEmptyVariablesTest extends IntegrationTestBase {

    @Test
    void emptyMailVariablesStartTheApplicationWithMailOff() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated());
        assertThat(repository.findAll().get(0).getNotificationStatus()).isEqualTo(NotificationStatus.DISABLED);
    }
}
