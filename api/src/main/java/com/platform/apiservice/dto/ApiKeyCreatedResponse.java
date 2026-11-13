package com.platform.apiservice.dto;

import java.time.LocalDateTime;

public record ApiKeyCreatedResponse(
        Long id,
        String cle,
        String prefix,
        LocalDateTime createdAt
) {}