package com.project.serverHealthMonitoring.config;

import com.project.serverHealthMonitoring.component.HealthChecker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.time.LocalDateTime;

@Configuration
@EnableScheduling
public class SchedulerConfig {
    private static final Logger log = LoggerFactory.getLogger(HealthChecker.class);

    @Bean
    public TaskScheduler taskScheduler() {
        log.info("Test scheduler fired at {}", LocalDateTime.now());
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(5); // allow up to 5 concurrent tasks
        scheduler.setThreadNamePrefix("scheduled-task-");
        scheduler.initialize();
        return scheduler;
    }
}

