package com.platform.apiservice.dto;

import jakarta.validation.constraints.NotBlank;

public record ApplicationRequest(
        @NotBlank(message = "Le nom est obligatoire") String nom,
        String webhookUrl,
        Long entrepriseId
) {}