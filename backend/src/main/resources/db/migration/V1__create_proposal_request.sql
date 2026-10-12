CREATE TABLE proposal_request (
    id               UUID PRIMARY KEY,
    full_name        VARCHAR(120)  NOT NULL,
    company          VARCHAR(160)  NOT NULL,
    email            VARCHAR(254)  NOT NULL,
    phone            VARCHAR(40),
    service_area     VARCHAR(40)   NOT NULL,
    project_location VARCHAR(160),
    message          VARCHAR(4000) NOT NULL,
    consent_given    BOOLEAN       NOT NULL,
    language         VARCHAR(5)    NOT NULL DEFAULT 'en',
    status           VARCHAR(20)   NOT NULL DEFAULT 'NEW',
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    CONSTRAINT chk_proposal_consent CHECK (consent_given),
    CONSTRAINT chk_proposal_status  CHECK (status IN ('NEW','IN_REVIEW','RESPONDED','CLOSED')),
    CONSTRAINT chk_proposal_area    CHECK (service_area IN
        ('FACILITY_MANAGEMENT','PROPERTY_MANAGEMENT','WASTE_MANAGEMENT','SUPPLIES_PROCUREMENT','MOBILISATION','OTHER'))
);

CREATE INDEX idx_proposal_request_created_at ON proposal_request (created_at DESC);
CREATE INDEX idx_proposal_request_status ON proposal_request (status);
