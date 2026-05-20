package com.project.serverHealthMonitoring.services;

import com.project.serverHealthMonitoring.controllers.LogController;
import com.project.serverHealthMonitoring.entity.Alert;
import com.project.serverHealthMonitoring.entity.Metric;
import com.project.serverHealthMonitoring.entity.Server;
import com.project.serverHealthMonitoring.repos.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AlertService {

    @Autowired
    private JavaMailSender mailSender;
    @Autowired private AlertRepository alertRepository;

    // for cleaner readable log
    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    public void evaluateServerHealth(Server server, Metric latestMetric) {
        // Define Thresholds
        double CPU_LIMIT = 80.0;
        double RAM_LIMIT = 90.0;
        double DISK_LIMIT = 90.0;

        StringBuilder issues = new StringBuilder();
        boolean isCritical = false;

        if (latestMetric.getCpuUsage() > CPU_LIMIT) {
            issues.append("- High CPU Usage: ").append(latestMetric.getCpuUsage()).append("%\n");
            isCritical = true;
        }
        if (latestMetric.getRamUsage() > RAM_LIMIT) {
            issues.append("- High RAM Usage: ").append(latestMetric.getRamUsage()).append("%\n");
            isCritical = true;
        }
        if (latestMetric.getDiskUsage() > DISK_LIMIT) {
            issues.append("- High Disk Usage: ").append(latestMetric.getDiskUsage()).append("%\n");
            isCritical = true;
        }

        if (isCritical) {
            // 1. Create UI Alert for the table
            Alert alert = new Alert();
            alert.setServer(server);
            alert.setMessage("Critical Load Detected: " + issues.toString().replace("\n", " "));
            alert.setTimestamp(LocalDateTime.now());
            alertRepository.save(alert);

            // 2. Update Server Status
            server.setStatus("HIGH_LOAD");

            log.warn("[ALERT] High load detected on server: {} | CPU: {}% | RAM: {}%",
                    server.getName(), latestMetric.getCpuUsage(), latestMetric.getRamUsage());


            // 3. Send Email Notification
            sendEmail(
                    server.getAlertEmail(),
                    "⚠️ ALERT: High Load on " + server.getName(),
                    "Hello Team,\n\nThe following issues were detected on your server [" + server.getName() + "]:\n\n" +
                            issues.toString() +
                            "\nPlease check your dashboard immediately."
            );
        } else {
            server.setStatus("HEALTHY");
        }
    }

    private void sendEmail(String to, String subject, String body) {
        // 1. Check if the email address actually exists
        if (to == null || to.isEmpty()) {
            System.err.println("Skipping email: No alert email defined for this server.");
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();

            // 2. Explicitly set the "From" address (Some SMTP servers require this)
            message.setFrom("your-email@gmail.com");

            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);

            log.info("[EMAIL] Alert notification sent to: {}", to);

        } catch (Exception e) {
            // This will now give you a much better error description in the console
            log.error("[EMAIL] Failed to send email to: {} | Error: {}", to, e.getMessage());
            e.printStackTrace();
        }
    }
}
