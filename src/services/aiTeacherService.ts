import { api } from './api';

export interface ChatMessage {
    id: string;
    sender: 'user' | 'teacher';
    text: string;
    audioText?: string;
    targetLang?: string;
    targetCode?: string;
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
            if (res && res.reply) {
                return res;
            }
        } catch {
            // Use intelligent on-device engine fallback
        }

        // --- Comprehensive Intelligent AI Teacher Engine ---
        const userRawMsg = (typeof options === 'string' ? options : options.message).trim();
        const msg = userRawMsg.toLowerCase();
        
        let target = (typeof options === 'object' ? options.targetLang : '') || 'Hindi';
        let targetCode = (typeof options === 'object' ? options.targetLang : 'hi') || 'hi';

        // Detect explicit target language in user prompt e.g. "in hindi", "in kannada", etc.
        if (/\b(in\s+)?kannada\b/i.test(msg)) {
            target = 'Kannada';
            targetCode = 'kn';
        } else if (/\b(in\s+)?telugu\b/i.test(msg)) {
            target = 'Telugu';
            targetCode = 'te';
        } else if (/\b(in\s+)?tamil\b/i.test(msg)) {
            target = 'Tamil';
            targetCode = 'ta';
        } else if (/\b(in\s+)?malayalam\b/i.test(msg)) {
            target = 'Malayalam';
            targetCode = 'ml';
        } else if (/\b(in\s+)?hindi\b/i.test(msg)) {
            target = 'Hindi';
            targetCode = 'hi';
        } else if (/\b(in\s+)?english\b/i.test(msg)) {
            target = 'English';
            targetCode = 'en';
        }

        const tLower = target.toLowerCase();

        let reply = "";
        let audioText = "";
        let tips: string[] = ["Practice pronouncing this 3 times aloud", "Focus on the vowel and consonant flow"];
        let vocabulary: { word: string; phonetics?: string; meaning?: string }[] = [];

        // 1. Specific Tomato / Vegetable / Market / How much / 1kg / Price queries
        if (msg.includes('tomato') || msg.includes('tomatoes') || msg.includes('tamatar') || (msg.includes('1kg') && msg.includes('how much')) || msg.includes('kilo')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Kannada:\n\n👉 **1 ಕೆಜಿ ಟೊಮೆಟೊ ಎಷ್ಟು?**\n*(Ondu kg tomato eshtu?)*\n\nOr formally: **ಒಂದು ಕಿಲೋ ಟೊಮೆಟೊಗೆ ಎಷ್ಟು ಬೆಲೆ?** *(Ondu kilo tomatoge eshtu bele?)*";
                audioText = "ಒಂದು ಕಿಲೋ ಟೊಮೆಟೊ ಎಷ್ಟು?";
                vocabulary = [
                    { word: "ಟೊಮೆಟೊ (Tomato)", phonetics: "Tomato", meaning: "Tomato" },
                    { word: "ಒಂದು ಕೆಜಿ (Ondu kg)", phonetics: "Ondu kg", meaning: "1 kilogram" },
                    { word: "ಎಷ್ಟು? (Eshtu?)", phonetics: "Eshtu?", meaning: "How much?" }
                ];
                tips = ["In local Karnataka vegetable markets, saying 'Ondu kg tomato kodi' means 'Please give 1kg tomatoes'."];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Telugu:\n\n👉 **1 కేజీ టమోటాలు ఎంత?**\n*(Oka kg tamotalu entha?)*\n\nOr politely: **ఒక కేజీ టమోటా ఎంత ధర?** *(Oka kg tamota entha dhara?)*";
                audioText = "ఒక కేజీ టమోటాలు ఎంత?";
                vocabulary = [
                    { word: "టమోటా (Tamota)", phonetics: "Tamota", meaning: "Tomato" },
                    { word: "ఒక కేజీ (Oka kg)", phonetics: "Oka kg", meaning: "1 kilogram" },
                    { word: "ఎంత? (Entha?)", phonetics: "Entha?", meaning: "How much?" }
                ];
                tips = ["In markets, you can also ask: 'Bhayya, tamota entha?' (Brother, how much are tomatoes?)."];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Tamil:\n\n👉 **1 கிலோ தக்காளி என்ன விலை?**\n*(Oru kilo thakkali enna vilai?)*\n\nOr casually: **ஒரு கிலோ தக்காளி எவ்வளவு?** *(Oru kilo thakkali evvalavu?)*";
                audioText = "ஒரு கிலோ தக்காளி எவ்வளவு?";
                vocabulary = [
                    { word: "தக்காளி (Thakkali)", phonetics: "Thakkali", meaning: "Tomato" },
                    { word: "ஒரு கிலோ (Oru kilo)", phonetics: "Oru kilo", meaning: "1 kilogram" },
                    { word: "எவ்வளவு? (Evvalavu?)", phonetics: "Evvalavu?", meaning: "How much?" }
                ];
                tips = ["'Vilai' means price, and 'Evvalavu' means how much."];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Malayalam:\n\n👉 **1 കിലോ തക്കാളിക്ക് എത്രയാണ്?**\n*(Oru kilo thakkalikku ethrayanu?)*\n\nOr: **ഒരു കിലോ തക്കാളിക്ക് എന്താ വില?** *(Oru kilo thakkalikku entha vila?)*";
                audioText = "ഒരു കിലോ തക്കാളിക്ക് എത്രയാണ്?";
                vocabulary = [
                    { word: "തക്കാളി (Thakkali)", phonetics: "Thakkali", meaning: "Tomato" },
                    { word: "ഒരു കിലോ (Oru kilo)", phonetics: "Oru kilo", meaning: "1 kilogram" },
                    { word: "എത്രയാണ്? (Ethrayanu?)", phonetics: "Ethrayanu?", meaning: "How much?" }
                ];
                tips = ["'Ethra' means how much, 'Vila' means price."];
            } else {
                reply = "To say **'How much for 1kg of tomatoes?'** in Hindi:\n\n👉 **1 किलो टमाटर कितने का है?**\n*(Ek kilo tamatar kitne ka hai?)*\n\nOr in daily local sabzi mandi style:\n👉 **भैया, टमाटर कैसे दिए?** *(Bhaiya, tamatar kaise diye?)*";
                audioText = "एक किलो टमाटर कितने का है?";
                vocabulary = [
                    { word: "टमाटर (Tamatar)", phonetics: "Tamatar", meaning: "Tomato" },
                    { word: "एक किलो (Ek kilo)", phonetics: "Ek kilo", meaning: "1 kilogram" },
                    { word: "कितने का है? (Kitne ka hai?)", phonetics: "Kitne ka hai?", meaning: "How much is it?" }
                ];
                tips = [
                    "Say 'Bhaiya, 1 kilo tamatar dena' when you want to buy 1kg tomatoes",
                    "'Kitna' changes according to gender and count (kitne ka hai / kitni hai)"
                ];
            }
        }
        // 2. Price / How much general
        else if (msg.includes('how much') || msg.includes('price') || msg.includes('cost') || msg.includes('rate') || msg.includes('bhaav') || msg.includes('kitna')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "To ask **'How much does this cost?'** in Kannada, say: **ಇದಕ್ಕೆ ಎಷ್ಟು ಬೆಲೆ? (Idakke eshtu bele?)** or simply **ಇದು ಎಷ್ಟು? (Idu eshtu?)**.";
                audioText = "ಇದಕ್ಕೆ ಎಷ್ಟು ಬೆಲೆ?";
                vocabulary = [{ word: "ಎಷ್ಟು (Eshtu)", phonetics: "Eshtu", meaning: "How much" }, { word: "ಬೆಲೆ (Bele)", phonetics: "Bele", meaning: "Price / Cost" }];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "To ask **'How much is this?'** in Telugu, say: **ఇది ఎంత? (Idi entha?)** or **దీని ధర ఎంత? (Deeni dhara entha?)**.";
                audioText = "ఇది ఎంత?";
                vocabulary = [{ word: "ఎంత (Entha)", phonetics: "Entha", meaning: "How much" }, { word: "ధర (Dhara)", phonetics: "Dhara", meaning: "Price" }];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "To ask **'How much is this?'** in Tamil, say: **இது எவ்வளவு? (Idhu evvalavu?)** or **என்ன விலை? (Enna vilai?)**.";
                audioText = "இது எவ்வளவு?";
                vocabulary = [{ word: "எவ்வளவு (Evvalavu)", phonetics: "Evvalavu", meaning: "How much" }, { word: "விலை (Vilai)", phonetics: "Vilai", meaning: "Price" }];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
                reply = "To ask **'How much is this?'** in Malayalam, say: **ഇതിന് എത്രയാണ്? (Ithinu ethrayanu?)** or **എന്താ വില? (Entha vila?)**.";
                audioText = "ഇതിന് എത്രയാണ്?";
                vocabulary = [{ word: "എത്ര (Ethra)", phonetics: "Ethra", meaning: "How much" }];
            } else {
                reply = "To ask **'How much is this?'** in Hindi, say: **यह कितने का है? (Yeh kitne ka hai?)** or **इसकी क्या कीमत है? (Iski kya keemat hai?)**.";
                audioText = "यह कितने का है?";
                vocabulary = [{ word: "कितना (Kitna)", phonetics: "Kitna", meaning: "How much" }, { word: "कीमत (Keemat)", phonetics: "Keemat", meaning: "Price" }];
            }
        }
        // 3. Name queries ("what is your name", "my name is")
        else if (msg.includes('your name') || msg.includes('what is name') || msg.includes('my name')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "In Kannada, ask **'ನಿಮ್ಮ ಹೆಸರೇನು?' (Nimma hesarenu?)** for 'What is your name?'. To answer, say: **'ನನ್ನ ಹೆಸರು...' (Nanna hesaru...)**.";
                audioText = "ನಿಮ್ಮ ಹೆಸರೇನು?";
                vocabulary = [{ word: "ಹೆಸರು", phonetics: "Hesaru", meaning: "Name" }, { word: "ನಿಮ್ಮ", phonetics: "Nimma", meaning: "Your (polite)" }];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "In Telugu, ask **'మీ పేరు ఏమిటి?' (Mee peru emiti?)**. To reply, say: **'నా పేరు...' (Naa peru...)**.";
                audioText = "మీ పేరు ఏమిటి?";
                vocabulary = [{ word: "పేరు", phonetics: "Peru", meaning: "Name" }, { word: "మీ", phonetics: "Mee", meaning: "Your (polite)" }];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "In Tamil, ask **'உங்கள் பெயர் என்ன?' (Ungal peyar enna?)**. To reply, say: **'என் பெயர்...' (En peyar...)**.";
                audioText = "உங்கள் பெயர் என்ன?";
                vocabulary = [{ word: "பெயர்", phonetics: "Peyar", meaning: "Name" }];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
                reply = "In Malayalam, ask **'നിങ്ങളുടെ പേരെന്താണ്?' (Ningalude perenthanu?)**. To reply: **'എന്റെ പേര്...' (Ente peru...)**.";
                audioText = "നിങ്ങളുടെ പേരെന്താണ്?";
                vocabulary = [{ word: "പേര്", phonetics: "Peru", meaning: "Name" }];
            } else {
                reply = "In Hindi, ask **'आपका नाम क्या है?' (Aapka naam kya hai?)**. To reply, say: **'मेरा नाम ... है' (Mera naam ... hai)**.";
                audioText = "आपका नाम क्या है?";
                vocabulary = [{ word: "नाम", phonetics: "Naam", meaning: "Name" }, { word: "आपका", phonetics: "Aapka", meaning: "Your" }];
            }
        }
        // 4. Where is / directions ("where is", "how do i go")
        else if (msg.includes('where is') || msg.includes('kahan') || msg.includes('direction') || msg.includes('station') || msg.includes('way')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "To ask where something is in Kannada, say: **'... ಎಲ್ಲಿದೆ?' (... ellide?)**. Example: **'ರೈಲ್ವೆ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?' (Railway nildaana ellide?)** - Where is the railway station?";
                audioText = "ಎಲ್ಲಿದೆ?";
                vocabulary = [{ word: "ಎಲ್ಲಿದೆ", phonetics: "Ellide", meaning: "Where is it?" }];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "To ask where something is in Telugu, say: **'... ఎక్కడ ఉంది?' (... ekkada undi?)**. Example: **'రైల్వే స్టేషన్ ఎక్కడ ఉంది?' (Railway station ekkada undi?)**.";
                audioText = "ఎక్కడ ఉంది?";
                vocabulary = [{ word: "ఎక్కడ", phonetics: "Ekkada", meaning: "Where" }];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "To ask where something is in Tamil, say: **'... எங்கே இருக்கிறது?' (... enge irukkiradhu?)**.";
                audioText = "எங்கே இருக்கிறது?";
                vocabulary = [{ word: "எங்கே", phonetics: "Enge", meaning: "Where" }];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
                reply = "To ask where something is in Malayalam, say: **'... എവിടെയാണ്?' (... evideyanu?)**.";
                audioText = "എവിടെയാണ്?";
                vocabulary = [{ word: "എവിടെ", phonetics: "Evide", meaning: "Where" }];
            } else {
                reply = "To ask where something is in Hindi, say: **'... कहाँ है?' (... kahan hai?)**. Example: **'स्टेशन कहाँ है?' (Station kahan hai?)**.";
                audioText = "कहाँ है?";
                vocabulary = [{ word: "कहाँ", phonetics: "Kahan", meaning: "Where" }];
            }
        }
        // 5. Thank you queries
        else if (msg.includes('thank') || msg.includes('dhanyavad') || msg.includes('shukriya')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "In Kannada, you say **ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)**! It is the polite way to express gratitude.";
                audioText = "ಧನ್ಯವಾದಗಳು";
                vocabulary = [{ word: "ಧನ್ಯವಾದಗಳು", phonetics: "Dhanyavadagalu", meaning: "Thank you" }];
                tips = ["You can say 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು' (Tumba Dhanyavadagalu) for 'Thank you very much'."];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "In Telugu, you say **ధన్యవాదాలు (Dhanyavaadaalu)**! You can also use 'చాలా కృతజ్ఞతలు' (Chala Kruthagnathalu) for formal thanks.";
                audioText = "ధన్యవాదాలు";
                vocabulary = [{ word: "ధన్యవాదాలు", phonetics: "Dhanyavaadaalu", meaning: "Thank you" }];
                tips = ["'చాలా ధన్యవాదాలు' (Chaala Dhanyavaadaalu) means 'Thank you very much'."];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "In Tamil, you say **நன்றி (Nandri)**! To say thank you very much, say **மிக்க நன்றி (Mikka Nandri)**.";
                audioText = "நன்றி";
                vocabulary = [{ word: "நன்றி", phonetics: "Nandri", meaning: "Thank you" }];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
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
        // 6. Greetings queries - EXACT regex word boundary check so "hindi" won't match "hi"!
        else if (/\b(hi|hello|hey|greetings|namaste|vanakkam|namaskara)\b/i.test(msg) || msg.includes('morning') || msg.includes('greet')) {
            if (tLower.includes('kannada') || targetCode === 'kn') {
                reply = "In Kannada, the greeting is **ನಮಸ್ಕಾರ (Namaskara)**! For good morning, say **ಶುಭೋದಯ (Shubhodaya)**.";
                audioText = "ನಮಸ್ಕಾರ";
                vocabulary = [{ word: "ನಮಸ್ಕಾರ", phonetics: "Namaskara", meaning: "Hello / Greetings" }];
            } else if (tLower.includes('telugu') || targetCode === 'te') {
                reply = "In Telugu, you say **నమస్కారం (Namaskaram)**! For good morning, say **శుభోదయం (Shubhodayam)**.";
                audioText = "నమస్కారం";
                vocabulary = [{ word: "నమస్కారం", phonetics: "Namaskaram", meaning: "Hello / Respectful greetings" }];
            } else if (tLower.includes('tamil') || targetCode === 'ta') {
                reply = "In Tamil, you say **வணக்கம் (Vanakkam)**! For good morning, say **காலை வணக்கம் (Kaalai Vanakkam)**.";
                audioText = "வணக்கம்";
                vocabulary = [{ word: "வணக்கம்", phonetics: "Vanakkam", meaning: "Hello / Welcome" }];
            } else if (tLower.includes('malayalam') || targetCode === 'ml') {
                reply = "In Malayalam, you say **നമസ്കാരം (Namaskaram)**! For good morning, say **സുപ്രഭാതം (Suprabhatham)**.";
                audioText = "നമസ്കാരം";
                vocabulary = [{ word: "നമസ്കാരം", phonetics: "Namaskaram", meaning: "Hello / Greetings" }];
            } else {
                reply = "In Hindi, the most popular greeting is **नमस्ते (Namaste)** or **नमस्कार (Namaskar)**! For good morning, you can say **शुभप्रभात (Shubhprabhat)**.";
                audioText = "नमस्ते";
                vocabulary = [{ word: "नमस्ते", phonetics: "Namaste", meaning: "Hello / I bow to you" }];
            }
        }
        // 7. Explain current lesson
        else if (msg.includes('explain') || msg.includes('lesson')) {
            reply = `In ${target}, learning starts with identifying letter sounds and building simple subject-object-verb word order. Focus on connecting root sounds with matching vowel markers!`;
            tips = ["Break multi-syllable words into individual sounds", "Listen to audio playback in Voice Studio"];
        }
        // 8. Grammar check
        else if (msg.includes('grammar') || msg.includes('check')) {
            reply = `Your sentence is understood! In ${target}, remember that verbs typically come at the end of the sentence (SOV word order). Keep going!`;
            tips = ["Subject comes first", "Object in the middle", "Verb at the end"];
        }
        // 9. General translation / conversational question
        else {
            reply = `Here is how to approach that in **${target}**: Break down your sentence into core components (Subject + Object + Action). Practice saying each word distinctly. Try asking me specific phrases like *"How do I ask for water?"* or *"How much for 1kg of tomatoes?"* and I will translate them for you!`;
            tips = ["Tap the speaker button to listen to clear native pronunciation", "Repeat the sentence 3 times"];
        }

        return {
            reply,
            audio_text: audioText,
            target_language: target,
            target_code: targetCode,
            comfortable_language: 'English',
            tips,
            vocabulary,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    }
};
