import React from 'react';
import { Flame, Star, Sparkles } from 'lucide-react';
import { useTranslation } from '../../utils/translations';

interface StreakProgressTrackerProps {
    streakCount: number;
    totalXp: number;
    dailyGoalXp?: number;
    className?: string;
}

export const StreakProgressTracker: React.FC<StreakProgressTrackerProps> = ({
    streakCount,
    totalXp,
    dailyGoalXp = 50,
    className = ''
}) => {
    const { t } = useTranslation();

    // 7 days of the week calendar
    const days = [
        { label: t('day_mon'), key: 1 },
        { label: t('day_tue'), key: 2 },
        { label: t('day_wed'), key: 3 },
        { label: t('day_thu'), key: 4 },
        { label: t('day_fri'), key: 5 },
        { label: t('day_sat'), key: 6 },
        { label: t('day_sun'), key: 7 }
    ];

    // Get current day of week (1 = Mon ... 7 = Sun)
    const today = new Date().getDay() || 7;

    // Determine checked days based on streak count leading up to today
    const isDayActive = (dayKey: number) => {
        if (streakCount >= 7) return true;
        if (streakCount <= 0) return false;
        // Check days up to today within streak window
        const diff = today - dayKey;
        return diff >= 0 && diff < streakCount;
    };

    // XP calculation toward daily goal (clamp 0..100%)
    const xpToday = totalXp % dailyGoalXp === 0 && totalXp > 0 ? dailyGoalXp : totalXp % dailyGoalXp;
    const goalPercent = Math.min(100, Math.round((xpToday / dailyGoalXp) * 100));

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {/* 1. Visual 7-Day Streak Calendar */}
            <div className="p-4 sm:p-5 bg-white border-2 border-amber-200/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06),0_2px_8px_rgba(79,70,229,0.04)]">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                            <Flame className="w-5 h-5 fill-amber-200 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-amber-900">
                                {streakCount} {t('streak_card_title')}
                            </h4>
                            <p className="text-[11px] text-amber-700/80 font-medium">
                                {t('streak_card_desc')}
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                        {t('streak_active_badge')}
                    </span>
                </div>

                {/* 7-Day Visual Indicator Row */}
                <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
                    {days.map((d) => {
                        const active = isDayActive(d.key);
                        const isToday = d.key === today;

                        return (
                            <div
                                key={d.key}
                                className={`flex flex-col items-center py-1.5 px-1 rounded-xl transition-all ${
                                    isToday
                                        ? 'bg-amber-100/90 ring-2 ring-amber-400 font-extrabold'
                                        : 'bg-white/80 border border-amber-100/80'
                                }`}
                            >
                                <span className="text-[10px] text-slate-500 font-bold mb-1">
                                    {d.label}
                                </span>
                                <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                        active
                                            ? 'bg-amber-500 text-white shadow-xs scale-105'
                                            : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    {active ? '✓' : '○'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. Visual XP Milestone Progress */}
            <div className="p-4 sm:p-5 bg-white border-2 border-brand-200/90 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06),0_2px_8px_rgba(79,70,229,0.04)] flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-xs">
                                <Star className="w-5 h-5 fill-amber-300 text-brand-600" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-brand-900">
                                    ⭐ {totalXp} {t('total_xp')}
                                </h4>
                                <p className="text-[11px] text-brand-700/80 font-medium">
                                    {t('daily_target_label')}: {xpToday} / {dailyGoalXp} XP
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-extrabold text-teal-700 bg-teal-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-teal-600" /> {goalPercent}%
                        </span>
                    </div>

                    {/* Visual Segmented / Gradient Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/80 mt-2">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-teal-500 transition-all duration-500 shadow-xs"
                            style={{ width: `${goalPercent}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold pt-2">
                    <span>{t('level_scholar_label')}</span>
                    <span className="text-brand-600 font-bold">
                        {dailyGoalXp - xpToday > 0 ? `${dailyGoalXp - xpToday} ${t('xp_to_crown_label')}` : t('crown_unlocked_label')}
                    </span>
                </div>
            </div>
        </div>
    );
};
