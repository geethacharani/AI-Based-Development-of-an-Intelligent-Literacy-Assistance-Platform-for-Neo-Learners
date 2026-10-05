import React, { useState, useEffect } from 'react';
import { CheckSquare, Eye, CheckCircle2, XCircle, Clock, Award, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminAssessmentResultsTab: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState<any | null>(null);
    const [attemptDrilldown, setAttemptDrilldown] = useState<any | null>(null);
    const [isDrilldownLoading, setIsDrilldownLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        adminService.getAssessmentResults()
            .then(res => {
                setResults(res.results || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const openDrilldown = (resItem: any) => {
        setSelectedResult(resItem);
        setIsDrilldownLoading(true);
        adminService.getAssessmentResults(resItem.id)
            .then(res => {
                setAttemptDrilldown(res.attempt_details || []);
                setIsDrilldownLoading(false);
            })
            .catch(() => setIsDrilldownLoading(false));
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header Description */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <CheckSquare className="w-5 h-5 text-brand-400" />
                        <span>Learner Assessment Attempts Audit</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Inspect diagnostic test performance, overall scores, and question-by-question student response breakdowns.
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-extrabold text-brand-400">{results.length}</span>
                    <div className="text-[10px] text-slate-400">Diagnostic Records</div>
                </div>
            </div>

            {/* Results Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Learner Name</th>
                                <th className="p-4">Target Language</th>
                                <th className="p-4">Assessment Date</th>
                                <th className="p-4">Score & Percentage</th>
                                <th className="p-4">Assigned Level</th>
                                <th className="p-4 text-right">Question Drilldown</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading diagnostic test results...</td>
                                </tr>
                            ) : results.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No assessment attempt logs available.</td>
                                </tr>
                            ) : (
                                results.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-sm">{res.learner_name}</div>
                                            <div className="text-slate-400 text-[11px]">{res.email}</div>
                                        </td>
                                        <td className="p-4 text-slate-300 font-medium">{res.target_language}</td>
                                        <td className="p-4 text-slate-400">{res.assessment_date}</td>
                                        <td className="p-4">
                                            <div className="font-extrabold text-emerald-400 text-sm">{res.total_score} ({res.percentage}%)</div>
                                            <div className="text-[10px] text-slate-400">{res.correct_answers} correct • {res.wrong_answers} wrong</div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 text-[11px]">
                                                {res.proficiency_level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openDrilldown(res)}
                                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 font-semibold text-xs transition"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                <span>Audit Answers</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Question-by-Question Drilldown Modal */}
            {selectedResult && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Assessment Attempt Drilldown: {selectedResult.learner_name}
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Score: {selectedResult.total_score} ({selectedResult.percentage}%) • Date: {selectedResult.assessment_date}
                                </p>
                            </div>
                            <button onClick={() => setSelectedResult(null)} className="text-slate-400 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
                            {isDrilldownLoading ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : !attemptDrilldown || attemptDrilldown.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-xs">
                                    No granular response breakdown found for this historical assessment record.
                                </div>
                            ) : (
                                attemptDrilldown.map((item: any, i: number) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-xl border ${item.is_correct
                                                ? 'bg-emerald-500/10 border-emerald-500/20'
                                                : 'bg-rose-500/10 border-rose-500/20'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center space-x-2">
                                                {item.is_correct ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                ) : (
                                                    <XCircle className="w-4 h-4 text-rose-400" />
                                                )}
                                                <span className="font-bold text-xs text-white">Q{i + 1}: {item.question_prompt}</span>
                                            </div>
                                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                                                {item.question_skill}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                                            <div className="bg-slate-900/60 p-2 rounded-lg">
                                                <span className="text-slate-400 text-[10px]">Student Answer:</span>
                                                <div className={`font-bold ${item.is_correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    {item.user_answer}
                                                </div>
                                            </div>
                                            <div className="bg-slate-900/60 p-2 rounded-lg">
                                                <span className="text-slate-400 text-[10px]">Correct Answer:</span>
                                                <div className="font-bold text-emerald-400">{item.correct_answer}</div>
                                            </div>
                                        </div>

                                        {item.explanation && (
                                            <div className="text-[11px] text-slate-300 mt-2 italic bg-slate-900/40 p-2 rounded-lg">
                                                💡 {item.explanation}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
