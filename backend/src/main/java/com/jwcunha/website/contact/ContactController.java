package com.jwcunha.website.contact;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
public class ContactController {

    private final ProposalService service;

    public ContactController(ProposalService service) {
        this.service = service;
    }

    @PostMapping("/api/contact")
    @ResponseStatus(HttpStatus.CREATED)
    public ProposalReceipt submit(@Valid @RequestBody ProposalRequestDto dto) {
        return service.submit(dto);
    }
}
