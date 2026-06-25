package com.project.serverHealthMonitoring.component;

import com.project.serverHealthMonitoring.controllers.LogController;
import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.LogRepository;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import com.project.serverHealthMonitoring.services.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class HealthChecker{

    @Autowired
    private ServerRepository serverRepository;
    @Autowired
    private MetricRepository metricRepository;
    @Autowired
    private AlertService alertService;
    @Autowired
    private LogRepository logRepository;

    // for cleaner readable log
    private static final Logger log = LoggerFactory.getLogger(HealthChecker.class);

    @Scheduled(fixedRate = 10000) // Runs every 10 seconds
    public void runHealthCheck() {
        List<Server> servers = serverRepository.findAll();
        LocalDateTime fiveMinsAgo = LocalDateTime.now().minusMinutes(5);

        log.info("[HEALTH-CHECK] Starting scan of {} registered servers...", servers.size());
        for (Server server : servers) {
            // Get the most recent metric for this specific server
            Optional<Metric> latestOpt = metricRepository.findFirstByServerOrderByTimestampDesc(server);

            if (latestOpt.isPresent()) {
                alertService.evaluateServerHealth(server, latestOpt.get());

            } else {
                server.setStatus("NO_DATA");

            }

            // Smart Log Check , count logs and call function to check if server is unstable
            long errorCount = logRepository.countByServerIdAndLevelAndTimestampAfter(
                    server.getId(), "ERROR", fiveMinsAgo
            );

            alertService.checkLogHealth(server, errorCount);
            serverRepository.save(server);
        }

        log.info("[HEALTH-CHECK] Scan complete.");
    }


}
