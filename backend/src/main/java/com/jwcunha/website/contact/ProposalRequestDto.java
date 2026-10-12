package com.jwcunha.website.contact;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Public submission payload. {@code website} is a honeypot and must stay empty. */
public record ProposalRequestDto(
        @NotBlank(message = "Full name is required.")
        @Size(max = 120, message = "Full name is too long.")
        String fullName,

        @NotBlank(message = "Company is required.")
        @Size(max = 160, message = "Company name is too long.")
        String company,

        @NotBlank(message = "Email is required.")
        @Email(message = "Enter a valid email address.")
        @Size(max = 254, message = "Email is too long.")
        String email,

        @Size(max = 40, message = "Phone number is too long.")
        @Pattern(regexp = "^[0-9+()\\-.\\s]*$", message = "Phone may contain only digits, spaces and + ( ) - .")
        String phone,

        @NotNull(message = "Select a service area.")
        ServiceArea serviceArea,

        @Size(max = 160, message = "Location is too long.")
        String projectLocation,

        @NotBlank(message = "Please describe your requirement.")
        @Size(min = 20, max = 4000, message = "Message must be between 20 and 4000 characters.")
        String message,

        @AssertTrue(message = "Consent is required to process your request.")
        boolean consent,

        @Pattern(regexp = "^(en|pt)?$", message = "Unsupported language.")
        String language,

        @Size(max = 0, message = "Invalid submission.")
        String website) {
}
