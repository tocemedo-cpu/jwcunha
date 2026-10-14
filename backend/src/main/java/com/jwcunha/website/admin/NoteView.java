package com.jwcunha.website.admin;

import java.time.Instant;
import java.util.UUID;

import com.jwcunha.website.contact.RequestNote;

public record NoteView(UUID id, String author, String body, Instant createdAt) {

    public static NoteView from(RequestNote n) {
        return new NoteView(n.getId(), n.getAuthor(), n.getBody(), n.getCreatedAt());
    }
}
