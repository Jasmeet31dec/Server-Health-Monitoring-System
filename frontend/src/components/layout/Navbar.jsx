import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Server, Shield, Sun, Moon } from 'lucide-react'; // Added Sun/Moon
import { useTheme } from '../../api/useTheme';

export const Navbar = () => {
    
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Activity className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl tracking-tight dark:text-white">
                            Server<span className="text-blue-600">Monitor</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <Server size={16} />
                            Infrastructure
                        </Link>
                        
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Shield size={16} className="text-emerald-500" />
                            System Secure
                        </div>

                        {/* 2. Enhanced Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 p-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 ring-blue-500/50 transition-all border border-slate-200 dark:border-slate-700"
                        >
                            {theme === 'light' ? (
                                <><Moon size={16} className="text-slate-600" /> <span className="text-xs font-semibold">Dark</span></>
                            ) : (
                                <><Sun size={16} className="text-amber-400" /> <span className="text-xs font-semibold">Light</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};