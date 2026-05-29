package com.project.serverHealthMonitoring.component;

import com.project.serverHealthMonitoring.repos.LogRepository;
import com.project.serverHealthMonitoring.repos.MetricRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class CleanupScheduler {

    private final MetricRepository metricRepository;
    private final LogRepository logRepository;

    @Value("${metrics.retention.days}")
    private int retentionDays;

    public CleanupScheduler(MetricRepository metricRepository, LogRepository logRepository) {
        this.metricRepository = metricRepository;
        this.logRepository = logRepository;
    }

    // Runs at 12:00 AM every night
    @Scheduled(cron = "0 0 0 * * *")
    public void performCleanup() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(retentionDays);
        metricRepository.deleteOldMetrics(cutoff);
        System.out.println("CLEANUP TASK: Deleted metrics older than " + cutoff);
    }

    @Scheduled(cron = "0 0 0 * * *") // Every night at 12 AM
    public void cleanupOldLogs() {
        // Delete logs older than 7 days
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        logRepository.deleteByTimestampBefore(sevenDaysAgo);
    }
}
