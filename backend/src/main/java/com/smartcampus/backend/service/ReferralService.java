package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.Referral;
import com.smartcampus.backend.repository.ReferralRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReferralService {

    private final ReferralRepository referralRepository;

    public ReferralService(ReferralRepository referralRepository) {
        this.referralRepository = referralRepository;
    }

    // Create referral request
    public Referral createReferral(Referral referral) {

        referral.setStatus("PENDING");

        return referralRepository.save(referral);
    }

    // Get all referrals
    public List<Referral> getAllReferrals() {

        return referralRepository.findAll();
    }

    // Get referral by ID
    public Referral getReferralById(Long id) {

        return referralRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Referral not found"));
    }

    // Get referrals by student
    public List<Referral> getReferralsByStudent(
            String studentEmail) {

        return referralRepository
                .findByStudentEmail(studentEmail);
    }

    // Get referrals by referrer
    public List<Referral> getReferralsByReferrer(
            String referrerEmail) {

        return referralRepository
                .findByReferrerEmail(referrerEmail);
    }

    // Update referral status
    public Referral updateReferralStatus(
            Long id,
            String status) {

        Referral referral =
                getReferralById(id);

        referral.setStatus(status);

        return referralRepository.save(referral);
    }

    // Delete referral
    public void deleteReferral(Long id) {

        Referral referral =
                getReferralById(id);

        referralRepository.delete(referral);
    }
}