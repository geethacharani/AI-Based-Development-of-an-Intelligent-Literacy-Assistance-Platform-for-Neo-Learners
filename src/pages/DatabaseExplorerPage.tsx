import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
    Database,
    Users,
    BookOpen,
    Map,
    Mic,
    ExternalLink,
    Search,
    Shield,
    ArrowLeft,
    CheckCircle2,
    Sparkles,
    RefreshCw
} from 'lucide-react';

export const DatabaseExplorerPage: React.FC = () => {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [activeTab, setActiveTab] = useState<'profiles' | 'assessments' | 'curriculum' | 'voice'>('profiles');
    const [searchTerm, setSearchTerm] = useState('');

    // Mock/Seeded DB Records representing Django Database Models
    const profilesData = [
        {
            id: 1,
            username: user?.full_name || 'testuser',
            full_name: profile?.full_name || 'Test Learner',
            email: user?.email || 'learner@lingopath.ai',
            native_language: profile?.comfortable_language?.name || 'English (GB)',
            target_language: profile?.target_language?.name || 'Hindi (🇮🇳)',
            qualification: profile?.qualification || 'Intermediate School',
            age_group: profile?.age_group || '18-24 Years',
            xp: 220,
            streak: 5,
            status: 'Active'
        },
        {
            id: 2,
            username: 'priya_sharma',
            full_name: 'Priya Sharma',
            email: 'priya@example.com',
            native_language: 'Telugu',
            target_language: 'Hindi',
            qualification: 'High School',
            age_group: '25-34 Years',
            xp: 450,
            streak: 12,
            status: 'Active'
        },
        {
            id: 3,
            username: 'rahul_verma',
            full_name: 'Rahul Verma',
            email: 'rahul@example.com',
            native_language: 'Hindi',
            target_language: 'English',
            qualification: 'Graduate',
            age_group: '18-24 Years',
            xp: 380,
            streak: 8,
            status: 'Active'
        }
    ];

    const assessmentData = [
        {
            id: 101,
            learner: profile?.full_name || 'Test Learner',
            target_lang: profile?.target_language?.name || 'Hindi',
            overall_score: '85%',
            reading_level: 'Letter Sounds (Level 2)',
            vocabulary_level: 'Basic Words',
            recommended_start: 'Stage 1: Alphabet & Letter Sounds',
            date: 'Today'
        },
        {
            id: 102,
            learner: 'Priya Sharma',
            target_lang: 'Hindi',
            overall_score: '92%',
            reading_level: 'Simple Sentences (Level 4)',
            vocabulary_level: 'Intermediate Phrases',
            recommended_start: 'Stage 3: Sentence Formation',
            date: '2 Days Ago'
        }
    ];

    const curriculumData = [
        {
            id: 'NODE-101',
            stage: 'Stage 1: Alphabet & Sounds',
            title: 'Hindi Swar (Vowels) & Vyanjan (Consonants)',
            xp_reward: 50,
            type: 'Alphabet Master',
            status: 'Unlocked / In Progress'
        },
        {
            id: 'NODE-102',
            stage: 'Stage 2: Simple Words',
            title: '2-Letter & 3-Letter Word Vocabulary',
            xp_reward: 60,
            type: 'Word Recognition',
            status: 'Locked'
        },
        {
            id: 'NODE-103',
            stage: 'Stage 3: Everyday Sentences',
            title: 'Basic Greetings & Everyday Communication',
            xp_reward: 75,
            type: 'Conversation Practice',
            status: 'Locked'
        }
    ];

    const voiceData = [
        {
            id: 'V-501',
            learner: profile?.full_name || 'Test Learner',
            phrase: 'शुभप्रभात! आप आज कैसे हैं?',
            target_lang: 'Hindi',
            clarity_score: '90%',
            rating: 'Excellent Pronunciation',
            time: '10 mins ago'
        },
        {
            id: 'V-502',
            learner: profile?.full_name || 'Test Learner',
            phrase: 'శుభోదయం! మీరు ఈ రోజు ఎలా ఉన్నారు?',
            target_lang: 'Telugu',
            clarity_score: '85%',
            rating: 'Good Effort',
            time: 'Yesterday'
        }
    ];

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-xl border border-indigo-800/40">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                            leftIcon={<ArrowLeft className="w-4 h-4" />}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            Back
                        </Button>
                        <Badge variant="teal" size="md" className="font-extrabold gap-1.5 bg-teal-400 text-slate-950">
                            <Database className="w-4 h-4" /> Live Django Database Explorer
                        </Badge>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight pt-2">
                        🗄️ Database Tables & Data Inspector
                    </h1>
                    <p className="text-xs text-slate-300">
                        View active database models, user profiles, diagnostic assessment logs, and seed tables.
                    </p>
                </div>

                {/* Direct Django Admin Link */}
                <a
                    href="http://127.0.0.1:8000/admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-transform hover:scale-105 shrink-0"
                >
                    <Shield className="w-4 h-4" /> Open Django Admin Console <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                {[
                    { key: 'profiles', label: '👥 Users & Profiles', icon: Users, count: profilesData.length },
                    { key: 'assessments', label: '📚 Baseline Assessments', icon: BookOpen, count: assessmentData.length },
                    { key: 'curriculum', label: '🗺️ Curriculum Nodes', icon: Map, count: curriculumData.length },
                    { key: 'voice', label: '🎙️ Voice Practice Logs', icon: Mic, count: voiceData.length },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all ${activeTab === tab.key
                            ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-300'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-800 border">
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Live Interactive Table Card */}
            <Card className="p-6 shadow-xl border-slate-200 bg-white space-y-4 rounded-3xl">
                {/* Search Bar */}
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        Backend API: <code className="bg-slate-100 px-2 py-1 rounded text-slate-800 font-mono">http://127.0.0.1:8000/api/</code>
                    </span>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    {activeTab === 'profiles' && (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                                    <th className="p-3 rounded-tl-xl">ID</th>
                                    <th className="p-3">Learner Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Comfortable Language</th>
                                    <th className="p-3">Learning Target</th>
                                    <th className="p-3">Qualification</th>
                                    <th className="p-3">Age Group</th>
                                    <th className="p-3">XP</th>
                                    <th className="p-3 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {profilesData.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 font-mono font-bold text-brand-600">#{row.id}</td>
                                        <td className="p-3 font-extrabold text-slate-900">{row.full_name}</td>
                                        <td className="p-3 text-slate-500">{row.email}</td>
                                        <td className="p-3">{row.native_language}</td>
                                        <td className="p-3 font-bold text-amber-600">{row.target_language}</td>
                                        <td className="p-3">{row.qualification}</td>
                                        <td className="p-3">{row.age_group}</td>
                                        <td className="p-3 font-extrabold text-teal-600">{row.xp} XP</td>
                                        <td className="p-3">
                                            <span className="px-2 py-1 bg-teal-100 text-teal-800 font-bold rounded-lg text-[10px]">
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'assessments' && (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                                    <th className="p-3 rounded-tl-xl">Test ID</th>
                                    <th className="p-3">Learner</th>
                                    <th className="p-3">Target Language</th>
                                    <th className="p-3">Overall Score</th>
                                    <th className="p-3">Reading Baseline</th>
                                    <th className="p-3">Vocabulary Level</th>
                                    <th className="p-3 rounded-tr-xl">Assigned Starting Path</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {assessmentData.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 font-mono font-bold text-brand-600">#{row.id}</td>
                                        <td className="p-3 font-extrabold text-slate-900">{row.learner}</td>
                                        <td className="p-3 font-bold text-amber-600">{row.target_lang}</td>
                                        <td className="p-3 font-extrabold text-teal-600">{row.overall_score}</td>
                                        <td className="p-3">{row.reading_level}</td>
                                        <td className="p-3">{row.vocabulary_level}</td>
                                        <td className="p-3 font-bold text-brand-700">{row.recommended_start}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'curriculum' && (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                                    <th className="p-3 rounded-tl-xl">Node ID</th>
                                    <th className="p-3">Curriculum Stage</th>
                                    <th className="p-3">Lesson Title</th>
                                    <th className="p-3">Node Type</th>
                                    <th className="p-3">XP Reward</th>
                                    <th className="p-3 rounded-tr-xl">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {curriculumData.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 font-mono font-bold text-brand-600">{row.id}</td>
                                        <td className="p-3 font-extrabold text-slate-900">{row.stage}</td>
                                        <td className="p-3 font-medium text-slate-800">{row.title}</td>
                                        <td className="p-3"><span className="px-2 py-0.5 bg-slate-100 border rounded">{row.type}</span></td>
                                        <td className="p-3 font-extrabold text-amber-600">+{row.xp_reward} XP</td>
                                        <td className="p-3 font-bold text-teal-600">{row.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeTab === 'voice' && (
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-slate-900 text-white font-bold border-b border-slate-800">
                                    <th className="p-3 rounded-tl-xl">Log ID</th>
                                    <th className="p-3">Learner</th>
                                    <th className="p-3">Target Phrase</th>
                                    <th className="p-3">Language</th>
                                    <th className="p-3">STT Clarity Score</th>
                                    <th className="p-3 rounded-tr-xl">AI Feedback Rating</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                {voiceData.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50 transition">
                                        <td className="p-3 font-mono font-bold text-brand-600">{row.id}</td>
                                        <td className="p-3 font-extrabold text-slate-900">{row.learner}</td>
                                        <td className="p-3 font-extrabold text-amber-700">{row.phrase}</td>
                                        <td className="p-3">{row.target_lang}</td>
                                        <td className="p-3 font-extrabold text-teal-600">{row.clarity_score}</td>
                                        <td className="p-3 font-bold text-brand-700">{row.rating}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};
