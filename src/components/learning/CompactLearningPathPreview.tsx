import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useTranslation } from '../../utils/translations';
import { Map, ArrowRight, Sparkles, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { LingoBot } from '../common/LingoCharacters';

interface CompactLearningPathPreviewProps {
    targetLangName?: string;
}

export const CompactLearningPathPreview: React.FC<CompactLearningPathPreviewProps> = ({
    targetLangName = 'Hindi'
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Stage progression state: 4 of 11 completed = 36%
    const currentStageNumber = 5;
    const totalStages = 11;
    const completedStages = 4;
    const progressPercent = Math.round((completedStages / totalStages) * 100);

    return (
        <Card className="p-6 sm:p-7 bg-gradient-to-br from-white via-brand-50/40 to-teal-50/50 rounded-3xl border border-brand-200/90 shadow-md relative overflow-hidden">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 left-1/3 w-60 h-60 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                            <Map className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Badge variant="brand" size="sm" className="font-extrabold uppercase tracking-wider text-[10px] bg-brand-100 text-brand-800 border-brand-200">
                                    {t('compact_path_tag')}
                                </Badge>
                                <span className="text-xs font-semibold text-slate-500">
                                    {targetLangName}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                {t('compact_path_title')}
                            </h2>
                        </div>
                    </div>

                    {/* Secondary Link to Full Roadmap */}
                    <button
                        onClick={() => navigate('/learning-path')}
                        className="self-start sm:self-auto text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 hover:underline transition cursor-pointer px-3 py-1.5 rounded-xl hover:bg-brand-50/80"
                    >
                        <span>{t('view_full_roadmap_btn')}</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Details Box */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-brand-100/90 shadow-sm space-y-4">
                    {/* Stage & Status Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-brand-600 text-white text-xs font-extrabold shadow-sm">
                                {t('stage_5_name')}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                                • {t('compact_path_mastered_count')}
                            </span>
                        </div>
                        <span className="text-xs font-black text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                            {progressPercent}% {t('stage_status_completed')}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                            <div
                                className="h-full bg-gradient-to-r from-teal-500 via-brand-500 to-indigo-600 rounded-full transition-all duration-700 shadow-sm"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                            <span>Stage 1: {t('stage_1_name')}</span>
                            <span className="text-teal-700 font-bold">{t('compact_path_next_desc')}</span>
                            <span>Stage 11: {t('stage_11_name')}</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
                        <LingoBot size="sm" expression="encouraging" />
                        <span>{t('compact_path_subtitle')}</span>
                    </div>

                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/learning-path')}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                        className="w-full sm:w-auto bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-black shadow-md cursor-pointer px-6 py-2.5 text-sm"
                    >
                        {t('continue_learning_btn')}
                    </Button>
                </div>
            </div>
        </Card>
    );
};
