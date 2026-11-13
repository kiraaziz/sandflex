package com.platform.apiservice.service;

import com.platform.apiservice.dto.ApiKeyCreatedResponse;
import com.platform.apiservice.dto.ApiKeyResponse;
import com.platform.apiservice.model.ApiKey;
import com.platform.apiservice.model.Application;
import com.platform.apiservice.repository.ApiKeyRepository;
import com.platform.apiservice.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final ApplicationRepository applicationRepository;
    private final ApiKeyGenerator generator;

    public ApiKeyCreatedResponse creer(Long applicationId) {
        Application application = trouverApplication(applicationId);

        String prefix = generator.genererPrefix();
        String secret = generator.genererSecret();
        String cle = "pk_" + prefix + "_" + secret;

        ApiKey apiKey = new ApiKey();
        apiKey.setApplication(application);
        apiKey.setPrefix(prefix);
        apiKey.setKeyHash(generator.hasher(cle));
        apiKeyRepository.save(apiKey);

        return new ApiKeyCreatedResponse(
                apiKey.getId(), cle, prefix, apiKey.getCreatedAt());
    }

    public List<ApiKeyResponse> lister(Long applicationId) {
        trouverApplication(applicationId);
        return apiKeyRepository.findByApplicationId(applicationId).stream()
                .map(this::versReponse)
                .toList();
    }

    public void revoquer(Long applicationId, Long cleId) {
        ApiKey cle = apiKeyRepository.findByIdAndApplicationId(cleId, applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Clé introuvable"));
        cle.setStatut("REVOQUEE");
        apiKeyRepository.save(cle);
    }

    private Application trouverApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application introuvable"));
    }

    private ApiKeyResponse versReponse(ApiKey cle) {
        return new ApiKeyResponse(
                cle.getId(), cle.getPrefix(), cle.getStatut(),
                cle.getExpiresAt(), cle.getCreatedAt());
    }
}