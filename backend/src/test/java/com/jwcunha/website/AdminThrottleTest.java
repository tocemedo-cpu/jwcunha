package com.jwcunha.website;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.TestPropertySource;

/** Password guessing on the admin API is throttled per address. */
@TestPropertySource(properties = "app.admin-throttle.max-failures=3")
class AdminThrottleTest extends IntegrationTestBase {

    @Test
    void blocksAnAddressAfterTooManyFailedLogins() throws Exception {
        for (int i = 0; i < 3; i++) {
            mvc.perform(get("/api/admin/requests").with(httpBasic(ADMIN_USER, "wrong-password-" + i)))
                    .andExpect(status().isUnauthorized());
        }
        // blocked: even the correct password is refused until the window passes
        mvc.perform(get("/api/admin/requests").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isTooManyRequests());
        // the public form is unaffected
        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/contact")
                .contentType("application/json").content(validJson())).andExpect(status().isCreated());
    }
}
