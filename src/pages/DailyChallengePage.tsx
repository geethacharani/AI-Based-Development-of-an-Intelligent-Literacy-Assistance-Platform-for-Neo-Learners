import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { dailyChallengeService, DailyChallenge, ChallengeTask } from '../services/dailyChallengeService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
    Flame,
    Target,
    Volume2,
    CheckCircle2,
    Sparkles,
    Award,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

export const DailyChallengePage: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [sentenceOrder, setSentenceOrder] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [score, setScore] = useState(100);
    const [feedback, setFeedback] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    const targetLangName = profile?.target_language?.name || 'Hindi';
    const comfLangName = profile?.comfortable_language?.name || 'English';

    useEffect(() => {
        const fetchChallenge = async () => {
            setIsLoading(true);
            try {
                const res = await dailyChallengeService.getDailyChallenge();
                setChallenge(res);
            } catch (err) {
                console.error('Error loading daily challenge', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchChallenge();
    }, []);

    const handleSpeak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    };

    const handleNextTask = async () => {
        if (!challenge) return;

        if (currentTaskIndex + 1 < challenge.tasks.length) {
            setCurrentTaskIndex(prev => prev + 1);
            setSelectedOption(null);
            setSentenceOrder([]);
        } else {
            // Finished challenge!
            setIsLoading(true);
            try {
                const res = await dailyChallengeService.submitChallenge(score, challenge.xp_reward);
                setFeedback(res.feedback);
                setIsCompleted(true);
            } catch (err) {
                setIsCompleted(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading && !challenge) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">{t('dc_loading')}</p>
            </div>
        );
    }

    const currentTask: ChallengeTask | undefined = challenge?.tasks[currentTaskIndex];

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in pb-16 font-sans">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-brand-700 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10">
                    <Badge variant="amber" size="sm" className="font-extrabold text-slate-950 bg-amber-300 border-none">
                        🎯 DAILY AI CHALLENGE
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {t('dc_title')}
                    </h1>
                    <p className="text-purple-100 text-sm sm:text-base font-medium max-w-xl">
                        {t('dc_personalized_for')} <strong className="text-white font-bold">({targetLangName})</strong>.
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 z-10">
                    <div className="px-4 py-3 bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 text-center">
                        <div className="flex items-center gap-1 text-amber-300 font-extrabold text-xl">
                            <Flame className="w-5 h-5 fill-amber-400" />
                            <span>+{challenge?.xp_reward || 40} XP</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-100">
                            Daily Bonus
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Interactive Card */}
            {challenge && (
                <Card className="p-6 sm:p-8 space-y-6 border-slate-200/90 shadow-sm">
                    {!isCompleted && currentTask ? (
                        <div className="space-y-6">
                            {/* Step Indicator */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 block">
                                        Task {currentTaskIndex + 1} of {challenge.tasks.length}
                                    </span>
                                    <h3 className="text-base font-extrabold text-slate-900">
                                        {currentTask.prompt}
                                    </h3>
                                </div>
                                <Badge variant="brand" size="sm" className="font-bold">
                                    {currentTask.type.replace('_', ' ').toUpperCase()}
                                </Badge>
                            </div>

                            {/* Task 1: Vocabulary Match */}
                            {currentTask.type === 'vocabulary_match' && (
                                <div className="space-y-4 text-center">
                                    <div className="p-6 bg-purple-50/70 border border-purple-200 rounded-3xl inline-block max-w-md mx-auto w-full">
                                        <span className="text-[11px] font-bold text-purple-600 uppercase block mb-1">
                                            {targetLangName} Target Word
                                        </span>
                                        <h2 className="text-2xl font-black text-slate-900">
                                            {currentTask.word}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                                        {currentTask.options?.map((opt, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedOption(opt)}
                                                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                                                    selectedOption === opt
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Task 2: Sentence Builder */}
                            {currentTask.type === 'sentence_builder' && (
                                <div className="space-y-5">
                                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">English Meaning</span>
                                        <p className="text-sm font-extrabold text-slate-800">
                                            "{currentTask.english_meaning}"
                                        </p>
                                    </div>

                                    {/* Built Sentence Slots */}
                                    <div className="p-4 bg-purple-50/50 border border-dashed border-purple-300 rounded-2xl min-h-[60px] flex items-center justify-center gap-2 flex-wrap">
                                        {sentenceOrder.length === 0 ? (
                                            <span className="text-xs text-slate-400 font-medium">
                                                Tap the words below in the correct order
                                            </span>
                                        ) : (
                                            sentenceOrder.map((w, idx) => (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    onClick={() => setSentenceOrder(prev => prev.filter((_, i) => i !== idx))}
                                                    className="px-3.5 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-rose-500 transition cursor-pointer"
                                                >
                                                    {w}
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    {/* Scrambled Word Pool */}
                                    <div className="flex items-center justify-center gap-2 flex-wrap">
                                        {currentTask.scrambled?.map((word, idx) => {
                                            const isUsed = sentenceOrder.includes(word);
                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={isUsed}
                                                    onClick={() => setSentenceOrder(prev => [...prev, word])}
                                                    className={`px-4 py-2 rounded-xl text-xs font-extrabold border transition cursor-pointer ${
                                                        isUsed
                                                            ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                                                            : 'bg-white hover:bg-purple-50 text-slate-800 border-slate-200 shadow-2xs'
                                                    }`}
                                                >
                                                    {word}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Task 3: Listening Comprehension */}
                            {currentTask.type === 'listening_comprehension' && (
                                <div className="space-y-5 text-center">
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl inline-block max-w-md mx-auto w-full space-y-3">
                                        <button
                                            type="button"
                                            onClick={() => handleSpeak(currentTask.audio_text!)}
                                            className="px-5 py-3 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 shadow-sm font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
                                        >
                                            <Volume2 className="w-5 h-5 animate-pulse" />
                                            <span>Play Audio Phrase</span>
                                        </button>
                                        <p className="text-[11px] text-slate-500 font-medium">
                                            Listen closely and identify the meaning
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto text-left">
                                        {currentTask.options?.map((opt, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedOption(opt)}
                                                className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold transition cursor-pointer ${
                                                    selectedOption === opt
                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Next / Submit Button */}
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <Button
                                    variant="primary"
                                    onClick={handleNextTask}
                                    disabled={
                                        (currentTask.type === 'sentence_builder' && sentenceOrder.length === 0) ||
                                        (currentTask.type !== 'sentence_builder' && !selectedOption)
                                    }
                                    className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                                >
                                    <span>{currentTaskIndex + 1 === challenge.tasks.length ? 'Complete Challenge' : 'Next Task'}</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* Completed Screen */
                        <div className="space-y-6 text-center py-6 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto shadow-md">
                                <Award className="w-8 h-8 animate-bounce text-purple-600" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-2xl font-extrabold text-slate-900">
                                    Daily AI Challenge Completed! 🌟
                                </h3>
                                <p className="text-sm text-slate-500 font-medium">
                                    {feedback || "Outstanding mastery! Your daily streak is active and your skills are advancing."}
                                </p>
                            </div>

                            <div className="inline-flex items-center gap-6 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-purple-700 block">XP Reward</span>
                                    <span className="text-2xl font-black text-purple-800">+{challenge.xp_reward} XP</span>
                                </div>
                                <div className="w-px h-8 bg-purple-200" />
                                <div>
                                    <span className="text-[10px] font-black uppercase text-purple-700 block">Daily Streak</span>
                                    <span className="text-2xl font-black text-purple-800 flex items-center gap-1 justify-center">
                                        <Flame className="w-5 h-5 fill-amber-400 text-amber-500" />
                                        Active
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-center gap-3">
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        setIsCompleted(false);
                                        setCurrentTaskIndex(0);
                                        setSelectedOption(null);
                                        setSentenceOrder([]);
                                    }}
                                    className="px-6 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-700"
                                >
                                    <RefreshCw className="w-4 h-4 mr-1.5" />
                                    <span>Practice Challenge Again</span>
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            )}
        </div>
    );
};
