import React from 'react';
import { cn } from '../../utils/cn';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    src?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', src, className, ...props }) => {
    const getInitials = (n: string) => {
        const parts = n.trim().split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return n.slice(0, 2).toUpperCase();
    };

    const sizes = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-lg',
        xl: 'w-20 h-20 text-2xl',
    };

    return (
        <div
            className={cn(
                'relative rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-tr from-brand-600 to-teal-500 shadow-soft shrink-0 border-2 border-white select-none',
                sizes[size],
                className
            )}
            {...props}
        >
            {src ? (
                <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
                <span>{getInitials(name)}</span>
            )}
        </div>
    );
};
