import React from 'react';
import { Bell, Search, UserCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
    onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ title, subtitle, onRefresh }) => {
    const { user } = useAuth();

    return (
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
            </div>

            <div className="flex items-center space-x-4">
                <a
                    href="/dashboard"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1 transition border border-slate-700"
                >
                    <span>🏠 Learner App</span>
                </a>

                {onRefresh && (
                    <button
                        onClick={onRefresh}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Refresh data"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                )}

                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>System Online</span>
                </div>

                <div className="h-6 w-px bg-slate-800" />

                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-brand-500 flex items-center justify-center text-white font-bold text-xs shadow">
                        {user?.full_name?.charAt(0) || 'A'}
                    </div>
                    <div className="text-left hidden sm:block">
                        <div className="text-xs font-bold text-slate-200">{user?.full_name || 'Admin User'}</div>
                        <div className="text-[10px] text-amber-400 font-medium">{user?.email || 'admin@lingopath.ai'}</div>
                    </div>
                </div>
            </div>
        </header>
    );
};
