package com.platform.apiservice.dto;

import com.platform.apiservice.model.StatutDemande;

import java.time.LocalDateTime;

public record RequestEventResponse(
        StatutDemande ancienStatut,
        StatutDemande nouveauStatut,
        String motif,
        LocalDateTime createdAt
) {}