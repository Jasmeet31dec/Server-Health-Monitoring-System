package com.project.serverHealthMonitoring.repos;

import com.project.serverHealthMonitoring.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    // Get alerts for a specific server, newest first
    List<Alert> findByServerIdOrderByTimestampDesc(Long serverId);
}
