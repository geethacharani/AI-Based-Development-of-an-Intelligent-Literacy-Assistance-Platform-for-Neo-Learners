import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { learningPathService } from '../services/learningPathService';
import { AILearnerInsight, LearnerProgress, FeedItem } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from '../utils/translations';
import { AlphabetExplorer } from '../components/learning/AlphabetExplorer';
import { DailyAIChallengeCard } from '../components/learning/DailyAIChallengeCard';
import { ExploreLingoPath } from '../components/learning/ExploreLingoPath';
import { StreakProgressTracker } from '../components/learning/StreakProgressTracker';
import { CompactLearningPathPreview } from '../components/learning/CompactLearningPathPreview';
import { LingoBot } from '../components/common/LingoCharacters';
import {
    Flame,
    Star,
    Trophy,
    Target,
    BookOpen,
    Brain,
    Mic,
    PenTool,
    Sparkles,
    ArrowRight,
    Play,
    Heart,
    MessageSquare,
    Compass,
    Volume2
} from 'lucide-react';

import { PWAInstallPrompt } from '../components/pwa/PWAInstallPrompt';

export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [insight, setInsight] = useState<AILearnerInsight | null>(null);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const supportLangCode = profile?.comfortable_language?.code || 'en';
    const targetLangCode = profile?.target_language?.code || 'hi';
    const learnerName = profile?.full_name || 'Learner';
    const targetLangName = profile?.target_language?.name || 'Hindi';

    const { t } = useTranslation();

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true);
            try {
                const [insightData, pathData] = await Promise.all([
                    assessmentService.getAILearnerInsights(),
                    learningPathService.getLearningPath()
                ]);
                setInsight(insightData);
                setProgress(pathData.progress);
                setFeedItems(learningPathService.getFeedItems());
            } catch (err) {
                console.error('Error loading dashboard data', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const handleCelebrateFeedItem = (id: string) => {
        setFeedItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, celebrate_count: item.celebrate_count + 1 } : item
            )
        );
    };

    const getFeedContent = (item: FeedItem) => {
        if (item.id === 'feed_1') return t('feed_1_content');
        if (item.id === 'feed_2') return t('feed_2_content');
        if (item.id === 'feed_3') return t('feed_3_content');
        return item.content;
    };

    if (isLoading || !progress || !insight) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">Loading your learner dashboard...</p>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
            {/* Top Welcome Banner Card */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                {/* Subtle Decorative Ambient Shapes in Hero Banner */}
                <div className="absolute -right-8 -bottom-10 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                <div className="absolute top-2 right-1/3 w-36 h-36 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute -top-10 left-1/4 w-28 h-28 rounded-full bg-teal-400/10 blur-xl pointer-events-none" />

                <div className="space-y-2 z-10">
                    <Badge variant="amber" size="sm" className="font-extrabold text-slate-950 bg-amber-400 border-none">
                        🌱 {t('literacy_journey_active')}
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {t('welcome_back')}, {learnerName} 👋
                    </h1>
                    <p className="text-brand-100 text-sm sm:text-base font-medium max-w-xl">
                        {t('practicing_literacy_prefix')} <strong className="text-white font-bold">{targetLangName}</strong> {t('practicing_literacy_suffix')}
                    </p>
                </div>

                {/* Gamified Stats Summary & Mascot */}
                <div className="flex items-center gap-3 shrink-0 z-10">
                    <LingoBot size="md" expression="happy" className="hidden sm:inline-flex shrink-0" />

                    <div className="px-4 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center">
                        <div className="flex items-center gap-1 text-amber-300 font-extrabold text-lg">
                            <Flame className="w-5 h-5 fill-amber-400" />
                            <span>{progress.streak_count}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-100">{t('day_streak')}</span>
                    </div>

                    <div className="px-4 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center">
                        <div className="flex items-center gap-1 text-teal-300 font-extrabold text-lg">
                            <Star className="w-5 h-5 fill-teal-300" />
                            <span>{progress.xp_total}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-100">{t('total_xp')}</span>
                    </div>
                </div>
            </div>

            {/* Visual 7-Day Streak & XP Progress Tracker */}
            <StreakProgressTracker streakCount={progress.streak_count} totalXp={progress.xp_total} />



            {/* Recommended Action & Daily Goal Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Recommended Next Lesson Card */}
                <Card className="md:col-span-2 p-6 sm:p-8 bg-gradient-to-br from-slate-900 to-brand-950 text-white rounded-3xl shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden border border-slate-800/80">
                    {/* Subtle Interior Glow */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />

                    <div className="space-y-3 relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-widest text-teal-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                                {t('skill_literacy_essentials')}
                            </span>
                            <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                ⏱ {t('approx_mins')}
                            </span>
                            <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                {t('xp_reward_50')}
                            </span>
                            <span className="text-xs font-bold text-teal-300 bg-teal-400/20 px-2.5 py-0.5 rounded-full">
                                {t('beginner_tag')}
                            </span>
                        </div>
                        <h2 className="text-2xl font-extrabold text-white">
                            {t('unit_1_title')}
                        </h2>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            {t('unit_1_desc')}
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 relative z-10">
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate('/learning-path')}
                            leftIcon={<Play className="w-4 h-4 fill-slate-950" />}
                            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold border-none shadow-lg cursor-pointer"
                        >
                            {t('start_recommended_lesson')}
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={() => navigate('/voice-learning')}
                            leftIcon={<Mic className="w-4 h-4 text-amber-400" />}
                            className="bg-white/10 hover:bg-white/20 text-white border-none text-xs cursor-pointer"
                        >
                            {t('voice_practice_btn')}
                        </Button>
                    </div>
                </Card>

                {/* AI Guidance Highlight Card */}
                <Card className="p-6 bg-gradient-to-br from-teal-50/95 via-white to-emerald-50/80 border-teal-200/90 rounded-3xl shadow-soft space-y-4 flex flex-col justify-between relative overflow-hidden">
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-teal-800 font-extrabold text-xs uppercase tracking-wider">
                                <Sparkles className="w-4 h-4 text-teal-600" />
                                <span>{t('ai_insight_header')}</span>
                            </div>
                            <LingoBot size="sm" expression="teaching" />
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                            "{t('ai_summary_headline')}"
                        </h3>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {t('ai_recommended_focus')}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[10px] font-bold bg-teal-100/90 text-teal-800 px-2 py-0.5 rounded-full border border-teal-200">
                                {t('strength_letter_recognition')}
                            </span>
                            <span className="text-[10px] font-bold bg-amber-100/90 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                                {t('focus_matras_conjuncts')}
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/insights')}
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="w-full text-xs font-extrabold border-teal-300 text-teal-900 hover:bg-teal-100 cursor-pointer"
                    >
                        {t('view_full_ai_analysis_btn')}
                    </Button>
                </Card>
            </div>

            {/* Feature 5: Daily AI Challenge (Personalized Contextual Entry Point) */}
            <DailyAIChallengeCard />

            {/* ✨ EXPLORE LINGOPATH (Prominent discoverability for the 4 core new tools) */}
            <ExploreLingoPath />

            {/* Sleek Compact Learning Path Progress Preview (Issue 2 Fix) */}
            <CompactLearningPathPreview targetLangName={targetLangName} />

            {/* Interactive Alphabet Explorer (A to Z / Swar & Vyanjan) */}
            <AlphabetExplorer targetLangCode={targetLangCode} targetLangName={targetLangName} />

            {/* Meaningful Skill Status Cards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <Compass className="w-5 h-5 text-brand-600" />
                        <span>{t('meaningful_progress_title')}</span>
                    </h2>
                    <Button variant="outline" size="sm" onClick={() => navigate('/assessment')}>
                        {t('retake_assessment_btn')}
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 📖 Reading */}
                    <Card hoverable className="p-5 border-brand-200/70 hover:border-brand-300 space-y-2.5 bg-white/95">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">📖</span>
                            <Badge variant="teal" size="sm" className="font-bold">{t('strong_baseline_badge')}</Badge>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{t('reading_ability_header')}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {t('ai_reading_summary')}
                        </p>
                        <div className="pt-1.5">
                            <Link to="/lingo-city" className="text-[11px] font-bold text-brand-600 hover:text-brand-700 hover:underline inline-flex items-center gap-1">
                                {t('explore_lingo_city_link')}
                            </Link>
                        </div>
                    </Card>

                    {/* 🧠 Vocabulary */}
                    <Card hoverable className="p-5 border-teal-200/70 hover:border-teal-300 space-y-2.5 bg-white/95">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🧠</span>
                            <Badge variant="teal" size="sm" className="font-bold">{t('developing_steadily_badge')}</Badge>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{t('vocab_knowledge_header')}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {t('ai_vocab_summary')}
                        </p>
                    </Card>

                    {/* ✍️ Writing */}
                    <Card hoverable className="p-5 border-purple-200/70 hover:border-purple-300 space-y-2.5 bg-white/95">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">✍️</span>
                            <Badge variant="amber" size="sm" className="font-bold">{t('needs_practice_badge')}</Badge>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{t('writing_sentences_header')}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {t('ai_writing_summary')}
                        </p>
                    </Card>

                    {/* 🎙️ Speaking */}
                    <Card hoverable className="p-5 border-amber-200/70 hover:border-amber-300 space-y-2.5 bg-white/95">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl">🎙️</span>
                            <Badge variant="amber" size="sm" className="font-bold">{t('growth_opportunity_badge')}</Badge>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm">{t('speaking_pronunciation_header')}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">
                            {t('ai_speaking_summary')}
                        </p>
                        <div className="pt-1.5">
                            <Link to="/missions" className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:underline inline-flex items-center gap-1">
                                {t('real_life_missions_link')}
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Learner Progress Feed Concept */}
            <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>{t('progress_milestone_feed_title')}</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {feedItems.map(item => (
                        <Card key={item.id} hoverable className="p-5 space-y-3 border-slate-200/80 hover:border-brand-300 hover:shadow-soft-hover transition-all bg-white/95">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                                        {item.avatar_initial}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-extrabold text-slate-900">{item.learner_name}</h4>
                                        <span className="text-[10px] text-slate-500">{item.time_ago}</span>
                                    </div>
                                </div>
                                <Badge variant="brand" size="sm" className="text-[10px] font-bold">
                                    {item.achievement_type}
                                </Badge>
                            </div>

                            <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                                {getFeedContent(item)}
                            </p>

                            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                                <button
                                    onClick={() => handleCelebrateFeedItem(item.id)}
                                    className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-2.5 py-1 rounded-xl transition"
                                >
                                    {t('celebrate_btn')} ({item.celebrate_count})
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;