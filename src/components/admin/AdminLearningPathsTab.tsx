import React, { useState, useEffect } from 'react';
import { Route, Sparkles, RefreshCw, Lock, Unlock, Eye, CheckCircle2, RotateCcw, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminLearningPathsTab: React.FC = () => {
    const [paths, setPaths] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPath, setSelectedPath] = useState<any | null>(null);
    const [pathDetail, setPathDetail] = useState<any | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    const fetchPaths = () => {
        setIsLoading(true);
        adminService.getLearningPaths()
            .then(res => {
                setPaths(res.learning_paths || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchPaths();
    }, []);

    const openPathInspector = (pathItem: any) => {
        setSelectedPath(pathItem);
        setIsDetailLoading(true);
        adminService.getLearningPathDetail(pathItem.learner_id)
            .then(res => {
                setPathDetail(res);
                setIsDetailLoading(false);
            })
            .catch(() => setIsDetailLoading(false));
    };

    const handleResetPath = async (learnerId: number) => {
        if (!window.confirm('Reset this learner\'s progress on their learning path?')) return;
        try {
            const res = await adminService.resetLearningPath(learnerId);
            alert(res.message);
            fetchPaths();
            if (selectedPath?.learner_id === learnerId) {
                openPathInspector(selectedPath);
            }
        } catch (err: any) {
            alert(err.message || 'Error resetting learning path');
        }
    };

    const handleRegeneratePath = async (learnerId: number) => {
        try {
            const res = await adminService.regenerateLearningPath(learnerId);
            alert(res.message);
            fetchPaths();
            if (selectedPath?.learner_id === learnerId) {
                openPathInspector(selectedPath);
            }
        } catch (err: any) {
            alert(err.message || 'Error regenerating path');
        }
    };

    const handleToggleNodeLock = async (nodeKey: string) => {
        if (!pathDetail) return;
        const currentUnlocked: string[] = pathDetail.unlocked_nodes || [];
        const isCurrentlyUnlocked = currentUnlocked.includes(nodeKey);

        let newUnlocked: string[];
        if (isCurrentlyUnlocked) {
            newUnlocked = currentUnlocked.filter(n => n !== nodeKey);
        } else {
            newUnlocked = [...currentUnlocked, nodeKey];
        }

        try {
            await adminService.updateLearningPathNodes(pathDetail.learner_id, {
                unlocked_nodes: newUnlocked
            });
            setPathDetail({ ...pathDetail, unlocked_nodes: newUnlocked });
        } catch (err: any) {
            alert(err.message || 'Error updating node lock');
        }
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <Route className="w-5 h-5 text-brand-400" />
                        <span>Learner Learning Path Manager</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Inspect personalized AI units & nodes per learner. Reorder lessons, unlock/lock specific nodes, reset progress, or force AI path regeneration.
                    </p>
                </div>
            </div>

            {/* Path List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Learner Name</th>
                                <th className="p-4">Target Language</th>
                                <th className="p-4">Proficiency Level</th>
                                <th className="p-4">Completed Lessons</th>
                                <th className="p-4">Progress</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading learning paths...</td>
                                </tr>
                            ) : paths.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No learning paths found.</td>
                                </tr>
                            ) : (
                                paths.map((path) => (
                                    <tr key={path.learner_id} className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-sm">{path.learner_name}</div>
                                            <div className="text-slate-400 text-[11px]">{path.email}</div>
                                        </td>
                                        <td className="p-4 font-medium text-slate-300">{path.target_language}</td>
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 text-[11px]">
                                                {path.current_level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 font-bold">{path.completed_lessons} lessons completed</td>
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-brand-500 h-2 rounded-full"
                                                        style={{ width: `${Math.max(path.progress_percentage, 5)}%` }}
                                                    />
                                                </div>
                                                <span className="text-[11px] font-bold text-brand-400">{path.progress_percentage}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-1.5">
                                                <button
                                                    onClick={() => openPathInspector(path)}
                                                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 font-semibold text-xs transition inline-flex items-center space-x-1"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span>Inspect Path</span>
                                                </button>
                                                <button
                                                    onClick={() => handleRegeneratePath(path.learner_id)}
                                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-brand-500/20 text-amber-400 transition"
                                                    title="Regenerate AI Path"
                                                >
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleResetPath(path.learner_id)}
                                                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Reset Path Progress"
                                                >
                                                    <RotateCcw className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Path Inspector Modal */}
            {selectedPath && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
                            <div>
                                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                                    <Route className="w-4 h-4 text-brand-400" />
                                    <span>Path Nodes Inspector: {selectedPath.learner_name}</span>
                                </h3>
                                <p className="text-xs text-slate-400">Target Language: {selectedPath.target_language} • Level: {selectedPath.current_level}</p>
                            </div>
                            <button onClick={() => setSelectedPath(null)} className="text-slate-400 hover:text-white p-1">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
                            {isDetailLoading || !pathDetail ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                pathDetail.units?.map((unit: any) => (
                                    <div key={unit.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold text-sm text-white">Unit {unit.unit_number}: {unit.title}</h4>
                                                <p className="text-xs text-slate-400">{unit.description}</p>
                                            </div>
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                                                {unit.level_tier}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            {unit.nodes?.map((node: any) => {
                                                const nodeKey = `node_${unit.unit_number}_${node.order}`;
                                                const isCompleted = pathDetail.completed_lessons?.includes(nodeKey) || pathDetail.completed_lessons?.includes(node.id?.toString());
                                                const isUnlocked = pathDetail.unlocked_nodes?.includes(nodeKey) || node.order === 1;

                                                return (
                                                    <div
                                                        key={node.id}
                                                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${isCompleted
                                                                ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                                                                : isUnlocked
                                                                    ? 'bg-slate-900 border-slate-700 text-white'
                                                                    : 'bg-slate-950/60 border-slate-800 text-slate-500 opacity-75'
                                                            }`}
                                                    >
                                                        <div className="space-y-0.5">
                                                            <div className="font-bold flex items-center space-x-1.5">
                                                                {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                                                                <span>{node.title}</span>
                                                            </div>
                                                            <div className="text-[10px] text-slate-400">{node.subtitle} • {node.node_type} ({node.xp_reward} XP)</div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleToggleNodeLock(nodeKey)}
                                                            className={`p-1.5 rounded-lg border transition ${isUnlocked
                                                                    ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                                                                    : 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                                                                }`}
                                                            title={isUnlocked ? 'Lock Node' : 'Unlock Node'}
                                                        >
                                                            {isUnlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
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
