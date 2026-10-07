package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.entity.ApplicationStatus;
import com.smartcampus.backend.entity.Opportunity;
import com.smartcampus.backend.repository.ApplicationRepository;
import com.smartcampus.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final OpportunityRepository opportunityRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            OpportunityRepository opportunityRepository) {

        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
    }

    public Application createApplication(
            Application application) {

        /*
         * Check whether the opportunity exists.
         */
        Opportunity opportunity =
                opportunityRepository
                        .findById(application.getOpportunityId())
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Opportunity not found"
                                ));

        /*
         * Check duplicate application.
         */
        boolean alreadyApplied =
                applicationRepository
                        .existsByOpportunityIdAndStudentEmail(
                                application.getOpportunityId(),
                                application.getStudentEmail()
                        );

        if (alreadyApplied) {
            throw new IllegalArgumentException(
                    "You have already applied for this opportunity"
            );
        }

        /*
         * Check opportunity deadline.
         */
        try {

            LocalDate deadline =
                    LocalDate.parse(
                            opportunity.getDeadline()
                    );

            if (deadline.isBefore(LocalDate.now())) {

                throw new IllegalArgumentException(
                        "The application deadline has passed"
                );
            }

        } catch (java.time.format.DateTimeParseException e) {

            throw new IllegalArgumentException(
                    "Invalid opportunity deadline format"
            );
        }

        /*
         * Everything is valid.
         */
        application.setStatus(
                ApplicationStatus.PENDING
        );

        return applicationRepository.save(application);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Application not found"
                        ));
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

        Application application =
                getApplicationById(id);

        ApplicationStatus newStatus;

        try {

            newStatus =
                    ApplicationStatus.valueOf(
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

        Application application =
                getApplicationById(id);

        applicationRepository.delete(application);
    }
}