import React, { useState, useEffect } from 'react';
import { Globe, Plus, Edit2, Trash2, CheckCircle2, XCircle, Users, X } from 'lucide-react';
import { adminService } from '../../services/adminService';

export const AdminLanguagesTab: React.FC = () => {
    const [languages, setLanguages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLang, setEditingLang] = useState<any>(null);

    const [formData, setFormData] = useState({
        code: '',
        name: '',
        native_name: '',
        flag_emoji: '🌐',
        is_supported_native: true,
        is_supported_target: true,
    });

    const fetchLanguages = () => {
        setIsLoading(true);
        adminService.getLanguages()
            .then(res => {
                setLanguages(res.languages || []);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchLanguages();
    }, []);

    const handleCreateLanguage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createLanguage(formData);
            setIsAddModalOpen(false);
            resetForm();
            fetchLanguages();
        } catch (err: any) {
            alert(err.message || 'Error creating language');
        }
    };

    const handleUpdateLanguage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLang) return;
        try {
            await adminService.updateLanguage(editingLang.id, formData);
            setIsEditModalOpen(false);
            setEditingLang(null);
            resetForm();
            fetchLanguages();
        } catch (err: any) {
            alert(err.message || 'Error updating language');
        }
    };

    const handleDeleteLanguage = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this language from the platform?')) return;
        try {
            await adminService.deleteLanguage(id);
            fetchLanguages();
        } catch (err: any) {
            alert(err.message || 'Error deleting language');
        }
    };

    const handleToggleSupport = async (lang: any, field: 'is_supported_native' | 'is_supported_target') => {
        try {
            await adminService.updateLanguage(lang.id, {
                [field]: !lang[field]
            });
            fetchLanguages();
        } catch (err: any) {
            alert(err.message || 'Error updating language');
        }
    };

    const openEditModal = (lang: any) => {
        setEditingLang(lang);
        setFormData({
            code: lang.code,
            name: lang.name,
            native_name: lang.native_name,
            flag_emoji: lang.flag_emoji,
            is_supported_native: lang.is_supported_native,
            is_supported_target: lang.is_supported_target,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            code: '',
            name: '',
            native_name: '',
            flag_emoji: '🌐',
            is_supported_native: true,
            is_supported_target: true,
        });
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Action Bar */}
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div>
                    <h3 className="text-base font-bold text-white flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-brand-400" />
                        <span>Platform Language Management</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Manage supported target learning languages and native bridge languages available on LingoPath AI.
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
                    <span>Add New Language</span>
                </button>
            </div>

            {/* Languages Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Language & Code</th>
                                <th className="p-4">Native Name</th>
                                <th className="p-4">Supported as Native</th>
                                <th className="p-4">Supported as Target</th>
                                <th className="p-4">Learners Count</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Loading languages...</td>
                                </tr>
                            ) : languages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">No languages found.</td>
                                </tr>
                            ) : (
                                languages.map((lang) => (
                                    <tr key={lang.id} className="hover:bg-slate-800/40 transition">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-2 font-bold text-white text-sm">
                                                <span className="text-lg">{lang.flag_emoji}</span>
                                                <span>{lang.name}</span>
                                                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                                                    {lang.code}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300 font-medium">{lang.native_name}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleSupport(lang, 'is_supported_native')}
                                                className={`px-3 py-1 rounded-full text-[10px] font-semibold flex items-center space-x-1.5 transition ${lang.is_supported_native
                                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-slate-800 text-slate-500'
                                                    }`}
                                            >
                                                {lang.is_supported_native ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                <span>{lang.is_supported_native ? 'Active Native' : 'Disabled'}</span>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => handleToggleSupport(lang, 'is_supported_target')}
                                                className={`px-3 py-1 rounded-full text-[10px] font-semibold flex items-center space-x-1.5 transition ${lang.is_supported_target
                                                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                                                        : 'bg-slate-800 text-slate-500'
                                                    }`}
                                            >
                                                {lang.is_supported_target ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                <span>{lang.is_supported_target ? 'Active Target' : 'Disabled'}</span>
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-amber-400 text-xs">
                                                {lang.target_learners} learners learning
                                            </div>
                                            <div className="text-[10px] text-slate-500">{lang.native_learners} native speakers</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => openEditModal(lang)}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                                                    title="Edit Language"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLanguage(lang.id)}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-rose-400 transition"
                                                    title="Delete Language"
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

            {/* Add / Edit Language Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <h3 className="text-base font-bold text-white">
                                {isAddModalOpen ? 'Add New Language' : 'Edit Language Details'}
                            </h3>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-slate-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={isAddModalOpen ? handleCreateLanguage : handleUpdateLanguage} className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Language Code (e.g. hi, te, en)</label>
                                <input
                                    type="text"
                                    required
                                    disabled={isEditModalOpen}
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono disabled:opacity-50"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">English Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Native Name (e.g. हिन्दी, తెలుగు)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.native_name}
                                    onChange={(e) => setFormData({ ...formData, native_name: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 block mb-1">Flag Emoji</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.flag_emoji}
                                    onChange={(e) => setFormData({ ...formData, flag_emoji: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                />
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="flex items-center space-x-2 text-xs text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_supported_native}
                                        onChange={(e) => setFormData({ ...formData, is_supported_native: e.target.checked })}
                                        className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-brand-500"
                                    />
                                    <span>Enable as Native Support Language</span>
                                </label>
                                <label className="flex items-center space-x-2 text-xs text-slate-300">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_supported_target}
                                        onChange={(e) => setFormData({ ...formData, is_supported_target: e.target.checked })}
                                        className="rounded bg-slate-800 border-slate-700 text-brand-500 focus:ring-brand-500"
                                    />
                                    <span>Enable as Target Learning Language</span>
                                </label>
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
                                    {isAddModalOpen ? 'Create Language' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
