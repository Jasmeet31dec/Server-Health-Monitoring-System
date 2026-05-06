import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMetrics, fetchServers } from '../api/client';
import { MetricChart } from '../components/charts/MetricChart';
import { ChevronLeft, Clock, LayoutDashboard } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const ServerDetailPage = () => {
    const { id } = useParams();
    const [metrics, setMetrics] = useState([]);
    const [server, setServer] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadMetrics = useCallback(async () => {
        const to = new Date().toISOString();
        const from = new Date(Date.now() - 15 * 60000).toISOString(); // Last 15 mins for cleaner chart
        
        const data = await fetchMetrics(id, from, to);
        setMetrics(data);
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

    useEffect(() => {
        loadServerInfo();
        loadMetrics();
        const interval = setInterval(loadMetrics, 5000); // Poll every 5s for real-time effect
        return () => clearInterval(interval);
    }, [loadMetrics, loadServerInfo]);

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
                            <Badge variant={server.status === 'ONLINE' ? 'success' : 'danger'}>
                                {server.status}
                            </Badge>
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
        </div>
    );
};
