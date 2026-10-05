import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningPathService } from '../services/learningPathService';
import { voiceService } from '../services/voiceService';
import { LearningPathUnit, LessonNode, LearnerProgress } from '../types';
import {
    ArrowLeft,
    BookOpen,
    Play,
    Sparkles,
    CheckCircle2,
    Lock,
    Volume2,
    Flame,
    Star,
    ArrowRight,
    Gamepad2,
    Mic,
    Target
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useTranslation } from '../utils/translations';

export const LearnPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [units, setUnits] = useState<LearningPathUnit[]>([]);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Interactive Lesson Modal state
    const [activeNode, setActiveNode] = useState<LessonNode | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [lessonAnswer, setLessonAnswer] = useState<number | null>(null);
    const [isLessonSubmitted, setIsLessonSubmitted] = useState(false);

    const targetLang = profile?.target_language?.name || 'Hindi';
    const targetLangCode = profile?.target_language?.code || 'hi';
    const comfortLangCode = profile?.comfortable_language?.code || 'en';

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            try {
                const res = await learningPathService.getLearningPath(targetLangCode, comfortLangCode);
                setUnits(res.units);
                setProgress(res.progress);
            } catch (err) {
                console.error('Failed to load learn page curriculum:', err);
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, [targetLangCode, comfortLangCode]);

    const currentUnit = units[0] || null;
    const currentLesson = currentUnit?.nodes?.find(n => n.status === 'unlocked' || (n.status as any) === 'current') || currentUnit?.nodes?.[0];

    const handleStartLesson = (node: LessonNode) => {
        if (node.status === 'locked') return;
        setActiveNode(node);
        setLessonAnswer(null);
        setIsLessonSubmitted(false);
        setIsLessonModalOpen(true);
    };

    const handleCompleteLesson = async () => {
        if (!activeNode) return;
        setIsLessonSubmitted(true);
        try {
            const res = await learningPathService.completeLesson(activeNode.id);
            setUnits(prev =>
                prev.map(u => ({
                    ...u,
                    nodes: u.nodes.map(n => {
                        if (n.id === activeNode.id) return { ...n, status: 'completed' as const };
                        if (n.order === activeNode.order + 1) return { ...n, status: 'unlocked' as const };
                        return n;
                    })
                }))
            );
            setProgress(prev => prev ? { ...prev, xp_total: res.total_xp, streak_count: res.streak_count } : null);
            setTimeout(() => {
                setIsLessonModalOpen(false);
                setIsCompletedModalOpen(true);
            }, 800);
        } catch (err) {
            console.error('Error completing lesson', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
                <p className="text-slate-500 text-sm font-bold">{t('learn_loading')}</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 animate-fade-in text-slate-900">
            {/* Header & Back Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('learn_back_home')}
                    </button>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-brand-600" />
                        {t('learn_page_title')}
                    </h1>
                    <p className="text-sm text-slate-600">
                        {t('learn_page_desc')} <span className="font-bold text-brand-700">({targetLang})</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-2xl text-amber-700 text-xs font-black">
                        <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                        <span>{progress?.streak_count || 5} {t('learn_day_streak')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-brand-50 border border-brand-200 px-3.5 py-1.5 rounded-2xl text-brand-700 text-xs font-black">
                        <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
                        <span>{progress?.xp_total || 220} XP</span>
                    </div>
                </div>
            </div>

            {/* Today's Recommended Lesson Hero Card */}
            {currentLesson && (
                <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-xl">
                    <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3 max-w-xl">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider">
                                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                                {t('learn_todays_lesson_badge')}
                            </span>
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                                {currentLesson.title}
                            </h2>
                            <p className="text-sm text-indigo-100 leading-relaxed">
                                {currentLesson.subtitle || 'Master essential target-language words and phonetics with instant audio pronunciation and interactive exercises.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                                <span className="bg-black/20 px-3 py-1 rounded-xl font-bold backdrop-blur-sm">
                                    Unit 1: {currentUnit?.title || 'Foundations'}
                                </span>
                                <span className="bg-amber-400/20 text-amber-200 border border-amber-300/30 px-3 py-1 rounded-xl font-bold">
                                    {t('learn_xp_on_completion')}
                                </span>
                                <span className="bg-emerald-400/20 text-emerald-200 px-3 py-1 rounded-xl font-bold">
                                    {t('learn_approx_time')}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleStartLesson(currentLesson)}
                            className="w-full md:w-auto px-8 py-4 bg-white hover:bg-amber-50 text-indigo-900 font-black text-base rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group"
                        >
                            <Play className="w-5 h-5 fill-indigo-900 group-hover:scale-110 transition-transform" />
                            {t('learn_continue_btn')}
                        </button>
                    </div>
                </div>
            )}

            {/* Current Unit Lessons Progression */}
            {currentUnit && (
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{t('learn_current_unit')}</span>
                            <h2 className="text-xl font-black text-slate-900">{currentUnit.title}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">{currentUnit.description}</p>
                        </div>
                        <button
                            onClick={() => navigate('/learning-path')}
                            className="inline-flex items-center gap-1.5 text-xs font-black text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-3.5 py-2 rounded-xl transition"
                        >
                            <Target className="w-4 h-4" /> {t('learn_view_full_path')} <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {currentUnit.nodes.map((node, idx) => {
                            const isDone = node.status === 'completed';
                            const isLocked = node.status === 'locked';

                            return (
                                <div
                                    key={node.id}
                                    onClick={() => !isLocked && handleStartLesson(node)}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        isLocked
                                            ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                            : isDone
                                            ? 'bg-emerald-50/40 border-emerald-200 hover:shadow-md cursor-pointer'
                                            : 'bg-white border-brand-300 shadow-sm hover:shadow-md cursor-pointer ring-2 ring-brand-500/20'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                                isDone
                                                    ? 'bg-emerald-500 text-white'
                                                    : isLocked
                                                    ? 'bg-slate-200 text-slate-500'
                                                    : 'bg-brand-600 text-white'
                                            }`}>
                                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : isLocked ? <Lock className="w-3.5 h-3.5" /> : idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-black text-slate-900 line-clamp-1">{node.title}</h4>
                                                <span className="text-[10px] text-slate-400 capitalize">{node.node_type} {t('learn_lesson_type_suffix')}</span>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                            +50 XP
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recommended Learning Activities Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{t('learn_recommended_activities')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Game recommendation */}
                    <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-3xl">
                                🧱
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600">{t('learn_lang_game_label')}</span>
                                <h4 className="text-base font-black text-slate-900">{t('learn_word_tetris_title')}</h4>
                                <p className="text-xs text-slate-500">{t('learn_word_tetris_desc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/games')}
                            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
                        >
                            {t('learn_play_btn')} <Gamepad2 className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Voice Studio recommendation */}
                    <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm flex items-center justify-between gap-4 hover:shadow-md transition">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-3xl">
                                🎤
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-purple-600">{t('learn_voice_label')}</span>
                                <h4 className="text-base font-black text-slate-900">{t('learn_voice_studio_title')}</h4>
                                <p className="text-xs text-slate-500">{t('learn_voice_studio_desc')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/voice-learning')}
                            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-black rounded-xl transition flex items-center gap-1.5 whitespace-nowrap"
                        >
                            {t('learn_practice_btn')} <Mic className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Interactive Lesson Modal */}
            <Modal
                isOpen={isLessonModalOpen}
                onClose={() => setIsLessonModalOpen(false)}
                title={activeNode?.title || 'Interactive Lesson'}
            >
                {activeNode && (
                    <div className="space-y-6 pt-2">
                        {/* Audio Header */}
                        <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-[11px] font-black text-brand-700 uppercase tracking-wider">{t('learn_pronunciation_label')}</span>
                                <p className="text-xl font-black text-slate-900">
                                    {activeNode.payload?.sample_words?.[0] || activeNode.subtitle || activeNode.title}
                                </p>
                            </div>
                            <button
                                onClick={() => voiceService.speakText(activeNode.payload?.sample_words?.[0] || activeNode.subtitle || activeNode.title, targetLangCode)}
                                className="w-12 h-12 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow transition-transform active:scale-95"
                            >
                                <Volume2 className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Interactive Quiz / Practice */}
                        <div className="space-y-3">
                            <p className="text-sm font-bold text-slate-700">
                                {activeNode.payload?.question_prompt || `Identify the correct target-language meaning in ${targetLang}:`}
                            </p>

                            <div className="grid grid-cols-1 gap-2.5">
                                {(activeNode.payload?.quiz_options || [
                                    activeNode.payload?.sample_words?.[0] || activeNode.title,
                                    'Alternative word B',
                                    'Incorrect option C',
                                    'Different spelling D'
                                ]).map((opt: string, i: number) => (
                                    <button
                                        key={i}
                                        onClick={() => !isLessonSubmitted && setLessonAnswer(i)}
                                        className={`p-3.5 rounded-2xl border text-left text-sm font-bold transition-all ${
                                            lessonAnswer === i
                                                ? 'bg-brand-600 text-white border-brand-600 shadow'
                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                                        }`}
                                    >
                                        <span className="inline-block w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs text-center leading-6 mr-2">
                                            {String.fromCharCode(65 + i)}
                                        </span>
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                            <Button variant="ghost" size="md" onClick={() => setIsLessonModalOpen(false)}>
                                {t('learn_close_btn')}
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                disabled={lessonAnswer === null}
                                isLoading={isLessonSubmitted}
                                onClick={handleCompleteLesson}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                            >
                                {t('learn_complete_xp_btn')}
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Completion Success Modal */}
            <Modal
                isOpen={isCompletedModalOpen}
                onClose={() => setIsCompletedModalOpen(false)}
                title={t('learn_lesson_done_title')}
            >
                <div className="py-6 text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-4xl">
                        ⭐
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">{t('learn_awesome_work')}</h3>
                    <p className="text-sm text-slate-600 max-w-sm mx-auto">
                        You earned <strong className="text-emerald-600 font-black">+50 XP</strong> {t('learn_xp_earned_msg')}
                    </p>
                    <div className="pt-4">
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={() => setIsCompletedModalOpen(false)}
                        >
                            {t('learn_continue_btn')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
