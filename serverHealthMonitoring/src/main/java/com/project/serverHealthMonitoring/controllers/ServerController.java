package com.project.serverHealthMonitoring.controllers;


import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.ServerRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/servers")
//@RequiredArgsConstructor // Automatically injects ServerRepository
public class ServerController {

    private final ServerRepository serverRepository;

    public ServerController(ServerRepository serverRepository) {
        this.serverRepository = serverRepository;
    }

    /**
     * POST /api/servers
     * Register a new server
     */
    @PostMapping
    public ResponseEntity<Server> registerServer(@Valid @RequestBody Server server) {
        Server savedServer = serverRepository.save(server);
        return new ResponseEntity<>(savedServer, HttpStatus.CREATED);
    }

    /**
     * GET /api/servers
     * List all registered servers
     */
    @GetMapping
    public ResponseEntity<List<Server>> getAllServers() {
        List<Server> servers = serverRepository.findAll();
        return ResponseEntity.ok(servers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Server> getServerById(@PathVariable Long id) {
        return serverRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
