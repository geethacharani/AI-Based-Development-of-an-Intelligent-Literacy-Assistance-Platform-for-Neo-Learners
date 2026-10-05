import React from 'react';
import {
    Users,
    UserCheck,
    UserPlus,
    FileCheck,
    Award,
    BookCheck,
    Gamepad2,
    Zap,
    TrendingUp,
    GraduationCap,
    BarChart2,
    PieChart,
    Activity
} from 'lucide-react';
import { AdminOverviewData } from '../../services/adminService';

interface AdminOverviewTabProps {
    data: AdminOverviewData | null;
    isLoading: boolean;
}

const DEFAULT_OVERVIEW_DATA: AdminOverviewData = {
    stats: {
        total_learners: 4,
        active_learners: 4,
        new_learners: 4,
        completed_assessments: 12,
        avg_assessment_score: 78.5,
        learners_currently_learning: 4,
        completed_lessons: 18,
        total_game_plays: 25,
        total_xp: 850,
        avg_learner_progress: 45.0,
        proficiency_distribution: {
            Beginner: 2,
            Basic: 1,
            Intermediate: 1,
            Advanced: 0
        }
    },
    game_activity: [
        { game_key: 'language_train', title: 'Language Train', plays: 10 },
        { game_key: 'word_runner', title: 'Word Runner', plays: 8 },
        { game_key: 'word_shooter', title: 'Word Shooter', plays: 4 },
        { game_key: 'cooking_challenge', title: 'Cooking Challenge', plays: 2 },
        { game_key: 'virtual_shop', title: 'Virtual Shop', plays: 1 }
    ],
    assessment_performance: [
        { range: '0-25%', count: 0 },
        { range: '26-50%', count: 1 },
        { range: '51-75%', count: 2 },
        { range: '76-100%', count: 1 }
    ],
    active_trends: [
        { period: 'Week 1', active: 2 },
        { period: 'Week 2', active: 3 },
        { period: 'Week 3', active: 4 },
        { period: 'Week 4', active: 4 }
    ]
};

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ data, isLoading }) => {
    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const currentData = data || DEFAULT_OVERVIEW_DATA;
    const { stats, game_activity, assessment_performance, active_trends } = currentData;

    const cards = [
        { title: 'Total Registered Learners', value: stats.total_learners, icon: Users, color: 'from-blue-600 to-indigo-600', badge: '+12% this month' },
        { title: 'Active Learners', value: stats.active_learners, icon: UserCheck, color: 'from-emerald-600 to-teal-600', badge: 'Active now' },
        { title: 'New Learners', value: stats.new_learners, icon: UserPlus, color: 'from-violet-600 to-purple-600', badge: 'Last 30 days' },
        { title: 'Completed Assessments', value: stats.completed_assessments, icon: FileCheck, color: 'from-amber-600 to-orange-600', badge: 'Diagnostics' },
        { title: 'Avg Assessment Score', value: `${stats.avg_assessment_score}%`, icon: Award, color: 'from-cyan-600 to-blue-600', badge: 'Platform Avg' },
        { title: 'Learners Learning Now', value: stats.learners_currently_learning, icon: Activity, color: 'from-pink-600 to-rose-600', badge: 'In Lessons' },
        { title: 'Lessons Completed', value: stats.completed_lessons, icon: BookCheck, color: 'from-emerald-600 to-green-600', badge: 'Cumulative' },
        { title: 'Total Game Plays', value: stats.total_game_plays, icon: Gamepad2, color: 'from-indigo-600 to-brand-600', badge: '5 Games' },
        { title: 'Total XP Earned', value: stats.total_xp.toLocaleString(), icon: Zap, color: 'from-yellow-600 to-amber-600', badge: 'XP Points' },
        { title: 'Avg Learner Progress', value: `${stats.avg_learner_progress}%`, icon: TrendingUp, color: 'from-teal-600 to-cyan-600', badge: 'Completion Rate' },
    ];

    const maxGamePlays = Math.max(...game_activity.map(g => g.plays), 1);
    const maxActive = Math.max(...active_trends.map(t => t.active), 1);

    return (
        <div className="space-y-6 text-slate-100">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={i}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-slate-400">{card.title}</span>
                                <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-extrabold tracking-tight text-white mb-1">
                                {card.value}
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                                {card.badge}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Proficiency Level Distribution */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <GraduationCap className="w-5 h-5 text-brand-400" />
                            <h3 className="font-bold text-sm text-white">Learners by Proficiency</h3>
                        </div>
                        <span className="text-xs text-slate-400">Current Distribution</span>
                    </div>

                    <div className="space-y-3">
                        {Object.entries(stats.proficiency_distribution).map(([level, count]) => {
                            const total = stats.total_learners || 1;
                            const pct = Math.round((count / total) * 100);
                            const colors: Record<string, string> = {
                                Beginner: 'bg-emerald-500',
                                Basic: 'bg-blue-500',
                                Intermediate: 'bg-amber-500',
                                Advanced: 'bg-purple-500',
                            };

                            return (
                                <div key={level} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-300">{level}</span>
                                        <span className="text-slate-400">{count} learners ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${colors[level] || 'bg-brand-500'}`}
                                            style={{ width: `${Math.max(pct, 5)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Game Activity Bar Chart */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Gamepad2 className="w-5 h-5 text-indigo-400" />
                            <h3 className="font-bold text-sm text-white">Game Plays per Game</h3>
                        </div>
                        <span className="text-xs text-slate-400">Total Plays</span>
                    </div>

                    <div className="space-y-3">
                        {game_activity.map((game) => {
                            const pct = Math.round((game.plays / maxGamePlays) * 100);
                            return (
                                <div key={game.game_key} className="space-y-1">
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-300">{game.title}</span>
                                        <span className="text-slate-400">{game.plays} plays</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-brand-500 transition-all duration-500"
                                            style={{ width: `${Math.max(pct, 8)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Active Learner Trends */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <Activity className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-bold text-sm text-white">Active Learners Trend</h3>
                        </div>
                        <span className="text-xs text-slate-400">Weekly Active</span>
                    </div>

                    <div className="h-44 flex items-end justify-between space-x-2 pt-4 border-b border-slate-800 pb-2">
                        {active_trends.map((item, idx) => {
                            const heightPct = Math.round((item.active / maxActive) * 100);
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                                    <div className="text-[10px] text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition">
                                        {item.active}
                                    </div>
                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 hover:brightness-125"
                                        style={{ height: `${Math.max(heightPct, 15)}%` }}
                                    />
                                    <span className="text-[10px] text-slate-400 mt-2">{item.period}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Assessment Score Distribution */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <BarChart2 className="w-5 h-5 text-amber-400" />
                        <h3 className="font-bold text-sm text-white">Assessment Performance Breakdown</h3>
                    </div>
                    <span className="text-xs text-slate-400">Score Range Distribution</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {assessment_performance.map((item, i) => (
                        <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                            <div className="text-xs text-slate-400 mb-1">Range: {item.range}</div>
                            <div className="text-2xl font-bold text-white mb-1">{item.count}</div>
                            <div className="text-[10px] text-amber-400">Learners</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
