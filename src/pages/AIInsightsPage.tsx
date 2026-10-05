import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { AILearnerInsight } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from '../utils/translations';
import {
    Sparkles,
    BookOpen,
    Brain,
    Mic,
    PenTool,
    Target,
    ArrowRight,
    CheckCircle2,
    Compass,
    Star,
    Award
} from 'lucide-react';

export const AIInsightsPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [insight, setInsight] = useState<AILearnerInsight | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInsight = async () => {
            setIsLoading(true);
            try {
                const data = await assessmentService.getAILearnerInsights();
                setInsight(data);
            } catch (err) {
                console.error('Error loading AI insights', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInsight();
    }, []);

    if (isLoading || !insight) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">Generating your personalized AI literacy profile...</p>
            </div>
        );
    }

    return (
        <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Top Celebration Banner */}
            <div className="text-center space-y-3">
                <Badge variant="brand" size="md" className="font-extrabold gap-1.5 px-4 py-1 text-brand-800 bg-brand-100 border-brand-200 inline-flex">
                    <Sparkles className="w-4 h-4 text-brand-600" /> {t('ai_diagnostic_complete')}
                </Badge>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {t('learner_profile_analysis')} <span className="text-brand-700">{profile?.full_name || 'Learner'}</span>
                </h1>
                <p className="text-base text-slate-600 max-w-xl mx-auto">
                    {t('diagnostic_reconcile_text')} <strong className="text-teal-700 font-bold">{profile?.target_language?.name || 'English'}</strong>.
                </p>
            </div>

            {/* AI Summary Highlight Card */}
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-brand-900 via-slate-900 to-teal-950 text-white rounded-3xl shadow-2xl space-y-6 relative overflow-hidden">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-teal-300 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                        {t('personalized_target_focus')}
                    </span>
                    <Badge variant="teal" size="sm" className="font-bold text-teal-900 bg-teal-300">
                        {t('level_2_starting_point')}
                    </Badge>
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug text-white">
                        "{t('ai_summary_headline')}"
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                        {t('ai_recommended_focus')}
                    </p>
                </div>

                <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-between text-xs sm:text-sm">
                    <div className="flex items-center gap-2 text-teal-200 font-semibold">
                        <Compass className="w-5 h-5 text-teal-300 shrink-0" />
                        <span>{t('recommended_path_prefix')} <strong>{insight.recommended_starting_point}</strong></span>
                    </div>
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/learning-path')}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="bg-teal-400 hover:bg-teal-300 text-teal-950 font-extrabold border-none shadow-lg"
                    >
                        {t('start_learning_path_btn')}
                    </Button>
                </div>
            </Card>

            {/* Meaningful Skill Breakdown Cards */}
            <div className="space-y-4">
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-brand-600" />
                    <span>{t('skill_insights_header')}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 📖 Reading */}
                    <Card className="p-6 border-brand-100 hover:border-brand-300 transition-all shadow-md space-y-3 bg-brand-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-brand-100 rounded-xl text-brand-700 font-bold">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900">{t('reading_ability_header')}</h4>
                                    <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">{t('strong_baseline_badge')}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{t('ai_reading_summary')}"
                        </p>
                    </Card>

                    {/* 🧠 Vocabulary */}
                    <Card className="p-6 border-teal-100 hover:border-teal-300 transition-all shadow-md space-y-3 bg-teal-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-teal-100 rounded-xl text-teal-700 font-bold">
                                    <Brain className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900">{t('vocab_knowledge_header')}</h4>
                                    <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded-full">{t('developing_steadily_badge')}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{t('ai_vocab_summary')}"
                        </p>
                    </Card>

                    {/* ✍️ Writing */}
                    <Card className="p-6 border-purple-100 hover:border-purple-300 transition-all shadow-md space-y-3 bg-purple-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-purple-100 rounded-xl text-purple-700 font-bold">
                                    <PenTool className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900">{t('writing_sentences_header')}</h4>
                                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">{t('needs_practice_badge')}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{t('ai_writing_summary')}"
                        </p>
                    </Card>

                    {/* 🎙️ Speaking */}
                    <Card className="p-6 border-amber-100 hover:border-amber-300 transition-all shadow-md space-y-3 bg-amber-50/30">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-2.5 bg-amber-100 rounded-xl text-amber-700 font-bold">
                                    <Mic className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-slate-900">{t('speaking_pronunciation_header')}</h4>
                                    <span className="text-xs font-bold text-amber-900 bg-amber-200 px-2 py-0.5 rounded-full">{t('growth_opportunity_badge')}</span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                            "{t('ai_speaking_summary')}"
                        </p>
                    </Card>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
                <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/dashboard')}
                >
                    {t('go_to_dashboard_btn')}
                </Button>

                <Button
                    variant="outline"
                    size="md"
                    onClick={() => navigate('/lingo-city')}
                    leftIcon={<Compass className="w-4 h-4" />}
                    className="border-indigo-300 text-indigo-700 hover:bg-indigo-50 font-bold"
                >
                    Explore Lingo City
                </Button>

                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/learning-path')}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                    className="w-full sm:w-auto shadow-xl"
                >
                    {t('enter_learning_path_btn')}
                </Button>
            </div>
        </div>
    );
};
