import { api } from './api';

export interface ChallengeTask {
    id: string;
    type: 'vocabulary_match' | 'sentence_builder' | 'listening_comprehension';
    prompt: string;
    word?: string;
    options?: string[];
    correct?: string;
    scrambled?: string[];
    correct_order?: string[];
    english_meaning?: string;
    audio_text?: string;
}

export interface DailyChallenge {
    date: string;
    theme: string;
    xp_reward: number;
    target_language: string;
    tasks: ChallengeTask[];
}

export interface ChallengeSubmitResponse {
    success: boolean;
    score: number;
    xp_earned: number;
    streak_active: boolean;
    feedback: string;
}

export const dailyChallengeService = {
    async getDailyChallenge(): Promise<DailyChallenge> {
        try {
            return await api.get<DailyChallenge>('/daily-challenge/');
        } catch (err) {
            return {
                date: new Date().toISOString().split('T')[0],
                theme: "Daily Focus: 3-Minute Mastery Booster",
                xp_reward: 40,
                target_language: "Hindi",
                tasks: [
                    {
                        id: "d1",
                        type: "vocabulary_match",
                        prompt: "Match this essential word with its correct meaning:",
                        word: "पुस्तकालय / Pustakaalay",
                        options: ["Library", "Hospital", "Market", "Kitchen"],
                        correct: "Library"
                    },
                    {
                        id: "d2",
                        type: "sentence_builder",
                        prompt: "Unscramble these words to form a correct sentence:",
                        scrambled: ["हूँ", "किताब", "मैं", "पढ़ता"],
                        correct_order: ["मैं", "किताब", "पढ़ता", "हूँ"],
                        english_meaning: "I am reading a book."
                    },
                    {
                        id: "d3",
                        type: "listening_comprehension",
                        prompt: "Listen to the phrase and choose what is being asked for:",
                        audio_text: "मुझे एक गिलास ठंडा पानी चाहिए।",
                        options: ["A glass of cold water", "A cup of hot coffee", "A bowl of rice", "A bus ticket"],
                        correct: "A glass of cold water"
                    }
                ]
            };
        }
    },

    async submitChallenge(score: number, xpEarned: number): Promise<ChallengeSubmitResponse> {
        try {
            return await api.post<ChallengeSubmitResponse>('/daily-challenge/submit/', {
                score,
                xp_earned: xpEarned
            });
        } catch (err) {
            return {
                success: true,
                score,
                xp_earned: xpEarned,
                streak_active: true,
                feedback: "Fantastic job! You completed today's AI challenge with high precision."
            };
        }
    }
};
