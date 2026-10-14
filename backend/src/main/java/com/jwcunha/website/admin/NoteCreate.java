package com.jwcunha.website.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record NoteCreate(
        @NotBlank(message = "The note cannot be empty.")
        @Size(max = 2000, message = "The note is too long (max 2000 characters).")
        String body) {
}
