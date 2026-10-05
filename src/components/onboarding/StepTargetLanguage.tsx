import React from 'react';
import { Language } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowLeft, ArrowRight, Check, Compass } from 'lucide-react';

interface StepTargetLanguageProps {
    languages: Language[];
    comfortableLanguage?: Language;
    selectedLanguage?: Language;
    onSelect: (language: Language) => void;
    onNext: () => void;
    onBack: () => void;
}

export const StepTargetLanguage: React.FC<StepTargetLanguageProps> = ({
    languages,
    comfortableLanguage,
    selectedLanguage,
    onSelect,
    onNext,
    onBack,
}) => {
    const [error, setError] = React.useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLanguage) {
            setError('Please choose the language you wish to learn.');
            return;
        }
        setError(null);
        onNext();
    };

    return (
        <Card className="p-6 sm:p-8 bg-white border-2 border-b-6 border-slate-200/90 shadow-xl rounded-3xl space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-teal-50 border border-teal-200 text-teal-700 rounded-full text-xs font-black">
                    <Compass className="w-4 h-4 text-teal-600 fill-teal-200" />
                    <span>Target Learning Goal</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Which language would you like to learn?
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-600 max-w-xl mx-auto">
                    We'll personalize lessons, voice practice, and reading exercises for this language!
                </p>

                {comfortableLanguage && (
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-2xl inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 border border-slate-200 shadow-sm">
                        <span>Comfortable Language:</span>
                        <span className="text-brand-700 font-black flex items-center gap-1">
                            {comfortableLanguage.flagEmoji} {comfortableLanguage.name} ({comfortableLanguage.nativeName})
                        </span>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {languages.map((lang) => {
                        const isSelected = selectedLanguage?.id === lang.id;
                        const isComfortableSame = comfortableLanguage?.id === lang.id;

                        return (
                            <div
                                key={lang.id}
                                onClick={() => {
                                    onSelect(lang);
                                    setError(null);
                                }}
                                className={`p-4 sm:p-5 rounded-3xl border-2 border-b-4 transition-all duration-150 cursor-pointer flex items-center justify-between select-none ${isSelected
                                        ? 'bg-gradient-to-r from-teal-50 to-brand-50 border-teal-600 shadow-md scale-[1.02] active:translate-y-0.5 active:border-b-2'
                                        : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-slate-50 active:translate-y-0.5 active:border-b-2'
                                    }`}
                            >
                                <div className="flex items-center space-x-3.5">
                                    <span className="text-4xl p-2 bg-slate-100 rounded-2xl shadow-inner border border-slate-200">{lang.flagEmoji}</span>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-base sm:text-lg font-black text-slate-900">{lang.name}</h3>
                                            {isComfortableSame && (
                                                <Badge variant="amber" size="sm" className="text-xs font-black">
                                                    Native
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm font-black text-teal-700">{lang.nativeName}</p>
                                    </div>
                                </div>

                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-b-3 transition-colors ${isSelected
                                            ? 'bg-teal-600 border-teal-800 text-white shadow-sm'
                                            : 'border-slate-300 bg-white'
                                        }`}
                                >
                                    {isSelected && <Check className="w-5 h-5" />}
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
                        leftIcon={<ArrowLeft className="w-5 h-5" />}
                        className="text-base py-3.5 px-6 font-black border-2 border-b-4 border-slate-200 hover:border-slate-400"
                    >
                        Back
                    </Button>
                    <Button
                        type="submit"
                        variant="secondary"
                        size="lg"
                        rightIcon={<ArrowRight className="w-6 h-6" />}
                        className="text-base py-4 px-8 font-black shadow-lg border-2 border-b-4 border-teal-800 active:border-b-0 active:translate-y-1"
                    >
                        Continue
                    </Button>
                </div>
            </form>
        </Card>
    );
};
