export type AgeGroup =
    | 'Under 18'
    | '18–25'
    | '26–40'
    | '41–60'
    | '60+'
    | 'Prefer not to say';

export type LearningGoal =
    | 'Reading'
    | 'Writing'
    | 'Speaking'
    | 'Vocabulary'
    | 'Everyday Communication'
    | 'All-round Literacy';

export type SkillLevel = 'Beginner' | 'Basic' | 'Intermediate' | 'Advanced';

export interface LearnerProficiency {
    reading_level?: SkillLevel;
    writing_level?: SkillLevel;
    vocabulary_level?: SkillLevel;
    speaking_level?: SkillLevel;
    overall_level?: SkillLevel;
    updated_at?: string;
}

export interface Language {
    id: string;
    code: string;
    name: string;
    nativeName: string;
    flagEmoji: string;
    popular?: boolean;
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    created_at: string;
    is_staff?: boolean;
    is_superuser?: boolean;
}

export interface LearnerProfile {
    id: string;
    user_id: string;
    full_name: string;
    email: string;
    age_group?: AgeGroup;
    qualification?: string;
    comfortable_language?: Language;
    target_language?: Language;
    learning_goals?: LearningGoal[];
    proficiency?: LearnerProficiency;
    created_at: string;
    updated_at: string;
}

export interface RegistrationStep1Data {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
}

export interface RegistrationStep2Data {
    age_group?: AgeGroup;
    qualification?: string;
    learning_goals?: LearningGoal[];
}

export interface RegistrationStep3Data {
    comfortable_language?: Language;
}

export interface RegistrationStep4Data {
    target_language?: Language;
}

export interface RegistrationStep5Data {
    proficiency: LearnerProficiency;
}

export interface FullOnboardingData {
    account: RegistrationStep1Data;
    basicInfo: RegistrationStep2Data;
    comfortableLanguage?: Language | null;
    targetLanguage?: Language | null;
    proficiency: LearnerProficiency;
}

export interface AuthResponse {
    token: string;
    user: User;
    profile?: LearnerProfile;
}

export type QuestionType =
    | 'multiple_choice'
    | 'match_words'
    | 'fill_blank'
    | 'arrange_words'
    | 'reading_passage'
    | 'writing_response'
    | 'voice_speaking';

export interface QuestionOption {
    id: number;
    text: string;
    is_correct: boolean;
}

export interface Question {
    id: string;
    skill: string;
    question_type: QuestionType;
    prompt: string;
    passage?: string;
    highlight_word?: string;
    comfortable_bridge?: string;
    options: QuestionOption[];
    target_phrase?: string;
    explanation?: string;
}

export interface AILearnerInsight {
    summary_headline: string;
    reading_summary: string;
    vocabulary_summary: string;
    writing_summary: string;
    speaking_summary: string;
    recommended_focus: string;
    recommended_starting_point: string;
    generated_at?: string;
}

export type NodeType = 'reading' | 'vocabulary' | 'listening' | 'speaking' | 'quiz' | 'milestone';
export type NodeStatus = 'completed' | 'unlocked' | 'locked';

export interface LessonNode {
    id: string;
    title: string;
    subtitle: string;
    node_type: NodeType;
    order: number;
    xp_reward: number;
    status: NodeStatus;
    payload?: any;
}

export interface SectionPreview {
    whatYouWillLearn: string[];
    whyItMatters: string;
    howToUnlock: string;
}

export interface LearningPathUnit {
    id: string;
    unit_number: number;
    title: string;
    description: string;
    color_theme: 'brand' | 'teal' | 'purple' | 'amber';
    status?: 'completed' | 'current' | 'locked';
    completion_percentage?: number;
    skills?: string[];
    preview?: SectionPreview;
    unlock_requirement?: string;
    nodes: LessonNode[];
}

export interface LearnerProgress {
    xp_total: number;
    streak_count: number;
    completed_lessons: string[];
    unlocked_nodes: string[];
    last_activity_date?: string;
}

export interface VoiceAnalysisResult {
    transcription: string;
    pronunciation_score: number;
    accuracy_rating: string;
    feedback: string;
    phonetic_breakdown?: { word: string; clarity: string }[];
}

export interface FeedItem {
    id: string;
    learner_name: string;
    avatar_initial: string;
    time_ago: string;
    achievement_type: 'milestone' | 'streak' | 'words' | 'speaking';
    content: string;
    celebrate_count: number;
}

