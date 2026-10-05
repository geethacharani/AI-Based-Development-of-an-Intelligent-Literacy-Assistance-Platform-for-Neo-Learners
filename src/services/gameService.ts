import { GameContentResponse, GameAttemptData } from '../types/game';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const MULTI_LANG_CONTENT: Record<string, (targetName: string, comfortName: string) => GameContentResponse> = {
    hi: (targetName, comfortName) => ({
        target_language: targetName || 'Hindi',
        target_code: 'hi',
        comfortable_language: comfortName || 'English',
        comfortable_code: 'en',
        level: 'beginner',
        games: {
            word_tetris: [
                { id: 1, letters: ['स', 'े', 'ब'], target_word: 'सेब', prompt: 'Form the Hindi word for "Apple"', options: ['सेब', 'बसे', 'बेस', 'सबे'], correct: 'सेब' },
                { id: 2, letters: ['प', 'ा', 'न', 'ी'], target_word: 'पानी', prompt: 'Form the Hindi word for "Water"', options: ['पानी', 'नापी', 'नीपा', 'आनीप'], correct: 'पानी' },
                { id: 3, letters: ['घ', 'र'], target_word: 'घर', prompt: 'Form the Hindi word for "House"', options: ['घर', 'रघ', 'गर', 'घट'], correct: 'घर' },
                { id: 4, letters: ['क', 'ि', 'त', 'ा', 'ब'], target_word: 'किताब', prompt: 'Form the Hindi word for "Book"', options: ['किताब', 'बातिक', 'ताकिब', 'किबात'], correct: 'किताब' },
                { id: 5, letters: ['म', 'ा', 'ँ'], target_word: 'माँ', prompt: 'Form the Hindi word for "Mother"', options: ['माँ', 'ँमा', 'आम', 'माँ'], correct: 'माँ' },
            ],
            memory_flip: [
                { id: 1, word: 'सेब', meaning: 'Apple', pairId: 1 },
                { id: 2, word: 'Apple', meaning: 'सेब', pairId: 1 },
                { id: 3, word: 'पानी', meaning: 'Water', pairId: 2 },
                { id: 4, word: 'Water', meaning: 'पानी', pairId: 2 },
                { id: 5, word: 'घर', meaning: 'House', pairId: 3 },
                { id: 6, word: 'House', meaning: 'घर', pairId: 3 },
                { id: 7, word: 'किताब', meaning: 'Book', pairId: 4 },
                { id: 8, word: 'Book', meaning: 'किताब', pairId: 4 },
                { id: 9, word: 'माँ', meaning: 'Mother', pairId: 5 },
                { id: 10, word: 'Mother', meaning: 'माँ', pairId: 5 },
                { id: 11, word: 'दोस्त', meaning: 'Friend', pairId: 6 },
                { id: 12, word: 'Friend', meaning: 'दोस्त', pairId: 6 },
            ],
            word_duel: {
                name: 'Shadow Boss',
                emoji: '🧟',
                maxHp: 300,
                questions: [
                    { id: 1, prompt: 'What does "नमस्ते" mean?', options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'], correct: 'Hello', damage: 60, explanation: '"नमस्ते" is the Hindi greeting for Hello!' },
                    { id: 2, prompt: 'Choose the Hindi word for "School":', options: ['स्कूल', 'घर', 'बाज़ार', 'नदी'], correct: 'स्कूल', damage: 60, explanation: '"स्कूल" (skool) means School in Hindi.' },
                    { id: 3, prompt: 'What does "धन्यवाद" mean?', options: ['Please', 'Sorry', 'Thank you', 'Welcome'], correct: 'Thank you', damage: 70, explanation: '"धन्यवाद" means Thank you — a polite expression!' },
                    { id: 4, prompt: 'Which Hindi word means "Sun"?', options: ['चाँद', 'तारा', 'सूरज', 'बादल'], correct: 'सूरज', damage: 70, explanation: '"सूरज" means Sun. "चाँद" = Moon, "तारा" = Star.' },
                    { id: 5, prompt: 'Translate: "मैं ठीक हूँ"', options: ['I am tired', 'I am fine', 'I am hungry', 'I am happy'], correct: 'I am fine', damage: 80, explanation: '"मैं ठीक हूँ" means I am fine in Hindi.' },
                ]
            },
            speed_round: [
                { id: 1, prompt: 'What does "बिल्ली" mean?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correct: 'Cat', timeLimitSeconds: 8 },
                { id: 2, prompt: '"लाल" means…', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 'Red', timeLimitSeconds: 7 },
                { id: 3, prompt: 'Hindi word for "Rain"?', options: ['धूप', 'बर्फ', 'बारिश', 'हवा'], correct: 'बारिश', timeLimitSeconds: 7 },
                { id: 4, prompt: 'What does "खाना" mean?', options: ['Sleep', 'Food', 'Play', 'Study'], correct: 'Food', timeLimitSeconds: 6 },
                { id: 5, prompt: '"पाँच" is the number…', options: ['3', '4', '5', '6'], correct: '5', timeLimitSeconds: 6 },
            ],
            word_spin: [
                {
                    id: 1,
                    prompt: 'Which word means "Good Morning" in Hindi?',
                    wheelWords: [
                        { word: 'शुभ रात्रि', meaning: 'Good Night', color: '#6366f1' },
                        { word: 'शुभ प्रभात', meaning: 'Good Morning', color: '#f59e0b' },
                        { word: 'नमस्ते', meaning: 'Hello', color: '#10b981' },
                        { word: 'अलविदा', meaning: 'Goodbye', color: '#ef4444' },
                        { word: 'धन्यवाद', meaning: 'Thank you', color: '#8b5cf6' },
                        { word: 'शुभ संध्या', meaning: 'Good Evening', color: '#06b6d4' },
                    ],
                    correct: 'शुभ प्रभात'
                },
                {
                    id: 2,
                    prompt: 'Find the Hindi word for "River"',
                    wheelWords: [
                        { word: 'पहाड़', meaning: 'Mountain', color: '#6366f1' },
                        { word: 'समुद्र', meaning: 'Ocean', color: '#06b6d4' },
                        { word: 'नदी', meaning: 'River', color: '#10b981' },
                        { word: 'जंगल', meaning: 'Forest', color: '#84cc16' },
                        { word: 'रेगिस्तान', meaning: 'Desert', color: '#f59e0b' },
                        { word: 'तालाब', meaning: 'Pond', color: '#ec4899' },
                    ],
                    correct: 'नदी'
                },
            ]
        }
    }),
    te: (targetName, comfortName) => ({
        target_language: targetName || 'Telugu',
        target_code: 'te',
        comfortable_language: comfortName || 'English',
        comfortable_code: 'en',
        level: 'beginner',
        games: {
            word_tetris: [
                { id: 1, letters: ['నీ', 'రు'], target_word: 'నీరు', prompt: 'Form the Telugu word for "Water"', options: ['నీరు', 'రునీ', 'నీల', 'పాలు'], correct: 'నీరు' },
                { id: 2, letters: ['పు', 'స్త', 'కం'], target_word: 'పుస్తకం', prompt: 'Form the Telugu word for "Book"', options: ['పుస్తకం', 'కంస్తపు', 'స్తంపుక', 'కలం'], correct: 'పుస్తకం' },
                { id: 3, letters: ['ఇ', 'ల్లు'], target_word: 'ఇల్లు', prompt: 'Form the Telugu word for "House"', options: ['ఇల్లు', 'ల్లుఇ', 'ఊరు', 'బడి'], correct: 'ఇల్లు' },
                { id: 4, letters: ['ప', 'ం', 'డు'], target_word: 'పండు', prompt: 'Form the Telugu word for "Fruit"', options: ['పండు', 'డుపం', 'పువ్వు', 'కాయ'], correct: 'పండు' },
                { id: 5, letters: ['అ', 'మ్మ'], target_word: 'అమ్మ', prompt: 'Form the Telugu word for "Mother"', options: ['అమ్మ', 'మ్మఅ', 'నాన్న', 'అక్క'], correct: 'అమ్మ' },
            ],
            memory_flip: [
                { id: 1, word: 'నీరు', meaning: 'Water', pairId: 1 },
                { id: 2, word: 'Water', meaning: 'నీరు', pairId: 1 },
                { id: 3, word: 'ఇల్లు', meaning: 'House', pairId: 2 },
                { id: 4, word: 'House', meaning: 'ఇల్లు', pairId: 2 },
                { id: 5, word: 'పుస్తకం', meaning: 'Book', pairId: 3 },
                { id: 6, word: 'Book', meaning: 'పుస్తకం', pairId: 3 },
                { id: 7, word: 'పండు', meaning: 'Fruit', pairId: 4 },
                { id: 8, word: 'Fruit', meaning: 'పండు', pairId: 4 },
                { id: 9, word: 'అమ్మ', meaning: 'Mother', pairId: 5 },
                { id: 10, word: 'Mother', meaning: 'అమ్మ', pairId: 5 },
                { id: 11, word: 'స్నేహితుడు', meaning: 'Friend', pairId: 6 },
                { id: 12, word: 'Friend', meaning: 'స్నేహితుడు', pairId: 6 },
            ],
            word_duel: {
                name: 'Shadow Boss',
                emoji: '🧟',
                maxHp: 300,
                questions: [
                    { id: 1, prompt: 'What does "నమస్కారం" mean?', options: ['Greetings / Hello', 'Goodbye', 'Thank you', 'Sorry'], correct: 'Greetings / Hello', damage: 60, explanation: '"నమస్కారం" is the polite Telugu greeting.' },
                    { id: 2, prompt: 'Choose the Telugu word for "School":', options: ['బడి / పాఠశాల', 'ఇల్లు', 'అంగడి', 'నది'], correct: 'బడి / పాఠశాల', damage: 60, explanation: '"బడి" means School.' },
                    { id: 3, prompt: 'What does "ధన్యవాదాలు" mean?', options: ['Please', 'Sorry', 'Thank you', 'Welcome'], correct: 'Thank you', damage: 70, explanation: '"ధన్యవాదాలు" means Thank you!' },
                    { id: 4, prompt: 'Which Telugu word means "Sun"?', options: ['చంద్రుడు', 'నక్షత్రం', 'సూర్యుడు', 'మేఘం'], correct: 'సూర్యుడు', damage: 70, explanation: '"సూర్యుడు" means Sun.' },
                    { id: 5, prompt: 'Translate: "నేను బాగున్నాను"', options: ['I am tired', 'I am fine', 'I am hungry', 'I am happy'], correct: 'I am fine', damage: 80, explanation: '"నేను బాగున్నాను" means I am doing well / fine.' },
                ]
            },
            speed_round: [
                { id: 1, prompt: 'What does "పిల్లి" mean in Telugu?', options: ['Dog', 'Cat', 'Bird', 'Fish'], correct: 'Cat', timeLimitSeconds: 8 },
                { id: 2, prompt: '"ఎరుపు" means…', options: ['Blue', 'Green', 'Red', 'Yellow'], correct: 'Red', timeLimitSeconds: 7 },
                { id: 3, prompt: 'Telugu word for "Rain"?', options: ['ఎండ', 'మంచు', 'వర్షం', 'గాలి'], correct: 'వర్షం', timeLimitSeconds: 7 },
                { id: 4, prompt: 'What does "ఆహారం" mean?', options: ['Sleep', 'Food', 'Play', 'Study'], correct: 'Food', timeLimitSeconds: 6 },
                { id: 5, prompt: '"ఐదు" is the number…', options: ['3', '4', '5', '6'], correct: '5', timeLimitSeconds: 6 },
            ],
            word_spin: [
                {
                    id: 1,
                    prompt: 'Which word means "Good Morning" in Telugu?',
                    wheelWords: [
                        { word: 'శుభ రాత్రి', meaning: 'Good Night', color: '#6366f1' },
                        { word: 'శుభోదయం', meaning: 'Good Morning', color: '#f59e0b' },
                        { word: 'నమస్కారం', meaning: 'Hello', color: '#10b981' },
                        { word: 'వీడ్కోలు', meaning: 'Goodbye', color: '#ef4444' },
                        { word: 'ధన్యవాదాలు', meaning: 'Thank you', color: '#8b5cf6' },
                        { word: 'శుభ సాయంత్రం', meaning: 'Good Evening', color: '#06b6d4' },
                    ],
                    correct: 'శుభోదయం'
                },
                {
                    id: 2,
                    prompt: 'Find the Telugu word for "River"',
                    wheelWords: [
                        { word: 'కొండ', meaning: 'Hill', color: '#6366f1' },
                        { word: 'సముద్రం', meaning: 'Ocean', color: '#06b6d4' },
                        { word: 'నది', meaning: 'River', color: '#10b981' },
                        { word: 'అడవి', meaning: 'Forest', color: '#84cc16' },
                        { word: 'ఎడారి', meaning: 'Desert', color: '#f59e0b' },
                        { word: 'చెరువు', meaning: 'Pond', color: '#ec4899' },
                    ],
                    correct: 'నది'
                },
            ]
        }
    }),
    en: (targetName, comfortName) => ({
        target_language: targetName || 'English',
        target_code: 'en',
        comfortable_language: comfortName || 'Telugu',
        comfortable_code: 'te',
        level: 'beginner',
        games: {
            word_tetris: [
                { id: 1, letters: ['A', 'P', 'P', 'L', 'E'], target_word: 'APPLE', prompt: 'Form the English word for Fruit', options: ['APPLE', 'PAPLE', 'LEAPP', 'PLPAE'], correct: 'APPLE' },
                { id: 2, letters: ['W', 'A', 'T', 'E', 'R'], target_word: 'WATER', prompt: 'Form the word for clear liquid', options: ['WATER', 'TAWER', 'RETWA', 'ARTWE'], correct: 'WATER' },
                { id: 3, letters: ['H', 'O', 'U', 'S', 'E'], target_word: 'HOUSE', prompt: 'Form the word for home', options: ['HOUSE', 'SEHOU', 'ESUOH', 'UESHO'], correct: 'HOUSE' },
                { id: 4, letters: ['B', 'O', 'O', 'K'], target_word: 'BOOK', prompt: 'Form the word for reading item', options: ['BOOK', 'KOOB', 'OOBK', 'OKOB'], correct: 'BOOK' },
                { id: 5, letters: ['S', 'M', 'I', 'L', 'E'], target_word: 'SMILE', prompt: 'Form the word for happy face', options: ['SMILE', 'LIMES', 'ELIMS', 'MILES'], correct: 'SMILE' },
            ],
            memory_flip: [
                { id: 1, word: 'Apple', meaning: 'Fruit', pairId: 1 },
                { id: 2, word: 'Fruit', meaning: 'Apple', pairId: 1 },
                { id: 3, word: 'Water', meaning: 'Liquid', pairId: 2 },
                { id: 4, word: 'Liquid', meaning: 'Water', pairId: 2 },
                { id: 5, word: 'House', meaning: 'Home', pairId: 3 },
                { id: 6, word: 'Home', meaning: 'House', pairId: 3 },
                { id: 7, word: 'Book', meaning: 'Reading', pairId: 4 },
                { id: 8, word: 'Reading', meaning: 'Book', pairId: 4 },
                { id: 9, word: 'Friend', meaning: 'Companion', pairId: 5 },
                { id: 10, word: 'Companion', meaning: 'Friend', pairId: 5 },
                { id: 11, word: 'Sun', meaning: 'Light', pairId: 6 },
                { id: 12, word: 'Light', meaning: 'Sun', pairId: 6 },
            ],
            word_duel: {
                name: 'Shadow Boss',
                emoji: '🧟',
                maxHp: 300,
                questions: [
                    { id: 1, prompt: 'What is the opposite of "Hot"?', options: ['Cold', 'Warm', 'Bright', 'Fast'], correct: 'Cold', damage: 60, explanation: '"Cold" is the direct antonym of "Hot".' },
                    { id: 2, prompt: 'Choose the word that means "Happy":', options: ['Joyful', 'Sad', 'Angry', 'Tired'], correct: 'Joyful', damage: 60, explanation: '"Joyful" is a synonym for "Happy".' },
                    { id: 3, prompt: 'Past tense of "Go":', options: ['Went', 'Gone', 'Going', 'Goed'], correct: 'Went', damage: 70, explanation: '"Went" is the simple past tense of "Go".' },
                    { id: 4, prompt: 'Which word means "Large"?', options: ['Huge', 'Tiny', 'Narrow', 'Short'], correct: 'Huge', damage: 70, explanation: '"Huge" means very large.' },
                    { id: 5, prompt: 'Complete: "She ___ to school every day."', options: ['goes', 'go', 'going', 'gone'], correct: 'goes', damage: 80, explanation: 'Third-person singular takes "goes".' },
                ]
            },
            speed_round: [
                { id: 1, prompt: 'A baby dog is called a…', options: ['Puppy', 'Kitten', 'Cub', 'Calf'], correct: 'Puppy', timeLimitSeconds: 7 },
                { id: 2, prompt: 'Color of the grass is…', options: ['Green', 'Blue', 'Red', 'Yellow'], correct: 'Green', timeLimitSeconds: 6 },
                { id: 3, prompt: 'Opposite of "Fast"?', options: ['Slow', 'Quick', 'Loud', 'Heavy'], correct: 'Slow', timeLimitSeconds: 6 },
                { id: 4, prompt: 'Twelve minus five is…', options: ['7', '6', '8', '5'], correct: '7', timeLimitSeconds: 5 },
                { id: 5, prompt: 'Word that rhymes with "Cat"?', options: ['Bat', 'Car', 'Dog', 'Cup'], correct: 'Bat', timeLimitSeconds: 5 },
            ],
            word_spin: [
                {
                    id: 1,
                    prompt: 'Select the polite greeting:',
                    wheelWords: [
                        { word: 'Good Morning', meaning: 'Morning greeting', color: '#f59e0b' },
                        { word: 'Goodbye', meaning: 'Farewell', color: '#ef4444' },
                        { word: 'Good Night', meaning: 'Night farewell', color: '#6366f1' },
                        { word: 'Thank You', meaning: 'Gratitude', color: '#10b981' },
                        { word: 'Please', meaning: 'Polite request', color: '#8b5cf6' },
                        { word: 'Excuse Me', meaning: 'Polite attention', color: '#06b6d4' },
                    ],
                    correct: 'Good Morning'
                },
                {
                    id: 2,
                    prompt: 'Find the natural water body:',
                    wheelWords: [
                        { word: 'River', meaning: 'Flowing water', color: '#10b981' },
                        { word: 'Mountain', meaning: 'High land', color: '#6366f1' },
                        { word: 'Forest', meaning: 'Trees', color: '#84cc16' },
                        { word: 'Desert', meaning: 'Dry land', color: '#f59e0b' },
                        { word: 'Valley', meaning: 'Low land', color: '#ec4899' },
                        { word: 'Cave', meaning: 'Hollow rock', color: '#06b6d4' },
                    ],
                    correct: 'River'
                }
            ]
        }
    })
};

const PROGRESS_KEY = 'lingopath_games_stats_v4';

const getLocal = (): Record<string, any> => {
    try {
        const stored = localStorage.getItem(PROGRESS_KEY);
        if (stored) return JSON.parse(stored);
    } catch { }
    return {
        word_tetris: { highest_score: 820, total_played: 6, total_xp: 120 },
        memory_flip: { highest_score: 450, total_played: 4, total_xp: 80 },
        word_duel: { highest_score: 280, total_played: 2, total_xp: 70 },
        speed_round: { highest_score: 510, total_played: 3, total_xp: 90 },
        word_spin: { highest_score: 360, total_played: 2, total_xp: 50 },
    };
};

const saveLocal = (key: string, data: any) => {
    const all = getLocal();
    const current = all[key] || { highest_score: 0, total_played: 0, total_xp: 0 };
    all[key] = {
        ...current,
        highest_score: Math.max(current.highest_score || 0, data.score || 0),
        total_xp: (current.total_xp || 0) + (data.xp_gained || 0),
        total_played: (current.total_played || 0) + 1,
        updated_at: new Date().toISOString()
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
};

export const gameService = {
    async getGameContent(targetLangCode: string = 'hi', comfortLangCode: string = 'en'): Promise<GameContentResponse> {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/api/games/content/`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data.games && data.games.word_tetris) {
                    return data;
                }
            }
        } catch { }

        const langKey = targetLangCode.toLowerCase();
        const generator = MULTI_LANG_CONTENT[langKey] || MULTI_LANG_CONTENT['hi'];
        return generator(targetLangCode === 'hi' ? 'Hindi' : targetLangCode === 'te' ? 'Telugu' : 'English', comfortLangCode === 'te' ? 'Telugu' : 'English');
    },

    async getGameProgress(): Promise<Record<string, any>> {
        const local = getLocal();
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/api/games/progress/`, {
                headers: { Authorization: token ? `Bearer ${token}` : '' }
            });
            if (res.ok) {
                const serverData = await res.json();
                return { ...local, ...serverData };
            }
        } catch { }
        return local;
    },

    async submitGameAttempt(attempt: GameAttemptData): Promise<void> {
        saveLocal(attempt.game_key, attempt);
        try {
            const token = localStorage.getItem('access_token');
            await fetch(`${API_BASE}/api/games/submit/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : ''
                },
                body: JSON.stringify(attempt)
            });
        } catch { }
    }
};
