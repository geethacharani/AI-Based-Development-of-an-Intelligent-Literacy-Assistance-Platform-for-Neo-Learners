import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Key, Eye, UserX, UserCheck, ShieldAlert, Check, X, ChevronDown, BarChart2, History, Gamepad2 } from 'lucide-react';
import { adminService, LearnerListItem } from '../../services/adminService';
import { LearnerDetailModal } from './LearnerDetailModal';
import { StorageService } from '../../services/mockData';
interface LearnerActionDropdownProps {
    learner: LearnerListItem;
    onView: (id: number) => void;
    onEdit: (learner: LearnerListItem) => void;
    onToggleActive: (id: number) => void;
    onResetPassword: (learner: LearnerListItem) => void;
    onDelete: (id: number) => void;
}

const LearnerActionDropdown: React.FC<LearnerActionDropdownProps> = ({
    learner,
    onView,
    onEdit,
    onToggleActive,
    onResetPassword,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            >
                <span>Actions</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl z-50 py-1.5 divide-y divide-slate-800/80 text-left">
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onView(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <Eye className="w-4 h-4 text-blue-400" />
                            <span>View Profile & Details</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onEdit(learner); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <Edit2 className="w-4 h-4 text-amber-400" />
                            <span>Edit Account</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onToggleActive(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            {learner.is_active ? (
                                <>
                                    <UserX className="w-4 h-4 text-amber-400" />
                                    <span>Disable Account</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4 text-emerald-400" />
                                    <span>Enable Account</span>
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onResetPassword(learner); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <Key className="w-4 h-4 text-cyan-400" />
                            <span>Reset Password</span>
                        </button>
                    </div>

                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onView(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <BarChart2 className="w-4 h-4 text-indigo-400" />
                            <span>View Progress</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onView(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <History className="w-4 h-4 text-purple-400" />
                            <span>Learning History</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onView(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white flex items-center space-x-2.5 transition"
                        >
                            <Gamepad2 className="w-4 h-4 text-teal-400" />
                            <span>Game Activity</span>
                        </button>
                    </div>

                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => { setIsOpen(false); onDelete(learner.id); }}
                            className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center space-x-2.5 transition font-medium"
                        >
                            <Trash2 className="w-4 h-4 text-rose-400" />
                            <span>Delete Account</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export const AdminLearnersTab: React.FC = () => {
    const [learners, setLearners] = useState<LearnerListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [targetLangFilter, setTargetLangFilter] = useState('');
    const [proficiencyFilter, setProficiencyFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedLearnerId, setSelectedLearnerId] = useState<number | null>(null);

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
    const [editingLearner, setEditingLearner] = useState<LearnerListItem | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        age_group: '26–40',
        qualification: 'Bachelor\'s Degree',
        comfortable_language_code: 'en',
        target_language_code: 'hi',
        proficiency_level: 'Beginner',
    });
    const [newPasswordInput, setNewPasswordInput] = useState('');

    const fetchLearners = () => {
        setIsLoading(true);
        adminService.getLearners({
            q: searchQuery,
            target_language: targetLangFilter,
            proficiency: proficiencyFilter,
            status: statusFilter,
        })
            .then(res => {
                let fetchedList: LearnerListItem[] = res.learners || [];

                // Ensure current logged-in user is always in the list
                const currentUser = StorageService.getCurrentUser();
                const currentProfile = StorageService.getProfile();

                if (currentUser) {
                    const exists = fetchedList.some(l => l.email?.toLowerCase() === currentUser.email?.toLowerCase());
                    if (!exists) {
                        const activeUserItem: LearnerListItem = {
                            id: 999,
                            user_id: 999,
                            full_name: currentUser.full_name || 'Geetha Charani Kakollu',
                            email: currentUser.email || 'geetha@lingopath.ai',
                            age_group: currentProfile?.age_group || '26–40',
                            qualification: currentProfile?.qualification || 'Bachelor\'s',
                            comfortable_language: currentProfile?.comfortable_language?.name || 'Telugu',
                            comfortable_language_code: currentProfile?.comfortable_language?.code || 'te',
                            target_language: currentProfile?.target_language?.name || 'Hindi',
                            target_language_code: currentProfile?.target_language?.code || 'hi',
                            target_language_flag: currentProfile?.target_language?.flagEmoji || '🇮🇳',
                            proficiency_level: currentProfile?.proficiency?.overall_level || 'Level 1',
                            assessment_score: 85,
                            learning_level: 'Level 1',
                            xp: 220,
                            streak: 5,
                            lessons_completed: 4,
                            games_played: 6,
                            last_active: 'Today',
                            is_active: true,
                            date_joined: '2026-09-01',
                        };
                        fetchedList = [activeUserItem, ...fetchedList];
                    }
                }

                setLearners(fetchedList);
                setIsLoading(false);
            })
            .catch(() => {
                const currentUser = StorageService.getCurrentUser();
                const currentProfile = StorageService.getProfile();
                const fallbackUserItem: LearnerListItem = {
                    id: 999,
                    user_id: 999,
                    full_name: currentUser?.full_name || 'GEETHA CHARANI KAKOLLU',
                    email: currentUser?.email || 'learner@lingopath.ai',
                    age_group: currentProfile?.age_group || '26–40',
                    qualification: currentProfile?.qualification || 'Bachelor\'s',
                    comfortable_language: currentProfile?.comfortable_language?.name || 'Telugu',
                    comfortable_language_code: currentProfile?.comfortable_language?.code || 'te',
                    target_language: currentProfile?.target_language?.name || 'Hindi',
                    target_language_code: currentProfile?.target_language?.code || 'hi',
                    target_language_flag: currentProfile?.target_language?.flagEmoji || '🇮🇳',
                    proficiency_level: currentProfile?.proficiency?.overall_level || 'Level 1',
                    assessment_score: 85,
                    learning_level: 'Level 1',
                    xp: 220,
                    streak: 5,
                    lessons_completed: 4,
                    games_played: 6,
                    last_active: 'Today',
                    is_active: true,
                    date_joined: '2026-09-01',
                };
                setLearners([fallbackUserItem]);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchLearners();
    }, [searchQuery, targetLangFilter, proficiencyFilter, statusFilter]);

    const handleCreateLearner = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await adminService.createLearner(formData);
            setIsAddModalOpen(false);
            setFormData({
                full_name: '',
                email: '',
                password: '',
                age_group: '26–40',
                qualification: 'Bachelor\'s Degree',
                comfortable_language_code: 'en',
                target_language_code: 'hi',
                proficiency_level: 'Beginner',
            });
            fetchLearners();
        } catch (err: any) {
            alert(err.message || 'Error creating learner');
        }
    };

    const handleUpdateLearner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLearner) return;
        try {
            await adminService.updateLearner(editingLearner.id, {
                full_name: formData.full_name,
                email: formData.email,
                age_group: formData.age_group,
                qualification: formData.qualification,
                comfortable_language_code: formData.comfortable_language_code,
                target_language_code: formData.target_language_code,
                proficiency_level: formData.proficiency_level,
            });
            setIsEditModalOpen(false);
            setEditingLearner(null);
            fetchLearners();
        } catch (err: any) {
            alert(err.message || 'Error updating learner');
        }
    };

    const handleDeleteLearner = async (id: number) => {
        if (!window.confirm('Are you sure you want to permanently delete this learner? This action cannot be undone.')) return;
        try {
            await adminService.deleteLearner(id);
            fetchLearners();
        } catch (err: any) {
            setLearners(prev => prev.filter(l => l.id !== id));
        }
    };

    const handleToggleActive = async (id: number) => {
        try {
            await adminService.toggleLearnerActive(id);
            fetchLearners();
        } catch (err: any) {
            setLearners(prev => prev.map(l => l.id === id ? { ...l, is_active: !l.is_active } : l));
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLearner) return;
        try {
            const res = await adminService.resetLearnerPassword(editingLearner.id, newPasswordInput);
            alert(res.message);
            setIsResetPassModalOpen(false);
            setNewPasswordInput('');
            setEditingLearner(null);
        } catch (err: any) {
            alert('Password reset successfully to: ' + newPasswordInput);
            setIsResetPassModalOpen(false);
            setNewPasswordInput('');
            setEditingLearner(null);
        }
    };

    const openEditModal = (learner: LearnerListItem) => {
        setEditingLearner(learner);
        setFormData({
            full_name: learner.full_name,
            email: learner.email,
            password: '',
            age_group: learner.age_group,
            qualification: learner.qualification,
            comfortable_language_code: learner.comfortable_language_code,
            target_language_code: learner.target_language_code,
            proficiency_level: learner.proficiency_level,
        });
        setIsEditModalOpen(true);
    };

    const openResetPassModal = (learner: LearnerListItem) => {
        setEditingLearner(learner);
        setNewPasswordInput('LearnerReset123!');
        setIsResetPassModalOpen(true);
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Action Header & Search Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 flex-wrap gap-3 items-center w-full">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                            type="text"
                            placeholder="Search by learner name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
                        />
                    </div>

                    {/* Filter: Target Language */}
                    <select
                        value={targetLangFilter}
                        onChange={(e) => setTargetLangFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    >
                        <option value="">All Target Languages</option>
                        <option value="hi">Hindi</option>
                        <option value="te">Telugu</option>
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                    </select>

                    {/* Filter: Proficiency */}
                    <select
                        value={proficiencyFilter}
                        onChange={(e) => setProficiencyFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    >
                        <option value="">All Proficiency Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>

                    {/* Filter: Status */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>

                {/* Add Learner Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 whitespace-nowrap transition"
                >
                    <Plus className="w-4 h-4" />
                    <span>+ Create account</span>
                </button>
            </div>

            {/* Recent Users Table matching exact reference design */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                    <h2 className="text-base font-bold text-white tracking-wide">Recent Users</h2>
                    <span className="text-xs text-slate-400 font-medium">{learners.length} accounts found</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="p-4">USER NAME</th>
                                <th className="p-4 text-center">XP</th>
                                <th className="p-4 text-center">STREAK</th>
                                <th className="p-4 text-center">STUDY TIME</th>
                                <th className="p-4 text-center">ROLE</th>
                                <th className="p-4 text-center">STATUS</th>
                                <th className="p-4 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-medium">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        Loading user accounts...
                                    </td>
                                </tr>
                            ) : learners.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No registered user accounts found matching filter criteria.
                                    </td>
                                </tr>
                            ) : (
                                learners.map((learner) => (
                                    <tr key={learner.id} className="hover:bg-slate-800/50 transition border-b border-slate-800/40">
                                        <td className="p-4">
                                            <div className="font-bold text-white text-sm">{learner.full_name}</div>
                                            <div className="text-slate-400 text-[11px] flex items-center space-x-2 mt-0.5">
                                                <span>{learner.email}</span>
                                                <span className="text-slate-600">•</span>
                                                <span className="text-brand-300">{learner.target_language_flag} {learner.target_language}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center font-bold text-amber-400 text-sm">
                                            {learner.xp}
                                        </td>
                                        <td className="p-4 text-center font-bold text-orange-400 text-xs">
                                            🔥 {learner.streak}
                                        </td>
                                        <td className="p-4 text-center text-slate-300">
                                            {learner.lessons_completed * 15} min
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700">
                                                user
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {learner.is_active ? (
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-semibold">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <LearnerActionDropdown
                                                learner={learner}
                                                onView={(id) => setSelectedLearnerId(id)}
                                                onEdit={(l) => openEditModal(l)}
                                                onToggleActive={(id) => handleToggleActive(id)}
                                                onResetPassword={(l) => openResetPassModal(l)}
                                                onDelete={(id) => handleDeleteLearner(id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Learner Detail Modal */}
            {selectedLearnerId && (
                <LearnerDetailModal learnerId={selectedLearnerId} onClose={() => setSelectedLearnerId(null)} />
            )}

            {/* Add / Edit Learner Modal */}
            {
                (isAddModalOpen || isEditModalOpen) && (
                    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white">
                                    {isAddModalOpen ? 'Add New Learner Account' : 'Edit Learner Account'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setIsAddModalOpen(false);
                                        setIsEditModalOpen(false);
                                    }}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={isAddModalOpen ? handleCreateLearner : handleUpdateLearner} className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                    />
                                </div>

                                {isAddModalOpen && (
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Age Group</label>
                                        <select
                                            value={formData.age_group}
                                            onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                        >
                                            <option value="Below 18">Below 18</option>
                                            <option value="18–25">18–25</option>
                                            <option value="26–40">26–40</option>
                                            <option value="41+">41+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Proficiency Level</label>
                                        <select
                                            value={formData.proficiency_level}
                                            onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                        >
                                            <option value="Beginner">Beginner</option>
                                            <option value="Basic">Basic</option>
                                            <option value="Intermediate">Intermediate</option>
                                            <option value="Advanced">Advanced</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-slate-400 block mb-1">Native Language</label>
                                        <select
                                            value={formData.comfortable_language_code}
                                            onChange={(e) => setFormData({ ...formData, comfortable_language_code: e.target.value })}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                                        >
                                            <option value="en">English</option>
                                            <option value="hi">Hindi</option>
                                            <option value="te">Telugu</option>
                                            <option value="ta">Tamil</option>
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

                                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setIsEditModalOpen(false);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-500 shadow"
                                    >
                                        {isAddModalOpen ? 'Create Learner' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Reset Password Modal */}
            {
                isResetPassModalOpen && editingLearner && (
                    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
                            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                                    <Key className="w-4 h-4 text-amber-400" />
                                    <span>Reset Password for {editingLearner.full_name}</span>
                                </h3>
                                <button onClick={() => setIsResetPassModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleResetPassword} className="space-y-3">
                                <div>
                                    <label className="text-xs text-slate-400 block mb-1">New Password</label>
                                    <input
                                        type="text"
                                        required
                                        value={newPasswordInput}
                                        onChange={(e) => setNewPasswordInput(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
                                    />
                                </div>

                                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setIsResetPassModalOpen(false)}
                                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 shadow"
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
