import React from 'react';
import {
    LayoutDashboard,
    Users,
    FileQuestion,
    CheckSquare,
    Globe,
    Route,
    BookOpen,
    Gamepad2,
    Activity,
    BarChart3,
    Settings,
    LogOut,
    Sparkles,
    Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export type AdminTab =
    | 'overview'
    | 'learners'
    | 'assessments'
    | 'assessment_results'
    | 'languages'
    | 'learning_paths'
    | 'lessons'
    | 'games'
    | 'progress'
    | 'reports'
    | 'settings';

interface AdminSidebarProps {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'learners', label: 'Learners', icon: Users },
        { id: 'assessments', label: 'Assessments', icon: FileQuestion },
        { id: 'assessment_results', label: 'Assessment Results', icon: CheckSquare },
        { id: 'languages', label: 'Languages', icon: Globe },
        { id: 'learning_paths', label: 'Learning Paths', icon: Route },
        { id: 'lessons', label: 'Lessons & Content', icon: BookOpen },
        { id: 'games', label: 'Puzzles & Games', icon: Gamepad2 },
        { id: 'progress', label: 'Progress Monitoring', icon: Activity },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 text-slate-300">
            {/* Logo Header */}
            <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-white text-lg tracking-tight">LingoPath</span>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold">ADMIN</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Control Panel</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as AdminTab)}
                            className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                                }`}
                        >
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Switch back to Learner View & Logout */}
            <div className="p-3 border-t border-slate-800 space-y-1">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>View Learner Dashboard</span>
                </button>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
