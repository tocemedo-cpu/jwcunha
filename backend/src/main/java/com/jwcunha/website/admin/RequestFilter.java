package com.jwcunha.website.admin;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.jwcunha.website.contact.ProposalRequest;
import com.jwcunha.website.contact.RequestStatus;
import com.jwcunha.website.contact.ServiceArea;

import jakarta.persistence.criteria.Predicate;

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
                all.add(cb.or(
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
