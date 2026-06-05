package com.project.serverHealthMonitoring.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class HistoricalMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "server_id")
    private Server server;

    private Double avgCpu;
    private Double avgRam;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime timestamp;

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }

    public Double getAvgCpu() {
        return avgCpu;
    }

    public void setAvgCpu(Double avgCpu) {
        this.avgCpu = avgCpu;
    }

    public Double getAvgRam() {
        return avgRam;
    }

    public void setAvgRam(Double avgRam) {
        this.avgRam = avgRam;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
