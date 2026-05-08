package com.project.serverHealthMonitoring.component;

import com.project.serverHealthMonitoring.entity.Alert;
import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.AlertRepository;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class HealthCheckScheduler {

    private final ServerRepository serverRepository;
    private final MetricRepository metricRepository;
    private final AlertRepository alertRepository;

    public HealthCheckScheduler(ServerRepository serverRepository, MetricRepository metricRepository,AlertRepository alertRepository) {
        this.serverRepository = serverRepository;
        this.metricRepository = metricRepository;
        this.alertRepository = alertRepository;
    }

    @Scheduled(fixedRate = 60000)   // Runs every 60,000ms (1 minute)
    @Transactional
    public void monitorServerHealth() {
        List<Server> servers = serverRepository.findAll();

        for (Server server : servers) {
            System.out.println("Checking health for Server ID: " + server.getId());

            List<Metric> lastMetrics = metricRepository.findTop5ByServerIdOrderByTimestampDesc(server.getId());

            if (lastMetrics.isEmpty()) {
                System.out.println("No metrics found for Server " + server.getId() + ". Setting OFFLINE.");
                server.setStatus("OFFLINE");
            } else {
                // Calculate Average CPU of the last 5 records
                double avgCpu = lastMetrics.stream()
                        .mapToDouble(Metric::getCpuUsage)
                        .average()
                        .orElse(0.0);

                System.out.println("Server " + server.getId() + " Avg CPU: " + avgCpu);

                if (avgCpu > 80) {
                    if (!"HIGH_LOAD".equals(server.getStatus())) { // Only alert if status CHANGED
                        Alert alert = new Alert();
                        alert.setMessage("High CPU Spike Detected: " + String.format("%.2f", avgCpu) + "%");
                        alert.setSeverity("CRITICAL");
                        alert.setTimestamp(LocalDateTime.now());
                        alert.setServer(server);
                        alertRepository.save(alert); // Save the spike to history
                        System.out.println("ALERT CREATED for Server " + server.getId());
                    }
                    server.setStatus("HIGH_LOAD");
                } else {
                    server.setStatus("OK");
                }
            }
            serverRepository.save(server); // Update status in DB
        }
        System.out.println("Health check completed for " + servers.size() + " servers.");
    }
}
