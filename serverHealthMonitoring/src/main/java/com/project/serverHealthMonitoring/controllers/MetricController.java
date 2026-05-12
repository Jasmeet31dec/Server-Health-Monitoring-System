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

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/metrics")
public class MetricController {

    private final MetricRepository metricRepository;

    public MetricController(MetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    // 1. Push metrics (Called by Python Agent)
    @PostMapping
    public ResponseEntity<Metric> pushMetrics(@RequestBody Metric metric) {
        Metric savedMetric = metricRepository.save(metric);
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
