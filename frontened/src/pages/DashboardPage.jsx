import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchServers } from '../api/client';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Server, ArrowRight, RefreshCw, Cpu, HardDrive } from 'lucide-react';

export const DashboardPage = () => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchServers();
            setServers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Infrastructure Overview</h1>
                    <p className="text-slate-500 mt-1">Manage and monitor your fleet of active servers.</p>
                </div>
                <button 
                    onClick={loadData}
                    className="flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-48 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {servers.map(server => (
                        <Card key={server.id} className="group hover:border-blue-500/50 transition-all">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl">
                                        <Server className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <StatusBadge status={server.status} />
                                </div>
                                
                                <h3 className="text-xl font-bold mb-1">{server.name}</h3>
                                <p className="text-sm text-slate-500 font-mono mb-6">{server.ipAddress}</p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                                        <Cpu size={14} /> {server.os}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                                        <HardDrive size={14} /> Active
                                    </div>
                                </div>

                                <Link 
                                    to={`/server/${server.id}`}
                                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
                                >
                                    View Metrics
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </Card>
                    ))}
                    {servers.length === 0 && (
                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                            <Server className="mx-auto w-12 h-12 text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium">No servers detected</h3>
                            <p className="text-slate-500">Ensure your Python agent is sending heartbeats.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
