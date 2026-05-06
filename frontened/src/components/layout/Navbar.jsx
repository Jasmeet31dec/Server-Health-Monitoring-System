import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Server, Shield } from 'lucide-react';

export const Navbar = () => (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Activity className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">
                        Server<span className="text-blue-600">Monitor</span>
                    </span>
                </Link>
                
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <Server size={16} />
                        Infrastructure
                    </Link>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Shield size={16} className="text-emerald-500" />
                        System Secure
                    </div>
                </div>
            </div>
        </div>
    </nav>
);
