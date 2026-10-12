
package com.smartcampus.backend.security;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                Arrays.asList("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                Arrays.asList(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                Arrays.asList("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )
                .authorizeHttpRequests(auth -> auth

                        // AUTH
                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        // RESUME UPLOADS
                        .requestMatchers("/uploads/**")
                        .permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/resumes/upload"
                        )
                        .hasRole("STUDENT")

                        // OPPORTUNITIES
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/opportunities"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/opportunities/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/opportunities/**"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers("/api/opportunities/**")
                        .authenticated()

                        // REFERRALS
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/referrals"
                        )
                        .hasRole("STUDENT")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/referrals/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/referrals/**"
                        )
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/referrals/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        // APPLICATIONS
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/applications"
                        )
                        .hasRole("STUDENT")

                        // Only employees and admins can list all applications
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/applications/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/applications/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/opportunity/**"
                        )
                        .hasAnyRole("EMPLOYEE", "ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/student/**"
                        )
                        .authenticated()

                        // Individual application access requires authentication.
                        // Controller checks ownership or employee/admin role.
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/applications/*"
                        )
                        .authenticated()

                        // USERS
                        .requestMatchers("/api/users/employees")
                        .authenticated()

                        .requestMatchers("/api/users/profile")
                        .authenticated()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/users"
                        )
                        .hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/users/**"
                        )
                        .hasRole("ADMIN")

                        // EVERYTHING ELSE
                        .anyRequest()
                        .authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
