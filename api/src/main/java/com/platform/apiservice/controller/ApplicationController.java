package com.platform.apiservice.controller;

import com.platform.apiservice.dto.ApplicationRequest;
import com.platform.apiservice.dto.ApplicationUpdateRequest;
import com.platform.apiservice.model.Application;
import com.platform.apiservice.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Application creer(@Valid @RequestBody ApplicationRequest request) {
        return service.creer(request);
    }

    @GetMapping
    public List<Application> lister() {
        return service.lister();
    }

    @GetMapping("/{id}")
    public Application voir(@PathVariable Long id) {
        return service.voir(id);
    }

    @PutMapping("/{id}")
    public Application modifier(@PathVariable Long id,
                                @Valid @RequestBody ApplicationUpdateRequest request) {
        return service.modifier(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactiver(@PathVariable Long id) {
        service.desactiver(id);
    }
    @PutMapping("/{id}/reactiver")
    public void reactiver(@PathVariable Long id) {
        service.reactiver(id);
    }
}