package com.platform.apiservice.repository;

import com.platform.apiservice.model.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    Optional<ApiKey> findByPrefix(String prefix);

    List<ApiKey> findByApplicationId(Long applicationId);

    Optional<ApiKey> findByIdAndApplicationId(Long id, Long applicationId);
}