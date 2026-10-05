import React from 'react';
import { cn } from '../../utils/cn';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number; // 0 to 100
    color?: 'brand' | 'teal' | 'amber';
    height?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const Progress: React.FC<ProgressProps> = ({
    value,
    color = 'brand',
    height = 'md',
    showLabel = false,
    className,
    ...props
}) => {
    const normalizedValue = Math.min(100, Math.max(0, value));

    const heights = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    const colors = {
        brand: 'bg-gradient-to-r from-brand-500 to-brand-600',
        teal: 'bg-gradient-to-r from-teal-500 to-teal-600',
        amber: 'bg-gradient-to-r from-amber-400 to-amber-500',
    };

    return (
        <div className={cn('w-full space-y-1', className)} {...props}>
            {showLabel && (
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(normalizedValue)}%</span>
                </div>
            )}
            <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden p-0.5', heights[height])}>
                <div
                    className={cn('h-full rounded-full transition-all duration-500 ease-out', colors[color])}
                    style={{ width: `${normalizedValue}%` }}
                />
            </div>
        </div>
    );
};
