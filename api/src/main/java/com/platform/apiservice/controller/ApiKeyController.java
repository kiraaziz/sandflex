package com.platform.apiservice.controller;

import com.platform.apiservice.dto.ApiKeyCreatedResponse;
import com.platform.apiservice.dto.ApiKeyResponse;
import com.platform.apiservice.service.ApiKeyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications/{applicationId}/api-keys")
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiKeyCreatedResponse creer(@PathVariable Long applicationId) {
        return service.creer(applicationId);
    }

    @GetMapping
    public List<ApiKeyResponse> lister(@PathVariable Long applicationId) {
        return service.lister(applicationId);
    }

    @DeleteMapping("/{cleId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void revoquer(@PathVariable Long applicationId, @PathVariable Long cleId) {
        service.revoquer(applicationId, cleId);
    }
}