import React from 'react';
import { twMerge } from 'tailwind-merge';

export const Card = ({ children, className }) => (
    <div className={twMerge(
        'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden',
        className
    )}>
        {children}
    </div>
);
