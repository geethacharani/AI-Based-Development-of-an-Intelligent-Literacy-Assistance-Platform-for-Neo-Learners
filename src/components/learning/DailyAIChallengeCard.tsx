import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dailyChallengeService, DailyChallenge } from '../../services/dailyChallengeService';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LingoBot } from '../common/LingoCharacters';
import { useTranslation } from '../../utils/translations';
import { Flame, ArrowRight, Headphones, Mic, Award } from 'lucide-react';

export const DailyAIChallengeCard: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useTranslation();
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const targetLangName = profile?.target_language?.name || 'Hindi';

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const res = await dailyChallengeService.getDailyChallenge();
                setChallenge(res);
            } catch (err) {
                // Ignore silent
            }
        };
        fetchChallenge();
    }, []);

    if (!challenge) return null;

    return (
        <Card className="p-6 sm:p-7 border-2 border-purple-200/90 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06),0_2px_8px_rgba(79,70,229,0.04)] hover:shadow-[0_16px_36px_-4px_rgba(79,70,229,0.14)] transition-all duration-300 relative overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-purple-100/50 blur-2xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                {/* Left Quest Info */}
                <div className="space-y-3 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="brand" size="sm" className="font-black text-[10px] bg-purple-100 text-purple-900 border-none">
                            {t('daily_challenge_badge')}
                        </Badge>
                        <span className="text-xs font-black text-amber-600 bg-amber-100/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-amber-500" />
                            +{challenge.xp_reward} {t('bonus_xp_tag')}
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                            {t('micro_quest_time')}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                            "{challenge.theme}"
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                            {t('challenge_desc_prefix')} <strong className="text-purple-700">{targetLangName}</strong> {t('challenge_desc_suffix')}
                        </p>
                    </div>

                    {/* Quest Micro-Steps Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/90 border border-purple-100 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                            <Headphones className="w-4 h-4 text-purple-600 shrink-0" />
                            <span>1. {t('step_listen')}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/90 border border-purple-100 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                            <Mic className="w-4 h-4 text-teal-600 shrink-0" />
                            <span>2. {t('step_speak')}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-white/90 border border-purple-100 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
                            <Award className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>3. {t('step_complete')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Action & Character */}
                <div className="flex sm:flex-row lg:flex-col items-center gap-4 w-full lg:w-auto justify-between lg:justify-center shrink-0">
                    <LingoBot size="md" expression="encouraging" className="hidden sm:inline-flex" />

                    <Link
                        to="/daily-challenge"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-black shadow-md hover:shadow-lg hover:scale-105 transition-all shrink-0 cursor-pointer"
                    >
                        <span>{t('start_challenge_btn')}</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </Card>
    );
};
