package com.platform.apiservice.dto;

import java.time.LocalDateTime;

public record ApiKeyResponse(
        Long id,
        String prefix,
        String statut,
        LocalDateTime expiresAt,
        LocalDateTime createdAt
) {}