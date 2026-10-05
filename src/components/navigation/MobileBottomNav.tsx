import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Map, Gamepad2, Trophy, User } from 'lucide-react';

interface NavItem {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
    matchPaths: string[];
}

const NAV_ITEMS: NavItem[] = [
    {
        label: 'Learn',
        path: '/dashboard',
        icon: BookOpen,
        matchPaths: ['/dashboard', '/learn']
    },
    {
        label: 'My Path',
        path: '/learning-path',
        icon: Map,
        matchPaths: ['/learning-path']
    },
    {
        label: 'Games',
        path: '/games',
        icon: Gamepad2,
        matchPaths: ['/games']
    },
    {
        label: 'League',
        path: '/leaderboard',
        icon: Trophy,
        matchPaths: ['/leaderboard']
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: User,
        matchPaths: ['/profile']
    },
];

export const MobileBottomNav: React.FC = () => {
    const location = useLocation();

    return (
        <nav
            aria-label="Mobile Navigation"
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-2 safe-bottom"
        >
            <div className="flex items-center justify-around max-w-lg mx-auto">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.matchPaths.some(p => location.pathname === p || (p !== '/dashboard' && location.pathname.startsWith(p)));

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                                isActive
                                    ? 'text-brand-600 font-extrabold scale-105'
                                    : 'text-slate-500 hover:text-slate-800 font-semibold'
                            }`}
                        >
                            <div className={`p-1 rounded-xl transition-colors ${
                                isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-500'
                            }`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};
