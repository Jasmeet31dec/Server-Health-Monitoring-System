package com.project.serverHealthMonitoring.component;

import com.project.serverHealthMonitoring.repos.MetricRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CleanupScheduler {

    private final MetricRepository metricRepository;

    @Value("${metrics.retention.days}")
    private int retentionDays;

    public CleanupScheduler(MetricRepository metricRepository) {
        this.metricRepository = metricRepository;
    }

    // Runs at 12:00 AM every night
    @Scheduled(cron = "0 0 0 * * *")
    public void performCleanup() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        metricRepository.deleteOldMetrics(cutoff);
        System.out.println("CLEANUP TASK: Deleted metrics older than " + cutoff);
    }
}
