package com.project.serverHealthMonitoring.controllers;

import com.project.serverHealthMonitoring.entity.Alert;
import com.project.serverHealthMonitoring.repos.AlertRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "http://localhost:5173") // Or your frontend port
public class AlertController {

    private final AlertRepository alertRepository;

    public AlertController(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    @GetMapping("/server/{serverId}")
    public List<Alert> getServerAlerts(@PathVariable Long serverId) {
        return alertRepository.findByServerIdOrderByTimestampDesc(serverId);
    }
}
