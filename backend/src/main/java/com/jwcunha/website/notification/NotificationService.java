package com.jwcunha.website.notification;

import java.time.Duration;
import java.time.Instant;
import java.util.EnumSet;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.jwcunha.website.config.AppProperties;
import com.jwcunha.website.contact.NotificationStatus;
import com.jwcunha.website.contact.ProposalRequestRepository;

/**
 * Sends the notification after the proposal has been committed, in the background, so a slow or broken mail server
 * can never delay or fail a submission. Anything not sent is retried on a schedule until the attempt limit.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    private static final Duration RETRY_WINDOW = Duration.ofDays(7);

    private final ProposalRequestRepository repository;
    private final ProposalNotifier notifier;
    private final AppProperties.Mail config;

    public NotificationService(ProposalRequestRepository repository, ProposalNotifier notifier, AppProperties props) {
        this.repository = repository;
        this.notifier = notifier;
        this.config = props.mail();
    }

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProposalSaved(ProposalSaved event) {
        dispatch(event.proposalId());
    }

    /** One attempt for one request. Never throws: the outcome is recorded on the row. */
    public void dispatch(UUID id) {
        if (!notifier.enabled()) {
            return;
        }
        var request = repository.findById(id).orElse(null);
        if (request == null || (request.getNotificationStatus() != NotificationStatus.PENDING
                && request.getNotificationStatus() != NotificationStatus.FAILED)) {
            return;
        }
        try {
            notifier.send(request);
            repository.recordNotificationAttempt(id, NotificationStatus.SENT, Instant.now(), null);
            log.info("Notification sent for proposal {}.", id);
        } catch (Exception e) {
            String error = (e.getClass().getSimpleName() + ": " + e.getMessage());
            repository.recordNotificationAttempt(id, NotificationStatus.FAILED, null,
                    error.length() > 300 ? error.substring(0, 300) : error);
            log.warn("Notification failed for proposal {} (attempt {}): {}", id,
                    request.getNotificationAttempts() + 1, e.toString());
        }
    }

    /** Retries notifications that are still owed (failed, or lost to a restart between commit and send). */
    @Scheduled(fixedDelayString = "${app.mail.retry-delay-ms:300000}",
            initialDelayString = "${app.mail.retry-delay-ms:300000}")
    public void retryPending() {
        if (!notifier.enabled()) {
            return;
        }
        Instant now = Instant.now();
        var due = repository.findNotificationsToRetry(
                EnumSet.of(NotificationStatus.PENDING, NotificationStatus.FAILED), config.maxAttempts(),
                now.minusSeconds(config.retryMinAgeSeconds()), now.minus(RETRY_WINDOW), PageRequest.of(0, 20));
        due.forEach(r -> dispatch(r.getId()));
    }
}
