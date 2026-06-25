package com.project.serverHealthMonitoring.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*; // For @Entity, @Id, @GeneratedValue, @ManyToOne, @JoinColumn
import jakarta.validation.constraints.Min; // Validation
import jakarta.validation.constraints.Max; // Validation
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(columnDefinition = "TIMESTAMP WITHOUT TIME ZONE")
    private LocalDateTime timestamp;

    public Metric(Server server, Double cpuUsage, Double ramUsage, Double diskUsage, LocalDateTime timestamp) {
        this.server = server;
        this.cpuUsage = cpuUsage;
        this.ramUsage = ramUsage;
        this.diskUsage = diskUsage;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public Double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(Double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public Double getRamUsage() {
        return ramUsage;
    }

    public void setRamUsage(Double ramUsage) {
        this.ramUsage = ramUsage;
    }

    public Double getDiskUsage() {
        return diskUsage;
    }

    public void setDiskUsage(Double diskUsage) {
        this.diskUsage = diskUsage;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
