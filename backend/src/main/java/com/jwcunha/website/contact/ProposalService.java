package com.jwcunha.website.contact;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.jwcunha.website.admin.RequestFilter;
import com.jwcunha.website.notification.ProposalNotifier;
import com.jwcunha.website.notification.ProposalSaved;

@Service
public class ProposalService {

    private final ProposalRequestRepository repository;
    private final ApplicationEventPublisher events;
    private final ProposalNotifier notifier;
    private final RequestNoteRepository notes;

    public ProposalService(ProposalRequestRepository repository, ApplicationEventPublisher events,
            ProposalNotifier notifier, RequestNoteRepository notes) {
        this.notes = notes;
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
    public Page<ProposalRequestView> list(RequestFilter filter, Pageable pageable) {
        Page<ProposalRequest> page = repository.findAll(filter.toSpecification(), pageable);
        Map<UUID, Long> counts = new java.util.HashMap<>();
        var ids = page.getContent().stream().map(ProposalRequest::getId).toList();
        if (!ids.isEmpty()) {
            for (Object[] row : notes.countByRequestIds(ids)) {
                counts.put((UUID) row[0], (Long) row[1]);
            }
        }
        return page.map(r -> ProposalRequestView.from(r, counts.getOrDefault(r.getId(), 0L)));
    }

    /** Number of requests per status (every status present, zero when none). */
    @Transactional(readOnly = true)
    public Map<RequestStatus, Long> summary() {
        Map<RequestStatus, Long> out = new EnumMap<>(RequestStatus.class);
        for (RequestStatus s : RequestStatus.values()) {
            out.put(s, 0L);
        }
        for (Object[] row : repository.countByStatus()) {
            out.put((RequestStatus) row[0], (Long) row[1]);
        }
        return out;
    }

    /** Matching requests, newest first, capped so an export can never exhaust memory. */
    @Transactional(readOnly = true)
    public List<ProposalRequest> exportRows(RequestFilter filter, int limit) {
        return repository.findAll(filter.toSpecification(),
                PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"))).getContent();
    }

    /** Internal notes of the given requests, oldest first, for the CSV export. */
    @Transactional(readOnly = true)
    public Map<UUID, List<RequestNote>> notesFor(List<ProposalRequest> rows) {
        Map<UUID, List<RequestNote>> out = new java.util.HashMap<>();
        if (!rows.isEmpty()) {
            notes.findByRequestIdInOrderByCreatedAtAsc(rows.stream().map(ProposalRequest::getId).toList())
                    .forEach(n -> out.computeIfAbsent(n.getRequestId(), k -> new java.util.ArrayList<>()).add(n));
        }
        return out;
    }

    @Transactional(readOnly = true)
    public ProposalRequestView get(UUID id) {
        return ProposalRequestView.from(find(id), notes.countByRequestId(id));
    }

    @Transactional
    public ProposalRequestView updateStatus(UUID id, RequestStatus status) {
        var entity = find(id);
        entity.changeStatus(status);
        return ProposalRequestView.from(repository.saveAndFlush(entity), notes.countByRequestId(id));
    }

    private ProposalRequest find(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Request not found."));
    }

    private static String blankToNull(String s) {
        return s == null || s.isBlank() ? null : s.trim();
    }
}
