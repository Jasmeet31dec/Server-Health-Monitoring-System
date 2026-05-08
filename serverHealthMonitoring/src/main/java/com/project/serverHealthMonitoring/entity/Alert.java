package com.project.serverHealthMonitoring.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String message;
    private String severity; // "CRITICAL" or "WARNING"
    private LocalDateTime timestamp;

    @ManyToOne
    @JsonIgnore
    private Server server;

    public Alert(String message, String severity, LocalDateTime timestamp, Server server) {
        this.message = message;
        this.severity = severity;
        this.timestamp = timestamp;
        this.server = server;
    }

    public Alert(){}

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Server getServer() {
        return server;
    }

    public void setServer(Server server) {
        this.server = server;
    }
}
