# Server Monitoring Dashboard

A high-performance real-time monitoring dashboard built with React, Tailwind CSS, and Recharts. This application connects to a Spring Boot backend and visualizes metrics sent by Python-based agents.

## Features

- **Live Infrastructure Overview**: See the status (Online/Offline) of all registered servers.
- **Real-time Metrics**: Polling logic refreshes charts every 5 seconds without page reload.
- **Interactive Visualizations**: High-quality Area Charts for CPU, RAM, and Disk usage.
- **Responsive Design**: Mobile-first UI that works on desktops, tablets, and phones.
- **Dark Mode Support**: Automatically respects system preferences or class-based themes.

## Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Running Spring Boot Backend at `http://localhost:8080`
- Active Python Agent sending data to the backend

## Installation

1. Create a new directory and initialize the project:
    mkdir monitor-ui && cd monitor-ui

2. Install all dependencies:
    npm install

3. Start the development server:
    npm run dev

The app will be available at `http://localhost:5173`.

## Configuration

### API Connection
The frontend is configured to talk to `http://localhost:8080/api`. If your backend is running elsewhere, update `src/api/client.js`:

    const API = axios.create({
        baseURL: 'https://your-api-domain.com/api'
    });

### Backend CORS (Crucial)
Ensure your Spring Boot controllers allow requests from the frontend origin:

    @CrossOrigin(origins = "http://localhost:5173")
    @RestController
    @RequestMapping("/api/servers")

## Project Structure

- `src/api`: Axios instance and backend services.
- `src/components/charts`: Recharts implementations.
- `src/components/ui`: Atomic UI components (Buttons, Badges, Cards).
- `src/pages`: Main application views (Dashboard and Details).
- `src/App.jsx`: Routing and layout shell.

## Troubleshooting

- **Empty Charts**: Ensure your Python agent is successfully POSTing data to the backend `/api/metrics` endpoint.
- **Connection Refused**: Check if your Spring Boot app is running and the `baseURL` in `client.js` is correct.
- **CORS Errors**: Verify that `@CrossOrigin` is added to your Spring Boot Controller classes.
