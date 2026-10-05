import { apiClient } from './api';
import { LearningPathUnit, LearnerProgress, FeedItem } from '../types';
import { curriculumService } from './curriculumService';

export const learningPathService = {
    async getLearningPath(targetLangCode: string = 'hi', comfortLangCode: string = 'en'): Promise<{ units: LearningPathUnit[]; progress: LearnerProgress }> {
        try {
            return await apiClient.get<{ units: LearningPathUnit[]; progress: LearnerProgress }>(`/learning-path/?target=${targetLangCode}&comfort=${comfortLangCode}`);
        } catch (err: any) {
            const fallbackUnits = curriculumService.generateCurriculum(targetLangCode, comfortLangCode, 'beginner');

            const fallbackProgress: LearnerProgress = {
                xp_total: 220,
                streak_count: 5,
                completed_lessons: ['node_alpha_1'],
                unlocked_nodes: ['node_alpha_1', 'node_alpha_2'],
                last_activity_date: new Date().toISOString()
            };

            return { units: fallbackUnits, progress: fallbackProgress };
        }
    },

    async completeLesson(nodeId: string): Promise<{ xp_earned: number; total_xp: number; streak_count: number }> {
        try {
            return await apiClient.post<{ xp_earned: number; total_xp: number; streak_count: number }>('/lessons/submit/', { node_id: nodeId });
        } catch (err: any) {
            return { xp_earned: 50, total_xp: 220, streak_count: 5 };
        }
    },

    getFeedItems(): FeedItem[] {
        return [
            {
                id: 'feed_1',
                learner_name: 'Geetha C.',
                avatar_initial: 'G',
                time_ago: '2 hours ago',
                achievement_type: 'milestone',
                content: 'Completed the Reading Basics unit milestone! 🏆',
                celebrate_count: 12,
            },
            {
                id: 'feed_2',
                learner_name: 'Anand K.',
                avatar_initial: 'A',
                time_ago: '5 hours ago',
                achievement_type: 'streak',
                content: 'Reached a 7-day learning streak! 🔥',
                celebrate_count: 8,
            },
            {
                id: 'feed_3',
                learner_name: 'Sunita M.',
                avatar_initial: 'S',
                time_ago: '1 day ago',
                achievement_type: 'speaking',
                content: 'Spoke 50 new phrases in English voice practice! 🎙️',
                celebrate_count: 15,
            }
        ];
    }
};
