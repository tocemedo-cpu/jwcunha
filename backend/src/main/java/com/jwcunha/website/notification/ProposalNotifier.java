package com.jwcunha.website.notification;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.jwcunha.website.config.AppProperties;
import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.ServiceArea;

import jakarta.annotation.PostConstruct;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

/**
 * Builds and sends the plain-text e-mail that tells the company about a new proposal request.
 * Visitor-supplied text only ever goes into the body (never into headers, except a sanitised subject and a
 * validated Reply-To address), so it cannot inject headers or markup.
 */
@Component
public class ProposalNotifier {

    private static final Logger log = LoggerFactory.getLogger(ProposalNotifier.class);
    private static final DateTimeFormatter WHEN =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm 'UTC'").withZone(ZoneId.of("UTC"));
    private static final Map<ServiceArea, String> SERVICE_LABEL = Map.of(
            ServiceArea.FACILITY_MANAGEMENT, "Facility Management",
            ServiceArea.PROPERTY_MANAGEMENT, "Property Management",
            ServiceArea.WASTE_MANAGEMENT, "Waste Management",
            ServiceArea.SUPPLIES_PROCUREMENT, "Produtos e Fornecimentos",
            ServiceArea.MOBILISATION, "Mobilização",
            ServiceArea.OTHER, "Outro / não tem a certeza");

    private final AppProperties.Mail config;
    private final ObjectProvider<JavaMailSender> sender;
    private final String smtpHost;
    private final List<String> recipients;

    public ProposalNotifier(AppProperties props, ObjectProvider<JavaMailSender> sender,
            @Value("${spring.mail.host:}") String smtpHost) {
        this.config = props.mail();
        this.sender = sender;
        this.smtpHost = smtpHost == null ? "" : smtpHost.trim();
        this.recipients = config == null || config.to() == null ? List.of()
                : config.to().stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
    }

    @PostConstruct
    void warnIfMisconfigured() {
        if (config != null && config.isEnabled() && !isConfigured()) {
            log.warn("MAIL_ENABLED is true but mail is not fully configured (need MAIL_HOST, MAIL_FROM and "
                    + "MAIL_NOTIFY_TO): notifications are off.");
        } else if (isConfigured()) {
            log.info("E-mail notifications are on: {} recipient(s) via {}.", recipients.size(), smtpHost);
        }
    }

    /** True only when enabled AND SMTP host, sender and at least one recipient are set. */
    public boolean enabled() {
        return config != null && config.isEnabled() && isConfigured();
    }

    private boolean isConfigured() {
        return !smtpHost.isEmpty() && config != null && config.from() != null && !config.from().isBlank()
                && !recipients.isEmpty() && sender.getIfAvailable() != null;
    }

    /** Sends the notification; throws on any failure so the caller can record it and retry. */
    public void send(ProposalRequest r) throws Exception {
        JavaMailSender mailSender = sender.getObject();
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");
        helper.setFrom(config.from().trim());
        helper.setTo(recipients.toArray(String[]::new));
        helper.setSubject(subject(r));
        try {
            helper.setReplyTo(new InternetAddress(oneLine(r.getEmail()), false));
        } catch (Exception invalidReplyTo) {
            log.warn("Reply-To omitted for request {}: address not accepted.", r.getId());
        }
        helper.setText(body(r), false);
        mailSender.send(message);
    }

    String subject(ProposalRequest r) {
        return oneLine("[Site] Novo pedido de proposta – " + r.getCompany() + " – " + label(r.getServiceArea()));
    }

    String body(ProposalRequest r) {
        return """
            Novo pedido de proposta recebido através do site.

            Referência:  %s
            Recebido em: %s
            Serviço:     %s
            Idioma:      %s

            Nome:        %s
            Empresa:     %s
            Email:       %s
            Telefone:    %s
            Local:       %s

            Mensagem:
            %s

            --
            Para responder, basta usar "Responder" neste email: a resposta segue para %s.
            O pedido está guardado na base de dados e pode ser consultado pela API de administração.
            """.formatted(r.getId(), WHEN.format(r.getCreatedAt()), label(r.getServiceArea()), r.getLanguage(),
                r.getFullName(), r.getCompany(), r.getEmail(), orDash(r.getPhone()), orDash(r.getProjectLocation()),
                r.getMessage(), r.getEmail());
    }

    private static String label(ServiceArea area) {
        return SERVICE_LABEL.getOrDefault(area, area.name());
    }

    private static String orDash(String s) {
        return s == null || s.isBlank() ? "—" : s;
    }

    /** Collapses every control character (CR, LF, tabs...) so a value cannot break out of a header line. */
    static String oneLine(String s) {
        return s == null ? "" : s.replaceAll("\\p{Cntrl}+", " ").trim();
    }
}
