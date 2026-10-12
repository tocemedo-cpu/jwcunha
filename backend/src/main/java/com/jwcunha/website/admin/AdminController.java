package com.jwcunha.website.admin;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jwcunha.website.contact.ProposalRequestView;
import com.jwcunha.website.contact.ProposalService;

import jakarta.validation.Valid;

/** Administrative API. Access is restricted to ROLE_ADMIN in SecurityConfig. */
@RestController
@RequestMapping("/api/admin/requests")
public class AdminController {

    private final ProposalService service;

    public AdminController(ProposalService service) {
        this.service = service;
    }

    @GetMapping
    public Page<ProposalRequestView> list(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageable = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return service.list(pageable);
    }

    @GetMapping("/{id}")
    public ProposalRequestView get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PatchMapping("/{id}/status")
    public ProposalRequestView updateStatus(@PathVariable UUID id, @Valid @RequestBody StatusUpdate body) {
        return service.updateStatus(id, body.status());
    }
}
