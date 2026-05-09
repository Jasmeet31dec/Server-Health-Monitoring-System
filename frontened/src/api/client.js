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

// Helper to get ISO string without the UTC shift
const getLocalISOString = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(date - offset)).toISOString().slice(0, -1); 
    // .slice(0, -1) removes the "Z"
    return localISOTime;
};


/**
 * Fetches historical metrics and maps them to frontend keys
 * Backend: cpuUsage, ramUsage, diskUsage
 * Frontend: cpu, ram, disk
 */
export const fetchMetrics = async (serverId, fromDate, toDate) => {
    const from = getLocalISOString(new Date(fromDate));
    const to = getLocalISOString(new Date(toDate));

    console.log("Fetching metrics for range:", { from, to });
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

export const fetchAlerts = async (serverId) => {
    const { data } = await API.get(`/alerts/server/${serverId}`);
    return data;
};

export const fetchServerById = async (id) => {
    const { data } = await API.get(`/servers/${id}`);
    return data;
};

export const fetchLogs = async (serverId) => {
    const { data } = await API.get(`/logs/${serverId}`);
    return data;
};