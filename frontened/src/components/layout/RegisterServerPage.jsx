import React, { useState } from 'react';
import axios from 'axios';

export const RegisterServerPage = () => {
    const [formData, setFormData] = useState({ name: '', description: '', tags: '' });
    const [apiKey, setApiKey] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Change URL to your Spring Boot Backend address
            const response = await axios.post('http://localhost:8081/api/servers', formData);
            setApiKey(response.data.apiKey);
        } catch (err) {
            alert("Registration failed. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">Register New Server</h2>
            
            {!apiKey ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Server Name</label>
                        <input 
                            required
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="e.g. Job-Application-Backend"
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-lg outline-none"
                            placeholder="Primary MERN app hosted on Render"
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors"
                    >
                        {loading ? 'Generating...' : 'Generate API Key'}
                    </button>
                </form>
            ) : (
                <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-dashed border-emerald-500 rounded-xl">
                        <p className="text-emerald-700 dark:text-emerald-400 font-bold text-center mb-4">
                            ✅ Server Registered Successfully!
                        </p>
                        <div className="bg-white dark:bg-slate-800 p-4 rounded border shadow-inner">
                            <p className="text-xs uppercase text-slate-500 font-bold mb-2">Your API Key (Copy Now)</p>
                            <code className="text-lg font-mono text-indigo-600 break-all select-all block">
                                {apiKey}
                            </code>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 italic">
                        * Use this key in your MERN app's environment variables to begin monitoring.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/'}
                        className="w-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white py-2 rounded-lg"
                    >
                        Return to Dashboard
                    </button>
                </div>
            )}
        </div>
    );
};

