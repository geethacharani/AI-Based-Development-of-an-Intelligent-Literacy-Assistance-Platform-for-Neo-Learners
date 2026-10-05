import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LingoBot, AtlasTraveler, LexiReader } from '../common/LingoCharacters';
import {
    Map,
    Sparkles,
    CheckCircle2,
    Lock,
    Play,
    Star,
    Trophy,
    ArrowRight
} from 'lucide-react';

interface VisualNode {
    id: string;
    step: number;
    title: string;
    stage: string;
    icon: string;
    status: 'completed' | 'current' | 'locked' | 'challenge' | 'milestone';
    xpReward: number;
    description: string;
}

interface VisualLearningPathMapProps {
    targetLangName?: string;
    className?: string;
}

export const VisualLearningPathMap: React.FC<VisualLearningPathMapProps> = ({
    targetLangName = 'Hindi',
    className = ''
}) => {
    const navigate = useNavigate();

    const nodes: VisualNode[] = [
        {
            id: 'node_1',
            step: 1,
            title: 'Foundations & Greetings',
            stage: '🌱 Foundation',
            icon: '🌱',
            status: 'completed',
            xpReward: 50,
            description: 'Core greetings, basic etiquette & gestures'
        },
        {
            id: 'node_2',
            step: 2,
            title: 'Swar & Vyanjan Script',
            stage: '🔤 Alphabet',
            icon: '🔤',
            status: 'completed',
            xpReward: 50,
            description: 'Essential vowels, consonants & character shapes'
        },
        {
            id: 'node_3',
            step: 3,
            title: 'Phonetics & Tones',
            stage: '🔊 Sounds',
            icon: '🔊',
            status: 'completed',
            xpReward: 60,
            description: 'Aspirated sounds, vowel length & rhythm'
        },
        {
            id: 'node_4',
            step: 4,
            title: 'Everyday Words',
            stage: '🧩 Words',
            icon: '🧩',
            status: 'completed',
            xpReward: 60,
            description: 'Household objects, food items & family'
        },
        {
            id: 'node_5',
            step: 5,
            title: 'Core Vocabulary Builder',
            stage: '📚 Vocabulary',
            icon: '📚',
            status: 'current',
            xpReward: 75,
            description: '100 high-frequency conversational nouns & verbs'
        },
        {
            id: 'node_6',
            step: 6,
            title: 'Sentence Formation (SOV)',
            stage: '💬 Sentences',
            icon: '💬',
            status: 'locked',
            xpReward: 75,
            description: 'Subject-Object-Verb word order and verb agreements'
        },
        {
            id: 'node_7',
            step: 7,
            title: 'Short Passages & Stories',
            stage: '📖 Reading',
            icon: '📖',
            status: 'locked',
            xpReward: 80,
            description: 'Simple bilingual stories with comprehension'
        },
        {
            id: 'node_8',
            step: 8,
            title: 'Script Practice & Spelling',
            stage: '✍️ Writing',
            icon: '✍️',
            status: 'locked',
            xpReward: 80,
            description: 'Matras, conjunct consonants & written sentences'
        },
        {
            id: 'node_9',
            step: 9,
            title: 'Voice Studio Speeches',
            stage: '🗣️ Speaking',
            icon: '🗣️',
            status: 'challenge',
            xpReward: 100,
            description: 'Live voice recognition dialogues and challenges'
        },
        {
            id: 'node_10',
            step: 10,
            title: 'Travel & City Scenarios',
            stage: '🌍 Real World',
            icon: '🌍',
            status: 'challenge',
            xpReward: 100,
            description: 'Auto, bargaining, dining and direction interactions'
        },
        {
            id: 'node_11',
            step: 11,
            title: 'Summit of Fluency',
            stage: '🏆 Mastery',
            icon: '🏆',
            status: 'milestone',
            xpReward: 150,
            description: 'Comprehensive milestone achievement certification'
        }
    ];

    return (
        <section className={`space-y-4 ${className}`}>
            {/* Header with Title and Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                        <Map className="w-3.5 h-3.5 text-brand-600" />
                        MY GUIDED LEARNING JOURNEY
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {targetLangName} Literacy Roadmap
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium">
                        Step-by-step path from basic alphabets to fluent two-way communication.
                    </p>
                </div>

                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate('/learning-path')}
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-xs self-start sm:self-auto cursor-pointer"
                >
                    Open Full Map & Lessons
                </Button>
            </div>

            {/* Horizontal / Winding Scrollable Scenic Node Trail */}
            <Card className="p-5 sm:p-7 bg-white/95 backdrop-blur-xs border-slate-200/90 shadow-soft relative overflow-hidden">
                {/* Subtle Ambient SVG Horizon in Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/40 via-teal-50/30 to-amber-50/40 pointer-events-none" />

                <div className="overflow-x-auto pb-4 pt-2 scrollbar-thin relative z-10">
                    <div className="flex items-center min-w-[980px] justify-between relative px-6">
                        {/* Connecting Winding Ribbon Line */}
                        <div className="absolute left-10 right-10 top-12 h-2.5 bg-slate-200 rounded-full -z-0 shadow-inner" />
                        <div
                            className="absolute left-10 top-12 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-brand-600 rounded-full -z-0 transition-all duration-500 shadow-xs"
                            style={{ width: '42%' }}
                        />

                        {nodes.map((node) => {
                            const isCompleted = node.status === 'completed';
                            const isCurrent = node.status === 'current';
                            const isLocked = node.status === 'locked';
                            const isChallenge = node.status === 'challenge';
                            const isMilestone = node.status === 'milestone';

                            return (
                                <div
                                    key={node.id}
                                    onClick={() => navigate('/learning-path')}
                                    className="flex flex-col items-center group cursor-pointer relative z-10 transition-transform hover:scale-105"
                                    style={{ width: '86px' }}
                                >
                                    {/* Active Companion Mascot hovering over Current Node */}
                                    {isCurrent && (
                                        <div className="absolute -top-12 z-20 animate-bounce flex flex-col items-center">
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-amber-300">
                                                START HERE!
                                            </span>
                                            <div className="w-1.5 h-1.5 bg-amber-400 rotate-45 -mt-1" />
                                        </div>
                                    )}

                                    {/* Interactive Round Node */}
                                    <div
                                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 shadow-md ${
                                            isMilestone
                                                ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 ring-4 ring-amber-300 shadow-amber-400/50'
                                                : isChallenge
                                                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white ring-4 ring-purple-200 shadow-purple-400/40'
                                                    : isCompleted
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-200 shadow-teal-500/40'
                                                        : isCurrent
                                                            ? 'bg-gradient-to-br from-brand-600 to-indigo-600 text-white ring-8 ring-brand-300/50 animate-pulse shadow-brand-500/50'
                                                            : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-7 h-7 text-white" />
                                        ) : isLocked ? (
                                            <Lock className="w-5 h-5 text-slate-400" />
                                        ) : isMilestone ? (
                                            <Trophy className="w-7 h-7 text-slate-950 fill-amber-300" />
                                        ) : (
                                            <span>{node.icon}</span>
                                        )}
                                    </div>

                                    {/* Stage Title & Subtitle */}
                                    <div className="mt-3 text-center">
                                        <span className={`text-[10px] font-black uppercase tracking-tight block ${
                                            isCurrent
                                                ? 'text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-md'
                                                : isCompleted
                                                    ? 'text-teal-700'
                                                    : 'text-slate-500'
                                        }`}>
                                            {node.stage}
                                        </span>
                                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1 mt-0.5">
                                            {node.title}
                                        </p>
                                        <span className="text-[9px] font-extrabold text-amber-600">
                                            +{node.xpReward} XP
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer progress explanation */}
                <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-semibold gap-2 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>4/11 Stages Mastered</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-brand-600 font-bold">Stage 5: Core Vocabulary Ready</span>
                    </div>

                    <button
                        onClick={() => navigate('/learning-path')}
                        className="text-brand-600 hover:text-brand-700 hover:underline font-extrabold flex items-center gap-1"
                    >
                        <span>Continue Stage 5</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </Card>
        </section>
    );
};
