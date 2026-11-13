package com.platform.apiservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"application_id", "idempotency_key"}))
@Getter
@Setter
@NoArgsConstructor
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "application_id")
    private Application application;

    @Column(nullable = false)
    private String titre;

    @Column(nullable = false)
    private Long montantMillimes;

    private Long fournisseurId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutDemande statut = StatutDemande.SOUMISE;

    private String idempotencyKey;

    private int niveauxRequis;

    private boolean signalee;
    @Column(columnDefinition = "TEXT")
    private String raisons;

    @Column(columnDefinition = "TEXT")
    private String avisIa;
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}