package com.jwcunha.website.notification;

import java.time.Duration;
import java.time.Instant;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.jwcunha.website.contact.ProposalRequestRepository;
import com.jwcunha.website.contact.RequestStatus;

/**
 * Reminds the team, by e-mail, of proposal requests still in status NEW after a number of hours. One digest per run
 * (weekday mornings by default); nothing is sent when nothing is pending, and nothing is stored: if sending fails,
 * the next run simply tries again. Needs the same e-mail configuration as the new-request alerts.
 */
@Service
public class ReminderService {

    private static final Logger log = LoggerFactory.getLogger(ReminderService.class);
    static final int DEFAULT_AFTER_HOURS = 48;
    static final int LISTED = 20;

    private final ProposalRequestRepository repository;
    private final ProposalNotifier notifier;
    private final long afterHours;

    public ReminderService(ProposalRequestRepository repository, ProposalNotifier notifier,
            @Value("${app.reminder.after-hours:}") String afterHours) {
        this.repository = repository;
        this.notifier = notifier;
        this.afterHours = parse(afterHours);
    }

    /** Blank means the default; 0 turns reminders off; anything unreadable falls back to the default. */
    public static long parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return DEFAULT_AFTER_HOURS;
        }
        try {
            return Math.max(0, Long.parseLong(raw.trim()));
        } catch (NumberFormatException e) {
            log.warn("REMINDER_AFTER_HOURS is not a number; using {} hours.", DEFAULT_AFTER_HOURS);
            return DEFAULT_AFTER_HOURS;
        }
    }

    @Scheduled(cron = "${app.reminder.cron:0 0 8 * * MON-FRI}", zone = "Africa/Luanda")
    public void scheduled() {
        remind(Instant.now());
    }

    /** Sends the digest if anything is overdue. Returns whether an e-mail went out. */
    public boolean remind(Instant now) {
        if (afterHours == 0 || !notifier.enabled()) {
            return false;
        }
        Instant cutoff = now.minus(Duration.ofHours(afterHours));
        long total = repository.countByStatusAndCreatedAtBefore(RequestStatus.NEW, cutoff);
        if (total == 0) {
            return false;
        }
        var shown = repository.findStaleByStatus(RequestStatus.NEW, cutoff, PageRequest.of(0, LISTED));
        try {
            notifier.sendReminder(shown, total, afterHours);
            log.info("Reminder sent: {} request(s) still new after {} h.", total, afterHours);
            return true;
        } catch (Exception e) {
            log.warn("Reminder not sent (will try again at the next run): {}", e.toString());
            return false;
        }
    }
}
