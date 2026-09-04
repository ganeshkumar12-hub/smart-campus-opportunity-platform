package com.smartcampus.backend.repository;

import com.smartcampus.backend.entity.Referral;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferralRepository extends JpaRepository<Referral, Long> {

    List<Referral> findByStudentEmail(String studentEmail);

    List<Referral> findByReferrerEmail(String referrerEmail);

    List<Referral> findByOpportunityId(Long opportunityId);
}