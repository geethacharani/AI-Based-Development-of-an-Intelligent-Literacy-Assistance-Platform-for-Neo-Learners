import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Award, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminLessonsTab: React.FC = () => {
    const [units, setUnits] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState<any>(null);

    const [formData, setFormData] = useState({
        unit_id: 1,
        title: '',
        subtitle: '',
        node_type: 'reading',
        order: 1,
        xp_reward: 50,
    });

    const fetchLessons = () => {
        setIsLoading(true);
        adminService.getLessons()
            .then(res => {
                setUnits(res.units || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const handleCreateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createLesson(formData);
            setIsAddModalOpen(false);
            resetForm();
            fetchLessons();
        } catch (err: any) {
            alert(err.message || 'Error creating lesson node');
        }
    };

    const handleUpdateLesson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingNode) return;
        try {
            await adminService.updateLesson(editingNode.id, formData);
            setIsEditModalOpen(false);
            setEditingNode(null);
            resetForm();
            fetchLessons();
        } catch (err: any) {
            alert(err.message || 'Error updating lesson node');
        }
    };

    const handleDeleteLesson = async (id: number) => {
        if (!window.confirm('Delete this lesson node from curriculum?')) return;
        try {
            await adminService.deleteLesson(id);
            fetchLessons();
        } catch (err: any) {
            alert(err.message || 'Error deleting lesson node');
        }
    };

    const openEditModal = (node: any, unitId: number) => {
        setEditingNode(node);
        setFormData({
            unit_id: unitId,
            title: node.title,
            subtitle: node.subtitle,
            node_type: node.node_type,
            order: node.order,
            xp_reward: node.xp_reward,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            unit_id: 1,
            title: '',
            subtitle: '',
            node_type: 'reading',
            order: 1,
            xp_reward: 50,
        });
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header */}
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <BookOpen className="w-5 h-5 text-brand-400" />
                        <span>Curriculum Units & Lesson Nodes Management</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage interactive lesson nodes, reading passages, vocabulary drills, speaking exercises, and XP rewards.
                    </p>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 whitespace-nowrap transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Lesson Node</span>
                </button>
            </div>

            {/* Units & Lesson Nodes Breakdown */}
            <div className="space-y-6">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                        Loading curriculum nodes...
                    </div>
                ) : units.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                        No curriculum units found.
                    </div>
                ) : (
                    units.map((unit) => (
                        <div key={unit.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <div>
                                    <h4 className="font-extrabold text-base text-white">Unit {unit.unit_number}: {unit.title}</h4>
                                    <p className="text-xs text-slate-400">{unit.description}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 text-xs">
                                    {unit.level_tier}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {unit.nodes?.map((node: any) => (
                                    <div key={node.id} className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-2 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-semibold uppercase tracking-wider">
                                                    {node.node_type}
                                                </span>
                                                <span className="text-[11px] font-bold text-amber-400">+{node.xp_reward} XP</span>
                                            </div>
                                            <h5 className="font-bold text-sm text-white mt-2">{node.title}</h5>
                                            <p className="text-xs text-slate-400 mt-0.5">{node.subtitle}</p>
                                        </div>

                                        <div className="flex justify-end space-x-1 pt-2 border-t border-slate-700/50">
                                            <button
                                                onClick={() => openEditModal(node, unit.id)}
                                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 transition"
                                                title="Edit Node"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteLesson(node.id)}
                                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-rose-400 transition"
                                                title="Delete Node"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add / Edit Lesson Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white">
                                {isAddModalOpen ? 'Add Lesson Node' : 'Edit Lesson Node'}
                            </h3>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={isAddModalOpen ? handleCreateLesson : handleUpdateLesson} className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Target Unit</label>
                                <select
                                    value={formData.unit_id}
                                    onChange={(e) => setFormData({ ...formData, unit_id: Number(e.target.value) })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                >
                                    {units.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            Unit {u.unit_number}: {u.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Lesson Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Subtitle / Description</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Type</label>
                                    <select
                                        value={formData.node_type}
                                        onChange={(e) => setFormData({ ...formData, node_type: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    >
                                        <option value="reading">Reading</option>
                                        <option value="vocabulary">Vocabulary</option>
                                        <option value="speaking">Speaking</option>
                                        <option value="writing">Writing</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">XP Reward</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.xp_reward}
                                        onChange={(e) => setFormData({ ...formData, xp_reward: Number(e.target.value) })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow"
                                >
                                    {isAddModalOpen ? 'Create Lesson' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
