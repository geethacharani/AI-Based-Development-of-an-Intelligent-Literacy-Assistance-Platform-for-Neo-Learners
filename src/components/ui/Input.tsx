import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    helperText?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, helperText, error, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
                        {label}
                    </label>
                )}
                <div className="relative rounded-2xl shadow-sm">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full bg-white border border-slate-200 rounded-2xl py-3 text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all duration-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-slate-50 disabled:text-slate-500',
                            leftIcon ? 'pl-11' : 'pl-4',
                            rightIcon ? 'pr-11' : 'pr-4',
                            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                            className
                        )}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error ? (
                    <p className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>
                        {error}
                    </p>
                ) : helperText ? (
                    <p className="text-xs text-slate-500 mt-1">{helperText}</p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = 'Input';
