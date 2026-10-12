package com.jwcunha.website.admin;

import com.jwcunha.website.contact.RequestStatus;

import jakarta.validation.constraints.NotNull;

public record StatusUpdate(@NotNull(message = "Status is required.") RequestStatus status) {
}
