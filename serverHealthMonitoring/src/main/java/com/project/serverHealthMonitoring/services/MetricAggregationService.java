package com.project.serverHealthMonitoring.services;

import com.project.serverHealthMonitoring.component.HealthChecker;
import com.project.serverHealthMonitoring.entity.HistoricalMetric;
import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.HistoricalMetricRepository;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Service
public class MetricAggregationService {

    @Autowired
    private MetricRepository metricRepository;
    @Autowired
    private HistoricalMetricRepository historicalRepository;
    @Autowired
    private ServerRepository serverRepository;

    private static final Logger log = LoggerFactory.getLogger(MetricAggregationService.class);

    // 0 0 * * * *
    @Scheduled(initialDelay = 30000, fixedRate = 120000) // Runs exactly at the start of every hour
    public void aggregateHourlyMetrics() {
        //LocalDateTime start = LocalDateTime.now().minusHours(1).withMinute(0).withSecond(0);
        log.info("Test scheduler fired at {}", LocalDateTime.now());

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(30);

        List<Server> servers = serverRepository.findAll();
        for (Server server : servers) {
            // Calculate averages for this server from the raw 'Metric' table
            List<Metric> rawMetrics = metricRepository.findByServerIdAndTimestampBetween(server.getId(), fiveMinutesAgo, now);

            if (!rawMetrics.isEmpty()) {
                double avgCpu = rawMetrics.stream().mapToDouble(Metric::getCpuUsage).average().orElse(0.0);
                double avgRam = rawMetrics.stream().mapToDouble(Metric::getRamUsage).average().orElse(0.0);

                HistoricalMetric hist = new HistoricalMetric();
                hist.setServer(server);
                hist.setAvgCpu(avgCpu);
                hist.setAvgRam(avgRam);
                hist.setTimestamp(now);

                log.warn("Saving historic metric...");
                try {
                    historicalRepository.save(hist);
                    log.warn("Historic metric saved!");
                } catch (Exception e) {
                    log.error("Historic save failed:", e);
                }
            }
        }
    }}
