package com.jwcunha.website.contact;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface ProposalRequestRepository extends JpaRepository<ProposalRequest, UUID> {

    /** Records one notification attempt. {@code notifiedAt} is set only when the e-mail was sent. */
    @Modifying
    @Transactional
    @Query("""
        update ProposalRequest p
           set p.notificationStatus = :status,
               p.notificationAttempts = p.notificationAttempts + 1,
               p.notifiedAt = :notifiedAt,
               p.notificationError = :error
         where p.id = :id
        """)
    int recordNotificationAttempt(@Param("id") UUID id, @Param("status") NotificationStatus status,
            @Param("notifiedAt") Instant notifiedAt, @Param("error") String error);

    /** Requests whose notification is still owed, oldest first. */
    @Query("""
        select p from ProposalRequest p
         where p.notificationStatus in :statuses
           and p.notificationAttempts < :maxAttempts
           and p.createdAt < :olderThan
           and p.createdAt > :newerThan
         order by p.createdAt
        """)
    List<ProposalRequest> findNotificationsToRetry(@Param("statuses") Collection<NotificationStatus> statuses,
            @Param("maxAttempts") int maxAttempts, @Param("olderThan") Instant olderThan,
            @Param("newerThan") Instant newerThan, Pageable pageable);
}
