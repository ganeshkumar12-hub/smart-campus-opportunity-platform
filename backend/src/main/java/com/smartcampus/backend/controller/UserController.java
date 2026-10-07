package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public String profile(Authentication authentication) {
        return "Welcome " + authentication.getName()
                + "! JWT authentication is working.";
    }

    @GetMapping("/employees")
    public List<User> getEmployees() {
        return userRepository.findByRole("EMPLOYEE");
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id,
            Authentication authentication) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // Prevent an admin from deleting their own account
        if (user.getEmail().equals(authentication.getName())) {
            throw new IllegalArgumentException(
                    "You cannot delete your own account"
            );
        }

        userRepository.delete(user);

        return "User deleted successfully";
    }
}