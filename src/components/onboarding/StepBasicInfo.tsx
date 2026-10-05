import React from 'react';
import { AgeGroup, LearningGoal, RegistrationStep2Data } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowLeft, ArrowRight, Check, Target, Users } from 'lucide-react';

interface StepBasicInfoProps {
    data: RegistrationStep2Data;
    onChange: (data: Partial<RegistrationStep2Data>) => void;
    onNext: () => void;
    onBack: () => void;
}

const AGE_GROUPS: AgeGroup[] = [
    'Under 18',
    '18–25',
    '26–40',
    '41–60',
    '60+',
    'Prefer not to say',
];

const LEARNING_GOALS: { goal: LearningGoal; description: string; icon: string }[] = [
    { goal: 'Reading', description: 'Understand books, news, and everyday signs', icon: '📖' },
    { goal: 'Writing', description: 'Construct sentences, letters, and messages', icon: '✍️' },
    { goal: 'Speaking', description: 'Express yourself comfortably in conversation', icon: '🗣️' },
    { goal: 'Vocabulary', description: 'Expand word knowledge and context clues', icon: '🧠' },
    { goal: 'Everyday Communication', description: 'Handle shopping, work, and community life', icon: '💬' },
    { goal: 'All-round Literacy', description: 'Complete balanced growth across all skills', icon: '🌟' },
];

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({
    data,
    onChange,
    onNext,
    onBack,
}) => {
    const [error, setError] = React.useState<string | null>(null);

    const toggleGoal = (goal: LearningGoal) => {
        const current = data.learning_goals || [];
        if (current.includes(goal)) {
            onChange({ learning_goals: current.filter((g) => g !== goal) });
        } else {
            onChange({ learning_goals: [...current, goal] });
        }
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.age_group) {
            setError('Please select an age group range');
            return;
        }
        if (!data.learning_goals || data.learning_goals.length === 0) {
            setError('Please select at least one learning goal');
            return;
        }
        setError(null);
        onNext();
    };

    return (
        <Card className="p-6 sm:p-8 bg-white border-2 border-b-6 border-slate-200/90 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Tell us a little about yourself
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-600">
                    This helps us personalize learning activities around your life and goals.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Age Group Section */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-sm sm:text-base">
                        <Users className="w-5 h-5 text-brand-600" />
                        <span>What is your age group?</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {AGE_GROUPS.map((age) => {
                            const isSelected = data.age_group === age;
                            return (
                                <button
                                    key={age}
                                    type="button"
                                    onClick={() => {
                                        onChange({ age_group: age });
                                        setError(null);
                                    }}
                                    className={`py-3.5 px-3 rounded-2xl text-xs sm:text-sm font-black text-center transition-all duration-150 flex items-center justify-center space-x-2 border-2 border-b-4 ${isSelected
                                        ? 'bg-brand-600 border-brand-800 text-white shadow-md active:translate-y-0.5 active:border-b-2 scale-[1.02]'
                                        : 'bg-white border-slate-200 text-slate-800 hover:border-brand-400 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2'
                                        }`}
                                >
                                    {isSelected && <Check className="w-4 h-4 text-white" />}
                                    <span>{age}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Educational Qualification Section */}
                <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-slate-900 font-black text-sm sm:text-base">
                        <span className="text-xl">🎓</span>
                        <span>Educational Qualification</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {['Primary School', 'Secondary School', 'High School', 'College / Graduate', 'Self-Taught', 'Other'].map((qual) => {
                            const isSelected = data.qualification === qual;
                            return (
                                <button
                                    key={qual}
                                    type="button"
                                    onClick={() => {
                                        onChange({ qualification: qual });
                                        setError(null);
                                    }}
                                    className={`py-3 px-2 rounded-2xl text-xs font-black text-center transition-all duration-150 border-2 border-b-4 ${isSelected
                                        ? 'bg-teal-600 border-teal-800 text-white shadow-md scale-[1.02]'
                                        : 'bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-slate-50'
                                        }`}
                                >
                                    {qual}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Goals Section */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-slate-900 font-black text-sm sm:text-base">
                            <Target className="w-5 h-5 text-teal-600" />
                            <span>What would you like to improve?</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-400">Select all that apply</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {LEARNING_GOALS.map(({ goal, description, icon }) => {
                            const isSelected = data.learning_goals?.includes(goal);
                            return (
                                <div
                                    key={goal}
                                    onClick={() => toggleGoal(goal)}
                                    className={`p-4 rounded-2xl border-2 border-b-4 transition-all duration-150 cursor-pointer flex items-start space-x-3 select-none ${isSelected
                                        ? 'bg-emerald-50 border-emerald-600 text-slate-900 shadow-md scale-[1.01] active:translate-y-0.5 active:border-b-2'
                                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2'
                                        }`}
                                >
                                    <span className="text-2xl p-1 bg-white rounded-xl shadow-sm border border-slate-200">{icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-black text-slate-900">{goal}</p>
                                            {isSelected && (
                                                <Badge variant="teal" size="sm" className="font-extrabold border-b-2 border-emerald-700">
                                                    ✓ Selected
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs font-semibold text-slate-600 mt-1 leading-snug">{description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="text-base py-3.5 px-6 font-black border-2 border-b-4 border-slate-200 hover:border-slate-400"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-6 h-6" />}
                        className="text-base py-4 px-8 font-black shadow-lg border-2 border-b-4 border-brand-800 active:border-b-0 active:translate-y-1"
                    >
                        Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
};
