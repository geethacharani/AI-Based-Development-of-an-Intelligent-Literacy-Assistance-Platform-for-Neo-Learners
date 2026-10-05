import React, { useState, useEffect } from 'react';
import { BarChart2, Download, Filter, TrendingUp, Users, BookOpen, Award } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminReportsTab: React.FC = () => {
    const [reportData, setReportData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [langFilter, setLangFilter] = useState('');
    const [levelFilter, setLevelFilter] = useState('');
    const [dateRange, setDateRange] = useState('30');

    const fetchReport = () => {
        setIsLoading(true);
        adminService.getReports({ language: langFilter, proficiency: levelFilter, date_range: dateRange === 'all' ? '' : dateRange })
            .then(res => {
                setReportData(res);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchReport();
    }, [langFilter, levelFilter, dateRange]);

    return (
        <div className="space-y-6 text-slate-100">
            {/* Filters */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <BarChart2 className="w-5 h-5 text-brand-400" />
                        <span>Reports & Analytics</span>
                    </h3>

                    <div className="flex flex-wrap gap-3 items-center">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                            <option value="365">Last Year</option>
                            <option value="all">All Time</option>
                        </select>

                        <select
                            value={langFilter}
                            onChange={(e) => setLangFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                        >
                            <option value="">All Languages</option>
                            <option value="hi">Hindi</option>
                            <option value="te">Telugu</option>
                            <option value="en">English</option>
                            <option value="ta">Tamil</option>
                        </select>

                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm">Generating analytics report...</p>
                </div>
            ) : !reportData ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                    No report data available.
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Key Metrics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'New Registrations', value: reportData.new_registrations, icon: Users, color: 'brand' },
                            { label: 'Lessons Completed', value: reportData.lessons_completed, icon: BookOpen, color: 'emerald' },
                            { label: 'Avg Score', value: `${reportData.avg_assessment_score}%`, icon: Award, color: 'amber' },
                            { label: 'Avg XP Earned', value: reportData.avg_xp_earned, icon: TrendingUp, color: 'purple' },
                        ].map((metric) => {
                            const Icon = metric.icon;
                            return (
                                <div key={metric.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-400">{metric.label}</span>
                                        <Icon className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <div className={`text-2xl font-extrabold ${metric.color === 'brand' ? 'text-brand-400' :
                                        metric.color === 'emerald' ? 'text-emerald-400' :
                                            metric.color === 'amber' ? 'text-amber-400' : 'text-purple-400'
                                        }`}>
                                        {metric.value?.toLocaleString() ?? 0}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Language Distribution */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <h4 className="text-sm font-bold text-white mb-4">Language Distribution</h4>
                        <div className="space-y-3">
                            {reportData.language_breakdown?.map((lang: any) => (
                                <div key={lang.code} className="flex items-center space-x-4">
                                    <div className="w-24 text-xs font-medium text-slate-300 flex items-center space-x-1.5">
                                        <span>{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </div>
                                    <div className="flex-1 bg-slate-800 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-brand-500 h-3 rounded-full transition-all"
                                            style={{ width: `${lang.percentage}%` }}
                                        />
                                    </div>
                                    <div className="w-20 text-right text-xs font-bold text-brand-400">{lang.learners} ({lang.percentage}%)</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Proficiency Distribution */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <h4 className="text-sm font-bold text-white mb-4">Proficiency Level Distribution</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {reportData.proficiency_breakdown?.map((lvl: any) => (
                                <div key={lvl.level} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
                                    <div className="text-xl font-extrabold text-white">{lvl.count}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{lvl.level}</div>
                                    <div className="text-[11px] font-semibold text-brand-400 mt-1">{lvl.percentage}%</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Game Analytics */}
                    {reportData.game_analytics && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                            <h4 className="text-sm font-bold text-white mb-4">Game Engagement Analytics</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                                        <tr>
                                            <th className="p-3">Game Name</th>
                                            <th className="p-3">Total Sessions</th>
                                            <th className="p-3">Avg Accuracy</th>
                                            <th className="p-3">Total XP Awarded</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {reportData.game_analytics.map((game: any) => (
                                            <tr key={game.game_type} className="hover:bg-slate-800/40 transition">
                                                <td className="p-3 font-bold text-white">{game.display_name}</td>
                                                <td className="p-3 text-slate-300">{game.total_sessions}</td>
                                                <td className="p-3 text-emerald-400 font-semibold">{game.avg_accuracy}%</td>
                                                <td className="p-3 text-amber-400 font-bold">{game.total_xp?.toLocaleString()} XP</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
