package com.smartcampus.backend.controller;
import org.springframework.security.core.Authentication;
import com.smartcampus.backend.entity.Referral;
import com.smartcampus.backend.service.ReferralService;
import org.springframework.web.bind.annotation.*;
import com.smartcampus.backend.exception.ResourceAccessException;
import java.util.List;

@RestController
@RequestMapping("/api/referrals")
public class ReferralController {

    private final ReferralService referralService;

    public ReferralController(ReferralService referralService) {
        this.referralService = referralService;
    }

    // Create referral request
@PostMapping
public Referral createReferral(
        @RequestBody Referral referral,
        Authentication authentication) {

    referral.setStudentEmail(authentication.getName());

    return referralService.createReferral(referral);
}
    // Get all referrals
    @GetMapping
    public List<Referral> getAllReferrals() {

        return referralService.getAllReferrals();
    }

    // Get referral by ID
    @GetMapping("/{id}")
    public Referral getReferralById(
            @PathVariable Long id) {

        return referralService.getReferralById(id);
    }

    // Get referrals by student email
@GetMapping("/student/{email}")
public List<Referral> getReferralsByStudent(
        @PathVariable String email,
        Authentication authentication) {

    if (!email.equals(authentication.getName())) {
throw new ResourceAccessException(
        "You can only view your own referrals"
);
    }

    return referralService
            .getReferralsByStudent(email);
}

    // Get referrals by referrer email
@GetMapping("/referrer/{email}")
public List<Referral> getReferralsByReferrer(
        @PathVariable String email,
        Authentication authentication) {

    if (!email.equals(authentication.getName())) {
        throw new ResourceAccessException(
                "You can only view referrals assigned to you"
        );
    }

    return referralService
            .getReferralsByReferrer(email);
}
    // Update referral status
    @PutMapping("/{id}/status")
    public Referral updateReferralStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return referralService
                .updateReferralStatus(id, status);
    }

    // Delete referral
    @DeleteMapping("/{id}")
    public String deleteReferral(
            @PathVariable Long id) {

        referralService.deleteReferral(id);

        return "Referral deleted successfully";
    }
}