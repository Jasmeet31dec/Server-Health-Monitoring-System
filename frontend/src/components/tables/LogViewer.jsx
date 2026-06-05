import React, { useEffect, useRef } from 'react';

export const LogViewer = ({ logs , onClear}) => {
    const scrollRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div className="group relative mt-6 rounded-lg bg-black p-1 shadow-2xl ring-1 ring-white/10">
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-zinc-900/50 px-4 py-2 rounded-t-md">
                <div className="flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">bash — 80x24</span>
                <button
                    onClick={onClear}
                    className="text-[10px] text-zinc-500 hover:text-white border border-zinc-700 px-2 py-0.5 rounded transition-colors"
                >
                    CLEAR CONSOLE
                </button>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="relative h-[400px] overflow-y-auto bg-[#0a0a0a] p-4 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800"
            >
                {/* Subtle Scanline Effect */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                {logs.map((log, i) => (
                    <div key={i} className="flex gap-3 hover:bg-white/5 transition-colors">
                        <span className="text-zinc-600 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                        <span className={`font-bold ${log.level === 'ERROR' ? 'text-red-500' :
                                log.level === 'WARN' ? 'text-yellow-500' : 'text-emerald-500'
                            }`}>
                            {log.level}:
                        </span>
                        <span className="text-zinc-300">
                            <span className="text-zinc-500">$</span> {log.message}
                        </span>
                    </div>
                ))}

                {/* Pulsing Cursor */}
                <div className="flex gap-2 items-center mt-1">
                    <span className="text-emerald-500 font-bold">root@monitor:~#</span>
                    <span className="h-4 w-2 bg-emerald-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
};