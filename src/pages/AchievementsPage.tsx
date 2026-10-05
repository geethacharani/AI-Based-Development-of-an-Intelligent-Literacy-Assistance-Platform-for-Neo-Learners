import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import {
    ArrowLeft,
    Trophy,
    Award,
    Flame,
    Star,
    Sparkles,
    Lock,
    CheckCircle2,
    Zap,
    Gamepad2,
    Mic,
    BookOpen,
    Target,
    ShieldAlert,
    Crown
} from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    category: 'milestones' | 'streaks' | 'games' | 'voice' | 'league';
    xpReward: number;
    current: number;
    target: number;
    unit: string;
    icon: string;
    color: string;
    isUnlocked: boolean;
    unlockedAt?: string;
}

export const AchievementsPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<'all' | 'unlocked' | 'progress' | 'locked'>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const streakCount = (profile as any)?.streak_days || 5;

    const achievements: Achievement[] = [
        {
            id: 'first_lesson',
            title: 'First Step to Fluency',
            description: 'Complete your very first lesson on LingoPath AI.',
            category: 'milestones',
            xpReward: 50,
            current: 1,
            target: 1,
            unit: 'lesson',
            icon: '🌱',
            color: 'from-emerald-500 to-teal-500',
            isUnlocked: true,
            unlockedAt: '3 days ago'
        },
        {
            id: 'streak_3',
            title: 'Ignition Spark',
            description: 'Maintain an active daily learning streak for 3 days.',
            category: 'streaks',
            xpReward: 75,
            current: Math.min(streakCount, 3),
            target: 3,
            unit: 'days',
            icon: '🔥',
            color: 'from-amber-500 to-orange-500',
            isUnlocked: streakCount >= 3,
            unlockedAt: '2 days ago'
        },
        {
            id: 'streak_7',
            title: 'Habit Master',
            description: 'Reach a continuous 7-day learning streak.',
            category: 'streaks',
            xpReward: 150,
            current: Math.min(streakCount, 7),
            target: 7,
            unit: 'days',
            icon: '⚡',
            color: 'from-orange-500 to-rose-500',
            isUnlocked: streakCount >= 7
        },
        {
            id: 'streak_30',
            title: 'Unstoppable Legend',
            description: 'Learn for 30 consecutive days without missing a single day.',
            category: 'streaks',
            xpReward: 500,
            current: Math.min(streakCount, 30),
            target: 30,
            unit: 'days',
            icon: '👑',
            color: 'from-purple-500 to-indigo-600',
            isUnlocked: streakCount >= 30
        },
        {
            id: 'game_tetris',
            title: 'Block Stacker',
            description: 'Score over 500 points in Word Tetris.',
            category: 'games',
            xpReward: 100,
            current: 820,
            target: 500,
            unit: 'pts',
            icon: '🧱',
            color: 'from-cyan-500 to-blue-600',
            isUnlocked: true,
            unlockedAt: 'Yesterday'
        },
        {
            id: 'game_memory',
            title: 'Card Sharp',
            description: 'Complete Memory Flip without exceeding the time limit.',
            category: 'games',
            xpReward: 80,
            current: 1,
            target: 1,
            unit: 'match',
            icon: '🃏',
            color: 'from-pink-500 to-rose-500',
            isUnlocked: true,
            unlockedAt: '1 day ago'
        },
        {
            id: 'game_duel',
            title: 'Boss Slayer',
            description: 'Defeat the Shadow Boss in Word Duel with full health.',
            category: 'games',
            xpReward: 150,
            current: 180,
            target: 300,
            unit: 'damage',
            icon: '⚔️',
            color: 'from-rose-600 to-red-600',
            isUnlocked: false
        },
        {
            id: 'voice_pronounce',
            title: 'Clear Voice',
            description: 'Attain 90%+ pronunciation accuracy in AI Voice Studio.',
            category: 'voice',
            xpReward: 120,
            current: 94,
            target: 90,
            unit: '%',
            icon: '🎤',
            color: 'from-blue-500 to-indigo-500',
            isUnlocked: true,
            unlockedAt: 'Today'
        },
        {
            id: 'voice_phrases',
            title: 'Fluent Speaker',
            description: 'Practice speaking 10 target-language sentences aloud.',
            category: 'voice',
            xpReward: 200,
            current: 6,
            target: 10,
            unit: 'phrases',
            icon: '🗣️',
            color: 'from-violet-500 to-purple-600',
            isUnlocked: false
        },
        {
            id: 'vocab_50',
            title: 'Word Collector',
            description: 'Master 50 target-language vocabulary words.',
            category: 'milestones',
            xpReward: 120,
            current: 34,
            target: 50,
            unit: 'words',
            icon: '📚',
            color: 'from-emerald-500 to-teal-600',
            isUnlocked: false
        },
        {
            id: 'league_top10',
            title: 'Diamond Contender',
            description: 'Finish in the Top 10 in Diamond League weekly leaderboard.',
            category: 'league',
            xpReward: 250,
            current: 4,
            target: 10,
            unit: 'rank',
            icon: '💎',
            color: 'from-cyan-400 to-blue-500',
            isUnlocked: true,
            unlockedAt: 'Last week'
        },
        {
            id: 'diagnostic_done',
            title: 'Self Discoverer',
            description: 'Complete the adaptive diagnostic placement assessment.',
            category: 'milestones',
            xpReward: 100,
            current: 1,
            target: 1,
            unit: 'test',
            icon: '🎯',
            color: 'from-teal-500 to-emerald-600',
            isUnlocked: true,
            unlockedAt: '3 days ago'
        }
    ];

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const totalCount = achievements.length;
    const totalXpEarned = achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0);

    const filtered = achievements.filter(item => {
        if (selectedTab === 'unlocked' && !item.isUnlocked) return false;
        if (selectedTab === 'locked' && item.isUnlocked) return false;
        if (selectedTab === 'progress' && (item.isUnlocked || item.current === 0)) return false;
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        return true;
    });

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 animate-fade-in text-slate-900">
            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('ach_back_home')}
                    </button>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-amber-500" />
                        {t('ach_title')}
                    </h1>
                    <p className="text-sm text-slate-600">
                        {t('ach_subtitle')}
                    </p>
                </div>

                {/* Quick Summary Pill */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                        🏆
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-900">{unlockedCount} / {totalCount}</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badges Unlocked</div>
                    </div>
                    <div className="border-l border-slate-200 pl-4">
                        <div className="text-xl font-black text-emerald-600">+{totalXpEarned} XP</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Badge Rewards</div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                    {[
                        { key: 'all', label: `All (${totalCount})` },
                        { key: 'unlocked', label: `Unlocked (${unlockedCount})` },
                        { key: 'progress', label: 'In Progress' },
                        { key: 'locked', label: `Locked (${totalCount - unlockedCount})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key as any)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                selectedTab === tab.key
                                    ? 'bg-slate-900 text-white shadow'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-400 font-semibold mr-1">Category:</span>
                    {['all', 'milestones', 'streaks', 'games', 'voice', 'league'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition ${
                                selectedCategory === cat
                                    ? 'bg-brand-100 text-brand-700'
                                    : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Achievement Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => {
                    const progressPercent = Math.min(100, Math.round((item.current / item.target) * 100));

                    return (
                        <div
                            key={item.id}
                            className={`relative rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                                item.isUnlocked
                                    ? 'bg-white border-amber-200/80 shadow-md hover:shadow-lg'
                                    : 'bg-slate-50/80 border-slate-200 opacity-90'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm bg-gradient-to-tr ${item.color} text-white`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-slate-900 leading-snug">
                                                {item.title}
                                            </h3>
                                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black">
                                        +{item.xpReward} XP
                                    </span>
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>

                            {/* Progress & Status */}
                            <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-500">Progress</span>
                                    <span className="text-slate-800">
                                        {item.current} / {item.target} {item.unit}
                                    </span>
                                </div>

                                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ${
                                            item.isUnlocked
                                                ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                                                : 'bg-gradient-to-r from-brand-500 to-teal-500'
                                        }`}
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    {item.isUnlocked ? (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600">
                                            <CheckCircle2 className="w-4 h-4" /> Unlocked {item.unlockedAt ? `• ${item.unlockedAt}` : ''}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                            <Lock className="w-3.5 h-3.5" /> Locked ({progressPercent}% done)
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
