import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Base API configuration connecting to your Spring Boot backend
const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

/**
 * Fetches all registered servers
 */
export const fetchServers = async () => {
  try {
    const { data } = await API.get("/servers");
    return data;
  } catch (error) {
    console.error("Error fetching servers:", error);
    throw error;
  }
};

function getISTLocalDateTime(date) {
  return date
    .toLocaleString("sv-SE", { hour12: false })
    .replace(" ", "T");
}


function convertDateToIST(date) {
  const istOffset = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
  const utcTime = date.getTime();
  const istTime = new Date(utcTime + istOffset);

  const pad = n => String(n).padStart(2, "0");

  return (
    istTime.getFullYear() +
    "-" +
    pad(istTime.getMonth() + 1) +
    "-" +
    pad(istTime.getDate()) +
    "T" +
    pad(istTime.getHours()) +
    ":" +
    pad(istTime.getMinutes()) +
    ":" +
    pad(istTime.getSeconds())
  );
}



/**
 * Fetches historical metrics and maps them to frontend keys
 * Backend: cpuUsage, ramUsage, diskUsage
 * Frontend: cpu, ram, disk
 */

export const fetchMetrics = async (serverId, fromDate, toDate) => {
  const from = convertDateToIST(fromDate);
  const to = convertDateToIST(toDate);

  try {
    const { data } = await API.get(`/metrics`, {
      params: { serverId, from, to },
    });

    return data.map((m) => ({
      time: new Date(m.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      cpu: m.cpuUsage,
      ram: m.ramUsage,
      disk: m.diskUsage,
      rawTimestamp: m.timestamp,
    }));
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return [];
  }
};

export const fetchAlerts = async (serverId) => {
  const { data } = await API.get(`/alerts/servers/${serverId}`);
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

export const registerServer = async (serverData) => {
  // Additional Frontend Trim for better UX
  const cleanedData = {
    ...serverData,
    name: serverData.name.trim(),
    description: serverData.description?.trim() || "",
  };

  const response = await API.post(`/servers`, cleanedData);
  return response.data;
};

export const handleDelete = async (id) => {
  const data = await API.delete(`/servers/${id}`);
  return data;
};

export const fetchServerHistory = async (id) => {
  const { data } = await API.get(`/metrics/${id}/history`);
  return data;
};


