package com.project.serverHealthMonitoring.controllers;

import com.project.serverHealthMonitoring.entity.LogEntry;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.LogRepository;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import com.project.serverHealthMonitoring.services.AlertService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {
    private final LogRepository logRepository;
    private final ServerRepository serverRepository;
    private final AlertService alertService;

    private static final Logger log = LoggerFactory.getLogger(LogController.class);

    public LogController(LogRepository logRepository, ServerRepository serverRepository, AlertService alertService) {
        this.logRepository = logRepository;
        this.serverRepository = serverRepository;
        this.alertService = alertService;
    }

    @PostMapping("/{serverId}")
    public void receiveLogs(@PathVariable Long serverId, @RequestBody List<Map<String, String>> logLines) {
        Server server = serverRepository.findById(serverId).orElseThrow();
        for (Map<String, String> line : logLines) {
            LogEntry entry = new LogEntry();
            entry.setMessage(line.get("message"));
            entry.setLevel(line.get("level"));
            entry.setTimestamp(LocalDateTime.now());
            entry.setServer(server);
            logRepository.save(entry);
            log.info("[LOGS] Received {} new log entries from Server ID: {}", logLines.size(), serverId);

            String msg = line.get("message").toUpperCase();
            if (msg.contains("OUTOFMEMORY") || msg.contains("CONNECTION_REFUSED") || msg.contains("FATAL")) {
                alertService.triggerInstantKeywordAlert(server, line.get("message"));
            }
        }
    }

    @GetMapping("/{serverId}")
    public List<LogEntry> getLogs(@PathVariable Long serverId) {
        // Return last 50 logs
        return logRepository.findTop50ByServerIdOrderByTimestampDesc(serverId);
    }
}
