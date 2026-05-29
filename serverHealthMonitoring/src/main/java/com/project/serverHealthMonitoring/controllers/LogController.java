package com.project.serverHealthMonitoring.controllers;

import com.project.serverHealthMonitoring.entity.LogEntry;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.LogRepository;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "*")
public class LogController {
    private final LogRepository logRepository;
    private final ServerRepository serverRepository;

    private static final Logger log = LoggerFactory.getLogger(LogController.class);

    public LogController(LogRepository logRepository, ServerRepository serverRepository) {
        this.logRepository = logRepository;
        this.serverRepository = serverRepository;
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
        }
    }

    @GetMapping("/{serverId}")
    public List<LogEntry> getLogs(@PathVariable Long serverId) {
        // Return last 50 logs
        return logRepository.findTop50ByServerIdOrderByTimestampDesc(serverId);
    }
}
