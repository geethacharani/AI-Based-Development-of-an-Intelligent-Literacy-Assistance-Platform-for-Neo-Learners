import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'amber';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            disabled,
            ...props
        },
        ref
    ) => {
        const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] select-none';

        const variants = {
            primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-soft hover:shadow-soft-hover border border-brand-500/30 rounded-2xl',
            secondary: 'bg-teal-600 hover:bg-teal-700 text-white shadow-soft hover:shadow-soft-hover rounded-2xl',
            amber: 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-soft hover:shadow-soft-hover font-bold rounded-2xl',
            outline: 'bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 hover:border-brand-300 rounded-2xl',
            ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 rounded-2xl',
        };

        const sizes = {
            sm: 'text-xs px-3.5 py-2 space-x-1.5',
            md: 'text-sm px-5 py-3 space-x-2',
            lg: 'text-base px-7 py-4 space-x-2.5 rounded-3xl',
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <>
                        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
                        <span>{children}</span>
                        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
                    </>
                )}
            </button>
        );
    }
);

Button.displayName = 'Button';
