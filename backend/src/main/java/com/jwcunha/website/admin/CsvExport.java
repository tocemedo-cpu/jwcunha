package com.jwcunha.website.admin;

import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

import com.jwcunha.website.contact.ProposalRequest;

/**
 * CSV for spreadsheets. Semicolon-separated with a UTF-8 BOM, which is what Excel expects in Portuguese locales
 * (and Google Sheets / LibreOffice read fine). Cells starting with = + - @ are prefixed with an apostrophe so a
 * visitor-supplied value can never run as a spreadsheet formula.
 */
final class CsvExport {

    private static final DateTimeFormatter WHEN =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").withZone(ZoneId.of("Africa/Luanda"));
    private static final String[] HEADER = {"Referência", "Recebido em (Luanda)", "Estado", "Nome", "Empresa", "Email",
            "Telefone", "Serviço", "Local do projecto", "Idioma", "Mensagem", "Aviso por email"};

    private CsvExport() {
    }

    static byte[] write(List<ProposalRequest> rows) {
        StringBuilder out = new StringBuilder("\uFEFF");
        line(out, HEADER);
        for (ProposalRequest r : rows) {
            line(out, r.getId().toString(), WHEN.format(r.getCreatedAt()), r.getStatus().name(), r.getFullName(),
                    r.getCompany(), r.getEmail(), r.getPhone(), r.getServiceArea().name(), r.getProjectLocation(),
                    r.getLanguage(), r.getMessage(), r.getNotificationStatus().name());
        }
        return out.toString().getBytes(StandardCharsets.UTF_8);
    }

    private static void line(StringBuilder out, String... cells) {
        for (int i = 0; i < cells.length; i++) {
            if (i > 0) {
                out.append(';');
            }
            out.append(cell(cells[i]));
        }
        out.append("\r\n");
    }

    static String cell(String value) {
        String v = value == null ? "" : value;
        if (!v.isEmpty() && "=+-@\t\r".indexOf(v.charAt(0)) >= 0) {
            v = "'" + v;
        }
        return "\"" + v.replace("\"", "\"\"") + "\"";
    }
}
