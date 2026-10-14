package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestNoteRepository;
import com.jwcunha.website.contact.ServiceArea;

/** Internal notes: who wrote what and when, per proposal request. */
class NotesApiTest extends IntegrationTestBase {

    @Autowired
    RequestNoteRepository notes;

    UUID requestId;
    UUID otherId;

    @BeforeEach
    void data() {
        notes.deleteAll();
        requestId = repository.save(new ProposalRequest("Ana Silva", "Alfa Energia", "ana@example.com", null,
                ServiceArea.FACILITY_MANAGEMENT, "Luanda", "Preciso de manutenção de edifícios.", true, "pt")).getId();
        otherId = repository.save(new ProposalRequest("Bruno Costa", "Beta Lda", "bruno@example.com", null,
                ServiceArea.WASTE_MANAGEMENT, "Cabinda", "Gestão de resíduos para uma base.", true, "pt")).getId();
    }

    private RequestPostProcessor admin() {
        return httpBasic(ADMIN_USER, ADMIN_PASSWORD);
    }

    private void addNote(UUID id, String body) throws Exception {
        mvc.perform(post("/api/admin/requests/" + id + "/notes").with(admin()).contentType(MediaType.APPLICATION_JSON)
                .content("{\"body\":" + new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(body) + "}"))
                .andExpect(status().isCreated());
    }

    @Test
    void notesRequireTheAdminAccount() throws Exception {
        mvc.perform(get("/api/admin/requests/" + requestId + "/notes")).andExpect(status().isUnauthorized());
        mvc.perform(post("/api/admin/requests/" + requestId + "/notes").contentType(MediaType.APPLICATION_JSON)
                .content("{\"body\":\"x\"}")).andExpect(status().isUnauthorized());
        mvc.perform(delete("/api/admin/requests/" + requestId + "/notes/" + UUID.randomUUID()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void addingANoteRecordsTheSignedInAuthorAndTime() throws Exception {
        mvc.perform(post("/api/admin/requests/" + requestId + "/notes").with(admin())
                .contentType(MediaType.APPLICATION_JSON).content("{\"body\":\"  Liguei ao cliente; pediu visita à base.  \"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.author").value(ADMIN_USER))
                .andExpect(jsonPath("$.body").value("Liguei ao cliente; pediu visita à base."))
                .andExpect(jsonPath("$.createdAt").exists())
                .andExpect(jsonPath("$.id").exists());
    }

    @Test
    void notesAreListedOldestFirstAndOnlyForTheirRequest() throws Exception {
        addNote(requestId, "Primeira nota");
        addNote(requestId, "Segunda nota");
        addNote(otherId, "Nota de outro pedido");

        mvc.perform(get("/api/admin/requests/" + requestId + "/notes").with(admin())).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2)).andExpect(jsonPath("$[0].body").value("Primeira nota"))
                .andExpect(jsonPath("$[1].body").value("Segunda nota"));
    }

    @Test
    void invalidNotesAreRejected() throws Exception {
        for (String body : new String[] {"{\"body\":\"\"}", "{\"body\":\"   \"}", "{}", "{\"body\":\"" + "x".repeat(2001) + "\"}"}) {
            mvc.perform(post("/api/admin/requests/" + requestId + "/notes").with(admin())
                    .contentType(MediaType.APPLICATION_JSON).content(body)).andExpect(status().isBadRequest());
        }
        assertThat(notes.count()).isZero();
    }

    @Test
    void unknownRequestIsNotFound() throws Exception {
        UUID nobody = UUID.randomUUID();
        mvc.perform(get("/api/admin/requests/" + nobody + "/notes").with(admin())).andExpect(status().isNotFound());
        mvc.perform(post("/api/admin/requests/" + nobody + "/notes").with(admin())
                .contentType(MediaType.APPLICATION_JSON).content("{\"body\":\"x\"}")).andExpect(status().isNotFound());
        assertThat(notes.count()).isZero();
    }

    @Test
    void aNoteCanOnlyBeDeletedThroughItsOwnRequest() throws Exception {
        addNote(requestId, "Para apagar");
        UUID noteId = notes.findAll().get(0).getId();

        mvc.perform(delete("/api/admin/requests/" + otherId + "/notes/" + noteId).with(admin()))
                .andExpect(status().isNotFound());
        assertThat(notes.count()).isEqualTo(1);

        mvc.perform(delete("/api/admin/requests/" + requestId + "/notes/" + noteId).with(admin()))
                .andExpect(status().isNoContent());
        assertThat(notes.count()).isZero();
    }

    @Test
    void theListShowsHowManyNotesEachRequestHas() throws Exception {
        addNote(requestId, "Nota 1");
        addNote(requestId, "Nota 2");
        String json = mvc.perform(get("/api/admin/requests").with(admin())).andExpect(status().isOk()).andReturn()
                .getResponse().getContentAsString(StandardCharsets.UTF_8);
        assertThat(com.jayway.jsonpath.JsonPath.<java.util.List<Integer>>read(json,
                "$.content[?(@.company=='Alfa Energia')].noteCount")).containsExactly(2);
        assertThat(com.jayway.jsonpath.JsonPath.<java.util.List<Integer>>read(json,
                "$.content[?(@.company=='Beta Lda')].noteCount")).containsExactly(0);
        mvc.perform(get("/api/admin/requests/" + requestId).with(admin())).andExpect(jsonPath("$.noteCount").value(2));
    }

    @Test
    void searchAlsoLooksInsideTheNotes() throws Exception {
        addNote(requestId, "Agendada visita técnica para quinta-feira");
        mvc.perform(get("/api/admin/requests").param("q", "visita técnica").with(admin())).andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].company").value("Alfa Energia"));
        mvc.perform(get("/api/admin/requests").param("q", "nada disto existe").with(admin()))
                .andExpect(jsonPath("$.content.length()").value(0));
    }

    @Test
    void csvExportIncludesTheNotes() throws Exception {
        addNote(requestId, "Respondido por telefone");
        addNote(requestId, "=SUM(1;2) não deve virar fórmula");
        String csv = mvc.perform(get("/api/admin/requests/export.csv?q=alfa").with(admin())).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        assertThat(csv).contains("\"Notas internas\"").contains(ADMIN_USER + ": Respondido por telefone")
                .contains(ADMIN_USER + ": =SUM(1;2) não deve virar fórmula");
        assertThat(csv).doesNotContain("\"=SUM"); // the cell starts with the date, never with '='
    }
}
