import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { AtlasTraveler, LingoBot } from '../common/LingoCharacters';
import { useTranslation } from '../../utils/translations';
import {
    Sparkles,
    Camera,
    Globe,
    Compass,
    Shirt,
    ArrowRight
} from 'lucide-react';

export const ExploreLingoPath: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        {
            title: t('tool_comm_title'),
            badge: t('tool_comm_badge'),
            badgeColor: 'teal' as const,
            tagline: t('tool_comm_desc'),
            path: '/missions',
            icon: <Globe className="w-6 h-6 text-teal-600" />,
            character: <AtlasTraveler size="sm" className="opacity-90" />,
            border: 'border-teal-200 hover:border-teal-400',
            bg: 'bg-white hover:bg-teal-50/40',
            btnBg: 'bg-teal-600 hover:bg-teal-700 text-white',
            actionText: t('tool_comm_btn')
        },
        {
            title: t('tool_ocr_title'),
            badge: t('tool_ocr_badge'),
            badgeColor: 'brand' as const,
            tagline: t('tool_ocr_desc'),
            path: '/learn-from-image',
            icon: <Camera className="w-6 h-6 text-brand-600" />,
            border: 'border-brand-200 hover:border-brand-400',
            bg: 'bg-white hover:bg-indigo-50/40',
            btnBg: 'bg-brand-600 hover:bg-brand-700 text-white',
            actionText: t('tool_ocr_btn')
        },
        {
            title: t('nav_lingo_city'),
            badge: 'NEW WORLD',
            badgeColor: 'brand' as const,
            tagline: t('explore_lingo_city_link'),
            path: '/lingo-city',
            icon: <Compass className="w-6 h-6 text-brand-600" />,
            border: 'border-indigo-200 hover:border-indigo-400',
            bg: 'bg-white hover:bg-indigo-50/40',
            btnBg: 'bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold',
            actionText: t('nav_lingo_city')
        },
        {
            title: t('nav_lingobot'),
            badge: 'AVATAR STUDIO',
            badgeColor: 'purple' as const,
            tagline: t('explore_lingopath_tag'),
            path: '/lingobot',
            icon: <Shirt className="w-6 h-6 text-purple-600" />,
            character: <LingoBot size="sm" expression="celebrating" />,
            border: 'border-purple-200 hover:border-purple-400',
            bg: 'bg-white hover:bg-purple-50/40',
            btnBg: 'bg-purple-600 hover:bg-purple-700 text-white',
            actionText: t('nav_lingobot')
        }
    ];

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                        <span>{t('explore_lingopath_tag').replace(/^✨\s*/, '')}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {t('explore_lingopath_title')}
                    </h2>
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
                    {t('explore_lingopath_subtitle')}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {features.map((feat, idx) => (
                    <Link
                        key={idx}
                        to={feat.path}
                        className={`group relative p-5 rounded-3xl border ${feat.border} ${feat.bg} shadow-soft hover:shadow-soft-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden`}
                    >
                        {/* Ambient subtle light inside card */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/40 blur-xl pointer-events-none group-hover:scale-150 transition-transform" />

                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 rounded-2xl bg-white/90 shadow-2xs border border-slate-200/80 group-hover:scale-110 transition-transform">
                                    {feat.icon}
                                </div>
                                {feat.character || (
                                    <Badge variant={feat.badgeColor} size="sm" className="text-[9px] font-black tracking-wider">
                                        {feat.badge}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                                    {feat.title}
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed font-medium mt-1">
                                    {feat.tagline}
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-slate-200/60 flex items-center justify-between relative z-10">
                            <span className="text-xs font-black text-slate-700 group-hover:text-brand-700 transition-colors flex items-center gap-1">
                                {feat.actionText}
                            </span>
                            <div className={`w-8 h-8 rounded-xl ${feat.btnBg} flex items-center justify-center shadow-xs group-hover:translate-x-1 transition-transform`}>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};
