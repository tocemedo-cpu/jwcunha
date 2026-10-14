package com.jwcunha.website.contact;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** An internal note about a proposal request. Immutable once written (the history is the point). */
@Entity
@Table(name = "request_note")
public class RequestNote {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "request_id", nullable = false, updatable = false)
    private UUID requestId;

    @Column(nullable = false, updatable = false, length = 80)
    private String author;

    @Column(nullable = false, updatable = false, length = 2000)
    private String body;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    protected RequestNote() {
    }

    public RequestNote(UUID requestId, String author, String body) {
        this.requestId = requestId;
        this.author = author;
        this.body = body;
    }

    public UUID getId() { return id; }
    public UUID getRequestId() { return requestId; }
    public String getAuthor() { return author; }
    public String getBody() { return body; }
    public Instant getCreatedAt() { return createdAt; }
}
