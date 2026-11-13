package com.platform.apiservice.controller;

import com.platform.apiservice.dto.ApplicationAuthentifiee;
import com.platform.apiservice.dto.RequestEventResponse;
import com.platform.apiservice.dto.ServiceRequestCreate;
import com.platform.apiservice.dto.ServiceRequestResponse;
import com.platform.apiservice.security.ApiKeyInterceptor;
import com.platform.apiservice.service.ServiceRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/requests")
@RequiredArgsConstructor
public class ServiceRequestController {

    private final ServiceRequestService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequestResponse soumettre(
            @RequestAttribute(ApiKeyInterceptor.ATTRIBUT_APPLICATION)
            ApplicationAuthentifiee application,
            @RequestHeader(value = "Idempotency-Key", required = false)
            String idempotencyKey,
            @Valid @RequestBody ServiceRequestCreate request) {
        return service.soumettre(application.id(), request, idempotencyKey);
    }

    @GetMapping("/{id}")
    public ServiceRequestResponse voir(
            @RequestAttribute(ApiKeyInterceptor.ATTRIBUT_APPLICATION)
            ApplicationAuthentifiee application,
            @PathVariable Long id) {
        return service.voir(application.id(), id);
    }

    @GetMapping("/{id}/events")
    public List<RequestEventResponse> historique(
            @RequestAttribute(ApiKeyInterceptor.ATTRIBUT_APPLICATION)
            ApplicationAuthentifiee application,
            @PathVariable Long id) {
        return service.historique(application.id(), id);
    }

    @GetMapping
    public List<ServiceRequestResponse> lister(
            @RequestAttribute(ApiKeyInterceptor.ATTRIBUT_APPLICATION)
            ApplicationAuthentifiee application) {
        return service.lister(application.id());
    }
}