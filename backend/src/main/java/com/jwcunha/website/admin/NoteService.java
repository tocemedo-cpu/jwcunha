package com.jwcunha.website.admin;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jwcunha.website.contact.ProposalRequestRepository;
import com.jwcunha.website.contact.RequestNote;
import com.jwcunha.website.contact.RequestNoteRepository;

@Service
public class NoteService {

    private final RequestNoteRepository notes;
    private final ProposalRequestRepository requests;

    public NoteService(RequestNoteRepository notes, ProposalRequestRepository requests) {
        this.notes = notes;
        this.requests = requests;
    }

    @Transactional(readOnly = true)
    public List<NoteView> list(UUID requestId) {
        requireRequest(requestId);
        return notes.findByRequestIdOrderByCreatedAtAsc(requestId).stream().map(NoteView::from).toList();
    }

    @Transactional
    public NoteView add(UUID requestId, String author, String body) {
        requireRequest(requestId);
        return NoteView.from(notes.saveAndFlush(new RequestNote(requestId, author, body.trim())));
    }

    @Transactional
    public void delete(UUID requestId, UUID noteId) {
        var note = notes.findByIdAndRequestId(noteId, requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Note not found."));
        notes.delete(note);
    }

    private void requireRequest(UUID requestId) {
        if (!requests.existsById(requestId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found.");
        }
    }
}
