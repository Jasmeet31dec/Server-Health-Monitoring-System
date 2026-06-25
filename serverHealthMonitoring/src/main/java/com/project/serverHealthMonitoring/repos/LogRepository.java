package com.project.serverHealthMonitoring.repos;

import com.project.serverHealthMonitoring.entity.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public interface LogRepository extends JpaRepository<LogEntry, Long> {

    // Fetches the latest 50 logs for a specific server
    List<LogEntry> findTop50ByServerIdOrderByTimestampDesc(Long serverId);

    @Transactional
    @Modifying
    void deleteByTimestampBefore(LocalDateTime expiryDate);

    // Count how many ERROR logs a server has in a specific time window
    long countByServerIdAndLevelAndTimestampAfter(Long serverId, String level, LocalDateTime time);
}
