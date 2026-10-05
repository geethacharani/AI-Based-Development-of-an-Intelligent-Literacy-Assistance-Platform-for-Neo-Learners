import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminLearnersTab } from '../components/admin/AdminLearnersTab';
import { AdminAssessmentsTab } from '../components/admin/AdminAssessmentsTab';
import { AdminAssessmentResultsTab } from '../components/admin/AdminAssessmentResultsTab';
import { AdminLanguagesTab } from '../components/admin/AdminLanguagesTab';
import { AdminLearningPathsTab } from '../components/admin/AdminLearningPathsTab';
import { AdminLessonsTab } from '../components/admin/AdminLessonsTab';
import { AdminProgressMonitoringTab } from '../components/admin/AdminProgressMonitoringTab';
import { AdminReportsTab } from '../components/admin/AdminReportsTab';
import { adminService, AdminOverviewData } from '../services/adminService';

export const AdminDashboardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [overviewData, setOverviewData] = useState<AdminOverviewData | null>(null);
    const [overviewLoading, setOverviewLoading] = useState(true);

    useEffect(() => {
        setOverviewLoading(true);
        adminService.getOverview()
            .then(res => {
                setOverviewData(res);
                setOverviewLoading(false);
            })
            .catch(() => setOverviewLoading(false));
    }, []);

    const tabTitles: Record<AdminTab, string> = {
        overview: 'Platform Overview',
        learners: 'Learner Management',
        assessments: 'Assessment Questions',
        assessment_results: 'Assessment Results Audit',
        languages: 'Language Management',
        learning_paths: 'Learning Path Manager',
        lessons: 'Curriculum & Lessons',
        games: 'Puzzles & Games',
        progress: 'Progress Monitoring',
        reports: 'Reports & Analytics',
        settings: 'Settings',
    };

    const renderTab = () => {
        switch (activeTab) {
            case 'overview':
                return <AdminOverviewTab data={overviewData} isLoading={overviewLoading} />;
            case 'learners':
                return <AdminLearnersTab />;
            case 'assessments':
                return <AdminAssessmentsTab />;
            case 'assessment_results':
                return <AdminAssessmentResultsTab />;
            case 'languages':
                return <AdminLanguagesTab />;
            case 'learning_paths':
                return <AdminLearningPathsTab />;
            case 'lessons':
                return <AdminLessonsTab />;
            case 'games':
                return (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="text-center space-y-2">
                            <div className="text-4xl">🎮</div>
                            <p className="text-slate-400 text-sm">Games Management tab coming soon</p>
                        </div>
                    </div>
                );
            case 'progress':
                return <AdminProgressMonitoringTab />;
            case 'reports':
                return <AdminReportsTab />;
            case 'settings':
                return (
                    <div className="flex items-center justify-center min-h-[40vh]">
                        <div className="text-center space-y-2">
                            <div className="text-4xl">⚙️</div>
                            <p className="text-slate-400 text-sm">Admin Settings tab coming soon</p>
                        </div>
                    </div>
                );
            default:
                return <AdminOverviewTab data={overviewData} isLoading={overviewLoading} />;
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-950 text-slate-100">
            {/* Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <AdminHeader title={tabTitles[activeTab]} />

                {/* Tab Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderTab()}
                </main>
            </div>
        </div>
    );
};
