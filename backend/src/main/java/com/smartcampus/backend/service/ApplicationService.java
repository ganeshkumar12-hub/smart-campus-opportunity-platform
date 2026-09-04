package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    // Create application
    public Application createApplication(Application application) {

        application.setStatus("PENDING");

        return applicationRepository.save(application);
    }

    // Get all applications
    public List<Application> getAllApplications() {

        return applicationRepository.findAll();
    }

    // Get application by ID
    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    // Get applications by student
    public List<Application> getApplicationsByStudent(
            String studentEmail) {

        return applicationRepository
                .findByStudentEmail(studentEmail);
    }

    // Get applications by opportunity
    public List<Application> getApplicationsByOpportunity(
            Long opportunityId) {

        return applicationRepository
                .findByOpportunityId(opportunityId);
    }

    // Update application status
    public Application updateApplicationStatus(
            Long id,
            String status) {

        Application application =
                getApplicationById(id);

        application.setStatus(status);

        return applicationRepository.save(application);
    }

    // Delete application
    public void deleteApplication(Long id) {

        Application application =
                getApplicationById(id);

        applicationRepository.delete(application);
    }
}