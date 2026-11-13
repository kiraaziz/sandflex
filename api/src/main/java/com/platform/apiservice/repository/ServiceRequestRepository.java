package com.platform.apiservice.repository;

import com.platform.apiservice.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);

    Optional<ServiceRequest> findByIdAndApplicationId(Long id, Long applicationId);

    Optional<ServiceRequest> findByApplicationIdAndIdempotencyKey(
            Long applicationId, String idempotencyKey);
}