import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchServers } from '../api/client';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Server, ArrowRight, RefreshCw, Cpu, HardDrive, Search, Filter } from 'lucide-react';

export const DashboardPage = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const navigate = useNavigate();

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchServers();
            setServers(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { loadData(); }, []);

    // --- LOGIC: Search and Filter ---
    const filteredServers = useMemo(() => {
        return servers.filter(server => {
            const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === "ALL" || server.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [servers, searchQuery, statusFilter]);

    // --- UX: Quick Stats ---
    const stats = {
        total: servers.length,
        healthy: servers.filter(s => s.status === 'HEALTHY').length,
        critical: servers.filter(s => s.status === 'HIGH_LOAD').length
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Infrastructure</h1>
                    <p className="text-slate-500">Real-time status of your connected nodes.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button onClick={loadData} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={() => navigate('/register-server')}
                        className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                    >
                        + Register Server
                    </button>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Servers</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-emerald-500 uppercase">Healthy</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.healthy}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-amber-500 uppercase">High Load</p>
                    <p className="text-2xl font-bold text-amber-600">{stats.critical}</p>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Search by server name..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <select 
                    className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="HEALTHY">Healthy Only</option>
                    <option value="HIGH_LOAD">High Load Only</option>
                    <option value="OFFLINE">Offline Only</option>
                </select>
            </div>

            {/* Grid Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-56 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServers.map(server => (
                        <Card key={server.id} className="relative group border-transparent hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-2xl">
                                        <Server size={24} />
                                    </div>
                                    <StatusBadge status={server.status} />
                                </div>

                                <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-600 transition-colors">{server.name}</h3>
                                <p className="text-sm text-slate-500 mb-6 truncate">{server.description || 'No description provided'}</p>

                                <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Cpu size={14} /> <span>CPU: {server.latestCpu || '0'}%</span>
                                    </div>
                                    <Link 
                                        to={`/server/${server.id}`}
                                        className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline"
                                    >
                                        Details <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            
            {/* Empty State */}
            {!loading && filteredServers.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-500 font-medium">No servers found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};