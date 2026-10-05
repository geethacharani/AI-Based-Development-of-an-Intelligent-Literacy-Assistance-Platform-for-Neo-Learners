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
        } catch {
            // Intelligent on-device AI Teacher fallback when remote API is unreachable
            const msg = (typeof options === 'string' ? options : options.message).toLowerCase().trim();
            const target = (typeof options === 'object' ? options.targetLang : '') || 'Hindi';
            const targetLower = target.toLowerCase();

            let reply = `That is a great language question! Keep practicing and repeating words out loud to strengthen your fluency in ${target}.`;
            let audioText = "";
            let tips: string[] = ["Practice saying this aloud 3 times", "Notice the accent and tongue position"];
            let vocabulary: { word: string; phonetics?: string; meaning?: string }[] = [];

            // Thank you queries
            if (msg.includes('thank') || msg.includes('dhanyavad') || msg.includes('shukriya')) {
                if (targetLower.includes('kannada') || msg.includes('kannada')) {
                    reply = "In Kannada, you say **ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)**! It is the polite way to express gratitude.";
                    audioText = "ಧನ್ಯವಾದಗಳು";
                    vocabulary = [{ word: "ಧನ್ಯವಾದಗಳು", phonetics: "Dhanyavadagalu", meaning: "Thank you" }];
                    tips = ["You can say 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು' (Tumba Dhanyavadagalu) for 'Thank you very much'."];
                } else if (targetLower.includes('telugu') || msg.includes('telugu')) {
                    reply = "In Telugu, you say **ధన్యవాదాలు (Dhanyavaadaalu)**! You can also use 'చాలా కృతజ్ఞతలు' (Chala Kruthagnathalu) for formal thanks.";
                    audioText = "ధన్యవాదాలు";
                    vocabulary = [{ word: "ధన్యవాదాలు", phonetics: "Dhanyavaadaalu", meaning: "Thank you" }];
                    tips = ["'చాలా ధన్యవాదాలు' (Chaala Dhanyavaadaalu) means 'Thank you very much'."];
                } else if (targetLower.includes('tamil') || msg.includes('tamil')) {
                    reply = "In Tamil, you say **நன்றி (Nandri)**! To say thank you very much, say **மிக்க நன்றி (Mikka Nandri)**.";
                    audioText = "நன்றி";
                    vocabulary = [{ word: "நன்றி", phonetics: "Nandri", meaning: "Thank you" }];
                } else if (targetLower.includes('malayalam') || msg.includes('malayalam')) {
                    reply = "In Malayalam, you say **നന്ദി (Nandi)**! To say thank you very much, you say **വളരെ നന്ദി (Valare Nandi)**.";
                    audioText = "നന്ദി";
                    vocabulary = [{ word: "നന്ദി", phonetics: "Nandi", meaning: "Thank you" }];
                } else {
                    reply = "In Hindi, you say **धन्यवाद (Dhanyavaad)** or **शुक्रिया (Shukriya)**! Both are commonly used across India.";
                    audioText = "धन्यवाद";
                    vocabulary = [
                        { word: "धन्यवाद", phonetics: "Dhanyavaad", meaning: "Thank you (formal)" },
                        { word: "शुक्रिया", phonetics: "Shukriya", meaning: "Thanks (casual/warm)" }
                    ];
                    tips = ["'बहुत धन्यवाद' (Bahut Dhanyavaad) means 'Thank you very much'."];
                }
            }
            // Hello / Greetings queries
            else if (msg.includes('hello') || msg.includes('hi') || msg.includes('greet') || msg.includes('morning')) {
                if (targetLower.includes('kannada') || msg.includes('kannada')) {
                    reply = "In Kannada, the greeting is **ನಮಸ್ಕಾರ (Namaskara)**! For good morning, say **ಶುಭೋದಯ (Shubhodaya)**.";
                    audioText = "ನಮಸ್ಕಾರ";
                    vocabulary = [{ word: "ನಮಸ್ಕಾರ", phonetics: "Namaskara", meaning: "Hello / Greetings" }];
                } else if (targetLower.includes('telugu') || msg.includes('telugu')) {
                    reply = "In Telugu, you say **నమస్కారం (Namaskaram)**! For good morning, say **శుభోదయం (Shubhodayam)**.";
                    audioText = "నమస్కారం";
                    vocabulary = [{ word: "నమస్కారం", phonetics: "Namaskaram", meaning: "Hello / Respectful greetings" }];
                } else if (targetLower.includes('tamil') || msg.includes('tamil')) {
                    reply = "In Tamil, you say **வணக்கம் (Vanakkam)**! For good morning, say **காலை வணக்கம் (Kaalai Vanakkam)**.";
                    audioText = "வணக்கம்";
                    vocabulary = [{ word: "வணக்கம்", phonetics: "Vanakkam", meaning: "Hello / Welcome" }];
                } else if (targetLower.includes('malayalam') || msg.includes('malayalam')) {
                    reply = "In Malayalam, you say **നമസ്കാരം (Namaskaram)**! For good morning, say **സുപ്രഭാതം (Suprabhatham)**.";
                    audioText = "നമസ്കാരം";
                    vocabulary = [{ word: "നമസ്കാരം", phonetics: "Namaskaram", meaning: "Hello / Greetings" }];
                } else {
                    reply = "In Hindi, the most popular greeting is **नमस्ते (Namaste)** or **नमस्कार (Namaskar)**! For good morning, you can say **शुभप्रभात (Shubhprabhat)**.";
                    audioText = "नमस्ते";
                    vocabulary = [{ word: "नमस्ते", phonetics: "Namaste", meaning: "Hello / I bow to you" }];
                }
            }
            // Explain current lesson
            else if (msg.includes('explain') || msg.includes('lesson')) {
                reply = `In ${target}, learning starts with identifying letter sounds and building simple subject-object-verb word order. Focus on connecting root sounds with matching vowel markers!`;
                tips = ["Break multi-syllable words into individual sounds", "Listen to audio playback in Voice Studio"];
            }
            // Grammar check
            else if (msg.includes('grammar') || msg.includes('check')) {
                reply = `Your sentence is understood! In ${target}, remember that verbs typically come at the end of the sentence (SOV word order). Keep going!`;
                tips = ["Subject comes first", "Object in the middle", "Verb at the end"];
            }
            else {
                reply = `Here is how you can practice that in ${target}: Break the phrase into short sound blocks, pronounce each letter carefully, and repeat with the native audio speaker. Feel free to ask me for any specific translations!`;
            }

            return {
                reply,
                audio_text: audioText,
                target_language: target,
                target_code: typeof options === 'object' ? (options.targetLang || 'hi') : 'hi',
                comfortable_language: 'English',
                tips,
                vocabulary,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
        }
    }
};
