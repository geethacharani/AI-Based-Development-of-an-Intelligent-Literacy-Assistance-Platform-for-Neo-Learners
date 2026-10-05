import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningPathService } from '../services/learningPathService';
import { voiceService } from '../services/voiceService';
import { LearningPathUnit, LessonNode, LearnerProgress, SectionPreview } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useTranslation } from '../utils/translations';
import { LingoBot, LexiReader, VoxSpeaker, AtlasTraveler } from '../components/common/LingoCharacters';
import {
    Flame,
    Star,
    Trophy,
    Target,
    BookOpen,
    Brain,
    Mic,
    Headphones,
    CheckCircle2,
    Lock,
    Play,
    Sparkles,
    Volume2,
    X,
    Award,
    ArrowLeft,
    ChevronRight,
    Eye,
    Compass
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [units, setUnits] = useState<LearningPathUnit[]>([]);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [activeNode, setActiveNode] = useState<LessonNode | null>(null);
    const [previewUnit, setPreviewUnit] = useState<LearningPathUnit | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [lessonAnswer, setLessonAnswer] = useState<number | null>(null);
    const [isLessonSubmitted, setIsLessonSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const supportLangCode = profile?.comfortable_language?.code || 'en';
    const { t } = useTranslation();

    useEffect(() => {
        loadData();
    }, [supportLangCode]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const targetCode = profile?.target_language?.code || 'hi';
            const data = await learningPathService.getLearningPath(targetCode, supportLangCode);
            setUnits(data.units);
            setProgress(data.progress);
        } catch (err) {
            console.error('Error loading path', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNodeClick = (node: LessonNode, unit: LearningPathUnit) => {
        if (node.status === 'locked') {
            setPreviewUnit(unit);
            return;
        }
        setActiveNode(node);
        setLessonAnswer(null);
        setIsLessonSubmitted(false);
        setIsLessonModalOpen(true);
    };

    const handleCompleteLesson = async () => {
        if (!activeNode) return;
        setIsLessonSubmitted(true);
        try {
            const res = await learningPathService.completeLesson(activeNode.id);

            // Update local units state: mark active node as completed and calculate progression
            setUnits(prevUnits => {
                const updated = prevUnits.map(u => {
                    const newNodes = u.nodes.map(n => {
                        if (n.id === activeNode.id) return { ...n, status: 'completed' as const };
                        if (n.order === activeNode.order + 1 && n.status === 'locked') return { ...n, status: 'unlocked' as const };
                        return n;
                    });
                    const completedCount = newNodes.filter(n => n.status === 'completed').length;
                    const pct = Math.round((completedCount / newNodes.length) * 100);
                    const status = pct === 100 ? ('completed' as const) : u.status;
                    return { ...u, nodes: newNodes, completion_percentage: pct, status };
                });
                return updated;
            });

            setProgress(prev => prev ? {
                ...prev,
                xp_total: res.total_xp,
                streak_count: res.streak_count,
                completed_lessons: [...(prev.completed_lessons || []), activeNode.id]
            } : null);

            setTimeout(() => {
                setIsLessonModalOpen(false);
                setIsCompletedModalOpen(true);
            }, 800);
        } catch (err) {
            console.error('Error completing lesson', err);
        }
    };

    if (isLoading || !progress) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">Loading your personalized learning path...</p>
            </div>
        );
    }

    const targetLangName = profile?.target_language?.name || 'Hindi';
    const targetFlag = profile?.target_language?.flagEmoji || '🇮🇳';

    const currentActiveUnit = units.find(u => u.status === 'current') || units[0];

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-7 animate-fade-in pb-20 text-slate-900">
            {/* Header & Navigation */}
            <div className="space-y-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span>🌱</span> My Personalized Learning Journey
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 mt-1">
                            A complete step-by-step master progression from beginner foundations to independent fluent communication.
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Sticky Gamification Header Bar */}
            <div className="sticky top-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200/90 shadow-md flex items-center justify-between">
                {/* Target Language Indicator */}
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{targetFlag}</span>
                    <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            {t('target_language_label')}
                        </span>
                        <span className="text-sm font-black text-slate-900">{targetLangName}</span>
                    </div>
                </div>

                {/* Gamified Stats Badges */}
                <div className="flex items-center gap-2.5">
                    {/* Streak */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 font-extrabold text-xs shadow-2xs">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{progress.streak_count} {t('day_streak')}</span>
                    </div>

                    {/* Total XP */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200/90 rounded-2xl text-brand-900 font-extrabold text-xs shadow-2xs">
                        <Star className="w-4 h-4 text-brand-600 fill-brand-600" />
                        <span>{progress.xp_total} XP</span>
                    </div>

                    {/* Active Section Tracker */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200/90 rounded-2xl text-teal-900 font-extrabold text-xs">
                        <Target className="w-4 h-4 text-teal-600" />
                        <span>Stage {currentActiveUnit?.unit_number || 1} of {units.length}</span>
                    </div>
                </div>
            </div>

            {/* 6-Section Visual Overview & Curriculum Roadmap */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-400">
                            <Brain className="w-4 h-4 text-teal-400" /> Complete Curriculum Roadmap (6 Sections)
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                            Track your exact milestone progress across foundational literacy, vocabulary, comprehension, and fluency.
                        </p>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 bg-white/10 rounded-xl text-teal-300 self-start sm:self-auto">
                        Current: Section {currentActiveUnit?.unit_number || 1}
                    </span>
                </div>

                {/* Grid of 6 Progression Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {units.map((unit) => {
                        const isCompleted = unit.status === 'completed' || unit.completion_percentage === 100;
                        const isCurrent = unit.status === 'current';
                        const isLocked = unit.status === 'locked' && !isCompleted && !isCurrent;
                        const pct = unit.completion_percentage ?? 0;

                        return (
                            <div
                                key={unit.id}
                                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                                    isCompleted
                                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400/60'
                                        : isCurrent
                                            ? 'bg-brand-950/60 border-brand-400/80 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-brand-400/50'
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            Section {unit.unit_number}
                                        </span>
                                        {isCompleted ? (
                                            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Completed
                                            </span>
                                        ) : isCurrent ? (
                                            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                                <Play className="w-3 h-3 fill-amber-300" /> Current Section
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> Locked
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-black text-white leading-tight">
                                        {unit.title.replace(/^Section \d+:\s*/, '')}
                                    </h4>

                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                            <span>Progress</span>
                                            <span className={isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-300' : 'text-slate-400'}>
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isCompleted
                                                        ? 'bg-emerald-400'
                                                        : isCurrent
                                                            ? 'bg-gradient-to-r from-amber-400 to-brand-500'
                                                            : 'bg-slate-700'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Measurable Skills */}
                                    {unit.skills && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {unit.skills.slice(0, 2).map((sk, idx) => (
                                                <span key={idx} className="text-[9px] font-semibold text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">
                                                    • {sk}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Preview Button for Locked Sections */}
                                {isLocked && (
                                    <button
                                        type="button"
                                        onClick={() => setPreviewUnit(unit)}
                                        className="mt-3 w-full py-1 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[10px] font-bold text-teal-300 flex items-center justify-center gap-1 transition cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3" />
                                        <span>Preview Section Curriculum</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vertical Gamified Path - All 6 Sections */}
            <div className="space-y-14 py-4">
                {units.map((unit) => {
                    const isCompleted = unit.status === 'completed' || unit.completion_percentage === 100;
                    const isCurrent = unit.status === 'current';
                    const isLocked = unit.status === 'locked' && !isCompleted && !isCurrent;

                    const themeGradient = unit.color_theme === 'teal'
                        ? 'bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800'
                        : unit.color_theme === 'purple'
                            ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900'
                            : unit.color_theme === 'amber'
                                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
                                : 'bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-800';

                    return (
                        <div key={unit.id} className="space-y-8">
                            {/* Unit Section Header Banner */}
                            <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden transition-all ${themeGradient} ${
                                isLocked ? 'opacity-90 saturate-75' : ''
                            }`}>
                                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                                    <div className="space-y-2 max-w-xl">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-white">
                                                <Award className="w-3.5 h-3.5 text-amber-300" /> Section {unit.unit_number}
                                            </span>
                                            {isCompleted ? (
                                                <span className="text-[10px] font-black uppercase text-emerald-200 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                                                    ✓ Completed (100%)
                                                </span>
                                            ) : isCurrent ? (
                                                <span className="text-[10px] font-black uppercase text-amber-200 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
                                                    → Current Section ({unit.completion_percentage ?? 0}%)
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-200 bg-black/30 px-2.5 py-0.5 rounded-full border border-white/20">
                                                    🔒 {unit.unlock_requirement || `Unlocks after Section ${unit.unit_number - 1}`}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{unit.title}</h2>
                                        <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">{unit.description}</p>

                                        {/* Measurable Skills Badges */}
                                        {unit.skills && (
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {unit.skills.map((skill, sIdx) => (
                                                    <span key={sIdx} className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded-md text-white">
                                                        ✓ {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action on Header */}
                                    <div className="shrink-0 flex sm:flex-col items-center gap-2">
                                        {isLocked ? (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setPreviewUnit(unit)}
                                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                                className="bg-white/20 hover:bg-white/30 text-white border-none text-xs font-bold"
                                            >
                                                Preview Section
                                            </Button>
                                        ) : (
                                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg hidden sm:block">
                                                <Trophy className="w-8 h-8 text-amber-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Node Path Column */}
                            <div className="flex flex-col items-center space-y-8 relative py-6">
                                {unit.nodes.map((node, index) => {
                                    const isNodeCompleted = node.status === 'completed';
                                    const isNodeUnlocked = node.status === 'unlocked';
                                    const isNodeLocked = node.status === 'locked';

                                    const offsets = ['translate-x-0', '-translate-x-10 sm:-translate-x-16', 'translate-x-0', 'translate-x-10 sm:translate-x-16', 'translate-x-0'];
                                    const offsetClass = offsets[index % offsets.length];

                                    // Dynamic Activity Icon
                                    const getNodeIcon = () => {
                                        const text = (node.title + ' ' + (node.subtitle || '') + ' ' + (node.node_type || '')).toLowerCase();
                                        if (text.includes('alphabet') || text.includes('letter') || text.includes('swar')) return '🔤';
                                        if (text.includes('sound') || text.includes('phonetic')) return '🔊';
                                        if (text.includes('word') || text.includes('starter')) return '🧩';
                                        if (text.includes('vocab') || node.node_type === 'vocabulary') return '📚';
                                        if (text.includes('sentence') || text.includes('dialogue')) return '💬';
                                        if (text.includes('read') || node.node_type === 'reading') return '📖';
                                        if (text.includes('writ') || text.includes('script') || text.includes('spell')) return '✍️';
                                        if (text.includes('listen') || node.node_type === 'listening') return '🎧';
                                        if (text.includes('speak') || node.node_type === 'speaking') return '🎤';
                                        if (text.includes('transit') || text.includes('market') || text.includes('help')) return '🌍';
                                        if (node.node_type === 'milestone') return '🏆';
                                        return '🌱';
                                    };

                                    return (
                                        <div key={node.id} className={`flex flex-col items-center group transition-transform ${offsetClass} relative`}>
                                            {/* Connector Line */}
                                            {index > 0 && (
                                                <div className={`w-2.5 h-10 mb-2 rounded-full transition-all ${
                                                    isNodeCompleted ? 'bg-gradient-to-b from-teal-400 to-emerald-500 shadow-xs' : 'bg-slate-300/80'
                                                }`} />
                                            )}

                                            {/* Companion Mascot on Active Node */}
                                            {isNodeUnlocked && !isLocked && (
                                                <div className="hidden sm:flex items-center gap-2 absolute -left-36 top-2 z-20 animate-float-subtle-1">
                                                    <LingoBot size="sm" expression="encouraging" />
                                                    <div className="bg-white/95 px-2.5 py-1.5 rounded-xl border border-brand-200 shadow-md text-[10px] font-bold text-brand-900 whitespace-nowrap">
                                                        You are here! 🚀
                                                    </div>
                                                </div>
                                            )}

                                            {/* Companion Mascot on Milestone Node */}
                                            {node.node_type === 'milestone' && (
                                                <div className="hidden sm:flex items-center gap-2 absolute -right-36 top-2 z-20 animate-float-subtle-2">
                                                    <div className="bg-white/95 px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-md text-[10px] font-bold text-amber-900 whitespace-nowrap">
                                                        Section Goal 🏆
                                                    </div>
                                                    <AtlasTraveler size="sm" />
                                                </div>
                                            )}

                                            {/* Interactive Node Button */}
                                            <button
                                                onClick={() => handleNodeClick(node, unit)}
                                                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                                                    isNodeCompleted
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-300/80 hover:scale-105 shadow-teal-500/40'
                                                        : isNodeUnlocked
                                                            ? 'bg-gradient-to-br from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white ring-8 ring-brand-300/40 animate-pulse hover:scale-110 shadow-brand-500/50'
                                                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300 border-4 border-slate-300 hover:scale-102'
                                                }`}
                                                title={isNodeLocked ? "Preview Section Information" : "Start Activity"}
                                            >
                                                {isNodeCompleted ? (
                                                    <div className="flex flex-col items-center">
                                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                                        <span className="text-xs font-bold text-white/90">{getNodeIcon()}</span>
                                                    </div>
                                                ) : isNodeLocked ? (
                                                    <div className="flex flex-col items-center opacity-70">
                                                        <Lock className="w-6 h-6 text-slate-500 mb-0.5" />
                                                        <span className="text-xs grayscale">{getNodeIcon()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                                                        {getNodeIcon()}
                                                    </span>
                                                )}

                                                {isNodeUnlocked && (
                                                    <span className="absolute -top-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-amber-300 whitespace-nowrap animate-bounce">
                                                        <Play className="w-3 h-3 fill-slate-950" /> START
                                                    </span>
                                                )}
                                            </button>

                                            {/* Node Title & Subtitle Card */}
                                            <div className="mt-2.5 text-center max-w-[220px] bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/90 shadow-md">
                                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                                    <span className="text-xs">{getNodeIcon()}</span>
                                                    <p className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">{node.title}</p>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">{node.subtitle}</p>
                                                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                                                        <Star className="w-3 h-3 fill-brand-600 text-brand-600" /> +{node.xp_reward} XP
                                                    </span>
                                                    {isNodeCompleted && (
                                                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                            Mastered ✓
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Section Preview Modal (For Locked Sections) */}
            {previewUnit && (
                <Modal
                    isOpen={!!previewUnit}
                    onClose={() => setPreviewUnit(null)}
                    title={`Curriculum Preview: ${previewUnit.title}`}
                >
                    <div className="space-y-5 py-2">
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 space-y-2">
                            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
                                <Compass className="w-4 h-4 text-indigo-600" />
                                <span>Section {previewUnit.unit_number} Educational Goal</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {previewUnit.description}
                            </p>
                        </div>

                        {/* What You Will Learn */}
                        {previewUnit.preview?.whatYouWillLearn && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-brand-600" /> What You Will Learn:
                                </h4>
                                <ul className="space-y-1.5">
                                    {previewUnit.preview.whatYouWillLearn.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Why It Matters */}
                        {previewUnit.preview?.whyItMatters && (
                            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                                <span className="font-bold flex items-center gap-1 text-amber-800">
                                    💡 Why It Matters:
                                </span>
                                <p className="leading-relaxed">{previewUnit.preview.whyItMatters}</p>
                            </div>
                        )}

                        {/* How To Unlock */}
                        <div className="p-3 bg-slate-100 rounded-2xl text-xs text-slate-700 flex items-center justify-between">
                            <div>
                                <span className="font-bold block text-slate-900">How to Unlock:</span>
                                <span>{previewUnit.preview?.howToUnlock || previewUnit.unlock_requirement}</span>
                            </div>
                            <LingoBot size="sm" expression="encouraging" />
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setPreviewUnit(null)}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold"
                        >
                            Got It, Let's Continue Learning! 🚀
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Interactive Lesson Modal Player */}
            {isLessonModalOpen && activeNode && (
                <Modal
                    isOpen={isLessonModalOpen}
                    onClose={() => setIsLessonModalOpen(false)}
                    title={`AI Teacher Lesson: ${activeNode.title}`}
                >
                    <div className="space-y-6 py-2">
                        <div className="flex items-center justify-between p-3 bg-brand-50 rounded-2xl text-xs font-bold text-brand-900 border border-brand-200">
                            <span>Activity: {activeNode.subtitle}</span>
                            <span className="flex items-center gap-1 text-amber-600">
                                <Star className="w-4 h-4 fill-amber-500" /> Reward: +{activeNode.xp_reward} XP
                            </span>
                        </div>

                        {(() => {
                            const targetCode = profile?.target_language?.code || 'hi';
                            const targetName = profile?.target_language?.name || 'Hindi';

                            if (activeNode.node_type === 'speaking') {
                                const targetPhrase = activeNode.payload?.targetPhrase || (targetCode === 'hi' ? 'नमस्ते' : 'Hello');
                                const phonetics = activeNode.payload?.phonetics || (targetCode === 'hi' ? 'Namaste' : 'Hello');

                                return (
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-5 text-center">
                                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-900">
                                            🎙️ <span className="font-bold">Real Teacher Voice Activity:</span> Listen to the phrase, then press the mic to speak in {targetName}!
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-brand-200 shadow-sm inline-flex items-center gap-3 px-8">
                                            <div>
                                                <div className="text-2xl font-extrabold text-brand-700">{targetPhrase}</div>
                                                <div className="text-xs text-slate-500 font-semibold">{phonetics}</div>
                                            </div>
                                            <button
                                                onClick={() => voiceService.speakText(targetPhrase, targetCode)}
                                                className="p-2 bg-brand-50 hover:bg-brand-100 rounded-xl text-brand-600 transition cursor-pointer"
                                                title="Listen to Teacher Pronunciation"
                                            >
                                                <Volume2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                                            <p className="text-xs font-bold text-slate-600">Click microphone & speak in {targetName}:</p>
                                            <button
                                                onClick={() => {
                                                    voiceService.startSpeechToText(
                                                        (transcript) => {
                                                            const res = voiceService.evaluatePronunciation(transcript, targetPhrase);
                                                            if (res.score >= 50) {
                                                                setLessonAnswer(1);
                                                            }
                                                        },
                                                        (err) => console.error(err),
                                                        targetCode
                                                    );
                                                }}
                                                className="p-5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition animate-pulse cursor-pointer"
                                            >
                                                <Mic className="w-8 h-8" />
                                            </button>
                                            <p className="text-[11px] text-slate-400 font-medium">Using native Browser Web Speech STT API</p>
                                        </div>
                                    </div>
                                );
                            }

                            const options = activeNode.payload?.options || [
                                { text: 'Correct Answer', isCorrect: true },
                                { text: 'Alternative Option', isCorrect: false },
                                { text: 'Other Choice', isCorrect: false }
                            ];

                            return (
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
                                        <p className="text-xs font-bold text-indigo-900">Select the correct translation or matching item:</p>
                                        <div className="text-2xl font-black text-slate-900">
                                            {activeNode.payload?.teachItem?.word || activeNode.payload?.teachItem?.symbol || activeNode.payload?.teachItem?.targetText || 'नमस्ते'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {options.map((opt: any, idx: number) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setLessonAnswer(idx)}
                                                className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                                    lessonAnswer === idx
                                                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm'
                                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <span>{opt.text}</span>
                                                {lessonAnswer === idx && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <Button variant="outline" size="sm" onClick={() => setIsLessonModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={lessonAnswer === null || isLessonSubmitted}
                                onClick={handleCompleteLesson}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold"
                            >
                                {isLessonSubmitted ? 'Submitting...' : 'Complete Activity ✓'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Lesson Completion Celebration Modal */}
            {isCompletedModalOpen && (
                <Modal
                    isOpen={isCompletedModalOpen}
                    onClose={() => setIsCompletedModalOpen(false)}
                    title="Lesson Mastered! 🎉"
                >
                    <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                            <Trophy className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Outstanding Progress!</h3>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto">
                            You earned +50 XP and unlocked the next milestone in your guided learning path.
                        </p>
                        <div className="pt-2">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => setIsCompletedModalOpen(false)}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold w-full"
                            >
                                Continue Path 🚀
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
