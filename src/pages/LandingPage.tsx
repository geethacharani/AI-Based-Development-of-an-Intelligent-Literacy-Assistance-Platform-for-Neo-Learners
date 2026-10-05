import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InteractiveHeroGraphic } from '../components/home/InteractiveHeroGraphic';
import {
    Sparkles,
    Globe,
    BookOpen,
    Brain,
    Target,
    CheckCircle2,
    ArrowRight,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/mockData';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { t, supportLangCode } = useTranslation();
    const { updateSupportLanguage } = useAuth();

    const interfaceLanguages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    ];

    return (
        <div className="space-y-24 pb-20">

            {/* HERO SECTION */}
            <section className="relative hero-gradient pt-8 pb-16 md:pt-16 md:pb-28 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Quick Interface Language Selector Banner for Neo-Learners */}
                    <div className="mb-8 p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 px-2">
                            <Globe className="w-4 h-4 text-brand-600" />
                            <span>{t('switch_support_lang')}:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {interfaceLanguages.map((l) => {
                                const isSelected = (supportLangCode || 'en').toLowerCase() === l.code.toLowerCase();
                                return (
                                    <button
                                        key={l.code}
                                        onClick={() => updateSupportLanguage(l.code)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
                                            isSelected
                                                ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-300'
                                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        <span>{l.flag}</span>
                                        <span>{l.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                        {/* Left Content */}
                        <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-brand-50 border border-brand-200/80 rounded-full text-xs font-extrabold text-brand-700 shadow-sm animate-fade-in">
                                <Sparkles className="w-4 h-4 text-brand-600 animate-pulse-subtle" />
                                <span>{t('landing_hero_badge')}</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                                {t('landing_hero_headline')}{' '}
                                <span className="gradient-text">{t('landing_hero_headline2')}</span>
                            </h1>

                            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {t('landing_hero_desc')}
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full sm:w-auto text-base py-4 px-8 shadow-soft-hover"
                                    onClick={() => navigate('/register')}
                                    rightIcon={<ArrowRight className="w-5 h-5" />}
                                >
                                    {t('landing_start_learning_btn')}
                                </Button>

                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full sm:w-auto text-base py-4 px-8"
                                    onClick={() => navigate('/login')}
                                >
                                    {t('landing_have_account_btn')}
                                </Button>
                            </div>

                            {/* Trust Badges */}
                            <div className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-semibold">
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600" /> {t('landing_trust_multilingual')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600" /> {t('landing_trust_self_paced')}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-4 h-4 text-teal-600" /> {t('landing_trust_mobile_ready')}
                                </span>
                            </div>
                        </div>

                        {/* Right Hero Interactive Literacy Engine Showcase */}
                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                {/* Background card accent */}
                                <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/20 via-teal-400/20 to-amber-300/20 rounded-4xl blur-2xl opacity-70 animate-pulse-subtle" />

                                <InteractiveHeroGraphic onStart={() => navigate('/register')} />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
                    <Badge variant="brand" size="md" className="font-bold uppercase tracking-wider">
                        {t('landing_features_badge')}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('landing_features_headline')}
                    </h2>
                    <p className="text-base text-slate-600 leading-relaxed">
                        {t('landing_features_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <Card hoverable className="p-8 space-y-4">
                        <div className="w-14 h-14 rounded-3xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-600 shadow-soft">
                            <Globe className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{t('landing_feature1_title')}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t('landing_feature1_desc')}
                        </p>
                    </Card>

                    <Card hoverable className="p-8 space-y-4">
                        <div className="w-14 h-14 rounded-3xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shadow-soft">
                            <Target className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{t('landing_feature2_title')}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t('landing_feature2_desc')}
                        </p>
                    </Card>

                    <Card hoverable className="p-8 space-y-4">
                        <div className="w-14 h-14 rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 shadow-soft">
                            <Brain className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{t('landing_feature3_title')}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {t('landing_feature3_desc')}
                        </p>
                    </Card>

                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="bg-slate-100/70 py-20 border-y border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <Badge variant="teal" size="md" className="font-bold uppercase tracking-wider">
                            {t('landing_how_badge')}
                        </Badge>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            {t('landing_how_headline')}
                        </h2>
                        <p className="text-base text-slate-600">
                            {t('landing_how_desc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 relative">
                            <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white font-extrabold flex items-center justify-center text-lg">
                                1
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{t('landing_step1_title')}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {t('landing_step1_desc')}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 relative">
                            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-lg">
                                2
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{t('landing_step2_title')}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {t('landing_step2_desc')}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 relative">
                            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-900 font-extrabold flex items-center justify-center text-lg">
                                3
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{t('landing_step3_title')}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {t('landing_step3_desc')}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3 relative">
                            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white font-extrabold flex items-center justify-center text-lg">
                                4
                            </div>
                            <h4 className="text-lg font-bold text-slate-900">{t('landing_step4_title')}</h4>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {t('landing_step4_desc')}
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* LANGUAGES SHOWCASE */}
            <section id="languages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
                    <Badge variant="amber" size="md" className="font-bold uppercase tracking-wider text-slate-900">
                        {t('landing_langs_badge')}
                    </Badge>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {t('landing_langs_headline')}
                    </h2>
                    <p className="text-base text-slate-600">
                        {t('landing_langs_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                        <Card key={lang.id} hoverable className="p-5 text-center space-y-2 border-slate-200">
                            <span className="text-4xl block">{lang.flagEmoji}</span>
                            <h4 className="text-base font-bold text-slate-900">{lang.name}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{lang.nativeName}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* BOTTOM CTA BANNER */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 rounded-4xl p-8 sm:p-12 md:p-16 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            {t('landing_cta_headline')}
                        </h2>
                        <p className="text-base text-brand-100 leading-relaxed">
                            {t('landing_cta_desc')}
                        </p>
                        <div className="pt-4">
                            <Button
                                variant="amber"
                                size="lg"
                                className="px-10 py-4 text-base shadow-glow hover:scale-105"
                                onClick={() => navigate('/register')}
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                {t('landing_cta_btn')}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
