package com.project.serverHealthMonitoring.repos;

import com.project.serverHealthMonitoring.entity.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepository extends JpaRepository<LogEntry, Long> {

    // Fetches the latest 50 logs for a specific server
    List<LogEntry> findTop50ByServerIdOrderByTimestampDesc(Long serverId);
}
