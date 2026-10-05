export interface WordToken {
    text: string;
    romanized: string;
    meaning: string;
    isKeyWord?: boolean;
}

export interface StoryScene {
    sceneNumber: number;
    title: string;
    illustrationType: 'station' | 'cafe' | 'park' | 'market' | 'library' | 'home';
    targetDialogue: string;
    audioText: string;
    words: WordToken[];
    comprehensionQuestion?: {
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
    };
    choice?: {
        prompt: string;
        options: { label: string; nextSceneNumber: number }[];
    };
    pronunciationPrompt?: {
        sentence: string;
        romanized: string;
        tip: string;
    };
}

export interface CityStory {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    coverIcon: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Explorer';
    xpReward: number;
    estimatedMins: number;
    targetLanguage: string;
    scenes: StoryScene[];
}

export interface DetectiveClue {
    id: string;
    type: 'written' | 'audio' | 'visual' | 'message' | 'evidence';
    title: string;
    icon: string;
    targetContent: string;
    romanized: string;
    meaning: string;
    contextNote: string;
    keyVocabulary: { word: string; phonetic: string; meaning: string }[];
}

export interface DetectiveCase {
    id: string;
    caseNumber: string;
    title: string;
    location: string;
    mysteryDescription: string;
    clues: DetectiveClue[];
    deductionQuestion: string;
    deductionOptions: {
        id: string;
        text: string;
        isCorrect: boolean;
        feedback: string;
    }[];
    solvedXp: number;
    unlockedReward: string;
}

export type PlantStage = 'seed' | 'sprout' | 'flower' | 'tree';

export interface GardenPlant {
    id: string;
    word: string;
    phonetic: string;
    meaning: string;
    exampleSentence: string;
    category: 'nature' | 'food' | 'people' | 'travel' | 'action';
    stage: PlantStage;
    waterCount: number;
    maxWater: number;
    xpEarned: number;
    lastWatered?: string;
}

export interface MuseumExhibit {
    id: string;
    category: 'vocab' | 'story' | 'script' | 'sound' | 'detective';
    title: string;
    subtitle: string;
    icon: string;
    scriptText?: string;
    phonetic?: string;
    meaning?: string;
    dateUnlocked: string;
    badge?: string;
}

export interface LingoCityState {
    level: number;
    cityName: string;
    storiesCompleted: string[];
    casesSolved: string[];
    gardenMasteredCount: number;
    unlockedDecorations: string[];
}
