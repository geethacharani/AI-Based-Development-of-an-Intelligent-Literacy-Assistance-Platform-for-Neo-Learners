import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
    Sparkles,
    Volume2,
    BookOpen,
    Brain,
    Globe,
    Target,
    ArrowRight,
    Play,
    CheckCircle2,
    Layers,
    Mic
} from 'lucide-react';

interface InteractiveHeroGraphicProps {
    onStart: () => void;
}

export const InteractiveHeroGraphic: React.FC<InteractiveHeroGraphicProps> = ({ onStart }) => {
    const [activeTab, setActiveTab] = useState<'ai' | 'reading' | 'metrics'>('ai');
    const [selectedLang, setSelectedLang] = useState<'te' | 'hi' | 'ta'>('te');
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);
    const [activeWord, setActiveWord] = useState<'literacy' | 'adaptive' | null>('literacy');

    const translations = {
        te: {
            flag: '🇮🇳',
            name: 'Telugu',
            phrase: 'నమస్కారం! మీ అభ్యాస ప్రయాణాన్ని ప్రారంభిద్దాం.',
            phonetic: 'Namasakaaram! Mii abhyaasa prayanaanni praarambhiddam.',
        },
        hi: {
            flag: '🇮🇳',
            name: 'Hindi',
            phrase: 'नमस्ते! आइए आपकी सीखने की यात्रा शुरू करें।',
            phonetic: 'Namaste! Aaiye aapki seekhne ki yaatra shuru karein.',
        },
        ta: {
            flag: '🇮🇳',
            name: 'Tamil',
            phrase: 'வணக்கம்! உங்கள் கற்றல் பயணத்தைத் தொடங்குவோம்.',
            phonetic: 'Vanakkam! Ungal katral payanathai thodanguvom.',
        },
    };

    const currentTrans = translations[selectedLang];

    const handleToggleAudio = () => {
        setIsPlayingAudio(true);
        setTimeout(() => setIsPlayingAudio(false), 2500);
    };

    return (
        <Card className="relative p-6 sm:p-8 bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-2xl space-y-6">

            {/* Top Header & Tab Pills */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-soft">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-extrabold text-slate-900">LingoPath AI Engine</h4>
                        <p className="text-[11px] text-slate-500 font-medium">Interactive Platform Demo</p>
                    </div>
                </div>

                <Badge variant="teal" size="sm" className="font-bold gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                    Live Interactive
                </Badge>
            </div>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-2xl text-xs font-semibold">
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`py-2 px-1 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'ai'
                            ? 'bg-white text-brand-700 shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Multilingual</span>
                </button>

                <button
                    onClick={() => setActiveTab('reading')}
                    className={`py-2 px-1 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'reading'
                            ? 'bg-white text-teal-700 shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Passage</span>
                </button>

                <button
                    onClick={() => setActiveTab('metrics')}
                    className={`py-2 px-1 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-1 ${activeTab === 'metrics'
                            ? 'bg-white text-amber-700 shadow-sm font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                >
                    <Target className="w-3.5 h-3.5" />
                    <span>Skill Metrics</span>
                </button>
            </div>

            {/* TAB 1: MULTILINGUAL AI VOICE & SCRIPT BRIDGE */}
            {activeTab === 'ai' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">Native Comfort Language:</span>
                        <div className="flex space-x-1">
                            {(['te', 'hi', 'ta'] as const).map((langKey) => (
                                <button
                                    key={langKey}
                                    onClick={() => setSelectedLang(langKey)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${selectedLang === langKey
                                            ? 'bg-brand-600 text-white shadow-soft'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                >
                                    {translations[langKey].flag} {translations[langKey].name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                Target Language (English 🇬🇧)
                            </span>
                            <button
                                onClick={handleToggleAudio}
                                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${isPlayingAudio
                                        ? 'bg-amber-400 text-slate-900 animate-pulse'
                                        : 'bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100'
                                    }`}
                            >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{isPlayingAudio ? 'Playing Native Audio...' : 'Listen Audio'}</span>
                            </button>
                        </div>

                        <p className="text-sm font-bold text-slate-900">
                            "Welcome! Let's start your personalized literacy journey."
                        </p>

                        {/* Native translation card */}
                        <div className="p-3 bg-brand-50/70 border border-brand-200/80 rounded-xl space-y-1 text-xs">
                            <div className="flex items-center justify-between font-bold text-brand-900">
                                <span>Native Script Explanation ({currentTrans.name} {currentTrans.flag}):</span>
                            </div>
                            <p className="text-sm font-semibold text-brand-800 leading-relaxed">
                                {currentTrans.phrase}
                            </p>
                            <p className="text-[11px] text-slate-500 italic">
                                Phonetic: {currentTrans.phonetic}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: ADAPTIVE READING DIAGNOSTIC */}
            {activeTab === 'reading' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700">Sample Reading Diagnostic</span>
                            <Badge variant="brand" size="sm">Tap highlighted words</Badge>
                        </div>

                        <p className="text-sm font-medium text-slate-800 leading-relaxed">
                            "Our platform improves adult{' '}
                            <button
                                onClick={() => setActiveWord('literacy')}
                                className={`px-1.5 py-0.5 rounded-md font-bold underline underline-offset-2 transition-all ${activeWord === 'literacy'
                                        ? 'bg-brand-600 text-white'
                                        : 'bg-brand-100 text-brand-800 hover:bg-brand-200'
                                    }`}
                            >
                                literacy
                            </button>{' '}
                            through{' '}
                            <button
                                onClick={() => setActiveWord('adaptive')}
                                className={`px-1.5 py-0.5 rounded-md font-bold underline underline-offset-2 transition-all ${activeWord === 'adaptive'
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                                    }`}
                            >
                                adaptive
                            </button>{' '}
                            AI recommendations."
                        </p>

                        {/* Word Definition Popup */}
                        {activeWord && (
                            <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-sm space-y-1 text-xs">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                    <span className="capitalize text-brand-700 flex items-center gap-1">
                                        <BookOpen className="w-3.5 h-3.5" />
                                        {activeWord}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Word Breakdown</span>
                                </div>
                                <p className="text-slate-600">
                                    {activeWord === 'literacy'
                                        ? 'Definition: The ability to read, write, and understand language effectively.'
                                        : 'Definition: Modifying learning content based on user proficiency in real-time.'}
                                </p>
                                <p className="text-brand-800 font-semibold text-[11px] pt-0.5">
                                    Telugu Hint: {activeWord === 'literacy' ? 'అక్షరాస్యత (Aksharaasyata)' : 'అనుకూలమైన (Anukoolamaina)'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: LIVE SKILL METRICS */}
            {activeTab === 'metrics' && (
                <div className="space-y-3 animate-fade-in">
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-brand-600" /> Reading Level</span>
                                <span className="text-brand-600 font-bold">Intermediate (75%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-brand-600 h-full rounded-full w-[75%] animate-pulse-subtle" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5"><Brain className="w-3.5 h-3.5 text-amber-600" /> Vocabulary Depth</span>
                                <span className="text-amber-600 font-bold">Advanced (90%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 h-full rounded-full w-[90%]" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                                <span className="flex items-center gap-1.5"><Mic className="w-3.5 h-3.5 text-teal-600" /> Speaking Pronunciation</span>
                                <span className="text-teal-600 font-bold">Basic (50%)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full rounded-full w-[50%]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
                        <span className="font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Recommendation
                        </span>
                        <p className="text-[11px] leading-relaxed">
                            Focus on everyday spoken greetings to boost your Speaking score to Intermediate.
                        </p>
                    </div>
                </div>
            )}

            {/* Bottom CTA Button */}
            <Button
                variant="amber"
                size="md"
                className="w-full font-bold shadow-soft"
                onClick={onStart}
                rightIcon={<ArrowRight className="w-4 h-4" />}
            >
                Start Personalized Assessment
            </Button>
        </Card>
    );
};
