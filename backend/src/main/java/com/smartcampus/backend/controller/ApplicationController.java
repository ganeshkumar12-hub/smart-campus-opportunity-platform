
package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Application;
import com.smartcampus.backend.service.ApplicationService;
import com.smartcampus.backend.exception.ResourceAccessException;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(
            ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    private boolean hasRole(
            Authentication authentication,
            String role) {

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority ->
                        authority.equals("ROLE_" + role));
    }

    private void requireEmployeeOrAdmin(
            Authentication authentication) {

        if (!hasRole(authentication, "EMPLOYEE")
                && !hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "Only employees or admins can perform this action");
        }
    }

    @PostMapping
    public Application createApplication(
            @Valid @RequestBody Application application,
            Authentication authentication) {

        if (!hasRole(authentication, "STUDENT")) {
            throw new ResourceAccessException(
                    "Only students can submit applications");
        }

        // Never trust studentEmail from the request body.
        application.setStudentEmail(authentication.getName());

        return applicationService.createApplication(application);
    }

    @GetMapping
    public List<Application> getAllApplications(
            Authentication authentication) {

        requireEmployeeOrAdmin(authentication);

        return applicationService.getAllApplications();
    }

    @GetMapping("/{id}")
    public Application getApplicationById(
            @PathVariable Long id,
            Authentication authentication) {

        Application application =
                applicationService.getApplicationById(id);

        boolean isOwner =
                application.getStudentEmail()
                        .equals(authentication.getName());

        if (!isOwner
                && !hasRole(authentication, "EMPLOYEE")
                && !hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "You cannot view this application");
        }

        return application;
    }

    @GetMapping("/student/{email}")
    public List<Application> getApplicationsByStudent(
            @PathVariable String email,
            Authentication authentication) {

        boolean isOwner =
                email.equals(authentication.getName());

        if (!isOwner
                && !hasRole(authentication, "EMPLOYEE")
                && !hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "You cannot view these applications");
        }

        return applicationService.getApplicationsByStudent(email);
    }

    @GetMapping("/opportunity/{opportunityId}")
    public List<Application> getApplicationsByOpportunity(
            @PathVariable Long opportunityId,
            Authentication authentication) {

        requireEmployeeOrAdmin(authentication);

        return applicationService
                .getApplicationsByOpportunity(opportunityId);
    }

    @PutMapping("/{id}/status")
    public Application updateApplicationStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        requireEmployeeOrAdmin(authentication);

        return applicationService
                .updateApplicationStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(
            @PathVariable Long id,
            Authentication authentication) {

        requireEmployeeOrAdmin(authentication);

        applicationService.deleteApplication(id);

        return "Application deleted successfully";
    }
}
