import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMetrics, fetchAlerts, fetchServerById, fetchLogs, fetchServerHistory, handleDelete } from '../api/client';
import { MetricChart } from '../components/charts/MetricChart';
import { ChevronLeft, Clock, LayoutDashboard, Trash2, Activity, TrendingUp } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { LogViewer } from '../components/tables/LogViewer';
import axios from 'axios';

export const ServerDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // --- State Management ---
    const [server, setServer] = useState(null);
    const [metrics, setMetrics] = useState([]);  // Live Data (Last 30m)
    const [history, setHistory] = useState([]);  // Trend Data (Last 24h)
    const [alerts, setAlerts] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('live'); // 'live' or 'trends'

    const clearLogs = () => setLogs([]);

    // --- Data Fetching: Live (Polling) ---
    const loadAllData = useCallback(async () => {
        const now = new Date();
        const thirtyMinsAgo = new Date(now.getTime() - 30 * 60000);
        try {
            const [serverData, metricData, alertData, logData] = await Promise.all([
                fetchServerById(id),
                fetchMetrics(id, thirtyMinsAgo, now),
                fetchAlerts(id),
                fetchLogs(id)
            ]);

            setServer(serverData);
            setMetrics(metricData);
            setAlerts(alertData);
            setLogs(prevLogs => {
                const existingIds = new Set(prevLogs.map(log => log.id));
                const newUniqueLogs = logData.filter(log => !existingIds.has(log.id));
                if (newUniqueLogs.length === 0) return prevLogs;
                return [...prevLogs, ...newUniqueLogs].slice(-100);
            });

        } catch (err) {
            console.error("Polling error:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    // --- Data Fetching: History (On Demand) ---
    const loadHistoryData = useCallback(async () => {
        try {
            const res = await fetchServerHistory(id);
            setHistory(res);
        } catch (err) {
            console.error("Failed to load history:", err);
        }
    }, [id]);

    const deleteServer = async (serverId) => {
        if (window.confirm("Are you sure? This will delete all history for this server.")) {
            try {
                await handleDelete(serverId);
                navigate('/');
            } catch (err) {
                alert("Error deleting server");
            }
        }
    }

    // --- Lifecycle Effects ---
    useEffect(() => {
        loadAllData();
        const interval = setInterval(loadAllData, 5000);
        return () => clearInterval(interval);
    }, [loadAllData]);

    // Fetch history only when the user switches to 'trends' mode
    useEffect(() => {
        if (viewMode === 'trends') {
            loadHistoryData();
        }
    }, [viewMode, loadHistoryData]);

    /*const formatTime = (timestamp) => {
        console.log("inside formattime : ",timestamp);
        if (!timestamp) return '---';

        // If Spring sends an array [2024, 5, 12, 10, 30], convert it to a Date
        let date;
        if (Array.isArray(timestamp)) {
            date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
        } else {
            date = new Date(timestamp);
            console.log("date : ",date,date.getTime());
        }

        return isNaN(date.getTime()) ? '---' : date.toLocaleTimeString([], { hour12: false });
    };*/

    const formatTime = (timestamp) => {
        if (!timestamp) return '---';

        let date;

        if (Array.isArray(timestamp)) {
            // Spring Boot LocalDateTime array format
            date = new Date(
                timestamp[0], timestamp[1] - 1, timestamp[2],
                timestamp[3], timestamp[4], timestamp[5]
            );
        } else if (timestamp instanceof Date) {
            // Already a Date object
            date = timestamp;
        } else if (typeof timestamp === 'string') {
            // String case (ISO from backend)
            date = new Date(timestamp);
        } else {
            return '---';
        }

        if (isNaN(date.getTime())) return '---';

        // Force conversion to IST
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };


    if (loading) return <div className="p-10 text-center animate-pulse">Synchronizing with node...</div>;
    if (!server) return <div className="p-10 text-center text-rose-500">Node not found</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><ChevronLeft /></Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{server.name}</h1>
                            <StatusBadge status={server.status} />
                        </div>
                        <p className="text-slate-500 font-mono text-sm uppercase tracking-tighter">API KEY: {server.apiKey?.substring(0, 12)}***</p>
                    </div>
                    <button onClick={() => deleteServer(id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                </div>

                {/* View Mode Switcher */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('live')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'live' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    >
                        <Activity size={16} /> Live View
                    </button>
                    <button
                        onClick={() => setViewMode('trends')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'trends' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}
                    >
                        <TrendingUp size={16} /> History (24h)
                    </button>
                </div>
            </div>

            {/* Conditional Charts Section */}
            {viewMode === 'live' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                    <MetricChart data={metrics} dataKey="cpu" color="#6366f1" title="Real-time CPU" />
                    <MetricChart data={metrics} dataKey="ram" color="#ec4899" title="Real-time RAM" />
                    <MetricChart data={metrics} dataKey="disk" color="#f59e0b" title="Real-time Disk" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2 duration-500">
                    <MetricChart data={history} dataKey="avgCpu" color="#6366f1" title="CPU 24h Trend" />
                    <MetricChart data={history} dataKey="avgRam" color="#ec4899" title="RAM 24h Trend" />
                </div>
            )}

            {/* System Info Card formatTime(metrics[metrics.length - 1].timestamp)*/}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6 font-bold text-lg">
                    <LayoutDashboard size={20} className="text-indigo-600" /> System Metrics Summary
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Status</div>
                        <div className="font-semibold">{server.status}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Last Data</div>
                        <div className="font-semibold text-indigo-600">
                            {metrics.length > 0 ? formatTime(metrics[metrics.length - 1].rawTimestamp) : '----'}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Email Alerts</div>
                        <div className="font-semibold truncate w-32">{server.alertEmail}</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-500 uppercase font-bold mb-1">Refresh Rate</div>
                        <div className="font-semibold">5s (Live) / 1h (Hist)</div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Alerts & Logs */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h2 className="font-bold flex items-center gap-2 underline decoration-indigo-500">Critical Incidents</h2>
                        <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] font-bold">{alerts.length} Total</span>
                    </div>
                    <div className="h-[400px] overflow-y-auto">
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {alerts.map(alert => (
                                    <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                        <td className="px-4 py-4 text-slate-400 font-mono whitespace-nowrap">{
                                            new Date(alert.timestamp).toLocaleString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true
                                            })
                                        }</td>
                                        <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{alert.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <LogViewer logs={logs} onClear={clearLogs} />
            </div>
        </div>
    );
};