package com.jwcunha.website.contact;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProposalRequestRepository extends JpaRepository<ProposalRequest, UUID> {
}
