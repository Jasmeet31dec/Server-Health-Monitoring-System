import axios from 'axios';

// Base API configuration connecting to your Spring Boot backend
const API = axios.create({
    baseURL: 'http://localhost:8081/api'
});

/**
 * Fetches all registered servers
 */
export const fetchServers = async () => {
    try {
        const { data } = await API.get('/servers');
        return data;
    } catch (error) {
        console.error("Error fetching servers:", error);
        throw error;
    }
};

/**
 * Fetches historical metrics and maps them to frontend keys
 * Backend: cpuUsage, ramUsage, diskUsage
 * Frontend: cpu, ram, disk
 */
export const fetchMetrics = async (serverId, from, to) => {
    try {
        const { data } = await API.get(`/metrics`, {
            params: { serverId, from, to }
        });
        
        return data.map(m => ({
            time: new Date(m.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }),
            cpu: m.cpuUsage,
            ram: m.ramUsage,
            disk: m.diskUsage,
            rawTimestamp: m.timestamp
        }));
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return [];
    }
};
