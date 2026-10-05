import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Sparkles, CheckCircle2, ArrowRight, UserCheck } from 'lucide-react';

interface StepSuccessProps {
    onTakeAssessment: () => void;
    onViewProfile: () => void;
    learnerName: string;
    targetLanguageName: string;
}

export const StepSuccess: React.FC<StepSuccessProps> = ({
    onTakeAssessment,
    onViewProfile,
    learnerName,
    targetLanguageName,
}) => {
    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4F46E5', '#0D9488', '#F59E0B'],
        });
    }, []);

    return (
        <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-brand-600 via-teal-500 to-amber-400 flex items-center justify-center text-white shadow-soft-hover animate-bounce-soft">
                <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Profile Created Successfully</span>
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Your learning profile is ready! 🎉
                </h2>

                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Welcome aboard, <strong className="text-slate-900 font-bold">{learnerName}</strong>! We've recorded your baseline skills for learning <strong className="text-brand-700 font-bold">{targetLanguageName}</strong>.
                </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 text-xs text-slate-600 space-y-2 text-left">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    Next Step: Initial Assessment
                </p>
                <p className="leading-relaxed">
                    Your initial diagnostic assessment will analyze your reading comprehension, writing accuracy, and vocabulary depth to tailor your dynamic learning path.
                </p>
            </div>

            <div className="space-y-3 pt-2">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full text-base py-4"
                    onClick={onTakeAssessment}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                    Continue to Assessment
                </Button>

                <Button
                    variant="outline"
                    size="md"
                    className="w-full"
                    onClick={onViewProfile}
                >
                    View My Profile
                </Button>
            </div>
        </Card>
    );
};
