import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { getTranslation, useTranslation } from '../../utils/translations';
import {
    Sparkles,
    Menu,
    X,
    User as UserIcon,
    LogOut,
    BookOpen,
    BarChart2,
    Globe,
    ChevronDown,
    Shield
} from 'lucide-react';

export const Navbar: React.FC = () => {
    const { isAuthenticated, user, profile, logout, updateSupportLanguage } = useAuth();
    const { t, supportLangCode: currentSupportLangCode } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const supportLanguages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
        { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
        { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
        { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    ];

    const currentLangObj = supportLanguages.find(l => l.code === currentSupportLangCode) || supportLanguages[0];

    const handleLanguageSelect = async (code: string) => {
        await updateSupportLanguage(code);
        setIsLangDropdownOpen(false);
    };

    const handleLogout = async () => {
        await logout();
        setIsProfileDropdownOpen(false);
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to={isAuthenticated ? '/profile' : '/'} className="flex items-center space-x-3 group">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
                            <Sparkles className="w-6 h-6 animate-pulse-subtle" />
                        </div>
                        <div>
                            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans group-hover:text-brand-600 transition-colors">
                                LingoPath<span className="text-brand-600"> AI</span>
                            </span>
                            <span className="hidden sm:block text-[10px] uppercase tracking-wider font-semibold text-teal-600 -mt-1">
                                Dynamic Literacy Assistant
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        {!isAuthenticated ? (
                            <>
                                <a
                                    href="#features"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Features
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    How It Works
                                </a>
                                <a
                                    href="#languages"
                                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                                >
                                    <Globe className="w-4 h-4 text-teal-600" />
                                    Languages
                                </a>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/dashboard"
                                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${isActive('/dashboard')
                                        ? 'bg-brand-50 text-brand-700 font-semibold'
                                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <BarChart2 className="w-4 h-4 text-brand-600" />
                                    {t('nav_learn')}
                                </Link>

                                <Link
                                    to="/learning-path"
                                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${isActive('/learning-path')
                                        ? 'bg-brand-50 text-brand-700 font-semibold'
                                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    {t('nav_learning_path')}
                                </Link>

                                <Link
                                    to="/voice-learning"
                                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${isActive('/voice-learning')
                                        ? 'bg-brand-50 text-brand-700 font-semibold'
                                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    {t('nav_voice')}
                                </Link>

                                <Link
                                    to="/assessment"
                                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors flex items-center gap-1.5 ${isActive('/assessment')
                                        ? 'bg-brand-50 text-brand-700 font-semibold'
                                        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <BookOpen className="w-4 h-4 text-teal-600" />
                                    {t('nav_assessment')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Desktop Right CTA / Global Language Switcher / User Menu */}
                    <div className="hidden md:flex items-center space-x-3">
                        {/* Global Interface Language Switcher */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition-colors focus:outline-none border border-slate-200"
                                title="Switch Interface/Support Language"
                            >
                                <Globe className="w-4 h-4 text-brand-600" />
                                <span>{currentLangObj.flag} {currentLangObj.name}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                            </button>

                            {isLangDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                                    <div className="px-3 py-1.5 border-b border-slate-100">
                                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                            {getTranslation(currentSupportLangCode, 'switch_support_lang')}
                                        </p>
                                    </div>
                                    {supportLanguages.map(lang => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageSelect(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-xs font-semibold flex items-center justify-between hover:bg-brand-50 transition-colors ${currentSupportLangCode === lang.code ? 'text-brand-700 font-bold bg-brand-50/60' : 'text-slate-700'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </span>
                                            {currentSupportLangCode === lang.code && (
                                                <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!isAuthenticated ? (
                            <>
                                <Button variant="ghost" size="md" onClick={() => navigate('/login')}>
                                    Log In
                                </Button>
                                <Button variant="primary" size="md" onClick={() => navigate('/register')}>
                                    Get Started
                                </Button>
                            </>
                        ) : (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-slate-100/80 transition-colors focus:outline-none"
                                >
                                    <Avatar name={profile?.full_name || user?.full_name || 'User'} size="md" />
                                    <div className="text-left hidden lg:block">
                                        <p className="text-sm font-bold text-slate-800 leading-tight">
                                            {profile?.full_name || user?.full_name || 'Learner'}
                                        </p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <span>{getTranslation(currentSupportLangCode, 'target_language_label')}: {profile?.target_language?.name || 'English'}</span>
                                        </p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user?.email}</p>
                                            {profile && profile.comfortable_language && (
                                                <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
                                                    <span>Comfortable:</span>
                                                    <span className="font-semibold text-brand-700">
                                                        {profile.comfortable_language.flagEmoji} {profile.comfortable_language.name}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <UserIcon className="w-4 h-4 text-brand-600" />
                                                {getTranslation(currentSupportLangCode, 'nav_profile')}
                                            </Link>

                                            <Link
                                                to="/assessment"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                            >
                                                <BookOpen className="w-4 h-4 text-teal-600" />
                                                {getTranslation(currentSupportLangCode, 'nav_assessment')}
                                            </Link>

                                            <Link
                                                to="/admin"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2 font-bold"
                                            >
                                                <Shield className="w-4 h-4 text-purple-600" />
                                                {getTranslation(currentSupportLangCode, 'prof_admin_console') || 'Admin Dashboard'}
                                            </Link>

                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 mt-1 border-t border-slate-100"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                {getTranslation(currentSupportLangCode, 'nav_logout')}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button & Language Switcher */}
                    <div className="flex md:hidden items-center space-x-2">
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold bg-slate-100 text-slate-800 rounded-xl border border-slate-200"
                            title="Switch Interface Language"
                        >
                            <Globe className="w-3.5 h-3.5 text-brand-600" />
                            <span>{currentLangObj.flag} {currentLangObj.code.toUpperCase()}</span>
                        </button>
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2.5 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                            aria-label="Toggle mobile navigation menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Language Dropdown Modal when tapped on mobile */}
            {isLangDropdownOpen && (
                <div className="md:hidden bg-slate-50 border-b border-slate-200 p-3 space-y-2 animate-fade-in shadow-inner">
                    <p className="text-xs font-extrabold uppercase text-slate-500 tracking-wider px-1">
                        Select Interface Language
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {supportLanguages.map(l => (
                            <button
                                key={l.code}
                                onClick={() => handleLanguageSelect(l.code)}
                                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition text-left border ${
                                    currentSupportLangCode === l.code
                                        ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <span className="text-base">{l.flag}</span>
                                <span>{l.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Mobile Drawer Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-fade-in shadow-xl">
                    {/* Language Switcher inside drawer */}
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-extrabold text-slate-700">
                            <Globe className="w-4 h-4 text-brand-600" />
                            <span>Interface Language:</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {supportLanguages.map(l => (
                                <button
                                    key={l.code}
                                    onClick={() => handleLanguageSelect(l.code)}
                                    className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center border transition ${
                                        currentSupportLangCode === l.code
                                            ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                            : 'bg-white text-slate-700 border-slate-200'
                                    }`}
                                >
                                    {l.flag} {l.code.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isAuthenticated ? (
                        <>
                            <a
                                href="#features"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-slate-700 rounded-2xl hover:bg-slate-50"
                            >
                                Features
                            </a>
                            <a
                                href="#how-it-works"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-slate-700 rounded-2xl hover:bg-slate-50"
                            >
                                How It Works
                            </a>
                            <a
                                href="#languages"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-slate-700 rounded-2xl hover:bg-slate-50"
                            >
                                Languages
                            </a>
                            <div className="pt-4 border-t border-slate-100 space-y-2">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/login');
                                    }}
                                >
                                    Log In
                                </Button>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        navigate('/register');
                                    }}
                                >
                                    Get Started
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-2xl mb-2">
                                <Avatar name={profile?.full_name || 'Learner'} size="md" />
                                <div>
                                    <p className="text-base font-bold text-slate-900">{profile?.full_name}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                </div>
                            </div>

                            <Link
                                to="/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-slate-800 rounded-2xl hover:bg-slate-50 flex items-center gap-3"
                            >
                                <UserIcon className="w-5 h-5 text-brand-600" />
                                Profile
                            </Link>
                            <Link
                                to="/assessment"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-semibold text-slate-800 rounded-2xl hover:bg-slate-50 flex items-center gap-3"
                            >
                                <BookOpen className="w-5 h-5 text-teal-600" />
                                Take Assessment
                            </Link>
                            <Link
                                to="/admin"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-4 py-3 text-base font-bold text-purple-700 rounded-2xl hover:bg-purple-50 flex items-center gap-3"
                            >
                                <Shield className="w-5 h-5 text-purple-600" />
                                Admin Dashboard
                            </Link>

                            <div className="pt-4 border-t border-slate-100">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                >
                                    Log Out
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
