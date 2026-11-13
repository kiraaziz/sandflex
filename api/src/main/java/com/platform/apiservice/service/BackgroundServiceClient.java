package com.platform.apiservice.service;

import com.platform.apiservice.dto.EvaluationRequest;
import com.platform.apiservice.dto.EvaluationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class BackgroundServiceClient {

    private final RestClient restClient;

    public BackgroundServiceClient(
            @Value("${background.service.url}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public EvaluationResponse evaluer(EvaluationRequest request) {
        return restClient.post()
                .uri("/api/evaluations")
                .body(request)
                .retrieve()
                .body(EvaluationResponse.class);
    }
}