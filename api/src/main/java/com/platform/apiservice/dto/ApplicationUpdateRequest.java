package com.platform.apiservice.dto;

import jakarta.validation.constraints.NotBlank;

public record ApplicationUpdateRequest(
        @NotBlank(message = "Le nom est obligatoire") String nom,
        String webhookUrl
) {}