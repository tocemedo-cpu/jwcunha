package com.jwcunha.website.admin;

import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.jwcunha.website.contact.ProposalRequestView;
import com.jwcunha.website.contact.ProposalService;
import com.jwcunha.website.contact.RequestStatus;
import com.jwcunha.website.contact.ServiceArea;

import jakarta.validation.Valid;

/** Administrative API. Access is restricted to ROLE_ADMIN in SecurityConfig. */
@RestController
@RequestMapping("/api/admin/requests")
public class AdminController {

    private static final int EXPORT_LIMIT = 5000;

    private final ProposalService service;

    public AdminController(ProposalService service) {
        this.service = service;
    }

    @GetMapping
    public Page<ProposalRequestView> list(@RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) ServiceArea serviceArea, @RequestParam(required = false) String q,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return service.list(new RequestFilter(status, serviceArea, q), pageable);
    }

    @GetMapping("/summary")
    public Map<RequestStatus, Long> summary() {
        return service.summary();
    }

    /** CSV of the matching requests (same filters as the list), up to {@value #EXPORT_LIMIT} rows. */
    @GetMapping("/export.csv")
    public ResponseEntity<byte[]> export(@RequestParam(required = false) RequestStatus status,
            @RequestParam(required = false) ServiceArea serviceArea, @RequestParam(required = false) String q) {
        var rows = service.exportRows(new RequestFilter(status, serviceArea, q), EXPORT_LIMIT);
        byte[] csv = CsvExport.write(rows, service.notesFor(rows));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("pedidos-de-proposta.csv").build().toString())
                .contentType(new MediaType("text", "csv", java.nio.charset.StandardCharsets.UTF_8))
                .body(csv);
    }

    @GetMapping("/{id}")
    public ProposalRequestView get(@PathVariable UUID id) {
        return service.get(id);
    }

    /** Permanent deletion (spam, or a data-erasure request from the client). */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PatchMapping("/{id}/status")
    public ProposalRequestView updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusUpdate body) {
        return service.updateStatus(id, body.status());
    }
}
