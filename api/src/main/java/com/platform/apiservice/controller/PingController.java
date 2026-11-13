package com.platform.apiservice.controller;

import com.platform.apiservice.dto.ApplicationAuthentifiee;
import com.platform.apiservice.security.ApiKeyInterceptor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/v1")
public class PingController {

    @GetMapping("/ping")
    public Map<String, Object> ping(
            @RequestAttribute(ApiKeyInterceptor.ATTRIBUT_APPLICATION)
            ApplicationAuthentifiee application) {
        return Map.of(
                "message", "Clé valide",
                "applicationId", application.id(),
                "application", application.nom());
    }
}