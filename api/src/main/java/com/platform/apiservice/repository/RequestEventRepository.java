package com.platform.apiservice.repository;

import com.platform.apiservice.model.RequestEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestEventRepository extends JpaRepository<RequestEvent, Long> {

    List<RequestEvent> findByServiceRequestIdOrderByCreatedAtAsc(Long serviceRequestId);
}