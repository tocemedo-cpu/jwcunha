package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.jwcunha.website.contact.RequestStatus;

class AdminApiTest extends IntegrationTestBase {

    @Test
    void anonymousAccessIsDenied() throws Exception {
        mvc.perform(get("/api/admin/requests")).andExpect(status().isUnauthorized());
    }

    @Test
    void browserCallsGetANoChallenge401SoNoNativeLoginDialogAppears() throws Exception {
        mvc.perform(get("/api/admin/requests").header("X-Requested-With", "XMLHttpRequest"))
                .andExpect(status().isUnauthorized())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .doesNotExist("WWW-Authenticate"));
        // tools keep the standard challenge
        mvc.perform(get("/api/admin/requests")).andExpect(status().isUnauthorized())
                .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.header()
                        .string("WWW-Authenticate", org.hamcrest.Matchers.startsWith("Basic")));
    }

    @Test
    void wrongPasswordIsDenied() throws Exception {
        mvc.perform(get("/api/admin/requests").with(httpBasic(ADMIN_USER, "wrong-password-123")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void adminCanListAndUpdateStatus() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated());
        var id = repository.findAll().get(0).getId();

        mvc.perform(get("/api/admin/requests").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].company").value("Example Energy Ltd"));

        mvc.perform(patch("/api/admin/requests/" + id + "/status").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"RESPONDED\"}"))
                .andExpect(status().isOk());
        assertThat(repository.findById(id).orElseThrow().getStatus()).isEqualTo(RequestStatus.RESPONDED);
    }

    @Test
    void unknownIdReturnsNotFound() throws Exception {
        mvc.perform(get("/api/admin/requests/00000000-0000-0000-0000-000000000000")
                .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))).andExpect(status().isNotFound());
    }

    @Test
    void otherEndpointsAreClosed() throws Exception {
        mvc.perform(get("/api/anything")).andExpect(status().is4xxClientError());
        mvc.perform(get("/actuator/env")).andExpect(status().is4xxClientError());
    }
}
