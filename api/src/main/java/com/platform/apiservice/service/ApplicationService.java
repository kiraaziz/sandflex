package com.platform.apiservice.service;

import com.platform.apiservice.dto.ApplicationRequest;
import com.platform.apiservice.dto.ApplicationUpdateRequest;
import com.platform.apiservice.model.Application;
import com.platform.apiservice.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository repository;

    public Application creer(ApplicationRequest request) {
        Application app = new Application();
        app.setNom(request.nom());
        app.setWebhookUrl(request.webhookUrl());
        app.setEntrepriseId(request.entrepriseId());
        return repository.save(app);
    }

    public List<Application> lister() {
        return repository.findAll();
    }

    public Application voir(Long id) {
        return trouver(id);
    }

    public Application modifier(Long id, ApplicationUpdateRequest request) {
        Application app = trouver(id);
        app.setNom(request.nom());
        app.setWebhookUrl(request.webhookUrl());
        return repository.save(app);
    }

    public void desactiver(Long id) {
        Application app = trouver(id);
        app.setStatut("INACTIVE");
        repository.save(app);
    }
    public void reactiver(Long id) {
        Application app = trouver(id);
        app.setStatut("ACTIVE");
        repository.save(app);
    }

    private Application trouver(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application introuvable"));
    }
}