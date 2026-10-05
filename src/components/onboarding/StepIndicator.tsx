import React from 'react';
import { cn } from '../../utils/cn';
import { Check, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepLabels: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
    currentStep,
    totalSteps,
    stepLabels,
}) => {
    const percentage = Math.round((currentStep / totalSteps) * 100);

    return (
        <div className="w-full max-w-3xl mx-auto space-y-3">
            {/* Top progress bar header */}
            <div className="flex justify-between items-center text-xs sm:text-sm font-black text-slate-700">
                <span className="uppercase tracking-wider flex items-center gap-1.5 text-brand-700">
                    <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                    Step {currentStep} of {totalSteps}: <span className="text-slate-900 font-extrabold">{stepLabels[currentStep - 1]}</span>
                </span>
                <span className="text-emerald-600 font-mono font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {percentage}% Complete
                </span>
            </div>

            {/* Duolingo style 3D progress bar */}
            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border-2 border-slate-200 shadow-inner">
                <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Step node pills */}
            <div className="grid grid-cols-4 gap-2 pt-1">
                {stepLabels.map((label, index) => {
                    const stepNum = index + 1;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <div key={label} className="flex flex-col items-center text-center">
                            <div
                                className={cn(
                                    'w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-300 border-2 border-b-4',
                                    isCompleted && 'bg-emerald-500 border-emerald-700 text-white shadow-sm',
                                    isCurrent && 'bg-brand-600 border-brand-800 text-white shadow-md scale-105',
                                    !isCompleted && !isCurrent && 'bg-white border-slate-200 text-slate-400'
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                            </div>
                            <span
                                className={cn(
                                    'text-xs font-black mt-1.5 transition-colors hidden sm:block',
                                    isCurrent && 'text-brand-700',
                                    isCompleted && 'text-emerald-700',
                                    !isCompleted && !isCurrent && 'text-slate-400'
                                )}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
