package com.project.serverHealthMonitoring.controllers;

import com.project.serverHealthMonitoring.entity.HistoricalMetric;
import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.repos.HistoricalMetricRepository;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricRepository metricRepository;
    private final HistoricalMetricRepository historicalRepository;

    private static final Logger log = LoggerFactory.getLogger(MetricController.class);

    public MetricController(MetricRepository metricRepository, HistoricalMetricRepository historicalRepository) {
        this.metricRepository = metricRepository;
        this.historicalRepository = historicalRepository;
    }

    // 1. Push metrics (Called by Python Agent)
    @PostMapping
    public ResponseEntity<Metric> pushMetrics(@RequestBody Metric metric) {
        metric.setTimestamp(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
        Metric savedMetric = metricRepository.save(metric);
        log.info("[METRIC] Data received from Server ID: {} | CPU: {}% | RAM: {}% | DISK: {}%",
                metric.getServer().getId(), metric.getCpuUsage(), metric.getRamUsage(), metric.getDiskUsage());
        return new ResponseEntity<>(savedMetric, HttpStatus.CREATED);
    }

    // 2. Get metrics for a server (For Graphs)
    @GetMapping
    public ResponseEntity<List<Metric>> getMetrics(
            @RequestParam Long serverId,
            @RequestParam LocalDateTime from,
            @RequestParam LocalDateTime to) {

        return ResponseEntity.ok(
                metricRepository.findByServerIdAndTimestampBetweenOrderByTimestampAsc(serverId, from, to)
        );
    }

    @GetMapping("/{serverId}/history")
    public List<HistoricalMetric> getHistory(@PathVariable Long serverId) {
        return historicalRepository.findByServerIdAndTimestampAfterOrderByTimestampAsc(
                serverId, LocalDateTime.now().minusHours(24)

        );
    }
}
