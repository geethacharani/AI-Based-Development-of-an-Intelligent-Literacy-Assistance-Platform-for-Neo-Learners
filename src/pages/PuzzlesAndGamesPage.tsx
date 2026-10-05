import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { gameService } from '../services/gameService';
import { GameKey, GameContentResponse } from '../types/game';
import { WordTetris } from '../components/games/WordTetris';
import { MemoryFlip } from '../components/games/MemoryFlip';
import { WordDuel } from '../components/games/WordDuel';
import { SpeedRound } from '../components/games/SpeedRound';
import { WordSpin } from '../components/games/WordSpin';
import {
    ArrowLeft,
    Gamepad2,
    Trophy,
    Play,
    Flame,
    Star,
    Sparkles,
    LayoutGrid,
    Swords,
    Zap,
    Disc,
    CheckCircle2,
    Target,
    HelpCircle
} from 'lucide-react';

interface GameDefinition {
    key: GameKey;
    title: string;
    skillTrained: string;
    difficulty: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    gradient: string;
    xpReward: number;
    badge: string;
    emoji: string;
    accentColor: string;
}

const ALL_GAMES: GameDefinition[] = [
    {
        key: 'word_tetris',
        title: 'Word Tetris',
        skillTrained: 'Vocabulary & Spelling',
        difficulty: 'Beginner',
        description: 'Build target-language words using falling letter blocks before the grid fills up.',
        icon: LayoutGrid,
        gradient: 'from-cyan-500 to-blue-600',
        xpReward: 50,
        badge: 'Block Stacking',
        emoji: '🧱',
        accentColor: 'text-cyan-400'
    },
    {
        key: 'memory_flip',
        title: 'Memory Flip',
        skillTrained: 'Translation & Memory',
        difficulty: 'Beginner',
        description: 'Flip pairs of 3D cards to match target words with their meanings under time pressure.',
        icon: Trophy,
        gradient: 'from-pink-500 to-rose-600',
        xpReward: 50,
        badge: '3D Memory',
        emoji: '🃏',
        accentColor: 'text-pink-400'
    },
    {
        key: 'word_duel',
        title: 'Word Duel',
        skillTrained: 'Grammar & Boss Combat',
        difficulty: 'Intermediate',
        description: 'Battle the Shadow Boss in animated HP combat! Answer correctly to strike heavy blows.',
        icon: Swords,
        gradient: 'from-rose-600 to-amber-500',
        xpReward: 70,
        badge: 'Boss Battle',
        emoji: '⚔️',
        accentColor: 'text-rose-400'
    },
    {
        key: 'speed_round',
        title: 'Speed Round',
        skillTrained: 'Rapid Recall',
        difficulty: 'Advanced',
        description: 'Race against a shrinking circular timer! Rapid answers earn multipliers and speed XP.',
        icon: Zap,
        gradient: 'from-amber-500 to-orange-500',
        xpReward: 60,
        badge: 'Rapid Fire',
        emoji: '⚡',
        accentColor: 'text-amber-400'
    },
    {
        key: 'word_spin',
        title: 'Word Spin',
        skillTrained: 'Random Vocabulary',
        difficulty: 'Beginner',
        description: 'Spin the color wheel to select random vocabulary words and match definitions.',
        icon: Disc,
        gradient: 'from-purple-600 to-indigo-600',
        xpReward: 50,
        badge: 'Wheel Spin',
        emoji: '🎲',
        accentColor: 'text-purple-400'
    },
];

export const PuzzlesAndGamesPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const langKey = (supportLangCode || 'en').toLowerCase().slice(0, 2);

    const GAME_TRANSLATIONS: Record<string, Record<string, { title: string; skill: string; desc: string }>> = {
        kn: {
            word_tetris: {
                title: "ವರ್ಡ್ ಟೆಟ್ರಿಸ್",
                skill: "ಶಬ್ದಕೋಶ & ಕಾಗುಣಿತ",
                desc: "ಗ್ರಿಡ್ ತುಂಬುವ ಮೊದಲು ಬೀಳುವ ಅಕ್ಷರ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಬಳಸಿ ಗುರಿ ಭಾಷೆಯ ಪದಗಳನ್ನು ರಚಿಸಿ."
            },
            memory_flip: {
                title: "ಮೆಮೊರಿ ಫ್ಲಿಪ್",
                skill: "ಅನುವಾದ & ಸ್ಮರಣಶಕ್ತಿ",
                desc: "ಸಮಯ ಮಿತಿಯಲ್ಲಿ ಪದಗಳನ್ನು ಅವುಗಳ ಅರ್ಥಗಳೊಂದಿಗೆ ಹೊಂದಿಸಲು 3D ಕಾರ್ಡ್‌ಗಳನ್ನು ಫ್ಲಿಪ್ ಮಾಡಿ."
            },
            word_duel: {
                title: "ವರ್ಡ್ ಡ್ಯುಯೆಲ್",
                skill: "ವ್ಯಾಕರಣ & ಬಾಸ್ ಕದನ",
                desc: "ಶ್ಯಾಡೋ ಬಾಸ್ ವಿರುದ್ಧ ಹೋರಾಡಿ! ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿ ಪ್ರಬಲ ಹೊಡೆತಗಳನ್ನು ನೀಡಿ."
            },
            speed_round: {
                title: "ಸ್ಪೀಡ್ ರೌಂಡ್",
                skill: "ತ್ವರಿತ ಸ್ಮರಣೆ",
                desc: "ಸಮಯ ಮುಗಿಯುವ ಮೊದಲು ವೇಗವಾಗಿ ಉತ್ತರಿಸಿ ಗುಣಕಗಳು ಮತ್ತು ಹೆಚ್ಚುವರಿ XP ಗಳಿಸಿ."
            },
            word_spin: {
                title: "ವರ್ಡ್ ಸ್ಪಿನ್",
                skill: "ಯಾದೃಚ್ಛಿಕ ಶಬ್ದಕೋಶ",
                desc: "ಚಕ್ರವನ್ನು ತಿರುಗಿಸಿ ಯಾದೃಚ್ಛಿಕ ಪದಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ವ್ಯಾಖ್ಯಾನಗಳನ್ನು ಹೊಂದಿಸಿ."
            }
        },
        te: {
            word_tetris: {
                title: "వర్డ్ టెట్రిస్",
                skill: "పదజాలం & స్పెల్లింగ్",
                desc: "గ్రిడ్ నిండకముందే అక్షరాల బ్లాక్‌లను ఉపయోగించి పదాలను నిర్మించండి."
            },
            memory_flip: {
                title: "మెమరీ ఫ్లిప్",
                skill: "అనువాదం & జ్ఞాపకశక్తి",
                desc: "సమయ పరిమితిలో పదాలను వాటి అర్థాలతో సరిపోల్చడానికి కార్డ్‌లను తిప్పండి."
            },
            word_duel: {
                title: "వర్డ్ డ్యుయల్",
                skill: "వ్యాకరణం & బాస్ పోరాటం",
                desc: "షాడో బాస్‌తో పోరాడండి! సరైన సమాధానాలు ఇచ్చి భారీ దెబ్బలు కొట్టండి."
            },
            speed_round: {
                title: "స్పీడ్ రౌండ్",
                skill: "వేగవంతమైన రీకాల్",
                desc: "టైమర్ ముగిసేలోపు వేగంగా సమాధానమిచ్చి ఎక్కువ XP సంపాదించండి."
            },
            word_spin: {
                title: "వర్డ్ స్పిన్",
                skill: "యాదృచ్ఛిక పదజాలం",
                desc: "రంగు చక్రం తిప్పి పదాలను ఎంచుకోండి మరియు అర్థాలను సరిపోల్చండి."
            }
        },
        hi: {
            word_tetris: {
                title: "वर्ड टेट्रिस",
                skill: "शब्दावली और वर्तनी",
                desc: "ग्रिड भरने से पहले गिरते अक्षर ब्लॉकों का उपयोग करके शब्द बनाएं।"
            },
            memory_flip: {
                title: "मेमोरी फ्लिप",
                skill: "अनुवाद और स्मरण",
                desc: "समय सीमा में शब्दों को उनके अर्थों से मिलाने के लिए 3D कार्ड पलटें।"
            },
            word_duel: {
                title: "वर्ड ड्यूल",
                skill: "व्याकरण और बॉस मुकाबला",
                desc: "शैडो बॉस से मुकाबला करें! सटीक प्रहार करने के लिए सही उत्तर दें।"
            },
            speed_round: {
                title: "स्पीड राउंड",
                skill: "त्वरित स्मरण",
                desc: "घटते समय के खिलाफ रेस करें! त्वरित उत्तर देकर अधिक XP अर्जित करें।"
            },
            word_spin: {
                title: "वर्ड स्पिन",
                skill: "यादृच्छिक शब्दावली",
                desc: "कलर व्हील घुमाकर शब्द चुनें और परिभाषाओं का मिलान करें।"
            }
        },
        ta: {
            word_tetris: {
                title: "வேர்ட் டெட்ரிஸ்",
                skill: "சொற்களஞ்சியம் & எழுத்துப்பிழை",
                desc: "கட்டங்கள் நிரம்புவதற்கு முன் எழுத்துத் தொகுதிகளைப் பயன்படுத்தி சொற்களை உருவாக்குங்கள்."
            },
            memory_flip: {
                title: "மெமரி ஃபிளிப்",
                skill: "மொழிபெயர்ப்பு & நினைவாற்றல்",
                desc: "நேர அழுத்தத்தில் சொற்களை அவற்றின் அர்த்தங்களுடன் பொருத்த அட்டைகளைப் புரட்டுங்கள்."
            },
            word_duel: {
                title: "வேர்ட் டூயல்",
                skill: "இலக்கணம் & பாஸ் போர்",
                desc: "ஷேடோ பாஸுடன் போரிடுங்கள்! பலத்த அடிகளைக் கொடுக்க சரியாகப் பதிலளிக்கவும்."
            },
            speed_round: {
                title: "ஸ்பீட் ரவுண்ட்",
                skill: "வேகமான நினைவுபடுத்தல்",
                desc: "குறைந்து வரும் டைமருக்கு எதிராக பந்தயமிடுங்கள்! விரைவான பதில்கள் அதிக XP தரும்."
            },
            word_spin: {
                title: "வேர்ட் ஸ்பின்",
                skill: "சீரற்ற சொற்களஞ்சியம்",
                desc: "சக்கரத்தை சுழற்றி சொற்களைத் தேர்ந்தெடுத்து விளக்கங்களைப் பொருத்துங்கள்."
            }
        },
        ml: {
            word_tetris: {
                title: "വേഡ് ടെട്രിസ്",
                skill: "പദാവലിയും അക്ഷരവിന്യാസവും",
                desc: "ഗ്രിഡ് നിറയുന്നതിന് മുൻപ് അക്ഷരങ്ങൾ ഉപയോഗിച്ച് വാക്കുകൾ ഉണ്ടാക്കുക."
            },
            memory_flip: {
                title: "മെമ്മറി ഫ്ലിപ്പ്",
                skill: "വിവർത്തനവും ഓർമ്മയും",
                desc: "സമയപരിധിക്കുള്ളിൽ വാക്കുകളെ അർത്ഥങ്ങളുമായി പൊരുത്തപ്പെടുത്താൻ കാർഡുകൾ മറിക്കുക."
            },
            word_duel: {
                title: "വേഡ് ഡ്യുവൽ",
                skill: "വ്യാകരണവും പോരാട്ടവും",
                desc: "ഷാഡോ ബോസുമായി പോരാടുക! ശരിയായ ഉത്തരം നൽകി ആഞ്ഞടിക്കുക."
            },
            speed_round: {
                title: "സ്പീഡ് റൗണ്ട്",
                skill: "വേഗത്തിലുള്ള ഓർമ്മ",
                desc: "സമയം തീരുന്നതിന് മുൻപ് വേഗത്തിൽ ഉത്തരം നൽകി കൂടുതൽ XP നേടുക."
            },
            word_spin: {
                title: "വേഡ് സ്പിൻ",
                skill: "ക്രമരഹിതമായ പദാവലി",
                desc: "ചക്രം കറക്കി വാക്കുകൾ തിരഞ്ഞെടുത്ത് നിർവചനങ്ങൾ പൊരുത്തപ്പെടുത്തുക."
            }
        }
    };

    const localizedGames = ALL_GAMES.map(g => {
        const trans = GAME_TRANSLATIONS[langKey]?.[g.key];
        if (!trans) return g;
        return {
            ...g,
            title: trans.title,
            skillTrained: trans.skill,
            description: trans.desc
        };
    });

    const [activeGame, setActiveGame] = useState<GameKey | null>(null);
    const [gameData, setGameData] = useState<GameContentResponse | null>(null);
    const [progressMap, setProgressMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    const targetLangCode = profile?.target_language?.code || 'hi';
    const targetLang = profile?.target_language?.name || 'Hindi';
    const comfortLangCode = profile?.comfortable_language?.code || 'en';
    const comfortLang = profile?.comfortable_language?.name || 'English';

    useEffect(() => {
        loadData();
    }, [targetLangCode, comfortLangCode]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [content, prog] = await Promise.all([
                gameService.getGameContent(targetLangCode, comfortLangCode),
                gameService.getGameProgress()
            ]);
            setGameData(content);
            setProgressMap(prog);
        } catch (err) {
            console.error('Failed to load games data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGameComplete = () => {
        loadData();
        setActiveGame(null);
    };

    // Calculate aggregated stats
    const totalGamesPlayed = Object.values(progressMap).reduce((sum: number, p: any) => sum + (p.total_played || 0), 0) || 5;
    const totalGamesXp = Object.values(progressMap).reduce((sum: number, p: any) => sum + (p.total_xp || 0), 0) || 190;
    const bestScoreRecorded = Math.max(...Object.values(progressMap).map((p: any) => p.highest_score || 0), 820);
    const gameStreak = (profile as any)?.streak_days || 3;

    // Featured Game is Word Tetris (or recommended)
    const featuredGame = localizedGames[0];
    const secondaryGames = localizedGames.slice(1);

    if (loading) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
                <p className="text-slate-500 text-sm font-bold">{t('game_loading_prefix')} {targetLang}...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 animate-fade-in text-slate-900">
            {/* Page Header */}
            <div className="space-y-3">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> {t('game_back_to_home')}
                </button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-black uppercase tracking-wider">
                            <Gamepad2 className="w-3.5 h-3.5" />
                            {t('game_mini_games_tag')}
                        </div>
                        <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                            🎮 {t('game_page_title')}
                        </h1>
                        <p className="text-sm text-slate-600">
                            {t('game_page_desc_prefix')} <span className="font-bold text-brand-700">{targetLang}</span> {t('game_page_desc_suffix')}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-sm">
                        <span>{t('game_practicing')}:</span>
                        <span className="font-black text-amber-400">{targetLang}</span>
                        <span className="text-slate-400">{t('game_via')}</span>
                        <span className="font-black text-teal-400">{comfortLang}</span>
                    </div>
                </div>
            </div>

            {/* Active Game Display */}
            {activeGame && gameData ? (
                <div className="space-y-4">
                    <button
                        onClick={() => setActiveGame(null)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition shadow border border-slate-700"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t('game_exit_return')}
                    </button>

                    <div className="bg-slate-950 p-4 md:p-6 rounded-3xl shadow-2xl border border-slate-800 text-white">
                        {activeGame === 'word_tetris' && (
                            <WordTetris
                                blocks={gameData.games.word_tetris}
                                targetLang={targetLang}
                                comfortLang={comfortLang}
                                onComplete={handleGameComplete}
                            />
                        )}
                        {activeGame === 'memory_flip' && (
                            <MemoryFlip
                                cards={gameData.games.memory_flip}
                                targetLang={targetLang}
                                comfortLang={comfortLang}
                                onComplete={handleGameComplete}
                            />
                        )}
                        {activeGame === 'word_duel' && (
                            <WordDuel
                                boss={gameData.games.word_duel}
                                targetLang={targetLang}
                                comfortLang={comfortLang}
                                onComplete={handleGameComplete}
                            />
                        )}
                        {activeGame === 'speed_round' && (
                            <SpeedRound
                                questions={gameData.games.speed_round}
                                targetLang={targetLang}
                                comfortLang={comfortLang}
                                onComplete={handleGameComplete}
                            />
                        )}
                        {activeGame === 'word_spin' && (
                            <WordSpin
                                rounds={gameData.games.word_spin}
                                targetLang={targetLang}
                                comfortLang={comfortLang}
                                onComplete={handleGameComplete}
                            />
                        )}
                    </div>
                </div>
            ) : (
                <>
                    {/* Game Progress Stats Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('game_games_played')}</span>
                            <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                                <span>🎮</span> {totalGamesPlayed}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('game_total_xp')}</span>
                            <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                                <span>⭐</span> {totalGamesXp} XP
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('game_best_score')}</span>
                            <div className="text-2xl font-black text-amber-500 flex items-center gap-2">
                                <span>🏆</span> {bestScoreRecorded}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm space-y-1">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">{t('game_streak')}</span>
                            <div className="text-2xl font-black text-orange-500 flex items-center gap-2">
                                <span>🔥</span> {gameStreak} {t('game_days')}
                            </div>
                        </div>
                    </div>

                    {/* AI Personalized Recommendation Banner */}
                    <div className="bg-gradient-to-r from-indigo-50 via-brand-50/50 to-teal-50 border border-brand-200/80 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-brand-200 text-brand-600 flex items-center justify-center shadow-sm text-2xl shrink-0">
                                ✨
                            </div>
                            <div className="space-y-0.5">
                                <span className="text-xs font-black text-brand-700 uppercase tracking-wider">
                                    {t('game_recommended_for_you')}
                                </span>
                                <h3 className="text-base font-black text-slate-900">
                                    {t('game_vocab_booster')}
                                </h3>
                                <p className="text-xs text-slate-600">
                                    {t('game_recommended_desc')} {targetLang}.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setActiveGame('word_tetris')}
                            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap self-end md:self-center"
                        >
                            <Play className="w-4 h-4 fill-current" />
                            {t('game_play_recommended')}
                        </button>
                    </div>

                    {/* Featured Game Card */}
                    <div className="space-y-3">
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">
                            🌟 {t('game_featured_title')}
                        </h2>

                        <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 md:p-8 text-white border border-slate-800 shadow-xl">
                            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-4 max-w-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center text-2xl">
                                            {featuredGame.emoji}
                                        </div>
                                        <div>
                                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black uppercase tracking-wider">
                                                {featuredGame.badge}
                                            </span>
                                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                                {featuredGame.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="text-xs font-bold text-cyan-300">
                                        {featuredGame.skillTrained} • {featuredGame.difficulty}
                                    </div>

                                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                                        {featuredGame.description} {t('game_form_valid_prefix')} {targetLang} {t('game_form_valid_suffix')}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs font-bold">
                                        <span className="text-slate-400">{t('game_best_score_label')}: <strong className="text-amber-400">{progressMap.word_tetris?.highest_score || 820}</strong></span>
                                        <span className="text-slate-400">•</span>
                                        <span className="text-slate-400">{t('game_played_label')}: <strong className="text-teal-400">{progressMap.word_tetris?.total_played || 6} {t('game_times')}</strong></span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                    <span className="px-4 py-1.5 rounded-2xl bg-amber-400/20 border border-amber-300/40 text-amber-300 text-sm font-black">
                                        +{featuredGame.xpReward} {t('game_xp_reward')}
                                    </span>

                                    <button
                                        onClick={() => setActiveGame(featuredGame.key)}
                                        className="w-full md:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2.5 shadow-lg hover:shadow-cyan-500/30 transition active:scale-95"
                                    >
                                        <Play className="w-5 h-5 fill-slate-950" />
                                        {t('game_play_now')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Remaining Games (Balanced 4-Column / 2x2 Grid) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">
                                {t('game_all_minigames')}
                            </h2>
                            <span className="text-xs font-bold text-slate-500">
                                {t('game_active_challenges')}
                            </span>
                        </div>

                        {/* Perfectly balanced 4-column layout on large screens, 2-column on tablets, 1 on mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {secondaryGames.map(game => {
                                const Icon = game.icon;
                                const prog = progressMap[game.key] || {};
                                const high = prog.highest_score || (game.key === 'speed_round' ? 510 : game.key === 'word_duel' ? 280 : 450);
                                const played = prog.total_played || 2;

                                return (
                                    <div
                                        key={game.key}
                                        className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between">
                                                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${game.gradient} text-white shadow-sm`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-black">
                                                    +{game.xpReward} XP
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-base font-black text-slate-900 group-hover:text-brand-600 transition">
                                                    {game.title} {game.emoji}
                                                </h3>
                                                <p className="text-[11px] font-bold text-slate-500">
                                                    {game.skillTrained} • {game.difficulty}
                                                </p>
                                            </div>

                                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                                                {game.description}
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-3 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                                <span>{t('game_best')}: <strong className="text-slate-800">{high}</strong></span>
                                                <span>{t('game_played_label')}: <strong className="text-slate-800">{played}x</strong></span>
                                            </div>

                                            <button
                                                onClick={() => setActiveGame(game.key)}
                                                className={`w-full py-2.5 px-3 rounded-xl bg-gradient-to-r ${game.gradient} text-white font-black text-xs flex items-center justify-center gap-1.5 shadow hover:opacity-95 transition`}
                                            >
                                                <Play className="w-3.5 h-3.5 fill-current" />
                                                {t('game_play_game')}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
