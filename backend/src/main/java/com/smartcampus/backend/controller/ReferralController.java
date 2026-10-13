
package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.Referral;
import com.smartcampus.backend.service.ReferralService;
import com.smartcampus.backend.exception.ResourceAccessException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    private boolean hasRole(
            Authentication authentication,
            String role) {

        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(authority ->
                        authority.equals("ROLE_" + role));
    }

    // Create referral request: students only
    @PostMapping
    public Referral createReferral(
            @RequestBody Referral referral,
            Authentication authentication) {

        if (!hasRole(authentication, "STUDENT")) {
            throw new ResourceAccessException(
                    "Only students can create referral requests");
        }

        referral.setStudentEmail(authentication.getName());

        return referralService.createReferral(referral);
    }

    // Get all referrals: admins only
    @GetMapping
    public List<Referral> getAllReferrals(
            Authentication authentication) {

        if (!hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "Only admins can view all referrals");
        }

        return referralService.getAllReferrals();
    }

    // Get referral by ID: student owner, assigned employee, or admin
    @GetMapping("/{id}")
    public Referral getReferralById(
            @PathVariable Long id,
            Authentication authentication) {

        Referral referral =
                referralService.getReferralById(id);

        boolean isStudentOwner =
                authentication.getName()
                        .equals(referral.getStudentEmail());

        boolean isAssignedEmployee =
                authentication.getName()
                        .equals(referral.getReferrerEmail());

        if (!isStudentOwner
                && !isAssignedEmployee
                && !hasRole(authentication, "ADMIN")) {

            throw new ResourceAccessException(
                    "You cannot view this referral");
        }

        return referral;
    }

    // Get referrals by student email
    @GetMapping("/student/{email}")
    public List<Referral> getReferralsByStudent(
            @PathVariable String email,
            Authentication authentication) {

        boolean isOwner =
                email.equals(authentication.getName());

        if (!isOwner && !hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "You can only view your own referrals");
        }

        return referralService.getReferralsByStudent(email);
    }

    // Get referrals assigned to an employee
    @GetMapping("/referrer/{email}")
    public List<Referral> getReferralsByReferrer(
            @PathVariable String email,
            Authentication authentication) {

        boolean isOwner =
                email.equals(authentication.getName());

        if (!isOwner && !hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "You can only view referrals assigned to you");
        }

        return referralService.getReferralsByReferrer(email);
    }

    // Update referral status: assigned employee or admin
    @PutMapping("/{id}/status")
    public Referral updateReferralStatus(
            @PathVariable Long id,
            @RequestParam String status,
            Authentication authentication) {

        Referral referral =
                referralService.getReferralById(id);

        boolean isAssignedEmployee =
                authentication.getName()
                        .equals(referral.getReferrerEmail());

        if (!isAssignedEmployee
                && !hasRole(authentication, "ADMIN")) {

            throw new ResourceAccessException(
                    "Only the assigned employee or an admin can update this referral");
        }

        return referralService.updateReferralStatus(id, status);
    }

    // Delete referral: admins only
    @DeleteMapping("/{id}")
    public String deleteReferral(
            @PathVariable Long id,
            Authentication authentication) {

        if (!hasRole(authentication, "ADMIN")) {
            throw new ResourceAccessException(
                    "Only admins can delete referrals");
        }

        referralService.deleteReferral(id);

        return "Referral deleted successfully";
    }
}
