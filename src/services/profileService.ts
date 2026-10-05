import { apiClient } from './api';
import { StorageService, MOCK_PROFILE } from './mockData';
import { LearnerProfile, LearnerProficiency } from '../types';

export const profileService = {
    async getProfile(): Promise<LearnerProfile> {
        try {
            const profile = await apiClient.get<LearnerProfile>('/profile/');
            StorageService.setProfile(profile);
            return profile;
        } catch (err: any) {
            if (err.message === 'BACKEND_OFFLINE') {
                const storedProfile = StorageService.getProfile();
                if (storedProfile) return storedProfile;
                // Fallback seed profile
                StorageService.setProfile(MOCK_PROFILE);
                return MOCK_PROFILE;
            }
            throw err;
        }
    },

    async updateProficiency(proficiency: LearnerProficiency): Promise<LearnerProfile> {
        try {
            const updatedProfile = await apiClient.put<LearnerProfile>('/proficiency/', proficiency);
            StorageService.setProfile(updatedProfile);
            return updatedProfile;
        } catch (err: any) {
            if (err.message === 'BACKEND_OFFLINE') {
                const current = StorageService.getProfile() || MOCK_PROFILE;
                const updated: LearnerProfile = {
                    ...current,
                    proficiency,
                    updated_at: new Date().toISOString(),
                };
                StorageService.setProfile(updated);
                return updated;
            }
            throw err;
        }
    },

    async updateProfile(data: Record<string, any>): Promise<LearnerProfile> {
        try {
            const updatedProfile = await apiClient.put<LearnerProfile>('/profile/', data);
            StorageService.setProfile(updatedProfile);
            return updatedProfile;
        } catch (err: any) {
            if (err.message === 'BACKEND_OFFLINE') {
                const current = StorageService.getProfile() || MOCK_PROFILE;
                const updated: LearnerProfile = {
                    ...current,
                    ...data,
                    updated_at: new Date().toISOString(),
                };
                StorageService.setProfile(updated);
                return updated;
            }
            throw err;
        }
    }
};
