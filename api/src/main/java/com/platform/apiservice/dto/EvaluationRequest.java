package com.platform.apiservice.dto;

public record EvaluationRequest(
        Long demandeId,
        Long entrepriseId,
        Long montantMillimes,
        Long fournisseurId,
        String titre
) {}