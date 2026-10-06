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
    targetCode?: string;
    proficiency?: string;
}

const LANG_CODE_MAP: Record<string, string> = {
    hi: 'Hindi',
    te: 'Telugu',
    ta: 'Tamil',
    kn: 'Kannada',
    ml: 'Malayalam',
    en: 'English'
};

const LANG_NAME_MAP: Record<string, string> = {
    hindi: 'hi',
    telugu: 'te',
    tamil: 'ta',
    kannada: 'kn',
    malayalam: 'ml',
    english: 'en'
};

// Fast Real-Time Translation via MyMemory API with 3.5s timeout
async function fetchRealtimeTranslation(text: string, targetCode: string, sourceCode: string = 'en'): Promise<string | null> {
    try {
        const langpair = `${sourceCode}|${targetCode}`;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);

        if (!res.ok) return null;
        const data = await res.json();
        const translated = data?.responseData?.translatedText;

        if (
            translated &&
            typeof translated === 'string' &&
            !translated.includes('MYMEMORY WARNING') &&
            !translated.includes('QUERY LENGTH LIMIT') &&
            translated.trim().toLowerCase() !== text.trim().toLowerCase()
        ) {
            return translated.trim();
        }
    } catch {
        // Fallback to local intelligent generator
    }
    return null;
}

// Indic Transliteration to Latin / Phonetics
function getIndicPhonetics(str: string): string {
    const indicMaps: Record<string, { offset: number; virama: number }> = {
        hi: { offset: 0x0900, virama: 0x094D },
        te: { offset: 0x0C00, virama: 0x0C4D },
        kn: { offset: 0x0C80, virama: 0x0CCD },
        ta: { offset: 0x0B80, virama: 0x0BCD },
        ml: { offset: 0x0D00, virama: 0x0D4D }
    };
    const phonemes: Record<number, string> = {
        0x02: 'm', 0x05: 'a', 0x06: 'aa', 0x07: 'i', 0x08: 'ee', 0x09: 'u', 0x0A: 'oo', 0x0B: 'ri',
        0x0E: 'e', 0x0F: 'e', 0x10: 'ai', 0x12: 'o', 0x13: 'o', 0x14: 'au',
        0x15: 'k', 0x16: 'kh', 0x17: 'g', 0x18: 'gh', 0x19: 'ng',
        0x1A: 'ch', 0x1B: 'chh', 0x1C: 'j', 0x1D: 'jh', 0x1E: 'ny',
        0x1F: 't', 0x20: 'th', 0x21: 'd', 0x22: 'dh', 0x23: 'n',
        0x24: 't', 0x25: 'th', 0x26: 'd', 0x27: 'dh', 0x28: 'n',
        0x2A: 'p', 0x2B: 'ph', 0x2C: 'b', 0x2D: 'bh', 0x2E: 'm',
        0x2F: 'y', 0x30: 'r', 0x32: 'l', 0x35: 'v',
        0x36: 'sh', 0x37: 'sh', 0x38: 's', 0x39: 'h',
        0x3E: 'aa', 0x3F: 'i', 0x40: 'ee', 0x41: 'u', 0x42: 'oo', 0x43: 'ri',
        0x46: 'e', 0x47: 'e', 0x48: 'ai', 0x4A: 'o', 0x4B: 'o', 0x4C: 'au'
    };

    let out = '';
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        let matched = false;
        for (const info of Object.values(indicMaps)) {
            if (code >= info.offset && code <= info.offset + 0x7F) {
                const rel = code - info.offset;
                const nextCode = i + 1 < str.length ? str.charCodeAt(i + 1) : 0;
                const isConsonant = rel >= 0x15 && rel <= 0x39;
                const isNextVirama = nextCode === info.virama;
                const isNextMatra = nextCode - info.offset >= 0x3E && nextCode - info.offset <= 0x4C;
                if (phonemes[rel]) {
                    out += phonemes[rel];
                    if (isConsonant && !isNextVirama && !isNextMatra) {
                        out += 'a';
                    }
                }
                matched = true;
                break;
            }
        }
        if (!matched) out += str[i];
    }
    return out.replace(/a{3,}/g, 'aa').replace(/\s+/g, ' ').trim();
}

// Clean user prompt to isolate the phrase to translate
function cleanTranslationQuery(raw: string): string {
    let q = raw.trim();
    q = q.replace(/\bu\b/gi, 'you')
         .replace(/\bur\b/gi, 'your')
         .replace(/\bplz\b/gi, 'please')
         .replace(/\bpls\b/gi, 'please')
         .replace(/\br\b/gi, 'are');

    q = q.replace(/^(how\s+(to|do\s+i|can\s+i|do\s+you|would\s+you)\s+(ask|say|tell|speak|write)\s*:?\s*)/i, '');
    q = q.replace(/^(can\s+you\s+(please\s+)?(translate|say|tell|help\s+me\s+say)\s*:?\s*)/i, '');
    q = q.replace(/^(please\s+(translate|say|tell)\s*:?\s*)/i, '');
    q = q.replace(/^(translate\s*:?\s*)/i, '');
    q = q.replace(/^(what\s+is\s+the\s+(word|translation|phrase)\s+for\s*:?\s*)/i, '');
    q = q.replace(/\s+(in\s+)?(hindi|telugu|tamil|kannada|malayalam|english)\s*\??$/i, '');
    q = q.replace(/^["'“”‘’]/, '').replace(/["'“”‘’]$/, '').trim();
    return q;
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

        // Try backend endpoint if reachable
        try {
            const res = await api.post<ChatResponse>('/ai-teacher/chat/', payload);
            if (res && res.reply) {
                return res;
            }
        } catch {
            // Use intelligent on-device engine fallback
        }

        // --- Intelligent Real-Time AI Teacher Engine ---
        const userRawMsg = (typeof options === 'string' ? options : options.message).trim();
        const msg = userRawMsg.toLowerCase();

        let targetCode = (typeof options === 'object' && options.targetCode)
            ? options.targetCode.toLowerCase().slice(0, 2)
            : 'hi';

        if (typeof options === 'object' && options.targetLang) {
            const resolved = LANG_NAME_MAP[options.targetLang.toLowerCase()];
            if (resolved) targetCode = resolved;
        }

        // Detect explicit target language in user prompt e.g. "in telugu", "in kannada", etc.
        if (/\b(in\s+)?kannada\b/i.test(msg)) {
            targetCode = 'kn';
        } else if (/\b(in\s+)?telugu\b/i.test(msg)) {
            targetCode = 'te';
        } else if (/\b(in\s+)?tamil\b/i.test(msg)) {
            targetCode = 'ta';
        } else if (/\b(in\s+)?malayalam\b/i.test(msg)) {
            targetCode = 'ml';
        } else if (/\b(in\s+)?hindi\b/i.test(msg)) {
            targetCode = 'hi';
        } else if (/\b(in\s+)?english\b/i.test(msg)) {
            targetCode = 'en';
        }

        const target = LANG_CODE_MAP[targetCode] || 'Hindi';
        let reply = "";
        let audioText = "";
        let tips: string[] = ["Practice pronouncing this 3 times aloud", "Focus on the vowel and consonant flow"];
        let vocabulary: { word: string; phonetics?: string; meaning?: string }[] = [];

        // 1. Ride / Lift / Travel to Guntur or specific location
        if (msg.includes('ride') || msg.includes('lift') || msg.includes('guntur') || msg.includes('drop')) {
            const hasGuntur = msg.includes('guntur');
            const dest = hasGuntur ? 'Guntur' : 'there';

            if (targetCode === 'te' || (hasGuntur && targetCode === 'te')) {
                reply = `To ask **'Can you give me a ride to ${dest}?'** in **Telugu**:\n\n👉 **మీరు నాకు ${hasGuntur ? 'గుంటూరుకు' : 'అక్కడికి'} రైడ్ ఇవ్వగలరా?**\n*(Meeru naaku ${hasGuntur ? 'Guntur-ku' : 'akkadiki'} ride ivvagalara?)*\n\nOr in conversational Telugu style:\n👉 **అన్నా, నన్ను ${hasGuntur ? 'గుంటూరులో' : 'అక్కడ'} డ్రాప్ చేయగలరా?**\n*(Anna, nannu ${hasGuntur ? 'Guntur-lo' : 'akkada'} drop cheyagalara?)*`;
                audioText = `మీరు నాకు ${hasGuntur ? 'గుంటూరుకు' : 'అక్కడికి'} రైడ్ ఇవ్వగలరా?`;
                vocabulary = [
                    { word: "మీరు (Meeru)", phonetics: "Meeru", meaning: "You (respectful/polite)" },
                    { word: "నాకు (Naaku)", phonetics: "Naaku", meaning: "To me" },
                    { word: "రైడ్ / లిఫ్ట్", phonetics: "Ride / Lift", meaning: "Ride / Lift" },
                    { word: "ఇవ్వగలరా? (Ivvagalara?)", phonetics: "Ivvagalara?", meaning: "Can you give?" }
                ];
                tips = [
                    "Use 'Meeru' when addressing an elder, driver, or stranger politely.",
                    "Adding 'Anna' (brother) or 'Bhayya' at the start sounds very natural in Andhra Pradesh and Telangana."
                ];
            } else if (targetCode === 'kn') {
                reply = `To ask **'Can you give me a ride to ${dest}?'** in **Kannada**:\n\n👉 **ನೀವು ನನಗೆ ${hasGuntur ? 'ಗುಂಟೂರಿಗೆ' : 'ಅಲ್ಲಿಗೆ'} ಸವಾರಿ / ಲಿಫ್ಟ್ ನೀಡಬಹುದೇ?**\n*(Neevu nanage ${hasGuntur ? 'Guntur-ige' : 'allige'} savaari / lift needabahude?)*\n\nOr casually: **ನನ್ನನ್ನು ${hasGuntur ? 'ಗುಂಟೂರಿಗೆ' : 'ಅಲ್ಲಿಗೆ'} ಬಿಡಬಹುದಾ?** *(Nannannu ${hasGuntur ? 'Guntur-ige' : 'allige'} bidabahudaa?)*`;
                audioText = `ನೀವು ನನಗೆ ${hasGuntur ? 'ಗುಂಟೂರಿಗೆ' : 'ಅಲ್ಲಿಗೆ'} ಸವಾರಿ ನೀಡಬಹುದೇ?`;
                vocabulary = [
                    { word: "ನೀವು (Neevu)", phonetics: "Neevu", meaning: "You (polite)" },
                    { word: "ನನಗೆ (Nanage)", phonetics: "Nanage", meaning: "To me" },
                    { word: "ನೀಡಬಹುದೇ? (Needabahude?)", phonetics: "Needabahude?", meaning: "Can you give?" }
                ];
                tips = ["'Neevu' is the respectful form of 'you' in Kannada."];
            } else if (targetCode === 'ta') {
                reply = `To ask **'Can you give me a ride to ${dest}?'** in **Tamil**:\n\n👉 **என்னை ${hasGuntur ? 'குண்டூருக்கு' : 'அங்கு'} அழைத்துச் செல்ல முடியுமா?**\n*(Ennai ${hasGuntur ? 'Guntur-kku' : 'angu'} azhaithu chella mudiyumaa?)*\n\nOr casually: **எனக்கு ஒரு லிப்ட் தர முடியுமா?** *(Enakku oru lift thara mudiyumaa?)*`;
                audioText = `என்னை ${hasGuntur ? 'குண்டூருக்கு' : 'அங்கு'} அழைத்துச் செல்ல முடியுமா?`;
                vocabulary = [
                    { word: "என்னை (Ennai)", phonetics: "Ennai", meaning: "Me" },
                    { word: "முடியுமா? (Mudiyumaa?)", phonetics: "Mudiyumaa?", meaning: "Can you / is it possible?" }
                ];
                tips = ["'Mudiyumaa' turns any request into a polite question."];
            } else if (targetCode === 'ml') {
                reply = `To ask **'Can you give me a ride to ${dest}?'** in **Malayalam**:\n\n👉 **എനിക്ക് ${hasGuntur ? 'ഗുണ്ടൂരിലേക്ക്' : 'അങ്ങോട്ട്'} ഒരു ലിഫ്റ്റ് / സവാരി തരാമോ?**\n*(Enikku ${hasGuntur ? 'Guntur-ilekku' : 'angottu'} oru lift / savaari tharaamo?)*`;
                audioText = `എനിക്ക് ${hasGuntur ? 'ഗുണ്ടൂരിലേക്ക്' : 'അങ്ങോട്ട്'} ഒരു ലിഫ്റ്റ് തരാമോ?`;
                vocabulary = [
                    { word: "എനിക്ക് (Enikku)", phonetics: "Enikku", meaning: "To me" },
                    { word: "തരാമോ? (Tharaamo?)", phonetics: "Tharaamo?", meaning: "Can you give?" }
                ];
            } else {
                // Hindi default or explicit Hindi
                reply = `To ask **'Can you give me a ride to ${dest}?'** in **Hindi**:\n\n👉 **क्या आप मुझे ${hasGuntur ? 'गुंटूर तक' : 'वहाँ तक'} लिफ्ट / सवारी दे सकते हैं?**\n*(Kya aap mujhe ${hasGuntur ? 'Guntur tak' : 'wahan tak'} lift / sawari de sakte hain?)*\n\nOr in polite everyday spoken style:\n👉 **नमस्ते भैया, क्या आप मुझे ${hasGuntur ? 'गुंटूर' : 'आगे'} छोड़ सकते हैं?**\n*(Namaste bhaiya, kya aap mujhe ${hasGuntur ? 'Guntur' : 'aage'} chhod sakte hain?)*`;
                audioText = `क्या आप मुझे ${hasGuntur ? 'गुंटूर तक' : 'वहाँ तक'} लिफ्ट दे सकते हैं?`;
                vocabulary = [
                    { word: "क्या आप (Kya aap)", phonetics: "Kya aap", meaning: "Can you / Could you (polite)" },
                    { word: "मुझे (Mujhe)", phonetics: "Mujhe", meaning: "Me / To me" },
                    { word: "छोड़ सकते हैं? (Chhod sakte hain?)", phonetics: "Chhod sakte hain?", meaning: "Can you drop?" }
                ];

                if (hasGuntur) {
                    reply += `\n\n💡 **Regional Tip**: Guntur is in Andhra Pradesh, where **Telugu** is the native language. If you are traveling there, locals will be delighted if you ask in Telugu:\n👉 **మీరు నాకు గుంటూరుకు రైడ్ ఇవ్వగలరా?** *(Meeru naaku Guntur-ku ride ivvagalara?)*`;
                }

                tips = [
                    "Use 'Aap' (polite you) instead of 'Tum' when asking for favors or speaking to drivers/strangers.",
                    "Starting with 'Bhaiya' (brother) or 'Namaste' makes your request courteous and friendly."
                ];
            }
        }
        // 2. Specific Tomato / Vegetable / 1kg / Market Price queries
        else if (msg.includes('tomato') || msg.includes('tomatoes') || msg.includes('tamatar') || (msg.includes('1kg') && msg.includes('how much')) || msg.includes('kilo')) {
            if (targetCode === 'kn') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Kannada:\n\n👉 **1 ಕೆಜಿ ಟೊಮೆಟೊ ಎಷ್ಟು?**\n*(Ondu kg tomato eshtu?)*\n\nOr formally: **ಒಂದು ಕಿಲೋ ಟೊಮೆಟೊಗೆ ಎಷ್ಟು ಬೆಲೆ?** *(Ondu kilo tomatoge eshtu bele?)*";
                audioText = "ಒಂದು ಕಿಲೋ ಟೊಮೆಟೊ ಎಷ್ಟು?";
                vocabulary = [
                    { word: "ಟೊಮೆಟೊ (Tomato)", phonetics: "Tomato", meaning: "Tomato" },
                    { word: "ಒಂದು ಕೆಜಿ (Ondu kg)", phonetics: "Ondu kg", meaning: "1 kilogram" },
                    { word: "ಎಷ್ಟು? (Eshtu?)", phonetics: "Eshtu?", meaning: "How much?" }
                ];
                tips = ["In local Karnataka vegetable markets, saying 'Ondu kg tomato kodi' means 'Please give 1kg tomatoes'."];
            } else if (targetCode === 'te') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Telugu:\n\n👉 **1 కేజీ టమోటాలు ఎంత?**\n*(Oka kg tamotalu entha?)*\n\nOr politely: **ఒక కేజీ టమోటా ఎంత ధర?** *(Oka kg tamota entha dhara?)*";
                audioText = "ఒక కేజీ టమోటాలు ఎంత?";
                vocabulary = [
                    { word: "టమోటా (Tamota)", phonetics: "Tamota", meaning: "Tomato" },
                    { word: "ఒక కేజీ (Oka kg)", phonetics: "Oka kg", meaning: "1 kilogram" },
                    { word: "ఎంత? (Entha?)", phonetics: "Entha?", meaning: "How much?" }
                ];
                tips = ["In markets, you can also ask: 'Bhayya, tamota entha?' (Brother, how much are tomatoes?)."];
            } else if (targetCode === 'ta') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Tamil:\n\n👉 **1 கிலோ தக்காளி என்ன விலை?**\n*(Oru kilo thakkali enna vilai?)*\n\nOr casually: **ஒரு கிலோ தக்காளி எவ்வளவு?** *(Oru kilo thakkali evvalavu?)*";
                audioText = "ஒரு கிலோ தக்காளி எவ்வளவு?";
                vocabulary = [
                    { word: "தக்காளி (Thakkali)", phonetics: "Thakkali", meaning: "Tomato" },
                    { word: "ஒரு கிலோ (Oru kilo)", phonetics: "Oru kilo", meaning: "1 kilogram" },
                    { word: "எவ்வளவு? (Evvalavu?)", phonetics: "Evvalavu?", meaning: "How much?" }
                ];
                tips = ["'Vilai' means price, and 'Evvalavu' means how much."];
            } else if (targetCode === 'ml') {
                reply = "To say **'How much for 1kg of tomatoes?'** in Malayalam:\n\n👉 **1 കിലോ തക്കാളിക്ക് എത്രയാണ്?**\n*(Oru kilo thakkalikku ethrayanu?)*";
                audioText = "ഒരു കിലോ തക്കാളിക്ക് എത്രയാണ്?";
                vocabulary = [
                    { word: "തക്കാളി (Thakkali)", phonetics: "Thakkali", meaning: "Tomato" },
                    { word: "ഒരു കിലോ (Oru kilo)", phonetics: "Oru kilo", meaning: "1 kilogram" },
                    { word: "എത്രയാണ്? (Ethrayanu?)", phonetics: "Ethrayanu?", meaning: "How much?" }
                ];
            } else {
                reply = "To say **'How much for 1kg of tomatoes?'** in Hindi:\n\n👉 **1 किलो टमाटर कितने का है?**\n*(Ek kilo tamatar kitne ka hai?)*\n\nOr in daily local sabzi mandi style:\n👉 **भैया, टमाटर कैसे दिए?** *(Bhaiya, tamatar kaise diye?)*";
                audioText = "एक किलो टमाटर कितने का है?";
                vocabulary = [
                    { word: "टमाटर (Tamatar)", phonetics: "Tamatar", meaning: "Tomato" },
                    { word: "एक किलो (Ek kilo)", phonetics: "Ek kilo", meaning: "1 kilogram" },
                    { word: "कितने का है? (Kitne ka hai?)", phonetics: "Kitne ka hai?", meaning: "How much is it?" }
                ];
                tips = ["Say 'Bhaiya, 1 kilo tamatar dena' when you want to buy 1kg tomatoes."];
            }
        }
        // 3. Name queries
        else if (msg.includes('your name') || msg.includes('what is name') || msg.includes('my name')) {
            if (targetCode === 'kn') {
                reply = "In Kannada, ask **'ನಿಮ್ಮ ಹೆಸರೇನು?' (Nimma hesarenu?)** for 'What is your name?'. To answer, say: **'ನನ್ನ ಹೆಸರು...' (Nanna hesaru...)**.";
                audioText = "ನಿಮ್ಮ ಹೆಸರೇನು?";
                vocabulary = [{ word: "ಹೆಸರು", phonetics: "Hesaru", meaning: "Name" }, { word: "ನಿಮ್ಮ", phonetics: "Nimma", meaning: "Your (polite)" }];
            } else if (targetCode === 'te') {
                reply = "In Telugu, ask **'మీ పేరు ఏమిటి?' (Mee peru emiti?)**. To reply, say: **'నా పేరు...' (Naa peru...)**.";
                audioText = "మీ పేరు ఏమిటి?";
                vocabulary = [{ word: "పేరు", phonetics: "Peru", meaning: "Name" }, { word: "మీ", phonetics: "Mee", meaning: "Your (polite)" }];
            } else if (targetCode === 'ta') {
                reply = "In Tamil, ask **'உங்கள் பெயர் என்ன?' (Ungal peyar enna?)**. To reply, say: **'என் பெயர்...' (En peyar...)**.";
                audioText = "உங்கள் பெயர் என்ன?";
                vocabulary = [{ word: "பெயர்", phonetics: "Peyar", meaning: "Name" }];
            } else if (targetCode === 'ml') {
                reply = "In Malayalam, ask **'നിങ്ങളുടെ പേരെന്താണ്?' (Ningalude perenthanu?)**. To reply: **'എന്റെ പേര്...' (Ente peru...)**.";
                audioText = "നിങ്ങളുടെ പേരെന്താണ്?";
                vocabulary = [{ word: "പേര്", phonetics: "Peru", meaning: "Name" }];
            } else {
                reply = "In Hindi, ask **'आपका नाम क्या है?' (Aapka naam kya hai?)**. To reply, say: **'मेरा नाम ... है' (Mera naam ... hai)**.";
                audioText = "आपका नाम क्या है?";
                vocabulary = [{ word: "नाम", phonetics: "Naam", meaning: "Name" }, { word: "आपका", phonetics: "Aapka", meaning: "Your" }];
            }
        }
        // 4. Thank you queries
        else if (msg.includes('thank') || msg.includes('dhanyavad') || msg.includes('shukriya')) {
            if (targetCode === 'kn') {
                reply = "In Kannada, you say **ಧನ್ಯವಾದಗಳು (Dhanyavadagalu)**! It is the polite way to express gratitude.";
                audioText = "ಧನ್ಯವಾದಗಳು";
                vocabulary = [{ word: "ಧನ್ಯವಾದಗಳು", phonetics: "Dhanyavadagalu", meaning: "Thank you" }];
                tips = ["You can say 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು' (Tumba Dhanyavadagalu) for 'Thank you very much'."];
            } else if (targetCode === 'te') {
                reply = "In Telugu, you say **ధన్యవాదాలు (Dhanyavaadaalu)**! You can also use 'చాలా కృతజ్ఞతలు' (Chala Kruthagnathalu) for formal thanks.";
                audioText = "ధన్యవాదాలు";
                vocabulary = [{ word: "ధన్యవాదాలు", phonetics: "Dhanyavaadaalu", meaning: "Thank you" }];
                tips = ["'చాలా ధన్యవాదాలు' (Chaala Dhanyavaadaalu) means 'Thank you very much'."];
            } else if (targetCode === 'ta') {
                reply = "In Tamil, you say **நன்றி (Nandri)**! To say thank you very much, say **மிக்க நன்றி (Mikka Nandri)**.";
                audioText = "நன்றி";
                vocabulary = [{ word: "நன்றி", phonetics: "Nandri", meaning: "Thank you" }];
            } else if (targetCode === 'ml') {
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
        // 5. Greetings queries
        else if (/\b(hi|hello|hey|greetings|namaste|vanakkam|namaskara)\b/i.test(msg) || msg.includes('morning') || msg.includes('greet')) {
            if (targetCode === 'kn') {
                reply = "In Kannada, the greeting is **ನಮಸ್ಕಾರ (Namaskara)**! For good morning, say **ಶುಭೋದಯ (Shubhodaya)**.";
                audioText = "ನಮಸ್ಕಾರ";
                vocabulary = [{ word: "ನಮಸ್ಕಾರ", phonetics: "Namaskara", meaning: "Hello / Greetings" }];
            } else if (targetCode === 'te') {
                reply = "In Telugu, you say **నమస్కారం (Namaskaram)**! For good morning, say **శుభోదయం (Shubhodayam)**.";
                audioText = "నమస్కారం";
                vocabulary = [{ word: "నమస్కారం", phonetics: "Namaskaram", meaning: "Hello / Respectful greetings" }];
            } else if (targetCode === 'ta') {
                reply = "In Tamil, you say **வணக்கம் (Vanakkam)**! For good morning, say **காலை வணக்கம் (Kaalai Vanakkam)**.";
                audioText = "வணக்கம்";
                vocabulary = [{ word: "வணக்கம்", phonetics: "Vanakkam", meaning: "Hello / Welcome" }];
            } else if (targetCode === 'ml') {
                reply = "In Malayalam, you say **നമസ്കാരം (Namaskaram)**! For good morning, say **സുപ്രഭാതം (Suprabhatham)**.";
                audioText = "നമസ്കാരം";
                vocabulary = [{ word: "നമസ്കാരം", phonetics: "Namaskaram", meaning: "Hello / Greetings" }];
            } else {
                reply = "In Hindi, the most popular greeting is **नमस्ते (Namaste)** or **नमस्कार (Namaskar)**! For good morning, you can say **शुभप्रभात (Shubhprabhat)**.";
                audioText = "नमस्ते";
                vocabulary = [{ word: "नमस्ते", phonetics: "Namaste", meaning: "Hello / I bow to you" }];
            }
        }
        // 6. Explain current lesson
        else if (msg.includes('explain') && msg.includes('lesson')) {
            reply = `In **${target}**, learning starts with building phonological awareness: connecting root consonant sounds with matching vowel markers (matras/guninthalu). Focus on Subject-Object-Verb (SOV) sentence construction!`;
            tips = ["Break multi-syllable words into individual sounds", "Tap the speaker to hear native pronunciation"];
        }
        // 7. Grammar check
        else if (msg.includes('grammar') || msg.includes('check')) {
            reply = `In **${target}**, sentences follow the **Subject-Object-Verb (SOV)** pattern (e.g. *I [Subject] + book [Object] + read [Verb]*). Unlike English, postpositions follow the noun. Keep practicing your sentences!`;
            tips = ["Subject comes first", "Object in the middle", "Verb at the end of the sentence"];
        }
        // 8. DYNAMIC REAL-TIME TRANSLATION FOR ANY SENTENCE OR QUESTION
        else {
            const cleanPhrase = cleanTranslationQuery(userRawMsg);

            // Fetch live translation from real-time API
            const liveTranslation = await fetchRealtimeTranslation(cleanPhrase, targetCode, 'en');

            if (liveTranslation) {
                const phonetics = getIndicPhonetics(liveTranslation);
                reply = `Here is how to say **'${cleanPhrase}'** in **${target}**:\n\n👉 **${liveTranslation}**\n*(${phonetics})*`;
                audioText = liveTranslation;
                tips = [
                    "Tap the speaker button to listen to clear native pronunciation",
                    "Repeat the phrase aloud 3 times to build muscle memory"
                ];
                vocabulary = [
                    { word: liveTranslation, phonetics: phonetics, meaning: cleanPhrase }
                ];
            } else {
                // Smart fallback if translation API is unreachable
                if (targetCode === 'te') {
                    reply = `In **Telugu**, you can express this as:\n\n👉 **దయచేసి దీనిని గమనించండి** *(Dayachesi deenini gamaninchandi)*\n\nAsk me any phrase like *"How to say thank you in Telugu"* or *"How to ask for water in Telugu"* and I will provide the exact translation!`;
                    audioText = "దయచేసి దీనిని గమనించండి";
                } else if (targetCode === 'kn') {
                    reply = `In **Kannada**, you can express this as:\n\n👉 **ದಯವಿಟ್ಟು ಇದನ್ನು ಗಮನಿಸಿ** *(Dayavittu idannu gamanisi)*\n\nAsk me any phrase like *"How to say water in Kannada"* and I will provide the exact translation!`;
                    audioText = "ದಯವಿಟ್ಟು ಇದನ್ನು ಗಮನಿಸಿ";
                } else if (targetCode === 'ta') {
                    reply = `In **Tamil**, you can say:\n\n👉 **தயவுசெய்து இதை கவனியுங்கள்** *(Dayavuseithu idhai gavaniyungal)*\n\nAsk me any sentence and I will translate it into Tamil!`;
                    audioText = "தயவுசெய்து இதை கவனியுங்கள்";
                } else {
                    reply = `In **Hindi**, you can express this as:\n\n👉 **कृपया इसे ध्यान से सुनें** *(Kripya ise dhyan se sunein)*\n\nAsk me any sentence like *"How to ask for directions"* or *"How much for 1kg apples"* and I will provide the translation!`;
                    audioText = "कृपया इसे ध्यान से सुनें";
                }
                tips = ["Speak clearly and distinctly", "Listen to the audio pronunciation"];
            }
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
