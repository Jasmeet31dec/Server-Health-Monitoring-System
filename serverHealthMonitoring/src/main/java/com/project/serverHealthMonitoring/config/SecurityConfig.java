package com.project.serverHealthMonitoring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // IMPORTANT: CSRF must be disabled for POST requests to work
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**").permitAll() // Allow your agent to hit /api endpoints
                        .anyRequest().authenticated()
                )
                .httpBasic(basic -> basic.disable()) // Disable the login popup
                .formLogin(form -> form.disable());

        return http.build();
    }
}