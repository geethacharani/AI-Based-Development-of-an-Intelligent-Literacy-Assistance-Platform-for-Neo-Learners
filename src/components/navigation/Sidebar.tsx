import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTranslation, useTranslation } from '../../utils/translations';
import { Modal } from '../ui/Modal';
import {
    Home,
    Map,
    BookOpen,
    Trophy,
    Award,
    Flame,
    BarChart3,
    Bot,
    Mic,
    User as UserIcon,
    Globe,
    ChevronDown,
    LogOut,
    Sparkles,
    Star,
    Menu,
    X,
    Gamepad2,
    Check,
    Target
} from 'lucide-react';

interface SidebarProps {
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
    const { profile, user, logout, updateSupportLanguage, updateTargetLanguage } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSupportLangOpen, setIsSupportLangOpen] = useState(false);
    const [isTargetLangOpen, setIsTargetLangOpen] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const targetLangCode = profile?.target_language?.code || 'hi';

    const supportLanguages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
        { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
        { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
        { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    ];

    const targetLanguages = [
        { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
        { code: 'en', name: 'English (English)', flag: '🇬🇧' },
        { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
        { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
        { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
        { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
        { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
    ];

    const currentSupportLangObj = supportLanguages.find(l => l.code === supportLangCode) || supportLanguages[0];
    const currentTargetLangObj = targetLanguages.find(l => l.code === targetLangCode) || targetLanguages[0];

    interface NavItem {
        path?: string;
        action?: () => void;
        label: string;
        icon: any;
        key?: string;
        badge?: string;
    }

    const topNavItems: NavItem[] = [
        { path: '/dashboard', label: 'Learn', icon: Home, key: 'nav_learn' },
        { path: '/learning-path', label: 'My Learning Path', icon: Map, key: 'nav_learning_path' },
        { path: '/assessment', label: 'Practice & Diagnostic', icon: BookOpen, key: 'nav_practice' },
        { path: '/games', label: 'Puzzles & Games', icon: Gamepad2, key: 'nav_games', badge: '5 GAMES' },
        { path: '/insights', label: 'Progress Report', icon: BarChart3, key: 'nav_insights' },
        { path: '/voice-learning', label: 'Voice Studio', icon: Mic, key: 'nav_voice' },
        { path: '/leaderboard', label: 'Leaderboard', icon: Trophy, key: 'nav_leaderboard', badge: 'TOP' },
        { action: () => setActiveModal('achievements'), label: 'Achievements', icon: Award, key: 'nav_achievements', badge: 'NEW' },
    ];

    const bottomNavItems: NavItem[] = [
        { path: '/profile', label: 'Profile & Settings', icon: UserIcon, key: 'nav_profile' },
        ...(user?.is_staff || user?.is_superuser || true ? [{ path: '/admin', label: 'Admin Dashboard', icon: Bot, key: 'nav_admin', badge: 'ADMIN' }] : []),
    ];

    const isActive = (path?: string) => path && location.pathname === path;

    const handleSupportLangChange = async (code: string) => {
        setIsSupportLangOpen(false);
        await updateSupportLanguage(code);
    };

    const handleTargetLangChange = async (code: string) => {
        setIsTargetLangOpen(false);
        await updateTargetLanguage(code);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const renderNavItem = (item: NavItem, idx: number) => {
        const active = isActive(item.path);
        const rawLabel = item.key ? t(item.key as any) : item.label;
        // When Lucide icon is rendered, strip duplicate emoji prefix from label
        const translatedLabel = rawLabel.replace(/^[\p{Emoji}\u200d\uFE0F]+\s*/u, '');

        return item.path ? (
            <Link
                key={idx}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${active
                    ? 'bg-brand-600 text-white font-extrabold shadow-md'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
            >
                <span className="flex items-center gap-3">
                    <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    <span>{translatedLabel}</span>
                </span>
                {item.badge && (
                    <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-extrabold text-amber-400 rounded-full border border-slate-700">
                        {item.badge}
                    </span>
                )}
            </Link>
        ) : (
            <button
                key={idx}
                onClick={item.action}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition text-left"
            >
                <span className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    <span>{translatedLabel}</span>
                </span>
                {item.badge && (
                    <span className="px-2 py-0.5 bg-slate-800 text-[10px] font-extrabold text-teal-400 rounded-full border border-slate-700">
                        {item.badge}
                    </span>
                )}
            </button>
        );
    };

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-900 text-slate-100 p-4 space-y-4 w-64 border-r border-slate-800 shadow-2xl overflow-y-auto">
            {/* App Brand Header */}
            <div className="flex items-center justify-between pt-2">
                <Link to="/dashboard" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                        <Sparkles className="w-5 h-5 text-slate-950" />
                    </div>
                    <div>
                        <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                            Lingo<span className="text-brand-400">Path</span>
                        </span>
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-teal-400 -mt-1">
                            AI Teacher
                        </span>
                    </div>
                </Link>
            </div>

            {/* Support / Interface Language Dropdown */}
            <div className="relative">
                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1 tracking-wider">
                    Interface Language:
                </label>
                <button
                    onClick={() => {
                        setIsSupportLangOpen(!isSupportLangOpen);
                        setIsTargetLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-2xl text-xs font-bold text-slate-200 transition shadow-sm"
                >
                    <span className="flex items-center gap-2 truncate">
                        <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="truncate">{currentSupportLangObj.flag} {currentSupportLangObj.name}</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isSupportLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSupportLangOpen && (
                    <div className="absolute top-14 left-0 right-0 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl py-1.5 z-50 animate-fade-in max-h-56 overflow-y-auto">
                        <div className="px-3 py-1 border-b border-slate-700/60 text-[10px] font-bold uppercase text-slate-400">
                            Select Support Language
                        </div>
                        {supportLanguages.map(l => (
                            <button
                                key={l.code}
                                onClick={() => handleSupportLangChange(l.code)}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-700/80 ${supportLangCode === l.code ? 'text-brand-400 font-bold bg-slate-700/50' : 'text-slate-300'}`}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    <span>{l.flag}</span>
                                    <span>{l.name}</span>
                                </span>
                                {supportLangCode === l.code && <Check className="w-3.5 h-3.5 text-brand-400 shrink-0" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Target Learning Language Dropdown */}
            <div className="relative">
                <label className="block text-[10px] font-extrabold uppercase text-amber-400 mb-1 tracking-wider">
                    Learning Target Language:
                </label>
                <button
                    onClick={() => {
                        setIsTargetLangOpen(!isTargetLangOpen);
                        setIsSupportLangOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-brand-950 to-slate-800 hover:from-brand-900 hover:to-slate-750 border border-brand-500/40 rounded-2xl text-xs font-bold text-white transition shadow-sm"
                >
                    <span className="flex items-center gap-2 truncate">
                        <Target className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="truncate">{currentTargetLangObj.flag} {currentTargetLangObj.name}</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isTargetLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isTargetLangOpen && (
                    <div className="absolute top-14 left-0 right-0 bg-slate-800 border border-brand-500/30 rounded-2xl shadow-2xl py-1.5 z-50 animate-fade-in max-h-56 overflow-y-auto">
                        <div className="px-3 py-1 border-b border-slate-700/60 text-[10px] font-bold uppercase text-amber-400">
                            Switch Learning Target
                        </div>
                        {targetLanguages.map(l => (
                            <button
                                key={l.code}
                                onClick={() => handleTargetLangChange(l.code)}
                                className={`w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between hover:bg-slate-700/80 ${targetLangCode === l.code ? 'text-amber-400 font-bold bg-amber-500/10' : 'text-slate-300'}`}
                            >
                                <span className="flex items-center gap-2 truncate">
                                    <span>{l.flag}</span>
                                    <span>{l.name}</span>
                                </span>
                                {targetLangCode === l.code && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* TOP SECTION: Main Learning Navigation Items */}
            <nav className="space-y-1 pt-1">
                {topNavItems.map((item, idx) => renderNavItem(item, idx))}
            </nav>

            {/* Vertical Separation Spacer */}
            <div className="flex-1 min-h-[16px]" />

            {/* BOTTOM SECTION: Account & Admin Options */}
            <div className="pt-3 border-t border-slate-800/80 space-y-1">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    Account & Admin
                </div>
                {bottomNavItems.map((item, idx) => renderNavItem(item, idx + 100))}
            </div>

            {/* Footer Stats & Logout */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-around p-2 bg-slate-800/60 rounded-2xl text-xs">
                    <div className="flex items-center gap-1 text-amber-400 font-extrabold">
                        <Flame className="w-4 h-4 fill-amber-400" />
                        <span>5 Days</span>
                    </div>
                    <div className="w-px h-4 bg-slate-700" />
                    <div className="flex items-center gap-1 text-teal-400 font-extrabold">
                        <Star className="w-4 h-4 fill-teal-400" />
                        <span>220 XP</span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold text-red-400 hover:bg-red-950/40 transition"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Permanent Sidebar */}
            <div className={`hidden md:block h-screen sticky top-0 shrink-0 ${className}`}>
                {sidebarContent}
            </div>

            {/* Mobile Sidebar Toggle Header */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
                <Link to="/dashboard" className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-400" />
                    <span className="font-extrabold text-base">LingoPath AI</span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-slate-800 rounded-xl text-slate-200"
                >
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-slate-950/80" onClick={() => setIsMobileOpen(false)} />
                    <div className="relative z-10 w-64 h-full">
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Top-level Root Modal (z-[100]) */}
            {activeModal && (
                <Modal
                    isOpen={!!activeModal}
                    onClose={() => setActiveModal(null)}
                    className="bg-slate-900 border-slate-800 text-white"
                >
                    {activeModal === 'league' && (
                        <div className="space-y-4 text-center">
                            <Trophy className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
                            <h3 className="text-xl font-extrabold text-white">Diamond League Leaderboard</h3>
                            <p className="text-xs text-slate-400">Ranked by weekly lesson XP gained.</p>
                            <div className="space-y-2 text-left text-xs font-semibold">
                                <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-xl flex justify-between items-center text-amber-300">
                                    <span>🥇 1. Priya Sharma</span>
                                    <span className="font-extrabold">450 XP</span>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl flex justify-between items-center text-slate-300">
                                    <span>🥈 2. Rahul Verma</span>
                                    <span className="font-extrabold">380 XP</span>
                                </div>
                                <div className="p-3 bg-brand-900/50 border border-brand-500 rounded-xl flex justify-between items-center text-white font-extrabold">
                                    <span>🥉 3. You ({profile?.full_name || 'Learner'})</span>
                                    <span className="text-brand-400">220 XP</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModal === 'achievements' && (
                        <div className="space-y-4 text-center">
                            <Award className="w-12 h-12 text-teal-400 mx-auto" />
                            <h3 className="text-xl font-extrabold text-white">{getTranslation(supportLangCode, 'achievements_modal_title')}</h3>
                            <div className="grid grid-cols-2 gap-3 text-xs text-left">
                                <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                    <div className="font-bold text-amber-400">{getTranslation(supportLangCode, 'achievements_first_spark')}</div>
                                    <div className="text-[10px] text-slate-400">{getTranslation(supportLangCode, 'achievements_first_spark_desc')}</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                    <div className="font-bold text-teal-400">{getTranslation(supportLangCode, 'achievements_voice_pioneer')}</div>
                                    <div className="text-[10px] text-slate-400">{getTranslation(supportLangCode, 'achievements_voice_pioneer_desc')}</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                    <div className="font-bold text-purple-400">{getTranslation(supportLangCode, 'achievements_alphabet_master')}</div>
                                    <div className="text-[10px] text-slate-400">{getTranslation(supportLangCode, 'achievements_alphabet_master_desc')}</div>
                                </div>
                                <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                    <div className="font-bold text-brand-400">{getTranslation(supportLangCode, 'achievements_streak_warrior')}</div>
                                    <div className="text-[10px] text-slate-400">{getTranslation(supportLangCode, 'achievements_streak_warrior_desc')}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </>
    );
};
