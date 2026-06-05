import time
import random
import argparse

# Allow choosing WHICH log file to spam
parser = argparse.ArgumentParser()
parser.add_argument("--path", default="app.log", help="Path to the log file")
args = parser.parse_args()

LOG_FILE = args.path
delay = 30  #random.uniform(1, 3)

messages = [
    "INFO: User logged in",
    "ERROR: Database timeout",
    "WARN: Memory threshold reached",
    "INFO: API request processed"
]

def spam():
    print(f"[*] Spammer writing to: {LOG_FILE}")
    while True:
        with open(LOG_FILE, "a") as f:
            f.write(f"[{time.strftime('%H:%M:%S')}] {random.choice(messages)}\n")
        time.sleep(delay)

if __name__ == "__main__":
    spam()
