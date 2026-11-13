package com.platform.apiservice.service;

import com.platform.apiservice.dto.ApplicationAuthentifiee;
import com.platform.apiservice.model.ApiKey;
import com.platform.apiservice.model.Application;
import com.platform.apiservice.repository.ApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApiKeyAuthService {

    private final ApiKeyRepository apiKeyRepository;
    private final ApiKeyGenerator generator;

    @Transactional(readOnly = true)
    public ApplicationAuthentifiee verifier(String cle) {
        if (cle == null || !cle.startsWith("pk_")) {
            throw refuser();
        }
        String[] morceaux = cle.split("_", 3);
        if (morceaux.length != 3) {
            throw refuser();
        }

        ApiKey apiKey = apiKeyRepository.findByPrefix(morceaux[1])
                .orElseThrow(this::refuser);

        byte[] recu = generator.hasher(cle).getBytes(StandardCharsets.UTF_8);
        byte[] attendu = apiKey.getKeyHash().getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(recu, attendu)) {
            throw refuser();
        }

        Application application = apiKey.getApplication();
        boolean expiree = apiKey.getExpiresAt() != null
                && apiKey.getExpiresAt().isBefore(LocalDateTime.now());
        if (!"ACTIVE".equals(apiKey.getStatut())
                || expiree
                || !"ACTIVE".equals(application.getStatut())) {
            throw refuser();
        }

        return new ApplicationAuthentifiee(application.getId(), application.getNom());
    }

    private ResponseStatusException refuser() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Clé API invalide");
    }
}