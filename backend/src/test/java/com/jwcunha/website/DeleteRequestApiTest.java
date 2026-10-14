package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;

import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestNoteRepository;
import com.jwcunha.website.contact.ServiceArea;

/** Manual, permanent deletion of a request (spam or data-erasure request). */
class DeleteRequestApiTest extends IntegrationTestBase {

    @Autowired
    RequestNoteRepository notes;

    UUID id;
    UUID otherId;

    @BeforeEach
    void data() {
        notes.deleteAll();
        id = repository.save(new ProposalRequest("Ana Silva", "Alfa Energia", "ana@example.com", null,
                ServiceArea.FACILITY_MANAGEMENT, "Luanda", "Preciso de manutenção de edifícios.", true, "pt")).getId();
        otherId = repository.save(new ProposalRequest("Bruno Costa", "Beta Lda", "bruno@example.com", null,
                ServiceArea.WASTE_MANAGEMENT, "Cabinda", "Gestão de resíduos para uma base.", true, "pt")).getId();
    }

    @Test
    void deletionRequiresTheAdminAccount() throws Exception {
        mvc.perform(delete("/api/admin/requests/" + id)).andExpect(status().isUnauthorized());
        assertThat(repository.existsById(id)).isTrue();
    }

    @Test
    void deletesTheRequestAndItsNotesOnly() throws Exception {
        mvc.perform(post("/api/admin/requests/" + id + "/notes").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                .contentType(MediaType.APPLICATION_JSON).content("{\"body\":\"Liguei ao cliente.\"}"))
                .andExpect(status().isCreated());
        mvc.perform(post("/api/admin/requests/" + otherId + "/notes").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))
                .contentType(MediaType.APPLICATION_JSON).content("{\"body\":\"Outra nota.\"}"))
                .andExpect(status().isCreated());

        mvc.perform(delete("/api/admin/requests/" + id).with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNoContent());

        assertThat(repository.existsById(id)).isFalse();
        assertThat(notes.countByRequestId(id)).isZero();
        assertThat(repository.existsById(otherId)).isTrue();
        assertThat(notes.countByRequestId(otherId)).isEqualTo(1);
        mvc.perform(get("/api/admin/requests/" + id).with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNotFound());
    }

    @Test
    void unknownRequestIs404() throws Exception {
        mvc.perform(delete("/api/admin/requests/" + UUID.randomUUID()).with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isNotFound());
    }
}
