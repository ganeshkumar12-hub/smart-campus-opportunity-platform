package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Opportunity;
import com.smartcampus.backend.repository.OpportunityRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;

    public OpportunityService(OpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    public Opportunity createOpportunity(Opportunity opportunity) {
        return opportunityRepository.save(opportunity);
    }

    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Opportunity not found"));
    }

    public Opportunity updateOpportunity(
            Long id,
            Opportunity updatedOpportunity) {

        Opportunity opportunity =
                getOpportunityById(id);

        opportunity.setTitle(updatedOpportunity.getTitle());
        opportunity.setCompany(updatedOpportunity.getCompany());
        opportunity.setDescription(updatedOpportunity.getDescription());
        opportunity.setLocation(updatedOpportunity.getLocation());
        opportunity.setType(updatedOpportunity.getType());
        opportunity.setSkills(updatedOpportunity.getSkills());
        opportunity.setDeadline(updatedOpportunity.getDeadline());
        opportunity.setPostedBy(updatedOpportunity.getPostedBy());

        return opportunityRepository.save(opportunity);
    }

    public void deleteOpportunity(Long id) {
        Opportunity opportunity =
                getOpportunityById(id);

        opportunityRepository.delete(opportunity);
    }
}   