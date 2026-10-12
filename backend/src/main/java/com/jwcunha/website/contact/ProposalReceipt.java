package com.jwcunha.website.contact;

import java.time.Instant;
import java.util.UUID;

/** Returned to the public only after the row has been committed. */
public record ProposalReceipt(UUID reference, Instant receivedAt) {
}
