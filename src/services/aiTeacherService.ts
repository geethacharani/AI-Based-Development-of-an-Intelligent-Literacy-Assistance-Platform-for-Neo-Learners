import { api } from './api';

export interface ChatMessage {
    id: string;
    sender: 'user' | 'teacher';
    text: string;
    audioText?: string;
    targetLang?: string;
    tips?: string[];
    correction?: string;
    vocabulary?: { word: string; phonetics?: string; meaning?: string }[];
    isError?: boolean;
    timestamp: string;
}

export interface ChatResponse {
    reply: string;
    audio_text?: string;
    target_language: string;
    target_code: string;
    comfortable_language: string;
    tips?: string[];
    correction?: string;
    vocabulary?: { word: string; phonetics?: string; meaning?: string }[];
    timestamp: string;
    error?: string;
}

export interface SendMessageOptions {
    message: string;
    history?: { sender: 'user' | 'teacher'; text: string }[];
    context?: string;
    interfaceLang?: string;
    targetLang?: string;
    proficiency?: string;
}

export const aiTeacherService = {
    async sendMessage(options: SendMessageOptions | string, context: string = 'general'): Promise<ChatResponse> {
        const payload = typeof options === 'string'
            ? { message: options, context }
            : {
                message: options.message,
                history: options.history || [],
                context: options.context || 'general',
                interface_language: options.interfaceLang,
                target_language: options.targetLang,
                learner_proficiency: options.proficiency
            };

        try {
            const res = await api.post<ChatResponse>('/ai-teacher/chat/', payload);
            return res;
        } catch (err: any) {
            const errorMsg = err?.response?.data?.error || err?.message || 'AI Teacher is temporarily unavailable. Please try again.';
            const customErr = new Error(errorMsg);
            (customErr as any).detail = err?.response?.data?.detail;
            (customErr as any).retryAllowed = true;
            throw customErr;
        }
    }
};
