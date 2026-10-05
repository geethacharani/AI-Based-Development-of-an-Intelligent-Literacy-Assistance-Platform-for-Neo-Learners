import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../utils/translations';
import { Modal } from '../ui/Modal';
import { PWAInstallPrompt } from '../pwa/PWAInstallPrompt';
import { FloatingAITeacher } from '../ai/FloatingAITeacher';
import { LearnerBackground } from './LearnerBackground';
import {
    Sparkles,
    Globe,
    ChevronDown,
    Check,
    Award,
    User as UserIcon,
    Smartphone,
    Shield,
    LogOut,
    ArrowRight
} from 'lucide-react';

export const LearnerLayout: React.FC = () => {
    const { profile, user, logout, updateSupportLanguage, updateTargetLanguage } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const [isSupportLangOpen, setIsSupportLangOpen] = useState(false);
    const [isTargetLangOpen, setIsTargetLangOpen] = useState(false);
    const [showAchievementsModal, setShowAchievementsModal] = useState(false);
    const [showInstallModal, setShowInstallModal] = useState(false);

    const supportLangCode = profile?.comfortable_language?.code || 'en';
    const targetLangCode = profile?.target_language?.code || 'hi';
    const isAdmin = Boolean(user?.is_staff || user?.is_superuser);

    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(supportLangCode, key);

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

    // Main learning navigation items (top horizontal bar)
    interface LearningNavItem {
        path?: string;
        action?: () => void;
        icon: string;
        key?: Parameters<typeof getTranslation>[1];
        defaultLabel: string;
        badgeKey?: Parameters<typeof getTranslation>[1];
        badge?: string;
    }

    const learningNavItems: LearningNavItem[] = [
        { path: '/dashboard', icon: '🌱', defaultLabel: 'Learn', key: 'nav_learn' },
        { path: '/lingo-city', icon: '🌍', defaultLabel: 'Lingo City', key: 'nav_lingo_city', badge: 'NEW' },
        { path: '/lingobot', icon: '👗', defaultLabel: 'Dress LingoBot', key: 'nav_lingobot' },
        { path: '/learning-path', icon: '🗺️', defaultLabel: 'My Learning Path', key: 'nav_learning_path' },
        { path: '/assessment', icon: '📚', defaultLabel: 'Practice & Diagnostic', key: 'nav_practice' },
        { path: '/games', icon: '🎮', defaultLabel: 'Puzzles & Games', key: 'nav_games', badgeKey: 'nav_games_badge' },
        { path: '/insights', icon: '📊', defaultLabel: 'Progress', key: 'nav_insights' },
        { path: '/voice-learning', icon: '🎤', defaultLabel: 'Voice Studio', key: 'nav_voice' },
        { path: '/leaderboard', icon: '🏆', defaultLabel: 'Leaderboard', key: 'nav_leaderboard', badgeKey: 'nav_leaderboard_badge' },
        { action: () => setShowAchievementsModal(true), icon: '🏅', defaultLabel: 'Achievements', key: 'nav_achievements', badgeKey: 'nav_achievements_badge' },
    ];

    const isActive = (path?: string) => path && location.pathname === path;

    return (
        <div className="min-h-screen flex flex-col bg-transparent text-slate-900 font-sans antialiased relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
            {/* Ambient Multi-Layered Learning Background */}
            <LearnerBackground />

            {/* Top Bar: Brand Logo & Language Switchers */}
            <header className="bg-white/95 backdrop-blur-md border-b border-indigo-100/90 sticky top-0 z-30 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.07)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
                    {/* Brand */}
                    <Link to="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-teal-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
                            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                                LingoPath<span className="text-brand-600"> AI</span>
                            </span>
                            <span className="hidden sm:block text-[10px] uppercase tracking-wider font-extrabold text-teal-700 -mt-0.5">
                                {t('logo_subtitle')}
                            </span>
                        </div>
                    </Link>

                    {/* Language Switchers */}
                    <div className="flex items-center gap-2 sm:gap-3 text-xs">
                        {/* Interface Language */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSupportLangOpen(!isSupportLangOpen);
                                    setIsTargetLangOpen(false);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-indigo-200 rounded-xl font-semibold text-slate-800 shadow-2xs transition"
                                title="Switch Interface Language"
                            >
                                <span className="text-sm">{currentSupportLangObj.flag}</span>
                                <span className="hidden md:inline text-[11px] text-slate-500 font-normal">{t('ui_lang_label')}</span>
                                <span className="max-w-[85px] truncate font-bold text-slate-900">{currentSupportLangObj.name.split(' ')[0]}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {isSupportLangOpen && (
                                <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {t('switch_support_lang')}
                                    </div>
                                    {supportLanguages.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => handleSupportLangChange(lang.code)}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                                                supportLangCode === lang.code ? 'font-bold text-brand-700 bg-brand-50/60' : 'text-slate-700'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </span>
                                            {supportLangCode === lang.code && <Check className="w-3.5 h-3.5 text-brand-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Learning Target Language */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsTargetLangOpen(!isTargetLangOpen);
                                    setIsSupportLangOpen(false);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100/90 border border-brand-300 rounded-xl font-semibold text-brand-900 shadow-2xs transition"
                                title="Learning Target Language"
                            >
                                <span className="text-sm">{currentTargetLangObj.flag}</span>
                                <span className="hidden md:inline text-[11px] text-brand-700 font-normal">{t('target_lang_label')}</span>
                                <span className="max-w-[85px] truncate font-extrabold text-brand-800">{currentTargetLangObj.name.split(' ')[0]}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-brand-600" />
                            </button>

                            {isTargetLangOpen && (
                                <div className="absolute right-0 mt-1 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95">
                                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        {t('target_language_label')}
                                    </div>
                                    {targetLanguages.map(lang => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => handleTargetLangChange(lang.code)}
                                            className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-brand-50 transition ${
                                                targetLangCode === lang.code ? 'font-bold text-brand-700 bg-brand-50/60' : 'text-slate-700'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </span>
                                            {targetLangCode === lang.code && <Check className="w-3.5 h-3.5 text-brand-600" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Horizontal Learning Navigation Area (Top) */}
                <div className="border-t border-indigo-100/80 bg-gradient-to-r from-blue-50/80 via-indigo-50/70 to-teal-50/80 backdrop-blur-md shadow-xs">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto no-scrollbar">
                        <nav className="flex items-center gap-2 min-w-max">
                            {learningNavItems.map((item, idx) => {
                                const active = isActive(item.path);
                                const label = item.key ? t(item.key) : item.defaultLabel;

                                const buttonClasses = `inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shrink-0 cursor-pointer ${
                                    active
                                        ? 'bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-md ring-2 ring-brand-400/40'
                                        : 'bg-white hover:bg-brand-50 text-slate-800 hover:text-brand-700 border border-indigo-200/90 shadow-2xs'
                                }`;

                                const badgeText = item.badgeKey ? t(item.badgeKey) : item.badge;

                                if (item.path) {
                                    return (
                                        <Link key={idx} to={item.path} className={buttonClasses}>
                                            <span className="flex items-center gap-1.5">
                                                <span className="text-sm shrink-0">{item.icon}</span>
                                                <span>{label}</span>
                                            </span>
                                            {badgeText && (
                                                <span
                                                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                                                        active ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                                                    }`}
                                                >
                                                    {badgeText}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                }

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={item.action}
                                        className={buttonClasses}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            <span className="text-sm shrink-0">{item.icon}</span>
                                            <span>{label}</span>
                                        </span>
                                        {badgeText && (
                                             <span
                                                 className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                                                     active ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-700'
                                                 }`}
                                             >
                                                 {badgeText}
                                             </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content Area (Unchanged Dashboard / Child Views) */}
            <main className="flex-1 w-full relative z-10">
                <Outlet />
            </main>

            {/* ACCOUNT & MORE Section at the Bottom */}
            <section className="border-t border-indigo-100/90 bg-gradient-to-b from-white/70 via-indigo-50/50 to-teal-50/60 backdrop-blur-xs py-10 mt-12 relative z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                            {t('account_more_title')}
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* [ 👤 Profile & Settings ] */}
                        <Link
                            to="/profile"
                            className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-2xl hover:border-brand-300 hover:bg-brand-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                                    <UserIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-sm font-extrabold text-slate-800 group-hover:text-brand-600 transition-colors">
                                        {t('profile_settings_title')}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {t('profile_settings_desc')}
                                    </span>
                                </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                        </Link>

                        {/* [ 📱 Install LingoPath AI ] */}
                        <button
                            type="button"
                            onClick={() => setShowInstallModal(true)}
                            className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-2xl hover:border-teal-300 hover:bg-teal-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-extrabold text-slate-800 group-hover:text-teal-600 transition-colors">
                                        {t('install_app_title')}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {t('install_app_desc')}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-teal-100 text-teal-700 rounded-lg">
                                {t('install_app_badge')}
                            </span>
                        </button>

                        {/* [ ⚡ Admin Dashboard ] (Only visible to admin users) */}
                        {isAdmin && (
                            <Link
                                to="/admin"
                                className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-xs border border-purple-200/80 rounded-2xl hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <span className="block text-sm font-extrabold text-slate-800 group-hover:text-purple-600 transition-colors">
                                            {t('admin_dash_title')}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-medium">
                                            {t('admin_dash_desc')}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-purple-100 text-purple-700 rounded-lg">
                                    {t('admin_dash_badge')}
                                </span>
                            </Link>
                        )}

                        {/* [ ↪ Logout ] */}
                        <button
                            type="button"
                            onClick={handleLogout}
                            className={`flex items-center justify-between p-4 bg-white/95 backdrop-blur-xs border border-slate-200/80 rounded-2xl hover:border-rose-300 hover:bg-rose-50/40 hover:shadow-md hover:-translate-y-0.5 transition-all group text-left cursor-pointer ${
                                !isAdmin ? 'sm:col-span-2 md:col-span-1' : ''
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                                    <LogOut className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-extrabold text-slate-800 group-hover:text-rose-600 transition-colors">
                                        {t('logout_title')}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium">
                                        {t('logout_desc')}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-rose-500 group-hover:underline">
                                {t('nav_logout')}
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Achievements Modal */}
            {showAchievementsModal && (
                <Modal
                    isOpen={showAchievementsModal}
                    onClose={() => setShowAchievementsModal(false)}
                    className="bg-slate-900 border-slate-800 text-white"
                >
                    <div className="space-y-4 text-center">
                        <Award className="w-12 h-12 text-teal-400 mx-auto" />
                        <h3 className="text-xl font-extrabold text-white">
                            {t('achievements_modal_title')}
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs text-left">
                            <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                <div className="font-bold text-amber-400">{t('achievements_first_spark')}</div>
                                <div className="text-[10px] text-slate-400">{t('achievements_first_spark_desc')}</div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                <div className="font-bold text-teal-400">{t('achievements_voice_pioneer')}</div>
                                <div className="text-[10px] text-slate-400">{t('achievements_voice_pioneer_desc')}</div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                <div className="font-bold text-purple-400">{t('achievements_alphabet_master')}</div>
                                <div className="text-[10px] text-slate-400">{t('achievements_alphabet_master_desc')}</div>
                            </div>
                            <div className="p-3 bg-slate-800 rounded-xl space-y-1">
                                <div className="font-bold text-brand-400">{t('achievements_streak_warrior')}</div>
                                <div className="text-[10px] text-slate-400">{t('achievements_streak_warrior_desc')}</div>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Install PWA Modal */}
            {showInstallModal && (
                <Modal
                    isOpen={showInstallModal}
                    onClose={() => setShowInstallModal(false)}
                    className="bg-transparent border-none p-0 max-w-lg"
                >
                    <PWAInstallPrompt forceShow={true} onClose={() => setShowInstallModal(false)} />
                </Modal>
            )}

            {/* Feature 1: Floating AI Teacher / Chatbot (Fixed bottom-right corner) */}
            <FloatingAITeacher />
        </div>
    );
};
