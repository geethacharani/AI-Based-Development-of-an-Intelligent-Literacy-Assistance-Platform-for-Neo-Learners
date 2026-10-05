import React, { useState } from 'react';
import { LearnerProficiency, SkillLevel } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowLeft, ArrowRight, Info, BookOpen, PenTool, Brain, Mic, Check } from 'lucide-react';

interface StepSkillLevelsProps {
    proficiency: LearnerProficiency;
    onChange: (proficiency: LearnerProficiency) => void;
    onSubmit: () => void;
    onBack: () => void;
    isLoading?: boolean;
}

const SKILL_KEYS: { key: keyof Omit<LearnerProficiency, 'overall_level' | 'updated_at'>; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: 'reading_level', label: 'Reading', icon: <BookOpen className="w-6 h-6 text-brand-600" />, desc: 'Understanding written words, signs & passages' },
    { key: 'writing_level', label: 'Writing', icon: <PenTool className="w-6 h-6 text-teal-600" />, desc: 'Spelling, grammar & constructing sentences' },
    { key: 'vocabulary_level', label: 'Vocabulary', icon: <Brain className="w-6 h-6 text-amber-600" />, desc: 'Word recognition & contextual meanings' },
    { key: 'speaking_level', label: 'Speaking', icon: <Mic className="w-6 h-6 text-emerald-600" />, desc: 'Pronunciation & natural verbal expression' },
];

const LEVELS: { level: SkillLevel; desc: string }[] = [
    { level: 'Beginner', desc: 'Starting from scratch' },
    { level: 'Basic', desc: 'Simple phrases & words' },
    { level: 'Intermediate', desc: 'Routine conversations' },
    { level: 'Advanced', desc: 'Fluent & confident' },
];

export const StepSkillLevels: React.FC<StepSkillLevelsProps> = ({
    proficiency,
    onChange,
    onSubmit,
    onBack,
    isLoading = false,
}) => {
    const [error, setError] = useState<string | null>(null);

    const handleLevelChange = (key: keyof Omit<LearnerProficiency, 'overall_level' | 'updated_at'>, level: SkillLevel) => {
        setError(null);
        onChange({
            ...proficiency,
            [key]: level,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const unselected: string[] = [];
        if (!proficiency.reading_level) unselected.push('Reading');
        if (!proficiency.writing_level) unselected.push('Writing');
        if (!proficiency.vocabulary_level) unselected.push('Vocabulary');
        if (!proficiency.speaking_level) unselected.push('Speaking');

        if (unselected.length > 0) {
            setError(`Please select your level for: ${unselected.join(', ')}.`);
            return;
        }

        setError(null);
        onSubmit();
    };

    return (
        <Card className="p-6 sm:p-8 bg-white border-2 border-b-6 border-slate-200/90 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    How comfortable are you with each skill?
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-xl mx-auto">
                    Click an option below to set your starting baseline.
                </p>

                <div className="mt-3 p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-start space-x-3 text-left max-w-xl mx-auto shadow-sm">
                    <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-emerald-950 font-semibold leading-relaxed">
                        <strong className="font-extrabold text-emerald-900">100% Flexible:</strong> These starting ratings help Lingo recommend your first lessons!
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    {SKILL_KEYS.map(({ key, label, icon, desc }) => {
                        const currentLevel = proficiency[key];

                        return (
                            <div key={key} className="bg-slate-50 p-5 rounded-3xl border-2 border-b-4 border-slate-200 space-y-3.5 hover:border-slate-300 transition-colors">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2.5 bg-white rounded-2xl shadow-sm border-2 border-slate-200">{icon}</div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-slate-900">{label}</h3>
                                            <p className="text-xs font-semibold text-slate-500">{desc}</p>
                                        </div>
                                    </div>

                                    {currentLevel ? (
                                        <Badge variant="brand" size="md" className="self-start sm:self-auto text-xs py-1 px-3 font-extrabold border-b-2 border-brand-800">
                                            ✓ {currentLevel}
                                        </Badge>
                                    ) : (
                                        <Badge variant="neutral" size="sm" className="self-start sm:self-auto text-xs py-1 px-3 bg-amber-100 text-amber-900 border-2 border-b-3 border-amber-300 font-extrabold">
                                            Select level
                                        </Badge>
                                    )}
                                </div>

                                {/* Duolingo-Style 3D Level Selector Buttons */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                                    {LEVELS.map(({ level }) => {
                                        const isSelected = currentLevel === level;
                                        return (
                                            <button
                                                key={level}
                                                type="button"
                                                onClick={() => handleLevelChange(key, level)}
                                                className={`py-3 px-2 rounded-2xl text-xs sm:text-sm font-black transition-all duration-150 text-center flex items-center justify-center space-x-1 border-2 border-b-4 ${isSelected
                                                        ? 'bg-brand-600 border-brand-800 text-white shadow-md active:translate-y-0.5 active:border-b-2 scale-[1.02]'
                                                        : 'bg-white text-slate-800 border-slate-200 hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-700 active:border-b-2 active:translate-y-0.5'
                                                    }`}
                                            >
                                                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
                                                <span>{level}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {error && (
                    <div className="p-4 bg-amber-100 border-2 border-amber-300 rounded-2xl text-sm font-black text-amber-950 text-center shadow-sm">
                        ⚠️ {error}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t-2 border-slate-100">
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={onBack}
                        disabled={isLoading}
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="text-base py-3.5 px-6 font-black border-2 border-b-4 border-slate-200 hover:border-slate-400"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="amber"
                        size="lg"
                        isLoading={isLoading}
                        rightIcon={<ArrowRight className="w-6 h-6" />}
                        className="text-base py-4 px-8 font-black shadow-lg border-2 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1"
                    >
                        Complete Profile
                    </Button>
                </div>
            </form>
        </Card>
    );
};
