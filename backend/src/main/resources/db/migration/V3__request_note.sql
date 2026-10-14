-- Internal notes written by the team about a proposal request (who contacted the client, when, what was said).
-- Append-only log; never shown to visitors.
CREATE TABLE request_note (
    id         UUID PRIMARY KEY,
    request_id UUID          NOT NULL REFERENCES proposal_request (id) ON DELETE CASCADE,
    author     VARCHAR(80)   NOT NULL,
    body       VARCHAR(2000) NOT NULL,
    created_at TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT chk_request_note_body CHECK (length(btrim(body)) > 0)
);

CREATE INDEX idx_request_note_request ON request_note (request_id, created_at);
