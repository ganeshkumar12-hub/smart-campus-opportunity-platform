package com.smartcampus.backend.controller;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}