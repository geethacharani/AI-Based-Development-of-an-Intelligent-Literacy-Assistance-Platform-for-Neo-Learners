import React, { useEffect, useState } from 'react';
import { X, User, Award, Route, Gamepad2, TrendingUp, Sparkles, CheckCircle2, AlertTriangle, Shield, Clock } from 'lucide-react';
import { adminService, LearnerDetailData } from '../../services/adminService';

interface LearnerDetailModalProps {
    learnerId: number | null;
    onClose: () => void;
}

export const LearnerDetailModal: React.FC<LearnerDetailModalProps> = ({ learnerId, onClose }) => {
    const [detail, setDetail] = useState<LearnerDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'profile' | 'assessment' | 'path' | 'games' | 'progress'>('profile');

    useEffect(() => {
        if (!learnerId) return;
        setIsLoading(true);
        adminService.getLearnerDetail(learnerId)
            .then(res => {
                setDetail(res);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [learnerId]);

    if (!learnerId) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                            {detail?.profile?.full_name?.charAt(0) || 'L'}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                                <span>{detail?.profile?.full_name || 'Loading Learner...'}</span>
                                {detail?.profile?.is_active ? (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</span>
                                ) : (
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">Inactive</span>
                                )}
                            </h2>
                            <p className="text-xs text-slate-400">{detail?.profile?.email} • Joined {detail?.profile?.date_joined}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Section Nav Tabs */}
                <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center space-x-2 overflow-x-auto">
                    {[
                        { id: 'profile', label: 'Profile Info', icon: User },
                        { id: 'assessment', label: 'Assessment Results', icon: Award },
                        { id: 'path', label: 'Learning Path', icon: Route },
                        { id: 'games', label: 'Puzzles & Games', icon: Gamepad2 },
                        { id: 'progress', label: 'XP & Mastery', icon: TrendingUp },
                    ].map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeSection === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSection(tab.id as any)}
                                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${isActive
                                        ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                    {isLoading || !detail ? (
                        <div className="py-12 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            {/* PROFILE SECTION */}
                            {activeSection === 'profile' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Full Name</span>
                                            <div className="text-base font-bold text-white">{detail.profile.full_name}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Email Address</span>
                                            <div className="text-base font-bold text-white">{detail.profile.email}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Age Group</span>
                                            <div className="text-base font-bold text-white">{detail.profile.age_group}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Educational Qualification</span>
                                            <div className="text-base font-bold text-white">{detail.profile.qualification}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Comfortable / Native Language</span>
                                            <div className="text-base font-bold text-emerald-400">{detail.profile.comfortable_language}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
                                            <span className="text-xs font-semibold text-slate-400">Target Learning Language</span>
                                            <div className="text-base font-bold text-brand-400 flex items-center space-x-2">
                                                <span>{detail.profile.target_language_flag}</span>
                                                <span>{detail.profile.target_language}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insight Card */}
                                    <div className="bg-gradient-to-r from-brand-900/40 via-indigo-900/40 to-slate-900 border border-brand-500/30 rounded-2xl p-5 space-y-3">
                                        <div className="flex items-center space-x-2 text-brand-400 font-bold text-sm">
                                            <Sparkles className="w-4 h-4" />
                                            <span>AI Tutor Insight & Diagnostics Summary</span>
                                        </div>
                                        <h4 className="text-base font-extrabold text-white">{detail.ai_insights.headline}</h4>
                                        <p className="text-xs text-slate-300 leading-relaxed">{detail.ai_insights.reading_summary}</p>
                                        <div className="text-xs font-semibold text-amber-400">Recommended Focus: {detail.ai_insights.recommended_focus}</div>
                                    </div>
                                </div>
                            )}

                            {/* ASSESSMENT SECTION */}
                            {activeSection === 'assessment' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400 mb-1">Assessment Date</div>
                                            <div className="text-base font-bold text-white">{detail.assessment.assessment_date}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400 mb-1">Overall Score</div>
                                            <div className="text-xl font-extrabold text-emerald-400">{detail.assessment.overall_score}%</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400 mb-1">Proficiency Level</div>
                                            <div className="text-base font-bold text-brand-400">{detail.assessment.proficiency_level}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400 mb-1">Correct / Total</div>
                                            <div className="text-base font-bold text-white">{detail.assessment.correct_answers} / {detail.assessment.attempts}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                                        <h4 className="font-bold text-sm text-white">Skill-wise Performance Breakdown</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {Object.entries(detail.assessment.skill_scores).map(([skill, lvl]) => (
                                                <div key={skill} className="bg-slate-900 border border-slate-700/50 p-3 rounded-xl">
                                                    <div className="text-xs text-slate-400">{skill}</div>
                                                    <div className="text-sm font-bold text-indigo-300 mt-1">{lvl}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
                                            <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>Strong Areas</span>
                                            </div>
                                            <ul className="text-xs text-slate-300 space-y-1">
                                                {detail.assessment.strong_areas.map((sa, idx) => (
                                                    <li key={idx}>• {sa}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 space-y-2">
                                            <div className="text-xs font-bold text-amber-400 flex items-center space-x-1">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span>Weak Areas Identified</span>
                                            </div>
                                            <ul className="text-xs text-slate-300 space-y-1">
                                                {detail.assessment.weak_areas.map((wa, idx) => (
                                                    <li key={idx}>• {wa}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* LEARNING PATH SECTION */}
                            {activeSection === 'path' && (
                                <div className="space-y-6">
                                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">Current Personalized Path</h4>
                                                <p className="text-xs text-slate-400">{detail.learning_path.current_lesson}</p>
                                            </div>
                                            <span className="text-lg font-extrabold text-brand-400">{detail.learning_path.progress_percentage}% Completed</span>
                                        </div>
                                        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-brand-600 to-indigo-500 h-3 rounded-full transition-all duration-500"
                                                style={{ width: `${Math.max(detail.learning_path.progress_percentage, 5)}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Current Level</div>
                                            <div className="text-base font-bold text-indigo-400">{detail.learning_path.current_level}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Completed Lessons</div>
                                            <div className="text-base font-bold text-emerald-400">{detail.learning_path.completed_lessons_count}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Locked Lessons</div>
                                            <div className="text-base font-bold text-slate-400">{detail.learning_path.locked_lessons_count}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Mastered Skills</div>
                                            <div className="text-base font-bold text-amber-400">{detail.learning_path.mastered_skills.length}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* GAMES SECTION */}
                            {activeSection === 'games' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Total Games Played</div>
                                            <div className="text-2xl font-extrabold text-indigo-400">{detail.games.games_played}</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Total XP From Games</div>
                                            <div className="text-2xl font-extrabold text-amber-400">{detail.games.total_xp} XP</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Weak Areas</div>
                                            <div className="text-xs font-bold text-rose-400 mt-2">{detail.games.weak_areas_identified.join(', ') || 'None'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                                        <h4 className="font-bold text-sm text-white">Game-wise Performance</h4>
                                        <div className="space-y-2">
                                            {detail.games.game_wise_performance.map((g: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl text-xs">
                                                    <span className="font-bold text-white">{g.title}</span>
                                                    <div className="flex items-center space-x-4">
                                                        <span className="text-slate-400">High Score: <strong className="text-amber-400">{g.highest_score}</strong></span>
                                                        <span className="text-slate-400">Played: <strong className="text-emerald-400">{g.total_played}</strong></span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PROGRESS & MASTERY SECTION */}
                            {activeSection === 'progress' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Total XP</div>
                                            <div className="text-2xl font-extrabold text-amber-400">{detail.progress.xp} XP</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Current Streak</div>
                                            <div className="text-2xl font-extrabold text-orange-400">{detail.progress.streak} Days 🔥</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Badges Unlocked</div>
                                            <div className="text-base font-bold text-brand-400">{detail.progress.badges.length} Badges</div>
                                        </div>
                                        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-center">
                                            <div className="text-xs text-slate-400">Overall Progress</div>
                                            <div className="text-base font-bold text-emerald-400">{detail.progress.overall_progress}%</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                                        <h4 className="font-bold text-sm text-white">Achievements & Badges</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {detail.progress.badges.map((b, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-semibold">
                                                    🏆 {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
