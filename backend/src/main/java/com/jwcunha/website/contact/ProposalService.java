package com.jwcunha.website.contact;

import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jwcunha.website.notification.ProposalNotifier;
import com.jwcunha.website.notification.ProposalSaved;

@Service
public class ProposalService {

    private final ProposalRequestRepository repository;
    private final ApplicationEventPublisher events;
    private final ProposalNotifier notifier;

    public ProposalService(ProposalRequestRepository repository, ApplicationEventPublisher events,
            ProposalNotifier notifier) {
        this.repository = repository;
        this.events = events;
        this.notifier = notifier;
    }

    /** Persists and flushes inside the transaction; the receipt exists only if the insert committed. */
    @Transactional
    public ProposalReceipt submit(ProposalRequestDto dto) {
        var entity = new ProposalRequest(
                dto.fullName().trim(),
                dto.company().trim(),
                dto.email().trim().toLowerCase(),
                blankToNull(dto.phone()),
                dto.serviceArea(),
                blankToNull(dto.projectLocation()),
                dto.message().trim(),
                dto.consent(),
                dto.language() == null || dto.language().isBlank() ? "en" : dto.language());
        entity.startNotification(notifier.enabled());
        var saved = repository.saveAndFlush(entity);
        events.publishEvent(new ProposalSaved(saved.getId())); // delivered only after this transaction commits
        return new ProposalReceipt(saved.getId(), saved.getCreatedAt());
    }

    @Transactional(readOnly = true)
    public Page<ProposalRequestView> list(Pageable pageable) {
        return repository.findAll(pageable).map(ProposalRequestView::from);
    }

    @Transactional(readOnly = true)
    public ProposalRequestView get(UUID id) {
        return ProposalRequestView.from(find(id));
    }

    @Transactional
    public ProposalRequestView updateStatus(UUID id, RequestStatus status) {
        var entity = find(id);
        entity.changeStatus(status);
        return ProposalRequestView.from(repository.saveAndFlush(entity));
    }

    private ProposalRequest find(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found."));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
