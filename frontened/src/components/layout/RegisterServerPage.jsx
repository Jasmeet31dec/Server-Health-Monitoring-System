import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerServer } from '../../api/client';
import { ChevronLeft, Server, Mail, AlignLeft, Send } from 'lucide-react';

export const RegisterServerPage = () => {
    const [formData, setFormData] = useState({ name: '', description: '', alertEmail: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await registerServer(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to register server. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // min-h-screen and bg color prevents the "white flash" during navigation
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
            <div className="max-w-xl mx-auto">
                
                {/* Clean Top Navigation */}
                <button 
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
                >
                    <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Infrastructure</span>
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                                <Server size={28} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Register New Node</h1>
                                <p className="text-slate-500 text-sm">Set up monitoring for a new server instance.</p>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-rose-600 text-sm rounded-xl font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <Server size={16} className="text-slate-400" /> Server Name
                                </label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="e.g. Production-API-01"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <Server size={16} className="text-slate-400" /> Server IP Address
                                </label>
                                <input 
                                    required
                                    type="text"
                                    placeholder="e.g. 40.2.6.148"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    onChange={e => setFormData({...formData, ipAddress: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <AlignLeft size={16} className="text-slate-400" /> Description
                                </label>
                                <textarea 
                                    required
                                    placeholder="What is this server used for?"
                                    rows="3"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                                    onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    <Mail size={16} className="text-slate-400" /> Alert Notification Email
                                </label>
                                <input 
                                    required
                                    type="email"
                                    placeholder="admin@yourcompany.com"
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    onChange={e => setFormData({...formData, alertEmail: e.target.value})}
                                />
                                <p className="mt-2 text-xs text-slate-400">We will send critical load alerts to this address.</p>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Complete Registration
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};