package com.jwcunha.website.contact;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RequestNoteRepository extends JpaRepository<RequestNote, UUID> {

    List<RequestNote> findByRequestIdOrderByCreatedAtAsc(UUID requestId);

    List<RequestNote> findByRequestIdInOrderByCreatedAtAsc(Collection<UUID> requestIds);

    Optional<RequestNote> findByIdAndRequestId(UUID id, UUID requestId);

    long countByRequestId(UUID requestId);

    @Query("select n.requestId, count(n) from RequestNote n where n.requestId in :ids group by n.requestId")
    List<Object[]> countByRequestIds(@Param("ids") Collection<UUID> ids);
}
