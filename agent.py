import psutil
import requests
import time
import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--server-id", type=int, required=True)
args = parser.parse_args()

# Configuration
API_URL = "http://localhost:8081/api/metrics"
#SERVER_ID = 1
SERVER_ID = args.server_id     # The ID of the server we registered in the DB
INTERVAL = 5   # Seconds between updates

def collect_and_send_metrics():
    print(f"Starting Health Monitoring Agent for Server ID: {SERVER_ID}...")
    
    while True:
        try:
            # 1. Collect System Metrics
            cpu = psutil.cpu_percent(interval=1)
            #cpu = 95.5
            ram = psutil.virtual_memory().percent
            disk = psutil.disk_usage('/').percent

            # 2. Prepare JSON Data
            # Note: We send the 'server' object with just the 'id'
            payload = {
                "cpuUsage": cpu,
                "ramUsage": ram,
                "diskUsage": disk,
                "server": {
                    "id": SERVER_ID
                }
            }

            # 3. Send to Spring Boot API
            response = requests.post(API_URL, json=payload)
            
            if response.status_code == 201:
                print(f"Success: CPU: {cpu}% | RAM: {ram}% | Disk: {disk}%")
            else:
                print(f"Failed: API returned {response.status_code}")
                print(response.text)

        except Exception as e:
            print(f"Error occurred: {e}")

        # Wait for the next interval
        time.sleep(INTERVAL)

if __name__ == "__main__":
    collect_and_send_metrics()
