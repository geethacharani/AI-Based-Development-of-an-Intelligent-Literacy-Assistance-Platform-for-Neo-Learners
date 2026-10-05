import React, { useState, useEffect } from 'react';
import { Activity, Users, CheckSquare, Route, BookOpen, Mic, Trophy, TrendingUp } from 'lucide-react';
import { adminService } from '../../services/adminService';

const funnelSteps = [
    { key: 'total_registered', label: 'Registered Learners', icon: Users, color: 'brand' },
    { key: 'profile_completed', label: 'Profile Completed', icon: Users, color: 'indigo' },
    { key: 'assessment_completed', label: 'Took Assessment', icon: CheckSquare, color: 'purple' },
    { key: 'path_generated', label: 'Path Generated', icon: Route, color: 'sky' },
    { key: 'lessons_started', label: 'Started Lessons', icon: BookOpen, color: 'cyan' },
    { key: 'games_played', label: 'Played Games', icon: Trophy, color: 'amber' },
    { key: 'voice_used', label: 'Used Voice Studio', icon: Mic, color: 'rose' },
    { key: 'advanced_level', label: 'Reached Advanced', icon: TrendingUp, color: 'emerald' },
];

const colorClasses: Record<string, string> = {
    brand: 'bg-brand-500 text-white border-brand-500',
    indigo: 'bg-indigo-500 text-white border-indigo-500',
    purple: 'bg-purple-500 text-white border-purple-500',
    sky: 'bg-sky-500 text-white border-sky-500',
    cyan: 'bg-cyan-500 text-white border-cyan-500',
    amber: 'bg-amber-500 text-white border-amber-500',
    rose: 'bg-rose-500 text-white border-rose-500',
    emerald: 'bg-emerald-500 text-white border-emerald-500',
};

const barColorClasses: Record<string, string> = {
    brand: 'bg-brand-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    sky: 'bg-sky-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    emerald: 'bg-emerald-500',
};

export const AdminProgressMonitoringTab: React.FC = () => {
    const [funnelData, setFunnelData] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        adminService.getProgressMonitoring()
            .then(res => {
                // Convert funnel_stages array to a lookup map
                const map: Record<string, number> = {};
                if (res?.funnel_stages) {
                    for (const stage of res.funnel_stages) {
                        map[stage.key] = stage.count;
                    }
                }
                setFunnelData(map);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const maxValue = Math.max(...Object.values(funnelData), 1);

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center space-x-4">
                <Activity className="w-8 h-8 text-brand-400 flex-shrink-0" />
                <div>
                    <h3 className="text-base font-bold text-white">Learner Journey Funnel</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Real-time breakdown of how far learners progress through the LingoPath AI journey, from registration to mastery.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-sm">Loading funnel data...</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    {funnelSteps.map((step, idx) => {
                        const count = funnelData[step.key] ?? 0;
                        const percent = maxValue > 0 ? Math.round((count / maxValue) * 100) : 0;
                        const prevCount = idx > 0 ? funnelData[funnelSteps[idx - 1].key] ?? count : count;
                        const dropoff = idx > 0 && prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0;
                        const Icon = step.icon;

                        return (
                            <div key={step.key} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2.5">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClasses[step.color]} shadow`}>
                                            <Icon className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <span className="text-xs font-semibold text-white">{step.label}</span>
                                            {idx > 0 && dropoff > 0 && (
                                                <span className="ml-2 text-[10px] text-rose-400 font-medium">
                                                    ↓ {dropoff}% drop-off
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-extrabold text-white">{count.toLocaleString()}</span>
                                        <span className="text-[11px] text-slate-400 ml-1.5">learners ({percent}%)</span>
                                    </div>
                                </div>

                                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`${barColorClasses[step.color]} h-3 rounded-full transition-all duration-700`}
                                        style={{ width: `${Math.max(percent, 2)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Summary Stats */}
            {!isLoading && Object.keys(funnelData).length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-extrabold text-brand-400">{funnelData.total_registered || 0}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Total Registered</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-extrabold text-emerald-400">
                            {funnelData.total_registered > 0
                                ? Math.round(((funnelData.assessment_completed || 0) / funnelData.total_registered) * 100)
                                : 0}%
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">Assessment Completion Rate</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-extrabold text-amber-400">{funnelData.games_played || 0}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Games Engaged</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                        <div className="text-2xl font-extrabold text-rose-400">{funnelData.voice_used || 0}</div>
                        <div className="text-xs text-slate-400 mt-0.5">Voice Learners</div>
                    </div>
                </div>
            )}
        </div>
    );
};
