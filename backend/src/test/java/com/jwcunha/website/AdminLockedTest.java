package com.jwcunha.website;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

/** With no credentials in the environment the admin API must stay locked for everyone. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = {"app.admin.username=", "app.admin.password-hash="})
class AdminLockedTest {

    @Autowired
    MockMvc mvc;

    @Test
    void noAccountExistsWhenUnconfigured() throws Exception {
        mvc.perform(get("/api/admin/requests").with(httpBasic("admin", "admin"))).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/requests").with(httpBasic("", ""))).andExpect(status().isUnauthorized());
    }
}
