import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LearnerProfile } from '../types';
import { authService } from '../services/authService';
import { profileService } from '../services/profileService';
import { StorageService, SUPPORTED_LANGUAGES } from '../services/mockData';

interface AuthContextType {
    user: User | null;
    profile: LearnerProfile | null;
    guestLanguage: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setProfileState: (profile: LearnerProfile) => void;
    updateSupportLanguage: (code: string) => Promise<void>;
    updateTargetLanguage: (code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<LearnerProfile | null>(null);
    const [guestLanguage, setGuestLanguage] = useState<string>(() => {
        return (typeof window !== 'undefined' && localStorage.getItem('lingo_interface_lang')) || 'en';
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = StorageService.getCurrentUser();
            const storedProfile = StorageService.getProfile();
            const token = StorageService.getAuthToken();

            if (token && storedUser) {
                setUser(storedUser);
                if (storedProfile) {
                    setProfile(storedProfile);
                } else {
                    try {
                        const fetchedProfile = await profileService.getProfile();
                        setProfile(fetchedProfile);
                    } catch {
                        // Ignore if profile fetch fails on init
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, pass: string) => {
        const res = await authService.login(email, pass);
        setUser(res.user);
        if (res.profile) {
            setProfile(res.profile);
        } else {
            const fetched = await profileService.getProfile();
            setProfile(fetched);
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setProfile(null);
    };

    const refreshProfile = async () => {
        const fetched = await profileService.getProfile();
        setProfile(fetched);
    };

    const setProfileState = (newProfile: LearnerProfile) => {
        setProfile(newProfile);
        StorageService.setProfile(newProfile);
    };

    const updateSupportLanguage = async (code: string) => {
        setGuestLanguage(code);
        if (typeof window !== 'undefined') {
            localStorage.setItem('lingo_interface_lang', code);
        }

        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === code) || {
            id: code,
            code: code,
            name: code.toUpperCase(),
            nativeName: code,
            flagEmoji: '🌐'
        };

        // Optimistically update local profile state immediately
        if (profile) {
            const optimisticProf = {
                ...profile,
                comfortable_language: langObj
            };
            setProfile(optimisticProf);
            StorageService.setProfile(optimisticProf);
        }

        try {
            const updated = await profileService.updateProfile({ comfortable_language_code: code } as any);
            if (updated && updated.comfortable_language) {
                const mergedProf = {
                    ...updated,
                    comfortable_language: {
                        ...updated.comfortable_language,
                        flagEmoji: (updated.comfortable_language as any).flag_emoji || (updated.comfortable_language as any).flagEmoji || langObj.flagEmoji,
                        nativeName: (updated.comfortable_language as any).native_name || (updated.comfortable_language as any).nativeName || langObj.nativeName,
                    }
                };
                setProfile(mergedProf);
                StorageService.setProfile(mergedProf);
            }
        } catch (err) {
            // Local fallback already saved above
        }
    };

    const updateTargetLanguage = async (code: string) => {
        const langObj = SUPPORTED_LANGUAGES.find(l => l.code === code) || {
            id: code,
            code: code,
            name: code.toUpperCase(),
            nativeName: code,
            flagEmoji: '🌐'
        };

        if (profile) {
            const optimisticProf = {
                ...profile,
                target_language: langObj
            };
            setProfile(optimisticProf);
            StorageService.setProfile(optimisticProf);
        }

        try {
            const updated = await profileService.updateProfile({ target_language_code: code } as any);
            if (updated && updated.target_language) {
                const mergedProf = {
                    ...updated,
                    target_language: {
                        ...updated.target_language,
                        flagEmoji: (updated.target_language as any).flag_emoji || (updated.target_language as any).flagEmoji || langObj.flagEmoji,
                        nativeName: (updated.target_language as any).native_name || (updated.target_language as any).nativeName || langObj.nativeName,
                    }
                };
                setProfile(mergedProf);
                StorageService.setProfile(mergedProf);
            }
        } catch (err) {
            // Local fallback already saved above
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                guestLanguage,
                isAuthenticated: !!user,
                isLoading,
                login,
                logout,
                refreshProfile,
                setProfileState,
                updateSupportLanguage,
                updateTargetLanguage,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
