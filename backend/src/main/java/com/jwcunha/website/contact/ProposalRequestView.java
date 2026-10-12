package com.jwcunha.website.contact;

import java.time.Instant;
import java.util.UUID;

/** Read model for administrators. */
public record ProposalRequestView(UUID id, String fullName, String company, String email, String phone,
        ServiceArea serviceArea, String projectLocation, String message, String language, RequestStatus status,
        Instant createdAt, Instant updatedAt) {

    public static ProposalRequestView from(ProposalRequest r) {
        return new ProposalRequestView(r.getId(), r.getFullName(), r.getCompany(), r.getEmail(), r.getPhone(),
                r.getServiceArea(), r.getProjectLocation(), r.getMessage(), r.getLanguage(), r.getStatus(),
                r.getCreatedAt(), r.getUpdatedAt());
    }
}
