import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { learningPathService } from '../services/learningPathService';
import { AILearnerInsight, LearnerProgress } from '../types';
import {
    ArrowLeft,
    BarChart3,
    BookOpen,
    PenTool,
    Volume2,
    Mic,
    Brain,
    Flame,
    Star,
    Award,
    Sparkles,
    Target,
    Layers
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

export const ProgressPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [insight, setInsight] = useState<AILearnerInsight | null>(null);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const targetLang = profile?.target_language?.name || 'Hindi';
    const comfortLang = profile?.comfortable_language?.name || 'English';

    useEffect(() => {
        const loadProgressData = async () => {
            setIsLoading(true);
            try {
                const [ins, pData] = await Promise.all([
                    assessmentService.getAILearnerInsights().catch(() => null),
                    learningPathService.getLearningPath().then(res => res.progress).catch(() => null)
                ]);
                setInsight(ins);
                setProgress(pData);
            } catch (err) {
                console.error('Error loading progress data', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadProgressData();
    }, []);

    const skills = [
        {
            name: t('prog_skill_vocab'),
            icon: BookOpen,
            level: profile?.proficiency?.vocabulary_level || 'Intermediate',
            percent: 78,
            color: 'from-blue-500 to-cyan-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            description: 'Vocabulary acquisition in everyday conversations, objects, and verbs.',
            wordsCount: '142 Words Learned'
        },
        {
            name: t('prog_skill_reading'),
            icon: Layers,
            level: profile?.proficiency?.reading_level || 'Intermediate',
            percent: 72,
            color: 'from-emerald-500 to-teal-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-emerald-200',
            description: 'Reading comprehension and script decoding in the target script.',
            wordsCount: 'Grade 2 Reading Level'
        },
        {
            name: t('prog_skill_writing'),
            icon: PenTool,
            level: profile?.proficiency?.writing_level || 'Beginner',
            percent: 54,
            color: 'from-amber-500 to-orange-500',
            textColor: 'text-amber-600',
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-200',
            description: 'Sentence structures, punctuation, and proper letter formation.',
            wordsCount: '32 Sentences Constructed'
        },
        {
            name: t('prog_skill_listening'),
            icon: Volume2,
            level: 'Intermediate',
            percent: 85,
            color: 'from-purple-500 to-indigo-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            borderColor: 'border-purple-200',
            description: 'Auditory recognition of native pronunciation and conversational tempo.',
            wordsCount: '92% Audio Comprehension'
        },
        {
            name: t('prog_skill_speaking'),
            icon: Mic,
            level: profile?.proficiency?.speaking_level || 'Basic',
            percent: 68,
            color: 'from-rose-500 to-pink-500',
            textColor: 'text-rose-600',
            bgColor: 'bg-rose-50',
            borderColor: 'border-rose-200',
            description: 'Oral phoneme accuracy, intonation, and conversational response speed.',
            wordsCount: '94% Phoneme Accuracy'
        },
    ];

    const weeklyActivity = [
        { day: 'Mon', minutes: 25, active: true },
        { day: 'Tue', minutes: 40, active: true },
        { day: 'Wed', minutes: 15, active: true },
        { day: 'Thu', minutes: 35, active: true },
        { day: 'Fri', minutes: 50, active: true },
        { day: 'Sat', minutes: 20, active: true },
        { day: 'Sun', minutes: 30, active: true },
    ];

    const maxMinutes = Math.max(...weeklyActivity.map(d => d.minutes), 60);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 animate-fade-in text-slate-900">
            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('prog_back_home')}
                    </button>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-brand-600" />
                        {t('prog_title')}
                    </h1>
                    <p className="text-sm text-slate-600">
                        {t('prog_desc')} <span className="font-bold text-brand-700">({targetLang})</span>
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate('/learning-path')}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-sm flex items-center gap-2"
                    >
                        <Target className="w-4 h-4 text-emerald-400" />
                        {t('prog_view_path_btn')}
                    </button>
                </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{t('prog_total_xp')}</span>
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">
                        {progress?.xp_total || 220}
                    </div>
                    <span className="text-[11px] text-emerald-600 font-bold block">{t('prog_xp_today')}</span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{t('prog_active_streak')}</span>
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-400" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">
                        {progress?.streak_count || 5} {t('prog_days_label')}
                    </div>
                    <span className="text-[11px] text-orange-600 font-bold block">{t('prog_streak_keep')}</span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{t('prog_overall_mastery')}</span>
                        <Award className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900">
                        71.4%
                    </div>
                    <span className="text-[11px] text-brand-600 font-bold block">{t('prog_upper_beginner')}</span>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                        <span>{t('prog_target_language')}</span>
                        <Sparkles className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-slate-900 truncate">
                        {targetLang}
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">{t('prog_via_label')} {comfortLang}</span>
                </div>
            </div>

            {/* AI Diagnostics & Insights Banner */}
            {insight && (
                <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-slate-900 border border-brand-800 rounded-3xl p-6 text-white shadow-xl space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
                            <Brain className="w-5 h-5 animate-pulse" />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{t('prog_ai_insights_title')}</h2>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                        {insight.recommended_focus || `Based on your diagnostic checks, you demonstrate high phonetic recognition in ${targetLang}. Focus on building writing construction and sentence assembly to accelerate your fluency journey.`}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                        <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                            <span className="text-[11px] font-bold text-emerald-400 block uppercase">{t('prog_primary_strength')}</span>
                            <span className="text-xs font-extrabold text-white">Listening & Script Recognition</span>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                            <span className="text-[11px] font-bold text-amber-400 block uppercase">{t('prog_growth_opportunity')}</span>
                            <span className="text-xs font-extrabold text-white">Compound Word Assembly</span>
                        </div>
                        <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
                            <span className="text-[11px] font-bold text-cyan-400 block uppercase">{t('prog_recommended_next')}</span>
                            <span className="text-xs font-extrabold text-white">Word Tetris & Speaking Studio</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Core Skills Breakdown */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('prog_skill_breakdown')}</h2>
                    <span className="text-xs font-semibold text-slate-500">{t('prog_skill_eval')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {skills.map(s => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.name}
                                className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 hover:shadow-md transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-3 rounded-2xl ${s.bgColor} border ${s.borderColor} ${s.textColor}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">{s.name}</h3>
                                            <span className={`text-xs font-bold ${s.textColor}`}>{s.level}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">{s.percent}%</span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {s.description}
                                </p>

                                <div className="space-y-1.5 pt-2">
                                    <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`}
                                            style={{ width: `${s.percent}%` }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                                        <span>{s.wordsCount}</span>
                                        <span>{t('prog_goal_label')}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Weekly Practice Activity Chart */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-900">{t('prog_weekly_minutes')}</h2>
                        <p className="text-xs text-slate-500">{t('prog_weekly_desc')}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-base font-black text-brand-600">215 min</span>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">{t('prog_this_week')}</span>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-3 items-end h-40 pt-4 px-2 border-b border-slate-100 pb-4">
                    {weeklyActivity.map(day => {
                        const heightPercent = Math.round((day.minutes / maxMinutes) * 100);
                        return (
                            <div key={day.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                                <div className="text-[10px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition">
                                    {day.minutes}m
                                </div>
                                <div className="w-full max-w-[40px] bg-slate-100 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                                    <div
                                        className="w-full bg-gradient-to-t from-brand-600 to-teal-400 rounded-t-xl transition-all duration-500"
                                        style={{ height: `${heightPercent}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-600">{day.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
