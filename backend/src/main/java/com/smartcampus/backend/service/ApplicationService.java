package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.entity.ApplicationStatus;
import com.smartcampus.backend.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public Application createApplication(Application application) {
        application.setStatus(ApplicationStatus.PENDING);
        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    public List<Application> getApplicationsByStudent(
            String studentEmail) {

        return applicationRepository
                .findByStudentEmail(studentEmail);
    }

    public List<Application> getApplicationsByOpportunity(
            Long opportunityId) {

        return applicationRepository
                .findByOpportunityId(opportunityId);
    }

    public Application updateApplicationStatus(
            Long id,
            String status) {

        Application application = getApplicationById(id);

        ApplicationStatus newStatus;

        try {
            newStatus = ApplicationStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "Invalid application status. " +
                    "Allowed values: PENDING, ACCEPTED, REJECTED"
            );
        }

        application.setStatus(newStatus);

        return applicationRepository.save(application);
    }

    public void deleteApplication(Long id) {
        Application application = getApplicationById(id);
        applicationRepository.delete(application);
    }
}