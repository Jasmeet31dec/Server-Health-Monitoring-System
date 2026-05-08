package com.project.serverHealthMonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ServerHealthMonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServerHealthMonitoringApplication.class, args);
	}

}
