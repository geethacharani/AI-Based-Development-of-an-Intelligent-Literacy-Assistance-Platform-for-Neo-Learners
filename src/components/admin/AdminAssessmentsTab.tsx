import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, HelpCircle, BookOpen, Volume2, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminAssessmentsTab: React.FC = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [langFilter, setLangFilter] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);

    const [formData, setFormData] = useState({
        skill: 'Vocabulary',
        question_type: 'multiple_choice',
        prompt: '',
        passage: '',
        highlight_word: '',
        target_language_code: 'hi',
        correct_answer: '',
        explanation: '',
        options: ['', '', '', ''],
    });

    const fetchQuestions = () => {
        setIsLoading(true);
        adminService.getQuestions({ q: searchQuery, skill: skillFilter, target_language: langFilter })
            .then(res => {
                setQuestions(res.questions || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchQuestions();
    }, [searchQuery, skillFilter, langFilter]);

    const handleCreateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createQuestion({
                ...formData,
                options: formData.options.filter(o => o.trim() !== ''),
            });
            setIsAddModalOpen(false);
            resetForm();
            fetchQuestions();
        } catch (err: any) {
            alert(err.message || 'Error creating question');
        }
    };

    const handleUpdateQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingQuestion) return;
        try {
            await adminService.updateQuestion(editingQuestion.id, {
                ...formData,
                options: formData.options.filter(o => o.trim() !== ''),
            });
            setIsEditModalOpen(false);
            setEditingQuestion(null);
            resetForm();
            fetchQuestions();
        } catch (err: any) {
            alert(err.message || 'Error updating question');
        }
    };

    const handleDeleteQuestion = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this assessment question?')) return;
        try {
            await adminService.deleteQuestion(id);
            fetchQuestions();
        } catch (err: any) {
            alert(err.message || 'Error deleting question');
        }
    };

    const openEditModal = (q: any) => {
        setEditingQuestion(q);
        const opts = [...(q.options || [])];
        while (opts.length < 4) opts.push('');
        setFormData({
            skill: q.skill || 'Vocabulary',
            question_type: q.question_type || 'multiple_choice',
            prompt: q.prompt || '',
            passage: q.passage || '',
            highlight_word: q.highlight_word || '',
            target_language_code: q.target_language_code || 'hi',
            correct_answer: q.correct_answer || '',
            explanation: q.explanation || '',
            options: opts,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            skill: 'Vocabulary',
            question_type: 'multiple_choice',
            prompt: '',
            passage: '',
            highlight_word: '',
            target_language_code: 'hi',
            correct_answer: '',
            explanation: '',
            options: ['', '', '', ''],
        });
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 flex-wrap gap-3 items-center w-full">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Search question prompt, passage, or explanation..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                    </div>

                    <select
                        value={skillFilter}
                        onChange={(e) => setSkillFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    >
                        <option value="">All Skills</option>
                        <option value="Reading">Reading</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Writing">Writing</option>
                        <option value="Speaking">Speaking</option>
                    </select>

                    <select
                        value={langFilter}
                        onChange={(e) => setLangFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    >
                        <option value="">All Languages</option>
                        <option value="hi">Hindi</option>
                        <option value="te">Telugu</option>
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                    </select>
                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setIsAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 whitespace-nowrap transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Question</span>
                </button>
            </div>

            {/* Questions List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Skill & Language</th>
                                <th className="p-4">Question Prompt</th>
                                <th className="p-4">Options & Correct Answer</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">Loading questions...</td>
                                </tr>
                            ) : questions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-500">No assessment questions found.</td>
                                </tr>
                            ) : (
                                questions.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 font-semibold border border-brand-500/30 text-[11px]">
                                                {q.skill}
                                            </span>
                                            <div className="text-[10px] text-slate-400 mt-1">{q.target_language}</div>
                                        </td>
                                        <td className="p-4 max-w-md">
                                            <div className="font-bold text-white">{q.prompt}</div>
                                            {q.passage && <div className="text-slate-400 text-[11px] italic mt-0.5 truncate">"{q.passage}"</div>}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {q.options?.map((opt: string, i: number) => (
                                                    <span
                                                        key={i}
                                                        className={`px-2 py-0.5 rounded text-[10px] ${opt === q.correct_answer
                                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                                                                : 'bg-slate-800 text-slate-400'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="text-[10px] text-emerald-400 font-semibold">Correct: {q.correct_answer}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => openEditModal(q)}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                                    title="Edit Question"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteQuestion(q.id)}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Delete Question"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
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

            {/* Add / Edit Question Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white">
                                {isAddModalOpen ? 'Add Diagnostic Assessment Question' : 'Edit Assessment Question'}
                            </h3>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={isAddModalOpen ? handleCreateQuestion : handleUpdateQuestion} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Target Skill</label>
                                    <select
                                        value={formData.skill}
                                        onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    >
                                        <option value="Reading">Reading</option>
                                        <option value="Vocabulary">Vocabulary</option>
                                        <option value="Writing">Writing</option>
                                        <option value="Speaking">Speaking</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Target Language</label>
                                    <select
                                        value={formData.target_language_code}
                                        onChange={(e) => setFormData({ ...formData, target_language_code: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    >
                                        <option value="hi">Hindi</option>
                                        <option value="te">Telugu</option>
                                        <option value="en">English</option>
                                        <option value="ta">Tamil</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Question Prompt / Title</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.prompt}
                                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    placeholder="e.g. What is the meaning of नमस्ते (Namaste)?"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Passage (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={formData.passage}
                                    onChange={(e) => setFormData({ ...formData, passage: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    placeholder="Passage text for reading comprehension questions..."
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Options (4 Choices)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {formData.options.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            placeholder={`Option ${idx + 1}`}
                                            value={opt}
                                            onChange={(e) => {
                                                const updated = [...formData.options];
                                                updated[idx] = e.target.value;
                                                setFormData({ ...formData, options: updated });
                                            }}
                                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Correct Answer</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.correct_answer}
                                    onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-emerald-400 focus:outline-none focus:border-brand-500"
                                    placeholder="Exact match of correct option text"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Explanation</label>
                                <textarea
                                    rows={2}
                                    value={formData.explanation}
                                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    placeholder="Explain why this answer is correct..."
                                />
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
                                    {isAddModalOpen ? 'Create Question' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
