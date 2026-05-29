package com.project.serverHealthMonitoring.controllers;

import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricRepository metricRepository;

    private static final Logger log = LoggerFactory.getLogger(MetricController.class);

    public MetricController(MetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    // 1. Push metrics (Called by Python Agent)
    @PostMapping
    public ResponseEntity<Metric> pushMetrics(@RequestBody Metric metric) {
        Metric savedMetric = metricRepository.save(metric);
        log.info("[METRIC] Data received from Server ID: {} | CPU: {}% | RAM: {}%",
                metric.getServer().getId(), metric.getCpuUsage(), metric.getRamUsage());
        return new ResponseEntity<>(savedMetric, HttpStatus.CREATED);
    }

    // 2. Get metrics for a server (For Graphs)
    @GetMapping
    public ResponseEntity<List<Metric>> getMetrics(
            @RequestParam Long serverId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {

        return ResponseEntity.ok(
                metricRepository.findByServerIdAndTimestampBetweenOrderByTimestampAsc(serverId, from, to)
        );
    }
}
