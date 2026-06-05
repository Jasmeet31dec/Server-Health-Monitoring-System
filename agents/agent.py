import psutil
import requests
import time
import argparse
import threading
import os

# Setup Command Line Arguments
parser = argparse.ArgumentParser()
parser.add_argument("--server-id", type=int, required=True, help="ID of the server in the database")
parser.add_argument("--log-path", type=str, default="app.log", help="Path to the log file to monitor")
args = parser.parse_args()

# Configuration
BASE_URL = "http://localhost:8081/api"
SERVER_ID = args.server_id
LOG_FILE_PATH = args.log_path
INTERVAL = 5 

def collect_and_send_metrics():
    print(f"[*] Metrics Thread Started for Server ID: {SERVER_ID}")
    while True:
        try:
            cpu = psutil.cpu_percent(interval=1)
            ram = psutil.virtual_memory().percent
            disk = psutil.disk_usage('/').percent

            payload = {
                "cpuUsage": cpu,
                "ramUsage": ram,
                "diskUsage": disk,
                "server": {"id": SERVER_ID}
            }

            response = requests.post(f"{BASE_URL}/metrics", json=payload)
            if response.status_code == 201:
                print(f"[Metrics] Sent: CPU {cpu}% | RAM {ram}% | DISK {disk}%")
        except Exception as e:
            print(f"[Metrics Error] {e}")
        
        time.sleep(INTERVAL)

def monitor_and_send_logs():
    print(f"[*] Log Monitoring Thread Started for: {LOG_FILE_PATH}")
    
    # Create file if it doesn't exist to avoid errors
    if not os.path.exists(LOG_FILE_PATH):
        with open(LOG_FILE_PATH, 'w') as f:
            f.write("--- Log Monitoring Started ---\n")

    try:
        with open(LOG_FILE_PATH, "r") as f:
            # Move to end of file
            f.seek(0, 2)
            
            while True:
                line = f.readline()
                if not line or not line.strip():
                    time.sleep(1)
                    continue
                
                # Determine log level
                level = "INFO"
                if "ERROR" in line.upper(): level = "ERROR"
                elif "WARN" in line.upper(): level = "WARN"

                payload = [{"message": line.strip(), "level": level}]
                
                try:
                    # Endpoint matches the controller logic: /api/logs/{serverId}
                    requests.post(f"{BASE_URL}/logs/{SERVER_ID}", json=payload)
                    print(f"[Log] Sent: {line.strip()[:40]}...")
                except Exception as e:
                    print(f"[Log Send Error] {e}")
                    
    except Exception as e:
        print(f"[Log File Error] {e}")

if __name__ == "__main__":
    print(f"--- Starting Agent for Server {SERVER_ID} ---")
    
    # 1. Start Metrics Thread
    metrics_thread = threading.Thread(target=collect_and_send_metrics, daemon=True)
    # 2. Start Logs Thread
    logs_thread = threading.Thread(target=monitor_and_send_logs, daemon=True)

    metrics_thread.start()
    logs_thread.start()

    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping Agent...")
