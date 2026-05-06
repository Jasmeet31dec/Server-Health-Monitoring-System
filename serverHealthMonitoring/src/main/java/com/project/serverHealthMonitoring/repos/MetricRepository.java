package com.project.serverHealthMonitoring.repos;


import com.project.serverHealthMonitoring.entity.Metric;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface MetricRepository extends JpaRepository<Metric, Long> {

    // Finds metrics for a specific server between two dates
    List<Metric> findByServerIdAndTimestampBetweenOrderByTimestampAsc(
            Long serverId,
            LocalDateTime from,
            LocalDateTime to
    );
}
