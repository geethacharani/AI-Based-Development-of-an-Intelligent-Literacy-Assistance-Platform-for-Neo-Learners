import { api } from './api';

export interface AdminOverviewStats {
    total_learners: number;
    active_learners: number;
    new_learners: number;
    completed_assessments: number;
    avg_assessment_score: number;
    learners_currently_learning: number;
    completed_lessons: number;
    total_game_plays: number;
    total_xp: number;
    avg_learner_progress: number;
    proficiency_distribution: Record<string, number>;
}

export interface AdminOverviewData {
    stats: AdminOverviewStats;
    game_activity: { game_key: string; title: string; plays: number }[];
    assessment_performance: { range: string; count: number }[];
    active_trends: { period: string; active: number }[];
}

export interface LearnerListItem {
    id: number;
    user_id: number;
    full_name: string;
    email: string;
    age_group: string;
    qualification: string;
    comfortable_language: string;
    comfortable_language_code: string;
    target_language: string;
    target_language_code: string;
    target_language_flag: string;
    proficiency_level: string;
    assessment_score: number;
    learning_level: string;
    xp: number;
    streak: number;
    lessons_completed: number;
    games_played: number;
    last_active: string;
    is_active: boolean;
    date_joined: string;
}

export interface LearnerDetailData {
    profile: {
        id: number;
        user_id: number;
        full_name: string;
        email: string;
        age_group: string;
        qualification: string;
        comfortable_language: string;
        comfortable_language_code: string;
        target_language: string;
        target_language_code: string;
        target_language_flag: string;
        is_active: boolean;
        date_joined: string;
    };
    assessment: {
        assessment_date: string;
        overall_score: number;
        proficiency_level: string;
        skill_scores: Record<string, string>;
        correct_answers: number;
        incorrect_answers: number;
        attempts: number;
        weak_areas: string[];
        strong_areas: string[];
        recommended_starting_level: string;
    };
    learning_path: {
        current_level: string;
        current_lesson: string;
        completed_lessons_count: number;
        completed_lessons: string[];
        locked_lessons_count: number;
        mastered_skills: string[];
        progress_percentage: number;
    };
    games: {
        games_played: number;
        best_scores: Record<string, number>;
        total_xp: number;
        game_wise_performance: any[];
        weak_areas_identified: string[];
    };
    progress: {
        xp: number;
        streak: number;
        badges: string[];
        achievements: string[];
        weekly_progress: { day: string; xp: number }[];
        overall_progress: number;
    };
    ai_insights: {
        headline: string;
        reading_summary: string;
        vocabulary_summary: string;
        writing_summary: string;
        speaking_summary: string;
        recommended_focus: string;
    };
}

export const adminService = {
    // Overview
    async getOverview(): Promise<AdminOverviewData> {
        try {
            return await api.get<AdminOverviewData>('/admin/overview/');
        } catch (err) {
            console.warn('Backend admin overview fetch failed, using fallback overview data:', err);
            return {
                stats: {
                    total_learners: 4,
                    active_learners: 4,
                    new_learners: 4,
                    completed_assessments: 12,
                    avg_assessment_score: 78.5,
                    learners_currently_learning: 4,
                    completed_lessons: 18,
                    total_game_plays: 25,
                    total_xp: 850,
                    avg_learner_progress: 45.0,
                    proficiency_distribution: {
                        Beginner: 2,
                        Basic: 1,
                        Intermediate: 1,
                        Advanced: 0
                    }
                },
                game_activity: [
                    { game_key: 'language_train', title: 'Language Train', plays: 10 },
                    { game_key: 'word_runner', title: 'Word Runner', plays: 8 },
                    { game_key: 'word_shooter', title: 'Word Shooter', plays: 4 },
                    { game_key: 'cooking_challenge', title: 'Cooking Challenge', plays: 2 },
                    { game_key: 'virtual_shop', title: 'Virtual Shop', plays: 1 }
                ],
                assessment_performance: [
                    { range: '0-25%', count: 0 },
                    { range: '26-50%', count: 1 },
                    { range: '51-75%', count: 2 },
                    { range: '76-100%', count: 1 }
                ],
                active_trends: [
                    { period: 'Week 1', active: 2 },
                    { period: 'Week 2', active: 3 },
                    { period: 'Week 3', active: 4 },
                    { period: 'Week 4', active: 4 }
                ]
            };
        }
    },

    // Learners
    async getLearners(params?: { q?: string; target_language?: string; proficiency?: string; status?: string }): Promise<{ learners: LearnerListItem[]; total: number }> {
        const queryParams = new URLSearchParams();
        if (params?.q) queryParams.append('q', params.q);
        if (params?.target_language) queryParams.append('target_language', params.target_language);
        if (params?.proficiency) queryParams.append('proficiency', params.proficiency);
        if (params?.status) queryParams.append('status', params.status);
        const url = `/admin/learners/?${queryParams.toString()}`;
        return api.get(url);
    },

    async createLearner(data: any): Promise<{ message: string; learner_id: number }> {
        return api.post('/admin/learners/', data);
    },

    async getLearnerDetail(pk: number): Promise<LearnerDetailData> {
        return api.get(`/admin/learners/${pk}/`);
    },

    async updateLearner(pk: number, data: any): Promise<{ message: string }> {
        return api.put(`/admin/learners/${pk}/`, data);
    },

    async deleteLearner(pk: number): Promise<{ message: string }> {
        return api.delete(`/admin/learners/${pk}/`);
    },

    async toggleLearnerActive(pk: number): Promise<{ message: string; is_active: boolean }> {
        return api.post(`/admin/learners/${pk}/toggle-active/`, {});
    },

    async resetLearnerPassword(pk: number, new_password?: string): Promise<{ message: string }> {
        return api.post(`/admin/learners/${pk}/reset-password/`, { new_password });
    },

    // Assessments
    async getQuestions(params?: { q?: string; skill?: string; target_language?: string }): Promise<{ questions: any[] }> {
        const queryParams = new URLSearchParams();
        if (params?.q) queryParams.append('q', params.q);
        if (params?.skill) queryParams.append('skill', params.skill);
        if (params?.target_language) queryParams.append('target_language', params.target_language);
        return api.get(`/admin/assessments/questions/?${queryParams.toString()}`);
    },

    async createQuestion(data: any): Promise<{ message: string; question_id: number }> {
        return api.post('/admin/assessments/questions/', data);
    },

    async updateQuestion(pk: number, data: any): Promise<{ message: string }> {
        return api.put(`/admin/assessments/questions/${pk}/`, data);
    },

    async deleteQuestion(pk: number): Promise<{ message: string }> {
        return api.delete(`/admin/assessments/questions/${pk}/`);
    },

    async getAssessmentResults(pk?: number): Promise<any> {
        const url = pk ? `/admin/assessments/results/${pk}/` : '/admin/assessments/results/';
        return api.get(url);
    },

    // Languages
    async getLanguages(): Promise<{ languages: any[] }> {
        return api.get('/admin/languages/');
    },

    async createLanguage(data: any): Promise<{ message: string; id: number }> {
        return api.post('/admin/languages/', data);
    },

    async updateLanguage(pk: number, data: any): Promise<{ message: string }> {
        return api.put(`/admin/languages/${pk}/`, data);
    },

    async deleteLanguage(pk: number): Promise<{ message: string }> {
        return api.delete(`/admin/languages/${pk}/`);
    },

    // Learning Paths
    async getLearningPaths(): Promise<{ learning_paths: any[] }> {
        return api.get('/admin/learning-paths/');
    },

    async getLearningPathDetail(learnerId: number): Promise<any> {
        return api.get(`/admin/learning-paths/${learnerId}/`);
    },

    async updateLearningPathNodes(learnerId: number, data: { completed_lessons?: string[]; unlocked_nodes?: string[] }): Promise<{ message: string }> {
        return api.post(`/admin/learning-paths/${learnerId}/edit-nodes/`, data);
    },

    async resetLearningPath(learnerId: number): Promise<{ message: string }> {
        return api.post(`/admin/learning-paths/${learnerId}/reset/`, {});
    },

    async regenerateLearningPath(learnerId: number): Promise<{ message: string }> {
        return api.post(`/admin/learning-paths/${learnerId}/regenerate/`, {});
    },

    // Lessons
    async getLessons(): Promise<{ units: any[] }> {
        return api.get('/admin/lessons/');
    },

    async createLesson(data: any): Promise<{ message: string; id: number }> {
        return api.post('/admin/lessons/', data);
    },

    async updateLesson(pk: number, data: any): Promise<{ message: string }> {
        return api.put(`/admin/lessons/${pk}/`, data);
    },

    async deleteLesson(pk: number): Promise<{ message: string }> {
        return api.delete(`/admin/lessons/${pk}/`);
    },

    // Games
    async getGames(): Promise<{ games: any[] }> {
        return api.get('/admin/games/');
    },

    async toggleGameStatus(gameKey: string): Promise<{ message: string }> {
        return api.post(`/admin/games/${gameKey}/toggle-status/`, {});
    },

    async updateGameContent(gameKey: string, content: any): Promise<{ message: string }> {
        return api.post(`/admin/games/${gameKey}/edit-content/`, { content });
    },

    // Progress Monitoring
    async getProgressMonitoring(): Promise<{ funnel_stages: any[]; learners: any[] }> {
        return api.get('/admin/progress-monitoring/');
    },

    // Reports
    async getReports(params?: { date_range?: string; language?: string; proficiency?: string }): Promise<any> {
        const queryParams = new URLSearchParams();
        if (params?.date_range) queryParams.append('date_range', params.date_range);
        if (params?.language) queryParams.append('language', params.language);
        if (params?.proficiency) queryParams.append('proficiency', params.proficiency);
        return api.get(`/admin/reports/?${queryParams.toString()}`);
    }
};
