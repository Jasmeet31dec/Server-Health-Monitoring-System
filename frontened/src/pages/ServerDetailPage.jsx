import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMetrics, fetchServers, fetchAlerts, fetchServerById, fetchLogs } from '../api/client';
import { MetricChart } from '../components/charts/MetricChart';
import { ChevronLeft, Clock, LayoutDashboard } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LogViewer } from '../components/tables/LogViewer';

export const ServerDetailPage = () => {
    const { id } = useParams();
    const [metrics, setMetrics] = useState([]);
    const [server, setServer] = useState(null);
    const [alerts, setAlerts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    /*const loadMetrics = useCallback(async () => {
        // Just pass the raw Date objects or timestamps
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);

        try {
            // Pass the actual Date objects, the client will format them
            const data = await fetchMetrics(id, thirtyMinsAgo, now);
            setMetrics(data);
        } catch (err) {
            console.error("Error:", err);
        }
    }, [id]);


    const loadServerInfo = useCallback(async () => {
        try {
            const servers = await fetchServers();
            const found = servers.find(s => s.id === parseInt(id));
            setServer(found);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const loadData = useCallback(async () => {
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);
        try {
            // Fetch both metrics and alerts in parallel
            const [metricData, alertData] = await Promise.all([
                fetchMetrics(id, thirtyMinsAgo, now),
                fetchAlerts(id)
            ]);

            setMetrics(metricData);
            setAlerts(alertData);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        }
    }, [id]);*/


    const loadAllData = useCallback(async () => {
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);
        try {
            // Fetch everything in one go every 5-10 seconds
            const [serverData, metricData, alertData, logData] = await Promise.all([
                fetchServerById(id),  // You need an API call for /api/servers/{id}
                fetchMetrics(id, thirtyMinsAgo, now),
                fetchAlerts(id),    // fetch alerts of server
                fetchLogs(id)      // fetch server logs
            ]);

            setServer(serverData);   // This updates the Status Badge
            setMetrics(metricData);  // This updates the Graphs
            setAlerts(alertData);    // This updates the Alert Table
            setLogs(logData);    // This updates the Log Table
        } catch (err) {
            console.error("Polling error:", err);
        } finally {
            // 3. THIS IS CRITICAL: Hide loading spinner even if there's an error
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadAllData(); // Initial load

        const interval = setInterval(() => {
            loadAllData();
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [loadAllData]);

    if (loading) return <div className="p-10 text-center">Loading server data...</div>;
    if (!server) return <div className="p-10 text-center text-rose-500">Server not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{server.name}</h1>

                            <StatusBadge status={server.status} />
                        </div>
                        <p className="text-slate-500 font-mono text-sm">{server.ipAddress} • {server.os}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-500/10 text-blue-600 px-4 py-2 rounded-full font-medium">
                    <Clock size={16} className="animate-pulse" />
                    Live Monitoring Active
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MetricChart
                    data={metrics}
                    dataKey="cpu"
                    color="#3b82f6"
                    title="CPU Load"
                />
                <MetricChart
                    data={metrics}
                    dataKey="ram"
                    color="#10b981"
                    title="Memory Usage"
                />
                <MetricChart
                    data={metrics}
                    dataKey="disk"
                    color="#f59e0b"
                    title="Disk Capacity"
                />
            </div>

            {/* Info Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4 font-bold text-lg">
                    <LayoutDashboard size={20} className="text-blue-600" />
                    System Specifications
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Architecture</div>
                        <div className="font-semibold">x64_64 bit</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monitoring Interval</div>
                        <div className="font-semibold">5 Seconds</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Data Point</div>
                        <div className="font-semibold">{metrics.length > 0 ? metrics[metrics.length - 1].time : 'Waiting...'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Agent Version</div>
                        <div className="font-semibold">v1.0.4-stable</div>
                    </div>
                </div>
            </div>

            {/* Alert Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="font-bold dark:text-white">Alert History</h2>
                </div>
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold">
                            <tr>
                                <th className="px-4 py-3">Time</th>
                                <th className="px-4 py-3">Issue</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {alerts.map(alert => (
                                <tr key={alert.id}>
                                    <td className="px-4 py-3 text-slate-400 font-mono">
                                        {new Date(alert.timestamp).toLocaleTimeString()}
                                    </td>
                                    <td className="px-4 py-3 dark:text-slate-200 font-medium">
                                        {alert.message}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Logs Table */}
            <LogViewer logs={logs}/>
        </div>
    );
};
