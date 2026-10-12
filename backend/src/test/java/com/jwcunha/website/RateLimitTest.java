package com.jwcunha.website;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;

@TestPropertySource(properties = "app.rate-limit.max-requests=2")
class RateLimitTest extends IntegrationTestBase {

    @Test
    void thirdSubmissionInWindowIsThrottled() throws Exception {
        for (int i = 0; i < 2; i++) {
            mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                    .andExpect(status().isCreated());
        }
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isTooManyRequests());
    }
}
