import React from 'react';
import { cn } from '../../utils/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'brand' | 'teal' | 'amber' | 'neutral' | 'outline';
    size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
    className,
    variant = 'brand',
    size = 'md',
    children,
    ...props
}) => {
    const baseStyles = 'inline-flex items-center font-semibold rounded-full select-none';

    const variants = {
        brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
        teal: 'bg-teal-50 text-teal-700 border border-teal-200/60',
        amber: 'bg-amber-50 text-amber-800 border border-amber-200/60',
        neutral: 'bg-slate-100 text-slate-700 border border-slate-200/60',
        outline: 'bg-transparent text-slate-600 border border-slate-300',
    };

    const sizes = {
        sm: 'text-xs px-2.5 py-0.5 space-x-1',
        md: 'text-xs px-3 py-1 space-x-1.5',
    };

    return (
        <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
            {children}
        </span>
    );
};
