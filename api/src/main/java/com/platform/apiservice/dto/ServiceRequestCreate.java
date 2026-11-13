package com.platform.apiservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ServiceRequestCreate(
        @NotBlank(message = "Le titre est obligatoire") String titre,
        @NotNull(message = "Le montant est obligatoire")
        @Positive(message = "Le montant doit être positif") Long montantMillimes,
        Long fournisseurId
) {}