package com.jwcunha.website.admin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestNote;
import com.jwcunha.website.contact.RequestStatus;
import com.jwcunha.website.contact.ServiceArea;

import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

/** Optional filters of the administrative list and export. Every field may be null. */
public record RequestFilter(RequestStatus status, ServiceArea service, String q) {

    public Specification<ProposalRequest> toSpecification() {
        return (root, query, cb) -> {
            List<Predicate> all = new ArrayList<>();
            if (status != null) {
                all.add(cb.equal(root.get("status"), status));
            }
            if (service != null) {
                all.add(cb.equal(root.get("serviceArea"), service));
            }
            if (q != null && !q.isBlank()) {
                String like = "%" + escapeLike(q.trim().toLowerCase()) + "%";
                Subquery<Long> inNotes = query.subquery(Long.class);
                Root<RequestNote> note = inNotes.from(RequestNote.class);
                inNotes.select(cb.literal(1L)).where(cb.equal(note.get("requestId"), root.get("id")),
                        cb.like(cb.lower(note.get("body")), like, '\\'));
                all.add(cb.or(
                        cb.exists(inNotes),
                        cb.like(cb.lower(root.get("fullName")), like, '\\'),
                        cb.like(cb.lower(root.get("company")), like, '\\'),
                        cb.like(cb.lower(root.get("email")), like, '\\'),
                        cb.like(cb.lower(root.get("projectLocation")), like, '\\'),
                        cb.like(cb.lower(root.get("message")), like, '\\')));
            }
            return cb.and(all.toArray(Predicate[]::new));
        };
    }

    /** Search text is data: % and _ must not act as wildcards. */
    private static String escapeLike(String s) {
        return s.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_");
    }
}
