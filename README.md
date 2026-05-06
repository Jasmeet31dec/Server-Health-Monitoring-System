# Server Health Monitoring System

A real-time monitoring platform that tracks CPU, RAM, Disk usage, and server uptime across multiple servers.  
Metrics are collected by lightweight agents and visualized on a React dashboard, with alerts triggered when thresholds are exceeded.

---

## 🚀 Features
- Collects CPU, RAM, Disk usage metrics
- Lightweight Python agent using `psutil`
- RESTful APIs built with Spring Boot
- PostgreSQL database for time-series storage
- React dashboard with interactive charts
- Basic alerting for high-load detection

---

## 🏗️ Project Structure
project-root/
│
├── backend/        # Spring Boot application
├── frontend/       # React + Vite dashboard
├── agent/          # Python metrics collector
└── docs/           # Documentation files


---

## ⚙️ How to Run Backend (Spring Boot + PostgreSQL)

1. **Configure PostgreSQL**
   - Create a database: `server_monitor`
   - Update `application.properties`:
     ```properties
     spring.datasource.url=jdbc:postgresql://localhost:5432/server_monitor
     spring.datasource.username=postgres
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     ```

2. **Run Backend**
   - Navigate to `backend/`
   - Build and run:
     ```bash
     mvn spring-boot:run
     ```
   - Backend will start at: `http://localhost:8080`

---

## 🖥️ How to Run Agent (Python Script)

1. **Install dependencies**
   ```bash
   pip install psutil requests
Run agent - 

Navigate to agent/
Run:
bash
python agent.py

Agent will send metrics every 10 seconds to backend at http://localhost:8080/api/metrics

Stop agent -
Press CTRL + C in terminal

🌐 How to Run Frontend (React + Vite)

Install dependencies

Navigate to frontend/

Run:

bash
npm install
Start development server

bash
npm run dev
Access dashboard

Open browser at: http://localhost:5173
