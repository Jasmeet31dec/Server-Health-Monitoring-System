package com.project.serverHealthMonitoring.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*; // For @Entity, @Id, @GeneratedValue, @ManyToOne, @JoinColumn
import jakarta.validation.constraints.Min; // Validation
import jakarta.validation.constraints.Max; // Validation
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Metric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "server_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Server server;

    @Min(0) @Max(100)
    private Double cpuUsage;

    @Min(0) @Max(100)
    private Double ramUsage;

    @Min(0) @Max(100)
    private Double diskUsage;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;
}
