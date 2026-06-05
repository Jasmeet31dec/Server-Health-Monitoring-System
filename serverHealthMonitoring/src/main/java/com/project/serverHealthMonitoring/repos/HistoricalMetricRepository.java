package com.project.serverHealthMonitoring.repos;

import com.project.serverHealthMonitoring.entity.HistoricalMetric;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface HistoricalMetricRepository extends JpaRepository<HistoricalMetric, Long> {

    // Get last 24 hours of data for a specific server
    List<HistoricalMetric> findByServerIdAndTimestampAfterOrderByTimestampAsc(Long serverId, LocalDateTime time);
}
