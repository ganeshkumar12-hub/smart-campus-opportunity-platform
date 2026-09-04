package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    List<Application> findByStudentEmail(String studentEmail);

    List<Application> findByOpportunityId(Long opportunityId);
}