import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import {
    Sparkles,
    CheckCircle2,
    ArrowRight,
    BookOpen,
    Mic,
    Brain,
    HelpCircle,
    ArrowLeft,
    Volume2
} from 'lucide-react';

export const AssessmentPlaceholderPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const sampleQuestion = {
        skill: 'Vocabulary & Reading Comprehension',
        comfortableLangExplanation: profile?.comfortable_language?.name === 'Telugu'
            ? 'క్రింది పదానికి సరిపోయే సరైన అర్థాన్ని ఎంచుకోండి:'
            : 'Select the correct meaning for the highlighted word:',
        sentence: 'The student was eager to learn new vocabulary words every day.',
        highlightWord: 'eager',
        options: [
            { id: 1, text: 'Enthusiastic and keen', isCorrect: true },
            { id: 2, text: 'Slow and reluctant', isCorrect: false },
            { id: 3, text: 'Scared and nervous', isCorrect: false },
            { id: 4, text: 'Uninterested', isCorrect: false },
        ]
    };

    const handleSelectOption = (index: number) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);
    };

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fade-in">

            {/* Top Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/profile')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    Back to Profile
                </Button>

                <Badge variant="amber" size="md" className="font-bold gap-1 text-slate-900 bg-amber-400">
                    <Sparkles className="w-3.5 h-3.5" /> Initial Assessment Diagnostic
                </Badge>
            </div>

            {/* Main Container */}
            <Card className="p-6 md:p-10 space-y-8 border-brand-100 shadow-2xl">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Diagnostic Literacy Assessment
                    </h1>
                    <p className="text-sm text-slate-600">
                        Evaluating baseline proficiency for <strong className="text-brand-700 font-bold">{profile?.full_name || 'Learner'}</strong> in <strong className="text-teal-700 font-bold">{profile?.target_language?.name || 'English'}</strong>.
                    </p>
                </div>

                {/* Diagnostic Assessment Modules Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-brand-50/70 border border-brand-200/80 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-brand-800">
                            <BookOpen className="w-4 h-4 text-brand-600" />
                            <span>1. Reading Passage</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Sentence comprehension & context</p>
                    </div>

                    <div className="p-4 bg-teal-50/70 border border-teal-200/80 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-teal-800">
                            <Brain className="w-4 h-4 text-teal-600" />
                            <span>2. Vocabulary Recognition</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Multilingual explanation bridge</p>
                    </div>

                    <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
                            <Mic className="w-4 h-4 text-amber-600" />
                            <span>3. Speech & Pronunciation</span>
                        </div>
                        <p className="text-[11px] text-slate-500">Voice interaction ready</p>
                    </div>
                </div>

                {/* Interactive Sample Question Preview */}
                <div className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200/80 space-y-6">
                    <div className="flex items-center justify-between">
                        <Badge variant="brand" size="sm" className="font-bold">
                            Sample Question 1 of 5
                        </Badge>
                        <button className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1">
                            <Volume2 className="w-4 h-4" /> Listen Audio
                        </button>
                    </div>

                    {/* Multilingual Explanation Hint */}
                    <div className="p-3 bg-white border border-brand-200 rounded-2xl text-xs text-brand-900 font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
                        <span>Comfortable Language Hint ({profile?.comfortable_language?.name}): {sampleQuestion.comfortableLangExplanation}</span>
                    </div>

                    {/* Sentence Display */}
                    <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
                        <p className="text-lg font-medium text-slate-800">
                            "The student was <span className="font-extrabold text-brand-600 underline underline-offset-4 bg-brand-50 px-2 py-0.5 rounded-lg">{sampleQuestion.highlightWord}</span> to learn new vocabulary words every day."
                        </p>
                    </div>

                    {/* Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {sampleQuestion.options.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            let btnStyle = 'bg-white border-slate-200 hover:border-brand-300 text-slate-800';

                            if (isAnswered) {
                                if (opt.isCorrect) {
                                    btnStyle = 'bg-teal-50 border-teal-600 text-teal-800 font-bold';
                                } else if (isSelected && !opt.isCorrect) {
                                    btnStyle = 'bg-red-50 border-red-400 text-red-700 font-bold';
                                }
                            } else if (isSelected) {
                                btnStyle = 'bg-brand-50 border-brand-600 text-brand-800 font-bold';
                            }

                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleSelectOption(idx)}
                                    className={`p-4 rounded-2xl border-2 text-left text-sm transition-all duration-200 flex items-center justify-between ${btnStyle}`}
                                >
                                    <span>{opt.text}</span>
                                    {isAnswered && opt.isCorrect && (
                                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {isAnswered && (
                        <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 font-medium flex items-center justify-between animate-fade-in">
                            <span className="flex items-center gap-2 font-bold text-teal-800">
                                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                                Correct! "Eager" means enthusiastic or keen.
                            </span>
                            <Button size="sm" variant="secondary" onClick={() => navigate('/profile')}>
                                Return to Profile
                            </Button>
                        </div>
                    )}
                </div>

                {/* Information box explaining scope */}
                <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-3xl text-xs text-amber-900 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>Assessment & AI Recommendation Engine Ready</span>
                    </div>
                    <p className="leading-relaxed text-amber-800">
                        Your self-reported starting skills (Reading: {profile?.proficiency?.reading_level}, Writing: {profile?.proficiency?.writing_level}, Vocabulary: {profile?.proficiency?.vocabulary_level}, Speaking: {profile?.proficiency?.speaking_level}) have been successfully saved to your relational profile record.
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Button variant="outline" size="md" onClick={() => navigate('/profile')}>
                        View Learner Profile
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/profile')}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                        Dashboard
                    </Button>
                </div>
            </Card>

        </div>
    );
};
