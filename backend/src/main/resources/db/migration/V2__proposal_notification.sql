-- Tracks the e-mail notification sent to the company for each proposal request.
-- Rows that already exist were created before notifications existed: they are marked DISABLED so that
-- enabling e-mail later never floods the mailbox with old requests.
ALTER TABLE proposal_request
    ADD COLUMN notification_status   VARCHAR(16) NOT NULL DEFAULT 'DISABLED',
    ADD COLUMN notification_attempts INTEGER     NOT NULL DEFAULT 0,
    ADD COLUMN notified_at           TIMESTAMPTZ,
    ADD COLUMN notification_error    VARCHAR(300);

ALTER TABLE proposal_request ALTER COLUMN notification_status SET DEFAULT 'PENDING';

ALTER TABLE proposal_request
    ADD CONSTRAINT chk_proposal_notification_status
    CHECK (notification_status IN ('PENDING','SENT','FAILED','DISABLED'));

CREATE INDEX idx_proposal_request_notification ON proposal_request (notification_status, created_at);
