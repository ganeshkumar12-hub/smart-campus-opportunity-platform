package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Opportunity;
import com.smartcampus.backend.service.OpportunityService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final OpportunityService opportunityService;

    public OpportunityController(OpportunityService opportunityService) {
        this.opportunityService = opportunityService;
    }

    // Create opportunity
    @PostMapping
    public Opportunity createOpportunity(
            @RequestBody Opportunity opportunity) {

        return opportunityService.createOpportunity(opportunity);
    }

    // Get all opportunities
    @GetMapping
    public List<Opportunity> getAllOpportunities() {

        return opportunityService.getAllOpportunities();
    }

    // Get opportunity by ID
    @GetMapping("/{id}")
    public Opportunity getOpportunityById(
            @PathVariable Long id) {

        return opportunityService.getOpportunityById(id);
    }

    // Update opportunity
    @PutMapping("/{id}")
    public Opportunity updateOpportunity(
            @PathVariable Long id,
            @RequestBody Opportunity opportunity) {

        return opportunityService.updateOpportunity(
                id,
                opportunity
        );
    }

    // Delete opportunity
    @DeleteMapping("/{id}")
    public String deleteOpportunity(
            @PathVariable Long id) {

        opportunityService.deleteOpportunity(id);

        return "Opportunity deleted successfully";
    }
}