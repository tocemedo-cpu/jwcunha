package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.jwcunha.website.contact.RequestStatus;

class ContactApiTest extends IntegrationTestBase {

    @Test
    void validSubmissionIsPersisted() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(validJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.reference").exists());

        var all = repository.findAll();
        assertThat(all).hasSize(1);
        var saved = all.get(0);
        assertThat(saved.getEmail()).isEqualTo("ana@example.com");
        assertThat(saved.getStatus()).isEqualTo(RequestStatus.NEW);
        assertThat(saved.isConsentGiven()).isTrue();
    }

    @Test
    void invalidSubmissionIsRejectedAndNothingIsSaved() throws Exception {
        String bad = """
            {"fullName":"","company":"X","email":"not-an-email","serviceArea":null,
             "message":"short","consent":false}""";
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bad))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.fullName").exists())
                .andExpect(jsonPath("$.errors.email").exists())
                .andExpect(jsonPath("$.errors.serviceArea").exists())
                .andExpect(jsonPath("$.errors.message").exists())
                .andExpect(jsonPath("$.errors.consent").exists());
        assertThat(repository.count()).isZero();
    }

    @Test
    void honeypotSubmissionIsRejected() throws Exception {
        String bot = validJson().replace("\"website\":\"\"", "\"website\":\"http://spam.example\"");
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bot))
                .andExpect(status().isBadRequest());
        assertThat(repository.count()).isZero();
    }

    @Test
    void unknownServiceAreaIsRejected() throws Exception {
        String bad = validJson().replace("FACILITY_MANAGEMENT", "DRILLING");
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content(bad))
                .andExpect(status().isBadRequest());
        assertThat(repository.count()).isZero();
    }

    @Test
    void malformedJsonIsRejected() throws Exception {
        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("{oops"))
                .andExpect(status().isBadRequest());
    }
}
