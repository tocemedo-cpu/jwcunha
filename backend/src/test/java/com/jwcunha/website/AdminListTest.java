package com.jwcunha.website;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;

import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestStatus;
import com.jwcunha.website.contact.ServiceArea;

/** Filters, summary and CSV export of the administrative API. */
class AdminListTest extends IntegrationTestBase {

    private static ProposalRequest request(String name, String company, ServiceArea area, String message) {
        return new ProposalRequest(name, company, name.toLowerCase().replace(' ', '.') + "@example.com", null, area,
                "Luanda", message, true, "pt");
    }

    @BeforeEach
    void data() {
        var a = request("Ana Silva", "Alfa Energia", ServiceArea.FACILITY_MANAGEMENT, "Preciso de manutenção de edifícios e escritórios.");
        var b = request("Bruno Costa", "Beta 100% Logística", ServiceArea.WASTE_MANAGEMENT, "Gestão de resíduos para uma base logística.");
        var c = request("Carla Dias", "Gama Obras", ServiceArea.WASTE_MANAGEMENT, "Recolha e destino de resíduos de obra.");
        c.changeStatus(RequestStatus.RESPONDED);
        repository.saveAll(java.util.List.of(a, b, c));
    }

    private String json(String url) throws Exception {
        return mvc.perform(get(url).with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
    }

    private String searchParam(String q) throws Exception {
        return mvc.perform(get("/api/admin/requests").param("q", q).with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
    }

    @Test
    void filtersByStatusAndService() throws Exception {
        mvc.perform(get("/api/admin/requests?status=RESPONDED").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].company").value("Gama Obras"));
        mvc.perform(get("/api/admin/requests?serviceArea=WASTE_MANAGEMENT").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(jsonPath("$.page.totalElements").value(2));
        mvc.perform(get("/api/admin/requests?status=NEW&serviceArea=WASTE_MANAGEMENT")
                .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))).andExpect(jsonPath("$.content.length()").value(1))
                .andExpect(jsonPath("$.content[0].company").value("Beta 100% Logística"));
    }

    @Test
    void searchIsCaseInsensitiveAcrossFieldsAndWildcardsAreLiteral() throws Exception {
        assertThat(json("/api/admin/requests?q=ALFA")).contains("Alfa Energia").doesNotContain("Gama Obras");
        assertThat(json("/api/admin/requests?q=resíduos")).contains("Beta").contains("Gama").doesNotContain("Alfa");
        assertThat(json("/api/admin/requests?q=carla.dias@")).contains("Gama Obras");
        // '%' must match only a literal percent sign, not "everything"
        assertThat(searchParam("%")).contains("Beta 100% Logística").doesNotContain("Alfa").doesNotContain("Gama");
        assertThat(searchParam("_")).doesNotContain("Alfa").doesNotContain("Gama").doesNotContain("Beta");
        assertThat(searchParam("\\")).doesNotContain("Alfa"); // a lone backslash is literal, never an error
    }

    @Test
    void summaryCountsEveryStatus() throws Exception {
        mvc.perform(get("/api/admin/requests/summary").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.NEW").value(2))
                .andExpect(jsonPath("$.RESPONDED").value(1)).andExpect(jsonPath("$.IN_REVIEW").value(0))
                .andExpect(jsonPath("$.CLOSED").value(0));
    }

    @Test
    void invalidFilterValueIsRejected() throws Exception {
        mvc.perform(get("/api/admin/requests?status=NOPE").with(httpBasic(ADMIN_USER, ADMIN_PASSWORD)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void csvExportIsAdminOnlyAndFollowsTheFilters() throws Exception {
        mvc.perform(get("/api/admin/requests/export.csv")).andExpect(status().isUnauthorized());

        var res = mvc.perform(get("/api/admin/requests/export.csv?serviceArea=WASTE_MANAGEMENT")
                .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))).andExpect(status().isOk()).andReturn().getResponse();
        assertThat(res.getHeader(HttpHeaders.CONTENT_DISPOSITION)).contains("attachment").contains(".csv");
        assertThat(res.getContentType()).startsWith("text/csv");
        String csv = res.getContentAsString(StandardCharsets.UTF_8);
        assertThat(csv).startsWith("﻿\"Referência\";\"Recebido em (Luanda)\";\"Estado\"");
        assertThat(csv).contains("Beta 100% Logística").contains("Gama Obras").doesNotContain("Alfa Energia");
        assertThat(csv.split("\r\n")).hasSize(3); // header + 2 rows
    }

    @Test
    void csvCellsCannotRunAsSpreadsheetFormulas() throws Exception {
        repository.save(request("Eve Hacker", "=HYPERLINK(\"http://evil.example\",\"x\")", ServiceArea.OTHER,
                "+cmd|' /C calc'!A0 \"quoted\"; semicolon"));
        String csv = mvc.perform(get("/api/admin/requests/export.csv?q=hacker")
                .with(httpBasic(ADMIN_USER, ADMIN_PASSWORD))).andExpect(status().isOk()).andReturn().getResponse()
                .getContentAsString(StandardCharsets.UTF_8);
        assertThat(csv).contains("\"'=HYPERLINK(\"\"http://evil.example\"\",\"\"x\"\")\"");
        assertThat(csv).contains("\"'+cmd|' /C calc'!A0 \"\"quoted\"\"; semicolon\"");
        assertThat(csv).doesNotContain("\"=HYPERLINK").doesNotContain("\"+cmd");
    }
}
