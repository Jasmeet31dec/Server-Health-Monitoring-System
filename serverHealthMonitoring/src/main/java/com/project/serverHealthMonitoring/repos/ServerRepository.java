package com.project.serverHealthMonitoring.repos;


import com.project.serverHealthMonitoring.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {
    // Search by name (case-insensitive)
    List<Server> findByNameContainingIgnoreCase(String name);

    // Filter by status
    List<Server> findByStatus(String status);

    // Combined Search and Filter
    List<Server> findByNameContainingIgnoreCaseAndStatus(String name, String status);

    // Always get servers in the same order (Newest first)
    List<Server> findAllByOrderByIdDesc();

    // Updated Search with default sorting
    //List<Server> findByNameContainingIgnoreCaseOrderByIdDesc(String name);

    //List<Server> findByStatusOrderByIdDesc(String status);
}

