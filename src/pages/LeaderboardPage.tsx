import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useTranslation } from '../utils/translations';
import { getLocalizedName } from '../utils/nameLocalization';
import {
    Trophy,
    Award,
    Flame,
    Star,
    Sparkles,
    Search,
    Crown,
    CheckCircle2,
    TrendingUp,
    Globe,
    Zap,
    BookOpen,
    ArrowLeft
} from 'lucide-react';

interface LeaderboardEntry {
    id: string;
    rank: number;
    full_name: string;
    avatar: string | null;
    comfortable_language: string;
    target_language: string;
    flag: string;
    weekly_xp: number;
    total_xp: number;
    streak_days: number;
    lessons_completed: number;
    accuracy_rate: number;
    league_tier: string;
    is_current_user: boolean;
}

export const LeaderboardPage: React.FC = () => {
    const { profile, user } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterPeriod, setFilterPeriod] = useState<'weekly' | 'alltime'>('weekly');
    const [searchQuery, setSearchQuery] = useState('');
    const [leagueName, setLeagueName] = useState('Diamond League 💎');
    const [resetDays, setResetDays] = useState(3);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            setIsLoading(true);
            try {
                const res = await api.get<{
                    league_name: string;
                    reset_days_remaining: number;
                    current_user_rank: number;
                    leaderboard: LeaderboardEntry[];
                }>('/leaderboard/');

                if (res && res.leaderboard) {
                    setEntries(res.leaderboard);
                    setLeagueName(res.league_name || 'Diamond League 💎');
                    setResetDays(res.reset_days_remaining || 3);
                }
            } catch (err) {
                console.error('Failed to load leaderboard from backend, using default entries:', err);
                // Fallback rich entries
                const currentName = profile?.full_name || user?.full_name || 'You';
                const defaultList: LeaderboardEntry[] = [
                    {
                        id: '1',
                        rank: 1,
                        full_name: 'Priya Sharma',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
                        comfortable_language: 'Telugu (తెలుగు)',
                        target_language: 'English',
                        flag: '🇬🇧',
                        weekly_xp: 940,
                        total_xp: 3450,
                        streak_days: 18,
                        lessons_completed: 42,
                        accuracy_rate: 96,
                        league_tier: 'Diamond 💎',
                        is_current_user: false
                    },
                    {
                        id: '2',
                        rank: 2,
                        full_name: 'Rahul Verma',
                        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
                        comfortable_language: 'Hindi (हिन्दी)',
                        target_language: 'English',
                        flag: '🇬🇧',
                        weekly_xp: 820,
                        total_xp: 2980,
                        streak_days: 14,
                        lessons_completed: 38,
                        accuracy_rate: 92,
                        league_tier: 'Gold 🥇',
                        is_current_user: false
                    },
                    {
                        id: '3',
                        rank: 3,
                        full_name: 'Ananya Reddy',
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
                        comfortable_language: 'Tamil (தமிழ்)',
                        target_language: 'English',
                        flag: '🇬🇧',
                        weekly_xp: 760,
                        total_xp: 2600,
                        streak_days: 12,
                        lessons_completed: 31,
                        accuracy_rate: 94,
                        league_tier: 'Silver 🥈',
                        is_current_user: false
                    },
                    {
                        id: '4',
                        rank: 4,
                        full_name: currentName,
                        avatar: null,
                        comfortable_language: profile?.comfortable_language?.name || 'Telugu',
                        target_language: profile?.target_language?.name || 'English',
                        flag: '🇬🇧',
                        weekly_xp: 680,
                        total_xp: 2300,
                        streak_days: 7,
                        lessons_completed: 24,
                        accuracy_rate: 91,
                        league_tier: 'Silver 🥈',
                        is_current_user: true
                    },
                    {
                        id: '5',
                        rank: 5,
                        full_name: 'Kiran Kumar',
                        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
                        comfortable_language: 'Kannada (ಕನ್ನಡ)',
                        target_language: 'English',
                        flag: '🇬🇧',
                        weekly_xp: 640,
                        total_xp: 2150,
                        streak_days: 9,
                        lessons_completed: 27,
                        accuracy_rate: 89,
                        league_tier: 'Bronze 🥉',
                        is_current_user: false
                    },
                    {
                        id: '6',
                        rank: 6,
                        full_name: 'Sneha Patel',
                        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
                        comfortable_language: 'Hindi (हिन्दी)',
                        target_language: 'Telugu',
                        flag: '🇮🇳',
                        weekly_xp: 580,
                        total_xp: 1890,
                        streak_days: 7,
                        lessons_completed: 22,
                        accuracy_rate: 88,
                        league_tier: 'Emerald 💚',
                        is_current_user: false
                    }
                ];
                setEntries(defaultList);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [profile, user]);

    // Sorting & Filtering
    const sortedEntries = [...entries].sort((a, b) => {
        if (filterPeriod === 'weekly') {
            return b.weekly_xp - a.weekly_xp;
        }
        return b.total_xp - a.total_xp;
    });

    const filteredEntries = sortedEntries.filter(e =>
        e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.comfortable_language.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.target_language.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const top1 = sortedEntries.find(e => e.rank === 1) || sortedEntries[0];
    const top2 = sortedEntries.find(e => e.rank === 2) || sortedEntries[1];
    const top3 = sortedEntries.find(e => e.rank === 3) || sortedEntries[2];

    const currentUserEntry = sortedEntries.find(e => e.is_current_user);

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
            {/* Back Button */}
            <div>
                <button
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> {t('lb_back_home')}
                </button>
            </div>

            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 border border-brand-500/30 p-6 md:p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-bold mb-3">
                            <Trophy className="w-4 h-4 text-amber-400" />
                            <span>{t('lb_weekly_sprint_badge')}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {t('lb_title')}
                        </h1>
                        <p className="text-slate-300 text-sm mt-1 max-w-xl">
                            {t('lb_desc')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/80 text-xs">
                        <div className="text-center px-2">
                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('lb_current_division')}</div>
                            <div className="text-base font-extrabold text-amber-400">{leagueName}</div>
                        </div>
                        <div className="w-px h-8 bg-slate-700" />
                        <div className="text-center px-2">
                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('lb_reset_in')}</div>
                            <div className="text-base font-extrabold text-teal-400">{resetDays} {t('lb_days_label')} ⏳</div>
                        </div>
                        <div className="w-px h-8 bg-slate-700" />
                        <div className="text-center px-2">
                            <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{t('lb_your_rank')}</div>
                            <div className="text-base font-extrabold text-white">
                                #{currentUserEntry ? currentUserEntry.rank : 4}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top 3 Podium Cards */}
            {!isLoading && sortedEntries.length >= 3 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
                    {/* 2nd Place Silver */}
                    <div className="order-2 md:order-1 bg-slate-900/90 border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-xl hover:border-slate-500 transition relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-700 text-slate-200 border border-slate-500 font-extrabold px-3 py-0.5 rounded-full text-xs shadow-md">
                            🥈 2nd Place
                        </div>
                        <div className="relative inline-block mt-2">
                            <div className="w-20 h-20 rounded-full border-4 border-slate-400 overflow-hidden mx-auto shadow-md">
                                {top2?.avatar ? (
                                    <img src={top2.avatar} alt={top2.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold text-xl">
                                        {top2?.full_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 right-0 bg-slate-800 text-slate-300 font-bold p-1 rounded-full text-xs border border-slate-600">
                                🥈
                            </div>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-white truncate">{getLocalizedName(top2?.full_name || '', supportLangCode)}</h3>
                            <p className="text-xs text-slate-400">{top2?.comfortable_language} → {top2?.target_language}</p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2 text-xs font-bold">
                            <span className="px-3 py-1 bg-slate-800 text-teal-400 rounded-full border border-slate-700 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-teal-400" /> {filterPeriod === 'weekly' ? top2?.weekly_xp : top2?.total_xp} XP
                            </span>
                            <span className="px-3 py-1 bg-slate-800 text-amber-400 rounded-full border border-slate-700 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {top2?.streak_days} Days
                            </span>
                        </div>
                    </div>

                    {/* 1st Place Gold Champion */}
                    <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/80 via-slate-900 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-7 text-center space-y-4 shadow-2xl relative transform -translate-y-2">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black px-4 py-1 rounded-full text-xs shadow-lg flex items-center gap-1">
                            <Crown className="w-4 h-4 text-slate-950" /> #1 Champion
                        </div>
                        <div className="relative inline-block mt-3">
                            <div className="w-24 h-24 rounded-full border-4 border-amber-400 overflow-hidden mx-auto shadow-xl ring-4 ring-amber-400/20">
                                {top1?.avatar ? (
                                    <img src={top1.avatar} alt={top1.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-amber-600 flex items-center justify-center text-white font-bold text-2xl">
                                        {top1?.full_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 right-0 bg-amber-400 text-slate-950 font-bold p-1 rounded-full text-sm shadow-md">
                                👑
                            </div>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-xl text-amber-300 truncate">{getLocalizedName(top1?.full_name || '', supportLangCode)}</h3>
                            <p className="text-xs text-amber-200/80">{top1?.comfortable_language} → {top1?.target_language}</p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2 text-xs font-bold">
                            <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-400/40 flex items-center gap-1">
                                <Star className="w-4 h-4 fill-amber-400" /> {filterPeriod === 'weekly' ? top1?.weekly_xp : top1?.total_xp} XP
                            </span>
                            <span className="px-3.5 py-1.5 bg-amber-500/20 text-amber-400 rounded-full border border-amber-400/40 flex items-center gap-1">
                                <Flame className="w-4 h-4 fill-amber-400" /> {top1?.streak_days} Days Streak
                            </span>
                        </div>
                    </div>

                    {/* 3rd Place Bronze */}
                    <div className="order-3 bg-slate-900/90 border border-slate-700 rounded-3xl p-6 text-center space-y-4 shadow-xl hover:border-slate-500 transition relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-800 text-amber-200 border border-amber-600 font-extrabold px-3 py-0.5 rounded-full text-xs shadow-md">
                            🥉 3rd Place
                        </div>
                        <div className="relative inline-block mt-2">
                            <div className="w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden mx-auto shadow-md">
                                {top3?.avatar ? (
                                    <img src={top3.avatar} alt={top3.full_name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-200 font-bold text-xl">
                                        {top3?.full_name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 right-0 bg-slate-800 text-amber-400 font-bold p-1 rounded-full text-xs border border-slate-600">
                                🥉
                            </div>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-lg text-white truncate">{getLocalizedName(top3?.full_name || '', supportLangCode)}</h3>
                            <p className="text-xs text-slate-400">{top3?.comfortable_language} → {top3?.target_language}</p>
                        </div>
                        <div className="flex items-center justify-center gap-3 pt-2 text-xs font-bold">
                            <span className="px-3 py-1 bg-slate-800 text-teal-400 rounded-full border border-slate-700 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-teal-400" /> {filterPeriod === 'weekly' ? top3?.weekly_xp : top3?.total_xp} XP
                            </span>
                            <span className="px-3 py-1 bg-slate-800 text-amber-400 rounded-full border border-slate-700 flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 fill-amber-400" /> {top3?.streak_days} Days
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Controls Bar (Filter Tabs + Search Bar) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
                    <button
                        onClick={() => setFilterPeriod('weekly')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${filterPeriod === 'weekly'
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>{t('lb_weekly_tab')}</span>
                    </button>
                    <button
                        onClick={() => setFilterPeriod('alltime')}
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${filterPeriod === 'alltime'
                            ? 'bg-brand-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>{t('lb_alltime_tab')}</span>
                    </button>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('lb_search_placeholder')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 transition"
                    />
                </div>
            </div>

            {/* Full Leaderboard Table / Column View */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-800/80 border-b border-slate-700/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                                <th className="py-4 px-6">{t('lb_col_rank')}</th>
                                <th className="py-4 px-6">{t('lb_col_learner')}</th>
                                <th className="py-4 px-6">{t('lb_col_lang_bridge')}</th>
                                <th className="py-4 px-6 text-center">{t('lb_col_xp')}</th>
                                <th className="py-4 px-6 text-center">{t('lb_col_streak')}</th>
                                <th className="py-4 px-6 text-center">{t('lb_col_lessons')}</th>
                                <th className="py-4 px-6 text-right">{t('lb_col_league')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-xs">
                            {filteredEntries.map((entry) => {
                                const isCurrentUser = entry.is_current_user;

                                return (
                                    <tr
                                        key={entry.id}
                                        className={`transition hover:bg-slate-800/60 ${isCurrentUser
                                            ? 'bg-brand-950/60 font-bold border-l-4 border-brand-500'
                                            : ''
                                            }`}
                                    >
                                        {/* Rank */}
                                        <td className="py-4 px-6 whitespace-nowrap font-extrabold">
                                            <div className="flex items-center gap-2">
                                                {entry.rank === 1 && <span className="text-xl">🥇</span>}
                                                {entry.rank === 2 && <span className="text-xl">🥈</span>}
                                                {entry.rank === 3 && <span className="text-xl">🥉</span>}
                                                {entry.rank > 3 && (
                                                    <span className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center font-bold text-xs">
                                                        #{entry.rank}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Learner & Avatar */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-200 font-bold">
                                                    {entry.avatar ? (
                                                        <img src={entry.avatar} alt={entry.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{entry.full_name.charAt(0)}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-white text-sm">{getLocalizedName(entry.full_name, supportLangCode)}</span>
                                                        {isCurrentUser && (
                                                            <span className="px-2 py-0.5 bg-brand-500 text-slate-950 text-[10px] font-black tracking-wider uppercase rounded-full shadow-sm">
                                                                {t('lb_you_label')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] text-slate-400 font-medium">
                                                        {t('lb_native_label')} {entry.comfortable_language}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Language Bridge */}
                                        <td className="py-4 px-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-teal-400 shrink-0" />
                                                <span className="text-slate-300 font-semibold">
                                                    {t('lb_learning_label')} <strong className="text-white">{entry.target_language}</strong> {entry.flag}
                                                </span>
                                            </div>
                                        </td>

                                        {/* XP Earned */}
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/30 rounded-full text-teal-300 font-extrabold">
                                                <Star className="w-3.5 h-3.5 fill-teal-400" />
                                                <span>{filterPeriod === 'weekly' ? entry.weekly_xp : entry.total_xp} XP</span>
                                            </div>
                                        </td>

                                        {/* Daily Streak */}
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 font-extrabold">
                                                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                                                <span>{entry.streak_days} {t('lb_days_label')}</span>
                                            </div>
                                        </td>

                                        {/* Lessons & Accuracy */}
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="text-slate-200 font-bold flex items-center justify-center gap-2">
                                                <span className="flex items-center gap-1 text-slate-300">
                                                    <BookOpen className="w-3.5 h-3.5 text-slate-400" /> {entry.lessons_completed} {t('lb_lessons_label')}
                                                </span>
                                                <span className="text-slate-500">•</span>
                                                <span className="text-teal-400">{entry.accuracy_rate}% {t('lb_acc_label')}</span>
                                            </div>
                                        </td>

                                        {/* League Tier */}
                                        <td className="py-4 px-6 whitespace-nowrap text-right">
                                            <span className="px-3 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded-full font-bold text-xs">
                                                {entry.league_tier}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
