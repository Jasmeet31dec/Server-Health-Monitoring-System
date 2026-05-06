package com.project.serverHealthMonitoring.entity;

import jakarta.persistence.*;   // For @Entity, @Id, @GeneratedValue, @Column, @OneToMany
import jakarta.validation.constraints.NotBlank;    // Validation
import jakarta.validation.constraints.Pattern;    // Validation
import lombok.AllArgsConstructor;    // For @Data, @NoArgsConstructor, @AllArgsConstructor
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Server {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Server name is required")
    private String name;

    @Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
            message = "Invalid IP Address format")
    @Column(nullable = false, unique = true)
    private String ipAddress;

    private String description;

    @Column(nullable = false, updatable = false)
    @org.hibernate.annotations.CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "server", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Metric> metrics;
}
