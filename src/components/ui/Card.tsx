import React from 'react';
import { cn } from '../../utils/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    active?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverable = false, active = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-white rounded-3xl border border-indigo-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.06),0_2px_8px_rgba(79,70,229,0.04)] transition-all duration-300 p-6',
                    hoverable && 'hover:shadow-[0_16px_36px_-4px_rgba(79,70,229,0.14),0_6px_14px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-1 hover:border-brand-300 cursor-pointer',
                    active && 'ring-2 ring-brand-500 border-brand-500 bg-brand-50/30 shadow-soft-hover',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('mb-4 space-y-1', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
    <h3 className={cn('text-xl font-bold text-slate-900 tracking-tight', className)} {...props}>
        {children}
    </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, children, ...props }) => (
    <p className={cn('text-sm text-slate-500 leading-relaxed', className)} {...props}>
        {children}
    </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('space-y-4', className)} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
    <div className={cn('mt-6 pt-4 border-t border-slate-100 flex items-center justify-between', className)} {...props}>
        {children}
    </div>
);
