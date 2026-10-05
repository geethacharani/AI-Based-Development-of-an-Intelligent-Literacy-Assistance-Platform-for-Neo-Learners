import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { BookOpen, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const AssessmentPromptCard: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Card className="relative overflow-hidden p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-950 text-white border-none shadow-2xl">
            {/* Background glow decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left max-w-xl">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                        <Badge variant="amber" size="md" className="font-bold gap-1 text-slate-900 bg-amber-400">
                            <Sparkles className="w-3.5 h-3.5" /> Assessment Waiting
                        </Badge>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> AI Diagnostic Framework
                        </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-white tracking-tight">
                        Your initial assessment has not been completed.
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed">
                        Take a short assessment so our platform can accurately measure your starting proficiency and construct your dynamic, personalized learning path.
                    </p>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                    <Button
                        variant="amber"
                        size="lg"
                        className="w-full md:w-auto px-8 py-4 text-base shadow-glow hover:scale-105"
                        onClick={() => navigate('/assessment')}
                        rightIcon={<ArrowRight className="w-5 h-5" />}
                    >
                        Start Assessment
                    </Button>
                </div>
            </div>
        </Card>
    );
};
