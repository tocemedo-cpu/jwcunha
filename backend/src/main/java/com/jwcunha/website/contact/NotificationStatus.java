package com.jwcunha.website.contact;

/** State of the e-mail notification to the company for one proposal request. */
public enum NotificationStatus {
    /** Waiting to be sent (or to be retried). */
    PENDING,
    SENT,
    /** The last attempt failed; it is retried automatically until the attempt limit is reached. */
    FAILED,
    /** E-mail notifications were off when the request arrived (or the request predates them). */
    DISABLED
}
