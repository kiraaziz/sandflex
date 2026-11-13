package com.platform.apiservice.dto;

import com.platform.apiservice.model.StatutDemande;

import java.time.LocalDateTime;

public record ServiceRequestResponse(
        Long id,
        String titre,
        Long montantMillimes,
        Long fournisseurId,
        StatutDemande statut,
        int niveauxRequis,
        boolean signalee,
        String raisons,
        String avisIa,
        LocalDateTime createdAt
) {}