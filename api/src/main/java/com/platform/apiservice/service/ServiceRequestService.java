
package com.platform.apiservice.service;
import com.platform.apiservice.dto.EvaluationRequest;
import com.platform.apiservice.dto.EvaluationResponse;
import com.platform.apiservice.dto.RequestEventResponse;
import com.platform.apiservice.dto.ServiceRequestCreate;
import com.platform.apiservice.dto.ServiceRequestResponse;
import com.platform.apiservice.model.Application;
import com.platform.apiservice.model.RequestEvent;
import com.platform.apiservice.model.ServiceRequest;
import com.platform.apiservice.model.StatutDemande;
import com.platform.apiservice.repository.ApplicationRepository;
import com.platform.apiservice.repository.RequestEventRepository;
import com.platform.apiservice.repository.ServiceRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ServiceRequestService {

    private final ServiceRequestRepository repository;
    private final ApplicationRepository applicationRepository;
    private final RequestEventRepository eventRepository;
    private final TransactionTemplate transactionTemplate;
    private final BackgroundServiceClient backgroundServiceClient;

    public ServiceRequestResponse soumettre(Long applicationId,
                                            ServiceRequestCreate request,
                                            String idempotencyKey) {
        String cle = (idempotencyKey == null || idempotencyKey.isBlank())
                ? null : idempotencyKey.trim();

        if (cle != null) {
            Optional<ServiceRequest> existante = repository
                    .findByApplicationIdAndIdempotencyKey(applicationId, cle);
            if (existante.isPresent()) {
                return rejouer(existante.get(), request);
            }
        }

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Application introuvable"));

        ServiceRequest demande = new ServiceRequest();
        demande.setApplication(application);
        demande.setTitre(request.titre());
        demande.setMontantMillimes(request.montantMillimes());
        demande.setFournisseurId(request.fournisseurId());
        demande.setIdempotencyKey(cle);

        try {
            transactionTemplate.executeWithoutResult(tx -> {
                repository.save(demande);
                enregistrerEvenement(demande, null,
                        StatutDemande.SOUMISE, "Demande soumise");
            });
        } catch (DataIntegrityViolationException e) {
            if (cle == null) {
                throw e;
            }
            ServiceRequest existante = repository
                    .findByApplicationIdAndIdempotencyKey(applicationId, cle)
                    .orElseThrow(() -> e);
            return rejouer(existante, request);
        }

        EvaluationRequest evaluationRequest = new EvaluationRequest(
                demande.getId(),
                application.getEntrepriseId(),
                demande.getMontantMillimes(),
                demande.getFournisseurId(),
                demande.getTitre()
        );

        EvaluationResponse evaluationResponse =
                backgroundServiceClient.evaluer(evaluationRequest);

        demande.setNiveauxRequis(evaluationResponse.niveauxRequis());
        demande.setSignalee(evaluationResponse.signalee());
        demande.setRaisons(evaluationResponse.raisons());
        demande.setAvisIa(evaluationResponse.avisIa());

        repository.save(demande);

        return versReponse(demande);
    }

    public ServiceRequestResponse voir(Long applicationId, Long demandeId) {
        return versReponse(trouver(applicationId, demandeId));
    }

    public List<ServiceRequestResponse> lister(Long applicationId) {
        return repository.findByApplicationIdOrderByCreatedAtDesc(applicationId)
                .stream()
                .map(this::versReponse)
                .toList();
    }

    public List<RequestEventResponse> historique(Long applicationId, Long demandeId) {
        ServiceRequest demande = trouver(applicationId, demandeId);
        return eventRepository
                .findByServiceRequestIdOrderByCreatedAtAsc(demande.getId())
                .stream()
                .map(e -> new RequestEventResponse(
                        e.getAncienStatut(), e.getNouveauStatut(),
                        e.getMotif(), e.getCreatedAt()))
                .toList();
    }

    private ServiceRequest trouver(Long applicationId, Long demandeId) {
        return repository.findByIdAndApplicationId(demandeId, applicationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Demande introuvable"));
    }

    private void enregistrerEvenement(ServiceRequest demande, StatutDemande ancien,
                                      StatutDemande nouveau, String motif) {
        RequestEvent evenement = new RequestEvent();
        evenement.setServiceRequest(demande);
        evenement.setAncienStatut(ancien);
        evenement.setNouveauStatut(nouveau);
        evenement.setMotif(motif);
        eventRepository.save(evenement);
    }

    private ServiceRequestResponse rejouer(ServiceRequest existante,
                                           ServiceRequestCreate request) {
        boolean identique = existante.getTitre().equals(request.titre())
                && existante.getMontantMillimes().equals(request.montantMillimes())
                && Objects.equals(existante.getFournisseurId(), request.fournisseurId());

        if (!identique) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cette clé d'idempotence a déjà été utilisée avec une autre demande");
        }

        return versReponse(existante);
    }

    private ServiceRequestResponse versReponse(ServiceRequest d) {
        return new ServiceRequestResponse(
                d.getId(),
                d.getTitre(),
                d.getMontantMillimes(),
                d.getFournisseurId(),
                d.getStatut(),
                d.getNiveauxRequis(),
                d.isSignalee(),
                d.getRaisons(),
                d.getAvisIa(),
                d.getCreatedAt()
        );

    }

}
