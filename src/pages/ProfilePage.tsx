import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { SkillGrid } from '../components/profile/SkillGrid';
import { AssessmentPromptCard } from '../components/profile/AssessmentPromptCard';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card } from '../components/ui/Card';
import {
    ArrowLeft,
    Edit3,
    RefreshCw,
    CheckCircle,
    Globe,
    Bell,
    Shield,
    LogOut,
    Sparkles,
    Smartphone,
    Languages,
    Sliders
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { LearnerProficiency, SkillLevel } from '../types';
import { PWAInstallPrompt } from '../components/pwa/PWAInstallPrompt';

export const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { profile, user, logout, setProfileState, updateSupportLanguage, updateTargetLanguage } = useAuth();
    const { t } = useTranslation();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Notifications state
    const [dailyReminders, setDailyReminders] = useState(true);
    const [streakAlerts, setStreakAlerts] = useState(true);

    const supportLanguages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'te', name: 'తెలుగు (Telugu)', flag: '🇮🇳' },
        { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
        { code: 'kn', name: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
        { code: 'ml', name: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
    ];

    const targetLanguages = [
        { code: 'hi', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
        { code: 'en', name: 'English (English)', flag: '🇬🇧' },
        { code: 'te', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
        { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸' },
        { code: 'fr', name: 'French (Français)', flag: '🇫🇷' },
        { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪' },
        { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵' },
    ];

    const [editProficiency, setEditProficiency] = useState<LearnerProficiency>(
        profile?.proficiency || {
            reading_level: 'Intermediate',
            writing_level: 'Beginner',
            vocabulary_level: 'Advanced',
            speaking_level: 'Basic',
        }
    );

    const isAdminUser = Boolean(user?.is_staff || user?.is_superuser);

    if (!profile) {
        return (
            <div className="py-20 text-center space-y-4">
                <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto" />
                <p className="text-sm font-semibold text-slate-600">{t('prof_loading')}</p>
            </div>
        );
    }

    const handleUpdateProficiency = async () => {
        setIsUpdating(true);
        try {
            const updated = await profileService.updateProficiency(editProficiency);
            setProfileState(updated);
            setIsEditModalOpen(false);
        } catch (err: any) {
            alert(err.message || 'Failed to update skills');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in text-slate-900">
            {/* Header & Back Button */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> {t('prof_back_to_home')}
                </button>

                {isAdminUser && (
                    <button
                        onClick={() => navigate('/admin')}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 text-amber-300 border border-amber-400/40 text-xs font-black shadow hover:bg-slate-800 transition"
                    >
                        <Shield className="w-4 h-4 text-amber-400" /> {t('prof_admin_console')}
                    </button>
                )}
            </div>

            {/* Top Learner Profile Banner */}
            <ProfileHeader profile={profile} />

            {/* Language Settings & Preferences */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 rounded-2xl bg-brand-50 text-brand-600">
                        <Languages className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900">{t('prof_language_preferences')}</h2>
                        <p className="text-xs text-slate-500">{t('prof_lang_pref_desc')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Target Learning Language */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            {t('prof_target_learning_lang')}
                        </label>
                        <select
                            value={profile.target_language?.code || 'hi'}
                            onChange={(e) => updateTargetLanguage?.(e.target.value)}
                            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {targetLanguages.map(l => (
                                <option key={l.code} value={l.code}>
                                    {l.flag} {l.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400">{t('prof_target_lang_hint')}</p>
                    </div>

                    {/* Interface / Comfortable Language */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            {t('prof_interface_explanation_lang')}
                        </label>
                        <select
                            value={profile.comfortable_language?.code || 'en'}
                            onChange={(e) => updateSupportLanguage?.(e.target.value)}
                            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                            {supportLanguages.map(l => (
                                <option key={l.code} value={l.code}>
                                    {l.flag} {l.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-[11px] text-slate-400">{t('prof_interface_lang_hint')}</p>
                    </div>
                </div>
            </div>

            {/* Notification & Study Preferences */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900">{t('prof_notif_study_reminders')}</h2>
                        <p className="text-xs text-slate-500">{t('prof_notif_desc')}</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">{t('prof_daily_study_reminders')}</h4>
                            <p className="text-xs text-slate-500">{t('prof_daily_reminders_desc')}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={dailyReminders}
                            onChange={(e) => setDailyReminders(e.target.checked)}
                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">{t('prof_streak_freeze_alerts')}</h4>
                            <p className="text-xs text-slate-500">{t('prof_streak_alerts_desc')}</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={streakAlerts}
                            onChange={(e) => setStreakAlerts(e.target.checked)}
                            className="w-5 h-5 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Skill Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">{t('prof_skill_overview')}</h2>
                        <p className="text-xs text-slate-500">{t('prof_skill_overview_desc')}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditModalOpen(true)}
                        leftIcon={<Edit3 className="w-4 h-4 text-brand-600" />}
                    >
                        {t('prof_update_levels')}
                    </Button>
                </div>

                <SkillGrid proficiency={profile.proficiency || editProficiency} />
            </div>

            {/* Initial Assessment CTA Card */}
            <AssessmentPromptCard />

            {/* App Installation Option */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <div className="p-2.5 rounded-2xl bg-teal-50 text-teal-600">
                        <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-slate-900">{t('prof_install_pwa')}</h3>
                        <p className="text-xs text-slate-500">{t('prof_install_pwa_desc')}</p>
                    </div>
                </div>
                <PWAInstallPrompt forceShow={true} />
            </div>

            {/* Account Management & Logout */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-black text-slate-900">{t('prof_account_session')}</h3>
                    <p className="text-xs text-slate-500">{t('prof_logged_in_as')} {user?.email || profile.email}</p>
                </div>

                <button
                    onClick={() => logout()}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition"
                >
                    <LogOut className="w-4 h-4" /> {t('prof_sign_out')}
                </button>
            </div>

            {/* Quick Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={t('prof_edit_modal_title')}
            >
                <div className="space-y-6 pt-2">
                    <p className="text-xs text-slate-500">
                        {t('prof_edit_modal_desc')}
                    </p>

                    {(['reading_level', 'writing_level', 'vocabulary_level', 'speaking_level'] as const).map((key) => {
                        const label = key.replace('_level', '').toUpperCase();
                        return (
                            <div key={key} className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-800 tracking-wider">{label}</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {(['Beginner', 'Basic', 'Intermediate', 'Advanced'] as SkillLevel[]).map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setEditProficiency({ ...editProficiency, [key]: lvl })}
                                            className={`p-2 rounded-xl text-xs font-semibold transition-colors ${editProficiency[key] === lvl
                                                ? 'bg-brand-600 text-white font-bold shadow-sm'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                        <Button variant="ghost" size="md" onClick={() => setIsEditModalOpen(false)}>
                            {t('prof_cancel')}
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            isLoading={isUpdating}
                            onClick={handleUpdateProficiency}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                            {t('prof_save_changes')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
