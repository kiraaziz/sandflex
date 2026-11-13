package com.platform.apiservice.repository;

import com.platform.apiservice.model.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
}