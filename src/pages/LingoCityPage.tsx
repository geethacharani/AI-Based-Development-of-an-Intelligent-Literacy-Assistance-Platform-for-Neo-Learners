import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { lingoBotService } from '../services/lingoBotService';
import { lingoCityService } from '../services/lingoCityService';
import { LingoBotCustomization, DEFAULT_CUSTOMIZATION } from '../types/lingobot';
import { CityStory, DetectiveCase, LingoCityState } from '../types/lingoCity';
import { CustomizableLingoBot } from '../components/lingobot/CustomizableLingoBot';
import { AtlasTraveler, LexiReader } from '../components/common/LingoCharacters';
import { StoryTheaterModal } from '../components/city/StoryTheaterModal';
import { DetectiveBureauModal } from '../components/city/DetectiveBureauModal';
import { LanguageMuseumModal } from '../components/city/LanguageMuseumModal';
import { LanguageGardenModal } from '../components/city/LanguageGardenModal';
import { Badge } from '../components/ui/Badge';
import {
    Sparkles,
    Compass,
    Film,
    Search,
    Landmark,
    Sprout
} from 'lucide-react';

export const LingoCityPage: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useTranslation();

    const [lingoBotConfig, setLingoBotConfig] = useState<LingoBotCustomization>(DEFAULT_CUSTOMIZATION);
    const [cityState, setCityState] = useState<LingoCityState>(lingoCityService.getCityState());

    // Modals
    const [activeStory, setActiveStory] = useState<CityStory | null>(null);
    const [activeDetectiveCase, setActiveDetectiveCase] = useState<DetectiveCase | null>(null);
    const [isMuseumOpen, setIsMuseumOpen] = useState(false);
    const [isGardenOpen, setIsGardenOpen] = useState(false);
    const [xpNotification, setXpNotification] = useState<number | null>(null);

    const targetLangCode = profile?.target_language?.code || 'hi';
    const stories = lingoCityService.getStories(targetLangCode);
    const detectiveCases = lingoCityService.getDetectiveCases(targetLangCode);

    useEffect(() => {
        setLingoBotConfig(lingoBotService.getCustomization());
        const unsubscribe = lingoBotService.subscribe(cfg => setLingoBotConfig(cfg));
        return () => unsubscribe();
    }, []);

    const triggerXpEarned = (amount: number) => {
        setXpNotification(amount);
        setCityState(lingoCityService.getCityState());
        setTimeout(() => setXpNotification(null), 3500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* 🌆 LINGO CITY BANNER */}
            <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Ambient clouds & stars */}
                <div className="absolute top-2 right-12 text-white/30 text-3xl animate-float-slow pointer-events-none">☁️</div>
                <div className="absolute bottom-2 left-1/3 text-white/20 text-2xl animate-float-delayed pointer-events-none">✨</div>

                <div className="space-y-2 relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        Welcome to Lingo City
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        An Immersive Cartoon Language World
                    </h1>
                    <p className="text-sky-100 text-xs sm:text-sm leading-relaxed font-medium">
                        Explore animated stories, investigate language mysteries, cultivate your living vocabulary garden, and curate discoveries in your language museum.
                    </p>
                </div>

                {/* City Level & Companion Avatar (Display Only) */}
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-3.5 shadow-inner relative z-10">
                    <CustomizableLingoBot
                        customization={lingoBotConfig}
                        size="md"
                        expression="happy"
                        animate={true}
                    />

                    <div className="text-left space-y-0.5">
                        <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                            City Tier {cityState.level}
                        </div>
                        <div className="text-sm font-black text-white">
                            {cityState.cityName}
                        </div>
                        <div className="text-[11px] text-sky-100 font-medium">
                            {cityState.storiesCompleted.length} Stories • {cityState.casesSolved.length} Mysteries Solved
                        </div>
                    </div>
                </div>
            </div>

            {/* XP Celebration Notification */}
            {xpNotification && (
                <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        <span>Congratulations! +{xpNotification} XP added to your learning journey!</span>
                    </div>
                </div>
            )}

            {/* 🗺️ ILLUSTRATED CARTOON CITY ENVIRONMENT */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-200/90 shadow-2xl bg-gradient-to-b from-sky-200 via-indigo-100 to-purple-100 p-4 sm:p-8">
                {/* Floating Ambient Elements in City Panorama */}
                <div className="absolute top-4 left-6 text-sky-400/40 text-4xl animate-float-slow pointer-events-none">☁️</div>
                <div className="absolute top-10 right-16 text-sky-400/40 text-5xl animate-float-delayed pointer-events-none">☁️</div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-amber-400 text-3xl animate-pulse pointer-events-none">☀️</div>

                {/* Floating Educational Glyphs & Objects */}
                <div className="absolute top-14 left-16 text-indigo-400/35 text-xl font-bold animate-float-slow pointer-events-none">क</div>
                <div className="absolute top-24 left-1/3 text-purple-400/30 text-lg font-bold animate-float-delayed pointer-events-none">📖</div>
                <div className="absolute top-16 right-1/4 text-teal-400/35 text-xl font-bold animate-float-slow pointer-events-none">జ్ఞా</div>
                <div className="absolute top-28 right-12 text-amber-400/30 text-base animate-float-delayed pointer-events-none">⭐</div>
                <div className="absolute bottom-20 left-10 text-emerald-500/25 text-lg animate-float-slow pointer-events-none">🌿</div>
                <div className="absolute bottom-24 right-16 text-pink-400/30 text-base animate-float-delayed pointer-events-none">🦋</div>

                {/* City Heading */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-indigo-900 tracking-wider bg-white/70 backdrop-blur-md px-3 py-1 rounded-full shadow-2xs">
                            <Compass className="w-3.5 h-3.5 text-brand-600" />
                            Interactive City Map
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                            Choose Your Destination
                        </h2>
                    </div>

                    <span className="hidden sm:inline-block text-xs font-bold text-indigo-950/70 bg-white/60 px-3 py-1.5 rounded-xl border border-indigo-200/60 shadow-2xs">
                        4 Unique Learning Quarters
                    </span>
                </div>

                {/* 🏛️ 4 BALANCED CARTOON BUILDINGS (2x2 on tablet/desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
                    {/* 1. 🎬 STORY THEATER */}
                    <div
                        onClick={() => setActiveStory(stories[0])}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 rounded-3xl p-5 border-2 border-amber-300 hover:border-amber-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Cinema Marquee Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-1 flex justify-around w-full px-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                            </div>
                            <span className="text-4xl drop-shadow-md">🎬</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 mt-1">
                                MARQUEE THEATER
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="amber" size="sm" className="font-bold text-[10px]">
                                    {stories.length} Visual Stories
                                </Badge>
                                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                    ⭐ +60 XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                                Story Theater
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Watch short interactive animated episodes, tap words for meanings, practice speech pronunciation, and make story choices.
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-800">
                            <span>Enter Theater →</span>
                            <Film className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>

                    {/* 2. 🕵️ DETECTIVE BUREAU */}
                    <div
                        onClick={() => setActiveDetectiveCase(detectiveCases[0])}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-slate-100 rounded-3xl p-5 border-2 border-indigo-300 hover:border-indigo-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Bureau Headquarters Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 right-3 text-amber-400 text-xs">💡 Street Lamp</div>
                            <span className="text-4xl drop-shadow-md">🕵️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mt-1">
                                MYSTERY HEADQUARTERS
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="brand" size="sm" className="font-bold text-[10px]">
                                    {detectiveCases.length} Active Cases
                                </Badge>
                                <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                                    ⭐ +80 XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                                Detective Bureau
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Solve language mysteries! Inspect audio recordings, tickets, messages, and handwritten clues on the investigation corkboard.
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-brand-700">
                            <span>Open Clue Board →</span>
                            <Search className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* 3. 🏛️ LANGUAGE MUSEUM */}
                    <div
                        onClick={() => setIsMuseumOpen(true)}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-3xl p-5 border-2 border-purple-300 hover:border-purple-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Greek Pillars Museum Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 right-3 text-purple-200 text-xs font-bold">HERITAGE</div>
                            <span className="text-4xl drop-shadow-md">🏛️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200 mt-1">
                                HERITAGE ARCHIVES
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="brand" size="sm" className="font-bold text-[10px]">
                                    Discovery Gallery
                                </Badge>
                                <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                                    ⭐ Milestones
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-purple-800 transition-colors">
                                Language Museum
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                A curated gallery of letters mastered, stories completed, mystery cases archived, and audio recordings collected on your journey.
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-800">
                            <span>Explore Exhibits →</span>
                            <Landmark className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* 4. 🌱 LANGUAGE GARDEN */}
                    <div
                        onClick={() => setIsGardenOpen(true)}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 rounded-3xl p-5 border-2 border-emerald-300 hover:border-emerald-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Greenhouse Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 left-3 text-emerald-200 text-xs">🌿 Conservatory</div>
                            <span className="text-4xl drop-shadow-md">🌱</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-1">
                                VOCABULARY BLOOM
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="teal" size="sm" className="font-bold text-[10px]">
                                    {cityState.gardenMasteredCount} Trees Blooming
                                </Badge>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    ⭐ Growth XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                                Language Garden
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                Watch your vocabulary grow visually! New words start as seeds, sprout into plants, and blossom into fruit trees with practice.
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-800">
                            <span>Tend Vocabulary Plots →</span>
                            <Sprout className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* 🛣️ CARTOON STREET & INHABITANTS STRIP (Walking Characters) */}
                <div className="mt-8 pt-4 border-t-2 border-indigo-200/60 relative">
                    {/* Road surface */}
                    <div className="h-10 bg-slate-700/80 rounded-2xl flex items-center justify-around px-4 shadow-inner relative overflow-hidden">
                        <div className="flex justify-around w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <span key={i} className="w-8 h-1.5 bg-amber-400 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Walking Characters on the sidewalk */}
                    <div className="flex items-center justify-between px-6 -mt-16 pointer-events-none">
                        <div className="animate-float-slow">
                            <CustomizableLingoBot
                                customization={lingoBotConfig}
                                size="sm"
                                expression="happy"
                                animate={true}
                            />
                        </div>
                        <div className="animate-float-delayed">
                            <AtlasTraveler size="sm" />
                        </div>
                        <div className="animate-float-slow">
                            <LexiReader size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {activeStory && (
                <StoryTheaterModal
                    story={activeStory}
                    isOpen={Boolean(activeStory)}
                    onClose={() => setActiveStory(null)}
                    onCompleted={(storyId, xp) => {
                        triggerXpEarned(xp);
                    }}
                />
            )}

            {activeDetectiveCase && (
                <DetectiveBureauModal
                    caseItem={activeDetectiveCase}
                    isOpen={Boolean(activeDetectiveCase)}
                    onClose={() => setActiveDetectiveCase(null)}
                    onCaseSolved={(caseId, xp) => {
                        triggerXpEarned(xp);
                    }}
                />
            )}

            {isMuseumOpen && (
                <LanguageMuseumModal
                    isOpen={isMuseumOpen}
                    onClose={() => setIsMuseumOpen(false)}
                />
            )}

            {isGardenOpen && (
                <LanguageGardenModal
                    isOpen={isGardenOpen}
                    onClose={() => setIsGardenOpen(false)}
                    onPlantWatered={(xp) => triggerXpEarned(xp)}
                />
            )}
        </div>
    );
};

export default LingoCityPage;
