import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const MetricChart = ({ data, dataKey, color, title }) => (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
            <span className="text-lg font-mono font-bold" style={{ color }}>
                {data.length > 0 ? `${Math.round(data[data.length - 1][dataKey])}%` : '--'}
            </span>
        </div>
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={color} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1}/>
                    <XAxis 
                        dataKey="time" 
                        hide={data.length > 20} 
                        tick={{fontSize: 10}} 
                        interval="preserveStartEnd"
                    />
                    <YAxis 
                        domain={[0, 100]} 
                        width={30} 
                        tick={{fontSize: 10}} 
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#0f172a', 
                            border: 'none', 
                            borderRadius: '8px', 
                            color: '#fff',
                            fontSize: '12px'
                        }}
                        itemStyle={{ color: color }}
                        cursor={{ stroke: color, strokeWidth: 1 }}
                    />
                    <Area 
                        type="monotone" 
                        dataKey={dataKey} 
                        stroke={color} 
                        fillOpacity={1} 
                        fill={`url(#color${dataKey})`} 
                        strokeWidth={2}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    </div>
);
