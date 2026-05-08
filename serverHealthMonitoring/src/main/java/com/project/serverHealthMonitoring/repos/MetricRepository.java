package com.project.serverHealthMonitoring.repos;


import com.project.serverHealthMonitoring.entity.Metric;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface MetricRepository extends JpaRepository<Metric, Long> {

    // Finds metrics for a specific server between two dates
    List<Metric> findByServerIdAndTimestampBetweenOrderByTimestampAsc(
            Long serverId,
            LocalDateTime from,
            LocalDateTime to
    );

    // Fetches the last N metrics for a specific server
    List<Metric> findTop5ByServerIdOrderByTimestampDesc(Long serverId);

    @Transactional
    @Modifying
    @Query("DELETE FROM Metric m WHERE m.timestamp < :expiryDate")
    void deleteOldMetrics(LocalDateTime expiryDate);
}
