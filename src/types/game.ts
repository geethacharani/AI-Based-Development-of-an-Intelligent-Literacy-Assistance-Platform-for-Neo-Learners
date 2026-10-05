export type GameKey = 'word_tetris' | 'memory_flip' | 'word_duel' | 'speed_round' | 'word_spin';

export interface GameProgressItem {
    game_key: GameKey;
    highest_score: number;
    level_unlocked: number;
    total_xp: number;
    total_played: number;
    updated_at: string;
}

export interface GameAttemptData {
    id?: number;
    game_key: GameKey;
    level: number;
    score: number;
    xp_gained: number;
    correct_attempts: number;
    wrong_attempts: number;
    completed: boolean;
    skill?: string;
    created_at?: string;
}

// 1. Word Tetris (kept)
export interface TetrisBlock {
    id: number;
    letters: string[];
    target_word: string;
    prompt: string;
    options: string[];
    correct: string;
}

// 2. Memory Flip
export interface MemoryCard {
    id: number;
    word: string;
    meaning: string;
    pairId: number;
}

// 3. Word Duel
export interface DuelQuestion {
    id: number;
    prompt: string;
    options: string[];
    correct: string;
    damage: number;
    explanation: string;
}

export interface DuelBoss {
    name: string;
    emoji: string;
    maxHp: number;
    questions: DuelQuestion[];
}

// 4. Speed Round
export interface SpeedQuestion {
    id: number;
    prompt: string;
    options: string[];
    correct: string;
    timeLimitSeconds: number;
}

// 5. Word Spin
export interface SpinWord {
    word: string;
    meaning: string;
    color: string;
}

export interface SpinRound {
    id: number;
    prompt: string;
    wheelWords: SpinWord[];
    correct: string;
}

export interface GameContentResponse {
    target_language: string;
    target_code: string;
    comfortable_language: string;
    comfortable_code: string;
    level: string;
    games: {
        word_tetris: TetrisBlock[];
        memory_flip: MemoryCard[];
        word_duel: DuelBoss;
        speed_round: SpeedQuestion[];
        word_spin: SpinRound[];
    };
}
