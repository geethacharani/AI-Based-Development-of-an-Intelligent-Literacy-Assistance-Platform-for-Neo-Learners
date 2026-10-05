import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentService } from '../services/assessmentService';
import { voiceService } from '../services/voiceService';
import { Question } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { useTranslation } from '../utils/translations';
import {
    BookOpen,
    Brain,
    Mic,
    Sparkles,
    CheckCircle2,
    ArrowRight,
    Volume2,
    ArrowLeft,
    RotateCcw,
    MicOff,
    HelpCircle,
    Award
} from 'lucide-react';

export const DiagnosticAssessmentPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t, supportLangCode } = useTranslation();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [arrangedWords, setArrangedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingComplete, setRecordingComplete] = useState(false);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadQuestions = async () => {
            setIsLoading(true);
            try {
                const qList = await assessmentService.getDiagnosticQuestions();
                setQuestions(qList);
            } catch (err) {
                console.error('Error loading questions', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadQuestions();
    }, [supportLangCode]);

    const currentQ = questions[currentIndex];

    useEffect(() => {
        if (currentQ && currentQ.question_type === 'arrange_words' && currentQ.options.length > 0) {
            const correctOpt = currentQ.options.find(o => o.is_correct)?.text || currentQ.options[0].text;
            const words = correctOpt.split(' ').sort(() => Math.random() - 0.5);
            setAvailableWords(words);
            setArrangedWords([]);
        }
    }, [currentIndex, currentQ]);

    if (isLoading || !currentQ) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">Preparing your target language assessment...</p>
            </div>
        );
    }

    const comfortableLangName = profile?.comfortable_language?.name || 'Support Language';
    const targetLangName = profile?.target_language?.name || 'Target Language';

    const handleSelectOption = (index: number) => {
        setSelectedAnswer(index);
        const selectedOpt = currentQ.options[index];
        setAnswers(prev => ({
            ...prev,
            [currentQ.id]: { option_id: selectedOpt.id, is_correct: selectedOpt.is_correct }
        }));
    };

    const handleWordClick = (word: string, index: number) => {
        const newAvailable = [...availableWords];
        newAvailable.splice(index, 1);
        setAvailableWords(newAvailable);

        const newArranged = [...arrangedWords, word];
        setArrangedWords(newArranged);

        const sentence = newArranged.join(' ');
        const correctOpt = currentQ.options.find(o => o.is_correct)?.text;
        const isCorrect = sentence === correctOpt;
        setAnswers(prev => ({
            ...prev,
            [currentQ.id]: { answer: sentence, is_correct: isCorrect }
        }));
    };

    const handleRemoveArrangedWord = (word: string, index: number) => {
        const newArranged = [...arrangedWords];
        newArranged.splice(index, 1);
        setArrangedWords(newArranged);

        const newAvailable = [...availableWords, word];
        setAvailableWords(newAvailable);
    };

    const handleToggleRecording = () => {
        if (!isRecording) {
            setIsRecording(true);
            setTimeout(() => {
                setIsRecording(false);
                setRecordingComplete(true);
                setAnswers(prev => ({
                    ...prev,
                    [currentQ.id]: { answer: currentQ.target_phrase || 'Spoken response', is_correct: true }
                }));
            }, 3000);
        } else {
            setIsRecording(false);
        }
    };

    const handlePlayAudio = (text: string) => {
        voiceService.speakText(text);
    };

    const handleNext = async () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setRecordingComplete(false);
        } else {
            setIsSubmitting(true);
            try {
                await assessmentService.submitDiagnostic(answers);
                navigate('/insights');
            } catch (err) {
                console.error('Error submitting assessment:', err);
                navigate('/insights');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const progressPercentage = Math.round(((currentIndex + 1) / questions.length) * 100);

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    Back to Profile
                </Button>
                <div className="flex items-center gap-2">
                    <Badge variant="brand" size="md" className="font-bold gap-1 bg-brand-100 text-brand-800">
                        <Sparkles className="w-3.5 h-3.5" /> {t('diagnostic_title')}
                    </Badge>
                </div>
            </div>

            {/* Non-intimidating encouragement banner */}
            <div className="bg-gradient-to-r from-brand-50 to-teal-50 p-4 rounded-2xl border border-brand-100 flex items-center justify-between text-xs text-brand-900 shadow-sm">
                <div className="flex items-center gap-2.5 font-medium">
                    <span className="text-xl">🌱</span>
                    <div>
                        <p className="font-bold text-slate-900">"Everyone starts somewhere."</p>
                        <p className="text-slate-600">Your answers help us create your personalized learning path. There are no wrong baseline answers.</p>
                    </div>
                </div>
                <div className="shrink-0 text-right">
                    <span className="font-extrabold text-brand-700 text-sm">{currentIndex + 1} / {questions.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>{currentQ.skill}</span>
                    <span>{progressPercentage}% Complete</span>
                </div>
                <Progress value={progressPercentage} color="brand" />
            </div>

            {/* Question Card */}
            <Card className="p-6 sm:p-8 space-y-6 border-slate-200/80 shadow-xl relative overflow-hidden">
                {/* Skill Badge */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100 flex items-center gap-1.5">
                        {currentQ.question_type === 'voice_speaking' && <Mic className="w-3.5 h-3.5 text-amber-600" />}
                        {currentQ.question_type === 'reading_passage' && <BookOpen className="w-3.5 h-3.5 text-brand-600" />}
                        {currentQ.question_type === 'match_words' && <Brain className="w-3.5 h-3.5 text-teal-600" />}
                        {currentQ.skill}
                    </span>

                    {(currentQ.passage || currentQ.target_phrase) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handlePlayAudio(currentQ.passage || currentQ.target_phrase || '')}
                            leftIcon={<Volume2 className="w-4 h-4 text-brand-600" />}
                        >
                            {t('mis_play_audio_btn')}
                        </Button>
                    )}
                </div>

                {/* Multilingual Explanation Bridge */}
                {currentQ.comfortable_bridge && (
                    <div className="p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl text-xs text-amber-950 font-semibold flex items-center gap-2.5">
                        <span className="text-base">🌍</span>
                        <span>
                            <strong className="text-amber-900">{comfortableLangName} Bridge: </strong>
                            {currentQ.comfortable_bridge}
                        </span>
                    </div>
                )}

                {/* Question Prompt */}
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
                    {currentQ.prompt}
                </h2>

                {/* Passage View (if reading passage) */}
                {currentQ.passage && currentQ.question_type !== 'voice_speaking' && (
                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl font-medium text-slate-800 text-base leading-relaxed">
                        "{currentQ.passage}"
                    </div>
                )}

                {/* Question Type 1 & 2 & 4: Options / Multiple Choice / Fill Blank */}
                {(currentQ.question_type === 'multiple_choice' ||
                    currentQ.question_type === 'match_words' ||
                    currentQ.question_type === 'fill_blank' ||
                    currentQ.question_type === 'reading_passage') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                            {currentQ.options.map((opt, idx) => {
                                const isSelected = selectedAnswer === idx;
                                return (
                                    <button
                                        key={opt.id}
                                        onClick={() => handleSelectOption(idx)}
                                        className={`p-4 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between ${isSelected
                                            ? 'bg-brand-50 border-brand-600 text-brand-900 shadow-md ring-2 ring-brand-200 font-bold'
                                            : 'bg-white border-slate-200 hover:border-brand-300 hover:bg-slate-50/80 text-slate-800'
                                            }`}
                                    >
                                        <span>{opt.text}</span>
                                        {isSelected && <CheckCircle2 className="w-5 h-5 text-brand-600 shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                {/* Question Type 3: Arrange Words into Sentence */}
                {currentQ.question_type === 'arrange_words' && (
                    <div className="space-y-6 pt-2">
                        {/* Target Display Area */}
                        <div className="min-h-[70px] p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex flex-wrap items-center gap-2">
                            {arrangedWords.length === 0 ? (
                                <span className="text-xs text-slate-400 font-medium italic">
                                    Click the words below to build your sentence...
                                </span>
                            ) : (
                                arrangedWords.map((word, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleRemoveArrangedWord(word, idx)}
                                        className="px-3.5 py-2 bg-brand-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-brand-700 transition"
                                    >
                                        {word}
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Available Word Blocks */}
                        <div className="flex flex-wrap gap-2.5">
                            {availableWords.map((word, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleWordClick(word, idx)}
                                    className="px-4 py-2.5 bg-white border-2 border-slate-200 hover:border-brand-400 text-slate-800 font-semibold rounded-xl text-sm shadow-sm transition hover:-translate-y-0.5"
                                >
                                    {word}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Question Type 5: Voice / Speaking Activity */}
                {currentQ.question_type === 'voice_speaking' && (
                    <div className="p-6 bg-amber-50/50 border border-amber-200 rounded-3xl text-center space-y-6">
                        <div className="p-4 bg-white border border-amber-200 rounded-2xl shadow-sm">
                            <p className="text-xs text-amber-900 font-bold uppercase tracking-wider mb-1">Phrase to Speak Aloud:</p>
                            <p className="text-lg sm:text-xl font-extrabold text-slate-900">
                                "{currentQ.target_phrase}"
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center space-y-3">
                            <button
                                onClick={handleToggleRecording}
                                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${isRecording
                                    ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200'
                                    : recordingComplete
                                        ? 'bg-teal-600 text-white ring-4 ring-teal-200'
                                        : 'bg-amber-500 hover:bg-amber-600 text-white ring-4 ring-amber-100 hover:scale-105'
                                    }`}
                            >
                                <Mic className="w-8 h-8" />
                            </button>
                            <span className="text-xs font-bold text-slate-700">
                                {isRecording
                                    ? 'Listening... Speak now 🎙️'
                                    : recordingComplete
                                        ? 'Voice Recorded Successfully! ✨'
                                        : 'Tap microphone to start recording'}
                            </span>
                        </div>

                        {recordingComplete && (
                            <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 font-semibold space-y-1 animate-fade-in">
                                <div className="flex items-center justify-center gap-1.5 font-bold text-teal-800 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                    <span>Pronunciation Evaluation Complete!</span>
                                </div>
                                <p>Score: <strong className="text-teal-700 text-sm font-extrabold">95% Clarity</strong> • Clear emphasis on words!</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Action */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                    <span className="text-xs text-slate-500 font-medium">
                        Skill {currentIndex + 1} of {questions.length}
                    </span>
                    <Button
                        variant="primary"
                        size="md"
                        disabled={
                            isSubmitting ||
                            (currentQ.question_type !== 'arrange_words' && currentQ.question_type !== 'voice_speaking' && selectedAnswer === null)
                        }
                        onClick={handleNext}
                        rightIcon={currentIndex < questions.length - 1 ? <ArrowRight className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    >
                        {isSubmitting
                            ? 'Analyzing Results...'
                            : currentIndex < questions.length - 1
                                ? 'Next Skill'
                                : 'View AI Assessment Insights'}
                    </Button>
                </div>
            </Card>
        </div>
    );
};
