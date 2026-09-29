package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.service.ApplicationService;
import com.smartcampus.backend.exception.ResourceAccessException;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    public Application createApplication(
            @Valid @RequestBody Application application,
            Authentication authentication) {

        application.setStudentEmail(authentication.getName());

        return applicationService.createApplication(application);
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public Application getApplicationById(
            @PathVariable Long id) {
        return applicationService.getApplicationById(id);
    }

    @GetMapping("/student/{email}")
    public List<Application> getApplicationsByStudent(
            @PathVariable String email,
            Authentication authentication) {

        if (!email.equals(authentication.getName())) {
            throw new ResourceAccessException(
                    "You can only view your own applications"
            );
        }

        return applicationService.getApplicationsByStudent(email);
    }

    @GetMapping("/opportunity/{opportunityId}")
    public List<Application> getApplicationsByOpportunity(
            @PathVariable Long opportunityId) {

        return applicationService
                .getApplicationsByOpportunity(opportunityId);
    }

    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return applicationService
                .updateApplicationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(
            @PathVariable Long id) {

        applicationService.deleteApplication(id);

        return "Application deleted successfully";
    }
}