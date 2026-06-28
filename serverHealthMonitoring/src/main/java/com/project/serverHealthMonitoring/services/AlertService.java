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

import java.time.Instant;
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

            log.warn("[ALERT] High load detected on server: {} | CPU: {}% | RAM: {}% | DISK: {}%",
                    server.getName(), latestMetric.getCpuUsage(), latestMetric.getRamUsage(),latestMetric.getDiskUsage());


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

    public void sendEmail(String to, String subject, String body) {
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
        }
    }

    //count and alert if too many errors in last 5 min
    public void checkLogHealth(Server server, long errorCount) {
        int ERROR_THRESHOLD = 5;

        if (errorCount >= ERROR_THRESHOLD && !"UNSTABLE".equals(server.getStatus())) {
            server.setStatus("UNSTABLE");

            // Create UI Alert
            Alert alert = new Alert();
            alert.setServer(server);
            alert.setMessage("Server marked as UNSTABLE: " + errorCount + " errors detected in last 5 mins.");
            alert.setTimestamp(LocalDateTime.now());
            alertRepository.save(alert);

            // Send Email
            sendEmail(server.getAlertEmail(),
                    "🔴 CRITICAL: Server " + server.getName() + " is UNSTABLE",
                    "Your server has reported " + errorCount + " errors in the last 5 minutes. Please check logs immediately.");

            log.warn("[SMART-ALERT] Server {} marked as UNSTABLE due to high error count", server.getName());
        }
    }

    // trigger alert if any danger buzzword in log
    public void triggerInstantKeywordAlert(Server server, String logMessage) {
        // Only send email, don't necessarily change status unless you want to
        log.error("[CRITICAL-LOG] Keyword match on {}: {}", server.getName(), logMessage);

        sendEmail(server.getAlertEmail(),
                "🔥 URGENT: Critical Error on " + server.getName(),
                "A critical log pattern was detected:\n\n" + logMessage);
    }
}
