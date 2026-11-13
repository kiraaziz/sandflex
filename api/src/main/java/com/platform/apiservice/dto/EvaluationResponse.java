package com.platform.apiservice.dto;

public record EvaluationResponse(
        Long demandeId,
        int niveauxRequis,
        boolean signalee,
        String raisons,
        String avisIa
) {}