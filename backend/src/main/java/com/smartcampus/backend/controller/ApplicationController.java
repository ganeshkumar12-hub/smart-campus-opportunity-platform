package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Create application
    @PostMapping
    public Application createApplication(
            @RequestBody Application application) {

        return applicationService.createApplication(application);
    }

    // Get all applications
    @GetMapping
    public List<Application> getAllApplications() {

        return applicationService.getAllApplications();
    }

    // Get application by ID
    @GetMapping("/{id}")
    public Application getApplicationById(
            @PathVariable Long id) {

        return applicationService.getApplicationById(id);
    }

    // Get applications by student
    @GetMapping("/student/{email}")
    public List<Application> getApplicationsByStudent(
            @PathVariable String email) {

        return applicationService
                .getApplicationsByStudent(email);
    }

    // Get applications by opportunity
    @GetMapping("/opportunity/{opportunityId}")
    public List<Application> getApplicationsByOpportunity(
            @PathVariable Long opportunityId) {

        return applicationService
                .getApplicationsByOpportunity(opportunityId);
    }

    // Update application status
    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService
                .updateApplicationStatus(id, status);
    }

    // Delete application
    @DeleteMapping("/{id}")
    public String deleteApplication(
            @PathVariable Long id) {

        applicationService.deleteApplication(id);

        return "Application deleted successfully";
    }
}