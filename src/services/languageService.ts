import { apiClient } from './api';
import { SUPPORTED_LANGUAGES } from './mockData';
import { Language } from '../types';

export const languageService = {
    async getLanguages(): Promise<Language[]> {
        try {
            return await apiClient.get<Language[]>('/languages/');
        } catch (err: any) {
            if (err.message === 'BACKEND_OFFLINE') {
                return SUPPORTED_LANGUAGES;
            }
            return SUPPORTED_LANGUAGES;
        }
    }
};
