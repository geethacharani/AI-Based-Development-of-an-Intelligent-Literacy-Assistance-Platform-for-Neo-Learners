import { apiClient } from './api';
import { StorageService, MOCK_USER, MOCK_PROFILE } from './mockData';
import { AuthResponse, FullOnboardingData, LearnerProfile, User } from '../types';

export const authService = {
    async register(onboardingData: FullOnboardingData): Promise<AuthResponse> {
        const payload = {
            full_name: onboardingData.account.full_name,
            email: onboardingData.account.email,
            password: onboardingData.account.password,
            age_group: onboardingData.basicInfo.age_group || '26–40',
            qualification: onboardingData.basicInfo.qualification || 'Secondary School',
            comfortable_language_id: onboardingData.comfortableLanguage?.id || 'lang_te',
            target_language_id: onboardingData.targetLanguage?.id || 'lang_en',
            learning_goals: onboardingData.basicInfo.learning_goals || [],
            proficiency: {
                reading_level: onboardingData.proficiency.reading_level || 'Intermediate',
                writing_level: onboardingData.proficiency.writing_level || 'Beginner',
                vocabulary_level: onboardingData.proficiency.vocabulary_level || 'Advanced',
                speaking_level: onboardingData.proficiency.speaking_level || 'Basic',
            },
        };

        try {
            const response = await apiClient.post<AuthResponse>('/auth/register/', payload);
            StorageService.setAuthToken(response.token);
            StorageService.setCurrentUser(response.user);
            if (response.profile) {
                StorageService.setProfile(response.profile);
            }
            return response;
        } catch (err: any) {
            const isOffline =
                !err ||
                err.message === 'BACKEND_OFFLINE' ||
                err.message?.includes('405') ||
                err.message?.includes('404') ||
                err.message?.includes('500') ||
                err.message?.includes('502') ||
                err.message?.includes('503') ||
                err.message?.includes('Failed to fetch') ||
                err.message?.includes('NetworkError');

            if (isOffline) {
                // Fallback to local storage persistence for standalone frontend execution
                const newUser: User = {
                    id: `usr_${Date.now()}`,
                    email: onboardingData.account.email,
                    full_name: onboardingData.account.full_name,
                    created_at: new Date().toISOString(),
                };

                const defaultLang = { id: 'lang_en', code: 'en', name: 'English', nativeName: 'English', flagEmoji: '🇬🇧' };

                const newProfile: LearnerProfile = {
                    id: `prof_${Date.now()}`,
                    user_id: newUser.id,
                    full_name: onboardingData.account.full_name,
                    email: onboardingData.account.email,
                    age_group: onboardingData.basicInfo.age_group || '26–40',
                    qualification: onboardingData.basicInfo.qualification || 'Secondary School',
                    comfortable_language: onboardingData.comfortableLanguage || defaultLang,
                    target_language: onboardingData.targetLanguage || defaultLang,
                    learning_goals: onboardingData.basicInfo.learning_goals || ['Reading', 'Speaking'],
                    proficiency: {
                        reading_level: onboardingData.proficiency.reading_level || 'Intermediate',
                        writing_level: onboardingData.proficiency.writing_level || 'Beginner',
                        vocabulary_level: onboardingData.proficiency.vocabulary_level || 'Advanced',
                        speaking_level: onboardingData.proficiency.speaking_level || 'Basic',
                    },
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };

                const token = `mock_token_${Date.now()}`;
                StorageService.setAuthToken(token);
                StorageService.setCurrentUser(newUser);
                StorageService.setProfile(newProfile);

                return {
                    token,
                    user: newUser,
                    profile: newProfile,
                };
            }
            throw err;
        }
    },

    async login(email: string, password: string): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login/', { email, password });
            StorageService.setAuthToken(response.token);
            StorageService.setCurrentUser(response.user);
            if (response.profile) {
                StorageService.setProfile(response.profile);
            }
            return response;
        } catch (err: any) {
            const isOffline =
                !err ||
                err.message === 'BACKEND_OFFLINE' ||
                err.message?.includes('405') ||
                err.message?.includes('404') ||
                err.message?.includes('500') ||
                err.message?.includes('502') ||
                err.message?.includes('503') ||
                err.message?.includes('Failed to fetch') ||
                err.message?.includes('NetworkError');

            if (isOffline) {
                // Check if saved profile matches or fallback to mock user
                const existingProfile = StorageService.getProfile();
                let user = StorageService.getCurrentUser();
                let profile = existingProfile;

                if (!user || !profile) {
                    user = { ...MOCK_USER, email: email || MOCK_USER.email };
                    profile = { ...MOCK_PROFILE, email: email || MOCK_PROFILE.email };
                }

                const token = `mock_token_${Date.now()}`;
                StorageService.setAuthToken(token);
                StorageService.setCurrentUser(user);
                StorageService.setProfile(profile);

                return { token, user, profile };
            }
            throw err;
        }
    },

    async logout(): Promise<void> {
        try {
            await apiClient.post('/auth/logout/', {});
        } catch {
            // Ignore network errors during logout
        } finally {
            StorageService.clearAll();
        }
    },

    getCurrentUser(): User | null {
        return StorageService.getCurrentUser();
    },

    getStoredToken(): string | null {
        return StorageService.getAuthToken();
    }
};
