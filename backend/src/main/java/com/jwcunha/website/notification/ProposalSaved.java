package com.jwcunha.website.notification;

import java.util.UUID;

/** Published inside the submission transaction; consumers run only after it has committed. */
public record ProposalSaved(UUID proposalId) {
}
