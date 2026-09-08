package com.smartcampus.backend.security;
import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()

        .requestMatchers(HttpMethod.POST, "/api/opportunities")
        .hasAnyRole("EMPLOYEE", "ADMIN")

        .requestMatchers(HttpMethod.PUT, "/api/opportunities/**")
        .hasAnyRole("EMPLOYEE", "ADMIN")

        .requestMatchers(HttpMethod.DELETE, "/api/opportunities/**")
        .hasAnyRole("EMPLOYEE", "ADMIN")

        .requestMatchers("/api/opportunities/**")
        .authenticated()

        .requestMatchers(HttpMethod.POST, "/api/referrals")
.hasRole("STUDENT")

.requestMatchers(HttpMethod.PUT, "/api/referrals/**")
.hasAnyRole("EMPLOYEE", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/referrals/**")
.authenticated()

.requestMatchers(HttpMethod.DELETE, "/api/referrals/**")
.hasAnyRole("EMPLOYEE", "ADMIN")

.requestMatchers(HttpMethod.POST, "/api/applications")
.hasRole("STUDENT")

.requestMatchers(HttpMethod.PUT, "/api/applications/**")
.hasAnyRole("EMPLOYEE", "ADMIN")

.requestMatchers(HttpMethod.DELETE, "/api/applications/**")
.hasAnyRole("EMPLOYEE", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/applications/opportunity/**")
.hasAnyRole("EMPLOYEE", "ADMIN")

.requestMatchers(HttpMethod.GET, "/api/applications/student/**")
.authenticated()

.requestMatchers(HttpMethod.GET, "/api/applications/*")
.authenticated()
        .requestMatchers("/api/users/**")
        .authenticated()

        .anyRequest().authenticated()
)

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}