import { Language, LearnerProfile, User } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
    { id: '1', code: 'en', name: 'English', nativeName: 'English', flagEmoji: '🇬🇧', popular: true },
    { id: '2', code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flagEmoji: '🇮🇳', popular: true },
    { id: '3', code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flagEmoji: '🇮🇳', popular: true },
    { id: '4', code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flagEmoji: '🇮🇳', popular: true },
    { id: '5', code: 'kn', name: 'Kannada', nativeName: 'கன்னட / ಕನ್ನಡ', flagEmoji: '🇮🇳', popular: false },
    { id: '6', code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flagEmoji: '🇮🇳', popular: false },
];

export const MOCK_USER: User = {
    id: 'usr_101',
    email: 'learner@lingopath.ai',
    full_name: 'Geetha Swaminathan',
    created_at: new Date().toISOString(),
};

export const MOCK_PROFILE: LearnerProfile = {
    id: 'prof_201',
    user_id: 'usr_101',
    full_name: 'Geetha Swaminathan',
    email: 'learner@lingopath.ai',
    age_group: '26–40',
    comfortable_language: SUPPORTED_LANGUAGES[1], // Telugu
    target_language: SUPPORTED_LANGUAGES[0], // English
    learning_goals: ['Reading', 'Speaking', 'Vocabulary'],
    proficiency: {
        reading_level: 'Intermediate',
        writing_level: 'Beginner',
        vocabulary_level: 'Advanced',
        speaking_level: 'Basic',
        overall_level: 'Basic',
        updated_at: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
};

// Storage keys
const STORAGE_KEY_AUTH_TOKEN = 'lingopath_auth_token';
const STORAGE_KEY_CURRENT_USER = 'lingopath_current_user';
const STORAGE_KEY_CURRENT_PROFILE = 'lingopath_current_profile';

export const StorageService = {
    getAuthToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
    },
    setAuthToken: (token: string): void => {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
    },
    clearAuthToken: (): void => {
        localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    },

    getCurrentUser: (): User | null => {
        const data = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },
    setCurrentUser: (user: User): void => {
        localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
    },

    getProfile: (): LearnerProfile | null => {
        const data = localStorage.getItem(STORAGE_KEY_CURRENT_PROFILE);
        if (!data) return null;
        try {
            return JSON.parse(data);
        } catch {
            return null;
        }
    },
    setProfile: (profile: LearnerProfile): void => {
        localStorage.setItem(STORAGE_KEY_CURRENT_PROFILE, JSON.stringify(profile));
    },

    clearAll: (): void => {
        localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
        localStorage.removeItem(STORAGE_KEY_CURRENT_PROFILE);
    }
};
