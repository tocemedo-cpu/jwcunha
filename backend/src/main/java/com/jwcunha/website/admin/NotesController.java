package com.jwcunha.website.admin;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

/** Internal notes of a request. Admin only (SecurityConfig); the author is always the signed-in account. */
@RestController
@RequestMapping("/api/admin/requests/{requestId}/notes")
public class NotesController {

    private final NoteService service;

    public NotesController(NoteService service) {
        this.service = service;
    }

    @GetMapping
    public List<NoteView> list(@PathVariable UUID requestId) {
        return service.list(requestId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NoteView add(@PathVariable UUID requestId, @Valid @RequestBody NoteCreate body, Principal principal) {
        return service.add(requestId, principal.getName(), body.body());
    }

    @DeleteMapping("/{noteId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID requestId, @PathVariable UUID noteId) {
        service.delete(requestId, noteId);
    }
}
