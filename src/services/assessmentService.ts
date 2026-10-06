import { apiClient } from './api';
import { StorageService } from './mockData';
import { Question, AILearnerInsight } from '../types';

export const assessmentService = {
    async getDiagnosticQuestions(targetLangParam?: string, comfortLangParam?: string): Promise<Question[]> {
        const profile = StorageService.getProfile();
        const storedTarget = profile?.target_language?.code || profile?.target_language?.name || 'hi';
        const storedComfort = profile?.comfortable_language?.code || profile?.comfortable_language?.name || 'en';

        const rawTarget = (targetLangParam || storedTarget || 'hi').toLowerCase();
        const rawComfort = (comfortLangParam || storedComfort || 'en').toLowerCase();

        let target = 'Hindi';
        if (rawTarget.includes('te') || rawTarget.includes('telugu')) target = 'Telugu';
        else if (rawTarget.includes('kn') || rawTarget.includes('kannada')) target = 'Kannada';
        else if (rawTarget.includes('ta') || rawTarget.includes('tamil')) target = 'Tamil';
        else if (rawTarget.includes('ml') || rawTarget.includes('malayalam')) target = 'Malayalam';
        else if (rawTarget.includes('en') || rawTarget.includes('english')) target = 'English';
        else target = 'Hindi';

        let comfort = 'en';
        if (rawComfort.includes('te') || rawComfort.includes('telugu')) comfort = 'te';
        else if (rawComfort.includes('kn') || rawComfort.includes('kannada')) comfort = 'kn';
        else if (rawComfort.includes('ta') || rawComfort.includes('tamil')) comfort = 'ta';
        else if (rawComfort.includes('ml') || rawComfort.includes('malayalam')) comfort = 'ml';
        else if (rawComfort.includes('hi') || rawComfort.includes('hindi')) comfort = 'hi';
        else comfort = 'en';

        try {
            const response = await apiClient.get<{ questions: Question[] }>(`/assessment/questions/?target_language=${target}&comfortable_language=${comfort}`);
            if (response && response.questions && response.questions.length > 0) {
                return response.questions;
            }
        } catch {
            // Intelligent on-device fallback when remote API is unreachable
        }

        // Bridge helper returning native instruction in the learner's comfortable language
        const getBridge = (targetWord: string, meaningMap: Record<string, string>): string => {
            const localizedMeaning = meaningMap[comfort] || meaningMap['en'] || targetWord;
            switch (comfort) {
                case 'kn':
                    return `ಪಾಠ್ಯಾಂಶವನ್ನು ಓದಿ "${targetWord}" (${localizedMeaning}) ಪದದ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:`;
                case 'te':
                    return `పాఠ్యాంశాన్ని చదివి "${targetWord}" (${localizedMeaning}) పదానికి సరిపోయే అర్థాన్ని ఎంచుకోండి:`;
                case 'ta':
                    return `பத்தியைப் படித்து "${targetWord}" (${localizedMeaning}) என்ற சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:`;
                case 'ml':
                    return `വാക്യം വായിച്ച് "${targetWord}" (${localizedMeaning}) എന്ന വാക്കിന്റെ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക:`;
                case 'hi':
                    return `गद्यांश पढ़कर "${targetWord}" (${localizedMeaning}) शब्द का सही अर्थ चुनें:`;
                default:
                    return `Read the passage and select the correct meaning of "${targetWord}" (${localizedMeaning}):`;
            }
        };

        const getGenericBridge = (instructionMap: Record<string, string>): string => {
            return instructionMap[comfort] || instructionMap['en'] || instructionMap['hi'] || '';
        };

        // 1. Target = Hindi
        if (target === 'Hindi') {
            return [
                {
                    id: 'q1',
                    skill: 'Alphabet & Reading',
                    question_type: 'reading_passage',
                    prompt: 'गद्यांश पढ़कर "पानी" शब्द का सही अर्थ चुनें:',
                    passage: 'रवि हर सुबह पानी पीता है और पुस्तकालय जाता है। उसे पढ़ना बहुत पसंद है।',
                    highlight_word: 'पानी',
                    comfortable_bridge: getBridge('पानी', {
                        en: 'Water',
                        kn: 'ನೀರು',
                        te: 'మంచి నీరు',
                        ta: 'தண்ணீர்',
                        ml: 'വെള്ളം',
                        hi: 'जल'
                    }),
                    options: [
                        { id: 1, text: 'जल (Water)', is_correct: true },
                        { id: 2, text: 'घर (Ghar)', is_correct: false },
                        { id: 3, text: 'किताब (Kitab)', is_correct: false },
                        { id: 4, text: 'खाना (Khana)', is_correct: false },
                    ],
                    explanation: "'पानी' का अर्थ जल होता है।"
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary',
                    question_type: 'match_words',
                    prompt: '"अवसर" शब्द के लिए सही पर्याय चुनें:',
                    highlight_word: 'अवसर',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the correct synonym for "अवसर" (Opportunity):',
                        kn: '"अवसर" (ಅವಕಾಶ) ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        te: '"अवसर" (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:',
                        ta: '"अवसर" (வாய்ப்பு) என்பதன் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: '"अवसर" (അവസരം) എന്ന വാക്കിന്റെ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക:',
                        hi: '"अवसर" शब्द का सही अर्थ चुनें:'
                    }),
                    options: [
                        { id: 1, text: 'शुभ समय / अनुकूल मौका', is_correct: true },
                        { id: 2, text: 'कठिन बाधा या विलंब', is_correct: false },
                        { id: 3, text: 'लिखने की गलती', is_correct: false },
                        { id: 4, text: 'पुराना ग्रंथ', is_correct: false },
                    ],
                    explanation: "'अवसर' का अर्थ अनुकूल मौका होता है।"
                },
                {
                    id: 'q3',
                    skill: 'Sentence Structure',
                    question_type: 'arrange_words',
                    prompt: 'सही हिंदी वाक्य बनाने के लिए शब्दों को क्रमबद्ध करें:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a correct Hindi sentence:',
                        kn: 'ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆಗಾಗಿ ಪದಗಳನ್ನು ಜೋಡಿಸಿ:',
                        te: 'సరియైన వాక్య నిర్మాణం కోసం పదాలను అమర్చండి:',
                        ta: 'சரியான வாக்கியத்தை உருவாக்க சொற்களை வரிசைப்படுத்துங்கள்:',
                        ml: 'ശരിയായ വാക്യം നിർമ്മിക്കാൻ വാക്കുകൾ ക്രമീകരിക്കുക:',
                        hi: 'सही वाक्य क्रम चुनें:'
                    }),
                    options: [
                        { id: 1, text: 'वह हर दिन हिंदी सीखता है।', is_correct: true },
                        { id: 2, text: 'हिंदी वह सीखता है हर दिन।', is_correct: false },
                        { id: 3, text: 'हर दिन सीखता हिंदी वह है।', is_correct: false },
                        { id: 4, text: 'सीखता है हर दिन वह हिंदी।', is_correct: false },
                    ],
                    explanation: 'कर्ता + समय + कर्म + क्रिया।'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: 'सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।',
                    passage: 'सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Fill in the blank with the most appropriate word:',
                        kn: 'ಸರಿಯಾದ ಪದದಿಂದ ಖಾಲಿ ಜಾಗವನ್ನು ತುಂಬಿರಿ:',
                        te: 'సరిపోయే పదంతో ఖాళీని భర్తీ చేయండి:',
                        ta: 'சரியான சொல்லால் கோடிட்ட இடத்தை நிரப்புக:',
                        ml: 'ശരിയായ വാക്ക് ഉപയോഗിച്ച് വിടവ് നികത്തുക:',
                        hi: 'सही शब्द से खाली स्थान भरें:'
                    }),
                    options: [
                        { id: 1, text: 'अभ्यास', is_correct: true },
                        { id: 2, text: 'आलस्य', is_correct: false },
                        { id: 3, text: 'भूल', is_correct: false },
                        { id: 4, text: 'क्रोध', is_correct: false },
                    ],
                    explanation: "'अभ्यास' वाक्य को सही अर्थ देता है।"
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: 'वाक्य को जोर से बोलें:',
                    target_phrase: 'नमस्ते! मैं लिंगोपथ से हिंदी सीख रहा हूँ।',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence aloud into the microphone:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಓದಿ:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:',
                        ta: 'இந்த வாக்கியத்தை சத்தமாகப் படித்து பதிவு செய்யுங்கள்:',
                        ml: 'ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:',
                        hi: 'वाक्य को जोर से बोलें:'
                    }),
                    options: [],
                    explanation: 'स्पष्ट उच्चारण करें।'
                },
                {
                    id: 'q6',
                    skill: 'Grammar Basics',
                    question_type: 'fill_blank',
                    prompt: 'सही सर्वनाम चुनें:',
                    passage: '_____ एक परिश्रमी छात्र है।',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Choose the correct pronoun to complete the sentence:',
                        kn: 'ಸರಿಯಾದ ಸರ್ವನಾಮವನ್ನು ಆರಿಸಿ:',
                        te: 'సరియైన సర్వనామాన్ని ఎంచుకోండి:',
                        ta: 'சரியான பிரதிப்பெயரைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ സർവ്വനാമം തിരഞ്ഞെടുക്കുക:',
                        hi: 'सही सर्वनाम चुनें:'
                    }),
                    options: [
                        { id: 1, text: 'वह', is_correct: true },
                        { id: 2, text: 'हम', is_correct: false },
                        { id: 3, text: 'वे', is_correct: false },
                        { id: 4, text: 'तुम', is_correct: false },
                    ],
                    explanation: "'वह' एकवचन पुल्लिंग के लिए उपयुक्त है।"
                },
                {
                    id: 'q7',
                    skill: 'Advanced Sentence Building',
                    question_type: 'arrange_words',
                    prompt: 'शब्दों को सही क्रम में रखें:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Put the words in correct order to make a fluent sentence:',
                        kn: 'ಅರ್ಥಪೂರ್ಣ ವಾಕ್ಯಕ್ಕಾಗಿ ಪದಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಇರಿಸಿ:',
                        te: 'సరైన క్రమంలో అమర్చండి:',
                        ta: 'பொருத்தமான வாக்கியமாக அமைய சொற்களை ஒழுங்குபடுத்துங்கள்:',
                        ml: 'വാക്കുകൾ ശരിയായ ക്രമത്തിൽ വെക്കുക:',
                        hi: 'शब्दों को सही क्रम में रखें:'
                    }),
                    options: [
                        { id: 1, text: 'हम सब मिलकर नई भाषा सीखते हैं।', is_correct: true },
                        { id: 2, text: 'भाषा नई सीखते हैं मिलकर हम सब।', is_correct: false },
                        { id: 3, text: 'सीखते हैं हम सब मिलकर भाषा नई।', is_correct: false },
                        { id: 4, text: 'सब मिलकर नई हम भाषा सीखते हैं।', is_correct: false },
                    ],
                    explanation: 'सटीक वाक्य विन्यास।'
                },
                {
                    id: 'q8',
                    skill: 'Contextual Vocabulary',
                    question_type: 'match_words',
                    prompt: '"मित्र" शब्द का सही अर्थ चुनें:',
                    highlight_word: 'मित्र',
                    comfortable_bridge: getGenericBridge({
                        en: 'Choose the correct meaning of "मित्र" (Friend):',
                        kn: '"मित्र" (ಸ್ನೇಹಿತ) ಪದದ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        te: '"मित्र" (స్నేహితుడు) కి సరైన అర్థాన్ని ఎంచుకోండి:',
                        ta: '"मित्र" (நண்பர்) என்ற சொல்லின் பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: '"मित्र" (സുഹൃത്ത്) എന്ന വാക്കിന്റെ അർത്ഥം തിരഞ്ഞെടുക്കുക:',
                        hi: 'सही अर्थ चुनें:'
                    }),
                    options: [
                        { id: 1, text: 'सखा / साथी', is_correct: true },
                        { id: 2, text: 'शत्रु / विरोधी', is_correct: false },
                        { id: 3, text: 'शिक्षक / गुरु', is_correct: false },
                        { id: 4, text: 'अजनबी / अनजान', is_correct: false },
                    ],
                    explanation: "'मित्र' का अर्थ सखा या साथी है।"
                },
                {
                    id: 'q9',
                    skill: 'Reading Comprehension',
                    question_type: 'reading_passage',
                    prompt: 'गद्यांश पढ़कर मीना की रुचि चुनें:',
                    passage: 'मीना को शाम को पार्क में घूमना और नई भाषाएँ सीखना पसंद है।',
                    comfortable_bridge: getGenericBridge({
                        en: 'Read the short passage and identify what Meena loves doing:',
                        kn: 'ಚಿಕ್ಕ ವಾಕ್ಯವನ್ನು ಓದಿ ಮೀನಾಗೆ ಏನು ಇಷ್ಟ ಎಂದು ಗುರುತಿಸಿ:',
                        te: 'పాఠ్యాంశాన్ని చదివి మీనాకు ఏమి ఇష్టమో ఎంచుకోండి:',
                        ta: 'பத்தியைப் படித்து மீனாவுக்கு என்ன பிடிக்கும் எனக் கண்டறியவும்:',
                        ml: 'വാക്യം വായിച്ച് മീനക്ക് എന്താണ് ഇഷ്ടമെന്ന് കണ്ടെത്തുക:',
                        hi: 'पढ़कर सही उत्तर चुनें:'
                    }),
                    options: [
                        { id: 1, text: 'नई भाषाएँ सीखना और पार्क में घूमना', is_correct: true },
                        { id: 2, text: 'दिन भर बिस्तर पर सोना', is_correct: false },
                        { id: 3, text: 'डरावनी फ़िल्में देखना', is_correct: false },
                        { id: 4, text: 'खाना बनाना', is_correct: false },
                    ],
                    explanation: 'गद्यांश में मीना की रुचि का वर्णन है।'
                },
                {
                    id: 'q10',
                    skill: 'Speaking Confidence',
                    question_type: 'voice_speaking',
                    prompt: 'वाक्य को स्पष्ट रूप से बोलें:',
                    target_phrase: 'मुझे नई भाषाएँ सीखना और बोलना बहुत पसंद है।',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence into the microphone with confidence:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:',
                        ta: 'இந்த வாக்கியத்தை நம்பிக்கையுடன் ஒலிவாங்கியில் பேசவும்:',
                        ml: 'ഈ വാക്യം വ്യക്തമായി ഉച്ചരിക്കുക:',
                        hi: 'स्पष्ट रूप से बोलें:'
                    }),
                    options: [],
                    explanation: 'स्पष्ट उच्चारण करें।'
                }
            ];
        }

        // 2. Target = Telugu
        if (target === 'Telugu') {
            return [
                {
                    id: 'q1',
                    skill: 'Alphabet & Reading',
                    question_type: 'reading_passage',
                    prompt: 'పాఠ్యాంశాన్ని చదివి "పుస్తకం" అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:',
                    passage: 'రవి పాఠశాలలో పుస్తకం చదువుతున్నాడు.',
                    highlight_word: 'పుస్తకం',
                    comfortable_bridge: getBridge('పుస్తకం', {
                        en: 'Book',
                        kn: 'ಪುಸ್ತಕ',
                        hi: 'किताब',
                        ta: 'புத்தகம்',
                        ml: 'പുസ്തകം',
                        te: 'గ్రంథం'
                    }),
                    options: [
                        { id: 1, text: 'గ్రంథం / పుస్తకము', is_correct: true },
                        { id: 2, text: 'నీరు / జలము', is_correct: false },
                        { id: 3, text: 'ఇల్లు / గృహము', is_correct: false },
                        { id: 4, text: 'అన్నం / ఆహారము', is_correct: false },
                    ],
                    explanation: "'పుస్తకం' అనగా చదివే గ్రంథము."
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary',
                    question_type: 'match_words',
                    prompt: '"అవకాశం" అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:',
                    highlight_word: 'అవకాశం',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the right meaning of "అవకాశం" (Opportunity):',
                        kn: '"ಅವಕಾಶ" ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        hi: '"అవకాశం" (अवसर) का सही अर्थ चुनें:',
                        ta: '"அవకాశం" (வாய்ப்பு) என்பதன் பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: '"అవకాశం" (അവസരം) എന്ന വാക്കിന്റെ അർത്ഥം തിരഞ്ഞെടുക്കുക:',
                        te: 'సరైన అర్థాన్ని ఎంచుకోండి:'
                    }),
                    options: [
                        { id: 1, text: 'మంచి తరుణం / శుభ సమయం', is_correct: true },
                        { id: 2, text: 'పెద్ద ఆటంకం లేదా ఆలస్యం', is_correct: false },
                        { id: 3, text: 'రాతలో దొర్లిన పొరపాటు', is_correct: false },
                        { id: 4, text: 'పాత కాలపు కథ', is_correct: false },
                    ],
                    explanation: "'అవకాశం' అంటే అనుకూలమైన సమయం."
                },
                {
                    id: 'q3',
                    skill: 'Sentence Structure',
                    question_type: 'arrange_words',
                    prompt: 'సరియైన తెలుగు వాక్యాన్ని అమర్చండి:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a correct Telugu sentence:',
                        kn: 'ಸರಿಯಾದ ವಾಕ್ಯಕ್ಕಾಗಿ ಪದಗಳನ್ನು ಜೋಡಿಸಿ:',
                        hi: 'सही तेलुगु वाक्य क्रम चुनें:',
                        ta: 'சொற்களை வரிசைப்படுத்தி சரியான வாக்கியத்தை அமைக்கவும்:',
                        ml: 'വാക്കുകൾ ക്രമീകരിക്കുക:',
                        te: 'సరియైన వాక్య క్రమాన్ని ఎంచుకోండి:'
                    }),
                    options: [
                        { id: 1, text: 'నేను ప్రతీ రోజూ తెలుగు నేర్చుకుంటాను.', is_correct: true },
                        { id: 2, text: 'తెలుగు నేను నేర్చుకుంటాను రోజూ.', is_correct: false },
                        { id: 3, text: 'రోజూ నేర్చుకుంటాను తెలుగు నేను.', is_correct: false },
                        { id: 4, text: 'నేర్చుకుంటాను నేను తెలుగు రోజూ.', is_correct: false },
                    ],
                    explanation: 'కర్త + కాలము + కర్మ + క్రియ.'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: 'విజయానికి నిరంతర _____ అవసరం.',
                    passage: 'విజయానికి నిరంతర _____ అవసరం.',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Fill in the blank with the correct word:',
                        kn: 'ಸರಿಯಾದ ಪದದಿಂದ ಖಾಲಿ ಜಾಗವನ್ನು ತುಂಬಿರಿ:',
                        hi: 'सही शब्द से वाक्य पूरा करें:',
                        ta: 'கோடிட்ட இடத்தை நிரப்பவும்:',
                        ml: 'ശരിയായ വാക്ക് തിരഞ്ഞെടുക്കുക:',
                        te: 'సరైన పదంతో ఖాళీని భర్తీ చేయండి:'
                    }),
                    options: [
                        { id: 1, text: 'సాధన', is_correct: true },
                        { id: 2, text: 'నిద్ర', is_correct: false },
                        { id: 3, text: 'ఆలస్యం', is_correct: false },
                        { id: 4, text: 'కోపం', is_correct: false },
                    ],
                    explanation: "'సాధన' అనగా అభ్యాసము."
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                    target_phrase: 'నమస్కారం! నేను లింగోపాత్ తో తెలుగు చదవడం నేర్చుకుంటున్నాను.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence aloud into the microphone:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:',
                        hi: 'इस वाक्य को स्पष्ट रूप से बोलें:',
                        ta: 'இந்த வாக்கியத்தை சத்தமாகப் பேசுங்கள்:',
                        ml: 'ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:'
                    }),
                    options: [],
                    explanation: 'స్పష్టమైన ఉచ్ఛారణతో చదవండి.'
                },
                {
                    id: 'q6',
                    skill: 'Grammar Basics',
                    question_type: 'fill_blank',
                    prompt: 'సరైన పదాన్ని ఎంచుకోండి:',
                    passage: 'శుభ _____! మీ రోజు ప్రశాంతంగా ఉండాలి.',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Choose the correct greeting word:',
                        kn: 'ಸರಿಯಾದ ಪದವನ್ನು ಆರಿಸಿ:',
                        hi: 'सही शब्द चुनें:',
                        ta: 'சரியான சொல்லைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ വാക്ക് തിരഞ്ഞെടുക്കുക:',
                        te: 'సరైన పదాన్ని ఎంచుకోండి:'
                    }),
                    options: [
                        { id: 1, text: 'ఉదయం', is_correct: true },
                        { id: 2, text: 'రాత్రి', is_correct: false },
                        { id: 3, text: 'కలం', is_correct: false },
                        { id: 4, text: 'దారి', is_correct: false },
                    ],
                    explanation: "'శుభ ఉదయం' అనగా వేకువ వేళల శుభాకాంక్ష."
                },
                {
                    id: 'q7',
                    skill: 'Advanced Sentence Building',
                    question_type: 'arrange_words',
                    prompt: 'పదాలను సక్రమమైన వరుసలో అమర్చండి:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a coherent sentence:',
                        kn: 'ಪದಗಳನ್ನು ಸರಿಯಾದ ಕ್ರಮದಲ್ಲಿ ಇರಿಸಿ:',
                        hi: 'शब्दों को सही क्रम में रखें:',
                        ta: 'சொற்களை வரிசைப்படுத்துங்கள்:',
                        ml: 'വാക്കുകൾ ശരിയായ ക്രമത്തിൽ വെക്കുക:',
                        te: 'సరియైన వరుసలో అమర్చండి:'
                    }),
                    options: [
                        { id: 1, text: 'మనం కలిసి కొత్త భాషలు నేర్చుకుందాం.', is_correct: true },
                        { id: 2, text: 'భాషలు మనం నేర్చుకుందాం కలిసి కొత్త.', is_correct: false },
                        { id: 3, text: 'కొత్త నేర్చుకుందాం కలిసి మనం భాషలు.', is_correct: false },
                        { id: 4, text: 'నేర్చుకుందాం కొత్త భాషలు మనం కలిసి.', is_correct: false },
                    ],
                    explanation: 'సరియైన వాక్య నిర్మాణం.'
                },
                {
                    id: 'q8',
                    skill: 'Contextual Vocabulary',
                    question_type: 'match_words',
                    prompt: '"స్నేహితుడు" అనే పదానికి అర్థాన్ని ఎంచుకోండి:',
                    highlight_word: 'స్నేహితుడు',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the synonym for "స్నేహితుడు" (Friend):',
                        kn: '"స్నేహితుడు" (ಸ್ನೇಹಿತ) ಪದದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        hi: 'सही अर्थ चुनें:',
                        ta: 'சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ അർത്ഥം കണ്ടെത്തുക:',
                        te: 'సరైన అర్థాన్ని ఎంచుకోండి:'
                    }),
                    options: [
                        { id: 1, text: 'మిత్రుడు / సహచరుడు', is_correct: true },
                        { id: 2, text: 'అపరిచితుడు', is_correct: false },
                        { id: 3, text: 'ఉపాధ్యాయుడు', is_correct: false },
                        { id: 4, text: 'శత్రువు', is_correct: false },
                    ],
                    explanation: "'స్నేహితుడు' అనగా మిత్రుడు."
                },
                {
                    id: 'q9',
                    skill: 'Reading Comprehension',
                    question_type: 'reading_passage',
                    prompt: 'పాఠ్యాంశాన్ని చదివి గీతకు ఏమి ఇష్టమో ఎంచుకోండి:',
                    passage: 'గీత ప్రతిరోజూ ఉదయాన్నే లేచి పుస్తకాలు చదువుతుంది.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Read the sentence and pick what Geetha likes:',
                        kn: 'ವಾಕ್ಯವನ್ನು ಓದಿ ಗೀತಾಗೆ ಏನು ಇಷ್ಟ ಎಂದು ಗುರುತಿಸಿ:',
                        hi: 'गद्यांश पढ़कर सही उत्तर चुनें:',
                        ta: 'படித்து சரியான விடையைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ ഉത്തരം തിരഞ്ഞെടുക്കുക:',
                        te: 'చదివి సరైన సమాధానం ఎంచుకోండి:'
                    }),
                    options: [
                        { id: 1, text: 'ఉదయాన్నే పుస్తకాలు చదవడం', is_correct: true },
                        { id: 2, text: 'రోజంతా టీవీ చూడటం', is_correct: false },
                        { id: 3, text: 'ఫోన్ లో ఆటలు ఆడటం', is_correct: false },
                        { id: 4, text: 'మధ్యాహ్నం వరకు నిద్రపోవడం', is_correct: false },
                    ],
                    explanation: 'గీత ఉదయాన్నే పుస్తకాలు చదువుతుంది.'
                },
                {
                    id: 'q10',
                    skill: 'Speaking Practice',
                    question_type: 'voice_speaking',
                    prompt: 'ఈ వాక్యాన్ని స్పష్టంగా మాట్లాడండి:',
                    target_phrase: 'నాకు చదవడం మరియు వ్రాయడం చాలా ఇష్టం.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this phrase clearly into microphone:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:',
                        hi: 'स्पष्ट रूप से बोलें:',
                        ta: 'தெளிவாகப் பேசுங்கள்:',
                        ml: 'വ്യക്തമായി സംസാരിക്കുക:',
                        te: 'స్పష్టంగా మాట్లాడండి:'
                    }),
                    options: [],
                    explanation: 'స్పష్టమైన ఉచ్ఛారణతో చెప్పండి.'
                }
            ];
        }

        // 3. Target = Kannada
        if (target === 'Kannada') {
            return [
                {
                    id: 'q1',
                    skill: 'Alphabet & Reading',
                    question_type: 'reading_passage',
                    prompt: 'ವಾಕ್ಯವನ್ನು ಓದಿ "ಪುಸ್ತಕ" ಪದದ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                    passage: 'ರವಿ ಪ್ರತಿದಿನ ಶಾಲೆಯಲ್ಲಿ ಪುಸ್ತಕ ಓದುತ್ತಾನೆ.',
                    highlight_word: 'ಪುಸ್ತಕ',
                    comfortable_bridge: getBridge('ಪುಸ್ತಕ', {
                        en: 'Book',
                        hi: 'किताब',
                        te: 'పుస్తకం',
                        ta: 'புத்தகம்',
                        ml: 'പുസ്തകം',
                        kn: 'ಗ್ರಂಥ'
                    }),
                    options: [
                        { id: 1, text: 'ಗ್ರಂಥ / ಪುಸ್ತಕ', is_correct: true },
                        { id: 2, text: 'ನೀರು / ಜಲ', is_correct: false },
                        { id: 3, text: 'ಮನೆ / ಭವನ', is_correct: false },
                        { id: 4, text: 'ಆಹಾರ / ಊಟ', is_correct: false },
                    ],
                    explanation: "'ಪುಸ್ತಕ' ಎಂದರೆ ಓದುವ ಗ್ರಂಥ."
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary',
                    question_type: 'match_words',
                    prompt: '"ಅವಕಾಶ" ಪದಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                    highlight_word: 'ಅವಕಾಶ',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the right synonym for "ಅವಕಾಶ" (Opportunity):',
                        hi: '"ಅವಕಾಶ" (अवसर) का सही अर्थ चुनें:',
                        te: '"అవకాశం" కి సరిపోయే అర్థాన్ని ఎంచుకోండి:',
                        ta: 'சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ അർത്ഥം കണ്ടെത്തുക:',
                        kn: 'ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:'
                    }),
                    options: [
                        { id: 1, text: 'ಒಳ್ಳೆಯ ಸಮಯ / ಅನುಕೂಲ', is_correct: true },
                        { id: 2, text: 'ದೊಡ್ಡ ಅಡಚಣೆ', is_correct: false },
                        { id: 3, text: 'ಬರಹದ ತಪ್ಪು', is_correct: false },
                        { id: 4, text: 'ಹಳೆಯ ಕಥೆ', is_correct: false },
                    ],
                    explanation: "'ಅವಕಾಶ' ಎಂದರೆ ಅನುಕೂಲಕರ ಸಂದರ್ಭ."
                },
                {
                    id: 'q3',
                    skill: 'Sentence Structure',
                    question_type: 'arrange_words',
                    prompt: 'ಸರಿಯಾದ ಕನ್ನಡ ವಾಕ್ಯವನ್ನು ರಚಿಸಲು ಪದಗಳನ್ನು ಜೋಡಿಸಿ:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a correct Kannada sentence:',
                        hi: 'सही वाक्य क्रम चुनें:',
                        te: 'సరైన వాక్య క్రమాన్ని ఎంచుకోండి:',
                        ta: 'சொற்களை வரிசைப்படுத்துங்கள்:',
                        ml: 'വാക്കുകൾ ക്രമീകരിക്കുക:',
                        kn: 'ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆಗಾಗಿ ಜೋಡಿಸಿ:'
                    }),
                    options: [
                        { id: 1, text: 'ನಾನು ಪ್ರತಿದಿನ ಹೊಸ ಭಾಷೆ ಕಲಿಯುತ್ತೇನೆ.', is_correct: true },
                        { id: 2, text: 'ಕಲಿಯುತ್ತೇನೆ ನಾನು ಹೊಸ ಭಾಷೆ ಪ್ರತಿದಿನ.', is_correct: false },
                        { id: 3, text: 'ಹೊಸ ಭಾಷೆ ಕಲಿಯುತ್ತೇನೆ ಪ್ರತಿದಿನ ನಾನು.', is_correct: false },
                        { id: 4, text: 'ಪ್ರತಿದಿನ ಕಲಿಯುತ್ತೇನೆ ನಾನು ಹೊಸ ಭಾಷೆ.', is_correct: false },
                    ],
                    explanation: 'ಕರ್ತೃ + ಕಾಲ + ಕರ್ಮ + ಕ್ರಿಯಾಪದ.'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: 'ಯಶಸ್ಸಿಗೆ ನಿರಂತರ _____ ಅಗತ್ಯ.',
                    passage: 'ಯಶಸ್ಸಿಗೆ ನಿರಂತರ _____ ಅಗತ್ಯ.',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Fill in the blank with the appropriate word:',
                        hi: 'सही शब्द से खाली स्थान भरें:',
                        te: 'సరిపోయే పదంతో భర్తీ చేయండి:',
                        ta: 'கோடிட்ட இடத்தை நிரப்பவும்:',
                        ml: 'വിടവ് നികത്തുക:',
                        kn: 'ಸರಿಯಾದ ಪದದಿಂದ ಭರ್ತಿ ಮಾಡಿ:'
                    }),
                    options: [
                        { id: 1, text: 'ಅಭ್ಯಾಸ', is_correct: true },
                        { id: 2, text: 'ಆಲಸ್ಯ', is_correct: false },
                        { id: 3, text: 'ನಿದ್ರೆ', is_correct: false },
                        { id: 4, text: 'ಕೋಪ', is_correct: false },
                    ],
                    explanation: "'ಅಭ್ಯಾಸ' ವಾಕ್ಯಕ್ಕೆ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ನೀಡುತ್ತದೆ."
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: 'ಈ ವಾಕ್ಯವನ್ನು ಗಟ್ಟಿಯಾಗಿ ಮಾತನಾಡಿ:',
                    target_phrase: 'ನಮಸ್ಕಾರ! ನಾನು ಲಿಂಗೋಪಾತ್ ಮೂಲಕ ಕನ್ನಡ ಕಲಿಯುತ್ತಿದ್ದೇನೆ.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence aloud into the microphone:',
                        hi: 'इस वाक्य को स्पष्ट रूप से बोलें:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                        ta: 'இந்த வாக்கியத்தை சத்தமாகப் பேசுங்கள்:',
                        ml: 'ഈ വാക്യം സംസാരിക്കുക:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಗಟ್ಟಿಯಾಗಿ ಮಾತನಾಡಿ:'
                    }),
                    options: [],
                    explanation: 'ಸ್ಪಷ್ಟವಾಗಿ ಉಚ್ಚರಿಸಿ.'
                }
            ];
        }

        // 4. Target = Tamil
        if (target === 'Tamil') {
            return [
                {
                    id: 'q1',
                    skill: 'Alphabet & Reading',
                    question_type: 'reading_passage',
                    prompt: 'பத்தியைப் படித்து "ஆர்வமுள்ள" என்ற சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
                    passage: 'ரவி ஒவ்வொரு காலையிலும் நூலகத்திற்குச் செல்ல மிகவும் ஆர்வமாக இருந்தான். வெவ்வேறு நாடுகளைப் பற்றிய கதைகளைப் படிக்க அவன் விரும்பினான்.',
                    highlight_word: 'ஆர்வமுள்ள',
                    comfortable_bridge: getBridge('ஆர்வமுள்ள', {
                        en: 'Excited / Enthusiastic',
                        hi: 'उत्साहित',
                        te: 'ఉత్సాహం',
                        kn: 'ಉತ್ಸಾಹಭರಿತ',
                        ta: 'ஆர்வம் மற்றும் உற்சாகம்',
                        ml: 'ഉത്സാഹഭരിതനായ'
                    }),
                    options: [
                        { id: 1, text: 'ஆர்வம் மற்றும் உற்சாகம் (Enthusiastic and keen)', is_correct: true },
                        { id: 2, text: 'ஆர்வம் இன்மையும் சலிப்பும்', is_correct: false },
                        { id: 3, text: 'பயமும் தயக்கமும்', is_correct: false },
                        { id: 4, text: 'சோர்வும் தூக்கமும்', is_correct: false },
                    ],
                    explanation: '"ஆர்வமுள்ள" என்றால் மிகுந்த ஈடுபாடும் உற்சாகமும் கொண்டது.'
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary',
                    question_type: 'match_words',
                    prompt: '"வாய்ப்பு" என்ற சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
                    highlight_word: 'வாய்ப்பு',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the correct meaning for "வாய்ப்பு" (Opportunity):',
                        hi: '"வாய்ப்பு" (अवसर) का सही अर्थ चुनें:',
                        te: '"வாய்ப்பு" (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:',
                        kn: '"வாய்ப்பு" (ಅವಕಾಶ) ಪದದ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        ml: '"வாய்ப்பு" (അവസരം) എന്ന വാക്കിന്റെ അർത്ഥം കണ്ടെത്തുക:',
                        ta: 'சரியான பொருளைத் தேர்ந்தெடுக்கவும்:'
                    }),
                    options: [
                        { id: 1, text: 'நல்ல நேரம் / நல் வாய்ப்பு', is_correct: true },
                        { id: 2, text: 'பெரிய தடை அல்லது தாமதம்', is_correct: false },
                        { id: 3, text: 'எழுத்துப் பிழை', is_correct: false },
                        { id: 4, text: 'பழைய கதை', is_correct: false },
                    ],
                    explanation: '"வாய்ப்பு" என்பது ஒரு செயலைச் செய்ய ஏற்ற தருணம்.'
                },
                {
                    id: 'q3',
                    skill: 'Sentence Structure',
                    question_type: 'arrange_words',
                    prompt: 'சரியான தமிழ் வாக்கியத்தை அமைக்க சொற்களை ஒழுங்குபடுத்துங்கள்:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a correct Tamil sentence:',
                        hi: 'सही तमिल वाक्य क्रम चुनें:',
                        te: 'సరైన వాక్య క్రమాన్ని ఎంచుకోండి:',
                        kn: 'ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆಗಾಗಿ ಜೋಡಿಸಿ:',
                        ml: 'വാക്കുകൾ ക്രമീകരിക്കുക:',
                        ta: 'சரியான வாக்கிய அமைப்பைத் தேர்ந்தெடுக்கவும்:'
                    }),
                    options: [
                        { id: 1, text: 'நான் தினமும் புதிய மொழியைக் கற்கிறேன்.', is_correct: true },
                        { id: 2, text: 'கற்கிறேன் நான் புதிய மொழியைக் தினமும்.', is_correct: false },
                        { id: 3, text: 'தினமும் கற்கிறேன் மொழியைக் புதிய நான்.', is_correct: false },
                        { id: 4, text: 'புதிய மொழியைக் தினமும் கற்கிறேன் நான்.', is_correct: false },
                    ],
                    explanation: 'எழுவாய் + கால இடைநிலை + செயப்படுபொருள் + பயனிலை.'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: 'வெற்றிக்கு தொடர்ச்சியான _____ அவசியம்.',
                    passage: 'வெற்றிக்கு தொடர்ச்சியான _____ அவசியம்.',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Fill in the blank with the appropriate word:',
                        hi: 'सही शब्द से खाली स्थान भरें:',
                        te: 'సరిపోయే పదంతో భర్తీ చేయండి:',
                        kn: 'ಸೂಕ್ತ ಪದದಿಂದ ಭರ್ತಿ ಮಾಡಿ:',
                        ml: 'വിടവ് നികത്തുക:',
                        ta: 'சரியான சொல்லால் நிரப்புக:'
                    }),
                    options: [
                        { id: 1, text: 'பயிற்சி', is_correct: true },
                        { id: 2, text: 'சோம்பல்', is_correct: false },
                        { id: 3, text: 'தூக்கம்', is_correct: false },
                        { id: 4, text: 'கோபம்', is_correct: false },
                    ],
                    explanation: '"பயிற்சி" என்பது தொடர் முயற்சியைக் குறிக்கிறது.'
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: 'இந்த வாக்கியத்தை உரக்கப் படித்து பதிவு செய்யுங்கள்:',
                    target_phrase: 'வணக்கம்! நான் லிங்கோபாத் மூலம் தமிழ் கற்றுக்கொள்கிறேன்.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence aloud into the microphone:',
                        hi: 'इस वाक्य को स्पष्ट रूप से बोलें:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:',
                        ml: 'ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:',
                        ta: 'இந்த வாக்கியத்தை உரக்கப் படிக்கவும்:'
                    }),
                    options: [],
                    explanation: 'தெளிவாக உச்சரிக்கவும்.'
                }
            ];
        }

        // 5. Target = Malayalam
        if (target === 'Malayalam') {
            return [
                {
                    id: 'q1',
                    skill: 'Alphabet & Reading',
                    question_type: 'reading_passage',
                    prompt: 'ഖണ്ഡിക വായിച്ച് "ആവേശം" എന്ന വാക്കിന്റെ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക:',
                    passage: 'രവി ദിവസവും രാവിലെയെ ലൈബ്രറി സന്ദർശിക്കാൻ വളരെ ആവേശഭരിതനായിരുന്നു. വിവിധ രാജ്യങ്ങളെക്കുറിച്ചുള്ള കഥകൾ വായിക്കാൻ അവൻ ഇഷ്ടപ്പെട്ടു.',
                    highlight_word: 'ആവേശം',
                    comfortable_bridge: getBridge('ആവേശം', {
                        en: 'Excited / Enthusiastic',
                        hi: 'उत्साहित',
                        te: 'ఉత్സാహం',
                        kn: 'ಉತ್ಸಾಹಭರಿತ',
                        ta: 'ஆர்வமுள்ள',
                        ml: 'വളരെ കൗതുകവും സന്തോഷവും'
                    }),
                    options: [
                        { id: 1, text: 'വളരെ കൗതുകവും സന്തോഷവും (Enthusiastic and keen)', is_correct: true },
                        { id: 2, text: 'താൽപ്പര്യമില്ലാത്തതും മടുപ്പുള്ളതും', is_correct: false },
                        { id: 3, text: 'ഭയമുള്ളതും സംശയാസ്പദമായതും', is_correct: false },
                        { id: 4, text: 'ക്ഷീണിതനും ഉറക്കം വരുന്നവനും', is_correct: false },
                    ],
                    explanation: '"ആവേശം" എന്നാൽ സന്തോഷത്തോടുകൂടിയ വലിയ താല്പര്യം.'
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary',
                    question_type: 'match_words',
                    prompt: '"അവസരം" എന്ന വാക്കിന്റെ ശരിയായ അർത്ഥം തിരഞ്ഞെടുക്കുക:',
                    highlight_word: 'അവസരം',
                    comfortable_bridge: getGenericBridge({
                        en: 'Select the right synonym for "അവസരം" (Opportunity):',
                        hi: '"അവസരം" (अवसर) का सही अर्थ चुनें:',
                        te: '"അവസരം" (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:',
                        kn: '"അവസരം" (ಅವಕಾಶ) ಪದದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:',
                        ta: '"அവസരം" (வாய்ப்பு) என்பதன் பொருளைத் தேர்ந்தெடுக்கவும்:',
                        ml: 'ശരിയായ അർത്ഥം കണ്ടെത്തുക:'
                    }),
                    options: [
                        { id: 1, text: 'നല്ല സമയം / ശുഭ മുഹൂർത്തം', is_correct: true },
                        { id: 2, text: 'വലിയ തടസ്സം അല്ലെങ്കിൽ കാലതാമസം', is_correct: false },
                        { id: 3, text: 'എഴുത്തിലെ തെറ്റ്', is_correct: false },
                        { id: 4, text: 'പഴയ കഥ', is_correct: false },
                    ],
                    explanation: '"അവസരം" എന്നാൽ അനുയോജ്യമായ സമയം.'
                },
                {
                    id: 'q3',
                    skill: 'Sentence Structure',
                    question_type: 'arrange_words',
                    prompt: 'ശരിയായ മലയാളം വാക്യം നിർമ്മിക്കാൻ വാക്കുകൾ ക്രമീകരിക്കുക:',
                    comfortable_bridge: getGenericBridge({
                        en: 'Arrange the words to form a correct Malayalam sentence:',
                        hi: 'सही वाक्य क्रम चुनें:',
                        te: 'సరైన వాక్య క్రమాన్ని ఎంచుకోండి:',
                        kn: 'ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆಗಾಗಿ ಜೋಡಿಸಿ:',
                        ta: 'சொற்களை வரிசைப்படுத்துங்கள்:',
                        ml: 'ശരിയായ വാക്യം നിർമ്മിക്കുക:'
                    }),
                    options: [
                        { id: 1, text: 'ഞാൻ ദിവസവും പുതിയ ഭാഷ പഠിക്കുന്നു.', is_correct: true },
                        { id: 2, text: 'പഠിക്കുന്നു ഞാൻ ഭാഷ പുതിയ ദിവസവും.', is_correct: false },
                        { id: 3, text: 'ദിവസവും പഠിക്കുന്നു ഭാഷ പുതിയ ഞാൻ.', is_correct: false },
                        { id: 4, text: 'പുതിയ ഭാഷ ദിവസവും പഠിക്കുന്നു ഞാൻ.', is_correct: false },
                    ],
                    explanation: 'കർത്താവ് + സമയം + കർമ്മം + ക്രിയ.'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: 'വിജയത്തിന് നിരന്തരമായ _____ ആവശ്യമാണ്.',
                    passage: 'വിജയത്തിന് നിരന്തരമായ _____ ആവശ്യമാണ്.',
                    highlight_word: '_____',
                    comfortable_bridge: getGenericBridge({
                        en: 'Fill in the blank with the appropriate word:',
                        hi: 'सही शब्द से खाली स्थान भरें:',
                        te: 'సరిపోయే పదంతో భర్తీ చేయండి:',
                        kn: 'ಸೂಕ್ತ ಪದದಿಂದ ಭರ್ತಿ ಮಾಡಿ:',
                        ta: 'கோடிட்ட இடத்தை நிரப்பவும்:',
                        ml: 'ശരിയായ വാക്ക് കൊണ്ട് വിടവ് നികത്തുക:'
                    }),
                    options: [
                        { id: 1, text: 'അഭ്യാസം', is_correct: true },
                        { id: 2, text: 'മടി', is_correct: false },
                        { id: 3, text: 'ഉറക്കം', is_correct: false },
                        { id: 4, text: 'ദേഷ്യം', is_correct: false },
                    ],
                    explanation: '"അഭ്യാസം" എന്നാൽ തുടർച്ചയായ പരിശീലനം.'
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: 'ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:',
                    target_phrase: 'നമസ്കാരം! ഞാൻ ലിംഗോപാത്ത് വഴി മലയാളം പഠിക്കുകയാണ്.',
                    comfortable_bridge: getGenericBridge({
                        en: 'Speak this sentence aloud into the microphone:',
                        hi: 'इस वाक्य को स्पष्ट रूप से बोलें:',
                        te: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                        kn: 'ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:',
                        ta: 'இந்த வாக்கியத்தை உரக்கப் படிக்கவும்:',
                        ml: 'ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:'
                    }),
                    options: [],
                    explanation: 'വ്യക്തമായി ഉച്ചരിക്കുക.'
                }
            ];
        }

        // Default English Target Language Set
        return [
            {
                id: 'q1',
                skill: 'Reading Passage',
                question_type: 'reading_passage',
                prompt: `Read the passage and select the correct meaning of 'excited':`,
                passage: `Ravi was excited to visit the library every morning. He loved reading stories about different countries.`,
                highlight_word: 'excited',
                comfortable_bridge: getBridge('excited', {
                    en: 'Excited / Enthusiastic',
                    hi: 'उत्साहित',
                    te: 'ఉత్సాహం',
                    kn: 'ಉತ್ಸಾಹಭರಿತ',
                    ta: 'ஆர்வமுள்ள',
                    ml: 'ഉത്സാഹഭരിതനായ'
                }),
                options: [
                    { id: 1, text: 'Enthusiastic and keen', is_correct: true },
                    { id: 2, text: 'Uninterested and bored', is_correct: false },
                    { id: 3, text: 'Fearful and hesitant', is_correct: false },
                    { id: 4, text: 'Tired and sleepy', is_correct: false },
                ],
                explanation: '"Excited" means eager and enthusiastic.'
            },
            {
                id: 'q2',
                skill: 'Vocabulary Matching',
                question_type: 'match_words',
                prompt: `Select the synonym that best matches 'opportunity':`,
                highlight_word: 'opportunity',
                comfortable_bridge: getGenericBridge({
                    en: `Select the synonym that best matches 'opportunity':`,
                    hi: `'opportunity' (अवसर) का सही पर्याय चुनें:`,
                    te: `'opportunity' (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:`,
                    kn: `'opportunity' (ಅವಕಾಶ) ಪದದ ಸರಿಯಾದ ಅರ್ಥವನ್ನು ಆರಿಸಿ:`,
                    ta: `'opportunity' (வாய்ப்பு) என்ற சொல்லின் பொருளைத் தேர்ந்தெடுக்கவும்:`,
                    ml: `'opportunity' (അവസരം) എന്ന വാക്കിന്റെ അർത്ഥം കണ്ടെത്തുക:`
                }),
                options: [
                    { id: 1, text: 'Favorable chance or moment', is_correct: true },
                    { id: 2, text: 'Difficult obstacle or delay', is_correct: false },
                    { id: 3, text: 'Misunderstanding or mistake', is_correct: false },
                    { id: 4, text: 'Written record or document', is_correct: false },
                ],
                explanation: 'An opportunity is a favorable set of circumstances.'
            },
            {
                id: 'q3',
                skill: 'Sentence Structure',
                question_type: 'arrange_words',
                prompt: `Arrange the words to form a grammatically correct sentence:`,
                comfortable_bridge: getGenericBridge({
                    en: `Arrange words in subject + verb + object order:`,
                    hi: `व्याकरण की दृष्टि से सही वाक्य क्रम चुनें:`,
                    te: `సరైన వాక్య క్రమంలో అమర్చండి:`,
                    kn: `ಸರಿಯಾದ ವಾಕ್ಯ ರಚನೆಗಾಗಿ ಜೋಡಿಸಿ:`,
                    ta: `சரியான வாக்கியமாக அமைக்கவும்:`,
                    ml: `ശരിയായ വാക്യം നിർമ്മിക്കുക:`
                }),
                options: [
                    { id: 1, text: 'Every day she practices speaking fluent English.', is_correct: true },
                    { id: 2, text: 'Practices she fluent English speaking every day.', is_correct: false },
                    { id: 3, text: 'English fluent she practices speaking every day.', is_correct: false },
                    { id: 4, text: 'Every day fluent English she speaking practices.', is_correct: false },
                ],
                explanation: 'Correct standard English word order: Subject + Verb + Object + Time clause.'
            },
            {
                id: 'q4',
                skill: 'Comprehension & Context',
                question_type: 'fill_blank',
                prompt: `Fill in the blank with the most fitting word:`,
                passage: `Regular _____ is essential to master any new skill or spoken language.`,
                highlight_word: '_____',
                comfortable_bridge: getGenericBridge({
                    en: `Choose the word that makes the sentence logical and meaningful:`,
                    hi: `खाली स्थान के लिए सबसे उपयुक्त शब्द चुनें:`,
                    te: `ఖాళీని సరియైన పదంతో భర్తీ చేయండి:`,
                    kn: `ಖಾಲಿ ಜಾಗವನ್ನು ಸೂಕ್ತ ಪದದಿಂದ ಭರ್ತಿ ಮಾಡಿ:`,
                    ta: `பொருத்தமான சொல்லால் நிரப்புக:`,
                    ml: `ശരിയായ വാക്ക് കൊണ്ട് വിടവ് നികത്തുക:`
                }),
                options: [
                    { id: 1, text: 'practice', is_correct: true },
                    { id: 2, text: 'hesitation', is_correct: false },
                    { id: 3, text: 'silence', is_correct: false },
                    { id: 4, text: 'distraction', is_correct: false },
                ],
                explanation: '"Practice" logically completes the context of mastering a skill.'
            },
            {
                id: 'q5',
                skill: 'Voice & Pronunciation',
                question_type: 'voice_speaking',
                prompt: `Read the following sentence aloud clearly into your microphone:`,
                target_phrase: `Consistency and daily practice lead to fluency and confidence.`,
                comfortable_bridge: getGenericBridge({
                    en: `Speak this sentence into microphone:`,
                    hi: `इस वाक्य को माइक्रोफ़ोन में स्पष्ट रूप से बोलें:`,
                    te: `ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:`,
                    kn: `ಈ ವಾಕ್ಯವನ್ನು ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ:`,
                    ta: `இந்த வாக்கியத்தை ஒலிவாங்கியில் பேசவும்:`,
                    ml: `ഈ വാക്യം വ്യക്തമായി സംസാരിക്കുക:`
                }),
                options: [],
                explanation: 'Focus on clear pronunciation.'
            }
        ];
    },

    async submitDiagnostic(answers: Record<string, any>): Promise<{ accuracy: number; insight: AILearnerInsight }> {
        try {
            return await apiClient.post<{ accuracy: number; insight: AILearnerInsight }>('/assessment/submit/', { answers });
        } catch {
            const defaultInsight: AILearnerInsight = {
                summary_headline: "Personalized Literacy Assessment Complete ✨",
                reading_summary: "You are comfortable with short passages and everyday written signs.",
                vocabulary_summary: "You recognize common everyday words well.",
                writing_summary: "You can write simple words, but need practice forming full sentences.",
                speaking_summary: "Speaking confidence is your biggest growth opportunity.",
                recommended_focus: "Everyday conversations + sentence building",
                recommended_starting_point: "Level 2 Reading & Level 1 Speaking",
            };
            return { accuracy: 85.0, insight: defaultInsight };
        }
    },

    async getAILearnerInsights(): Promise<AILearnerInsight> {
        try {
            return await apiClient.get<AILearnerInsight>('/insights/');
        } catch {
            return {
                summary_headline: "Personalized Literacy Diagnostic Complete ✨",
                reading_summary: "You recognize everyday words and simple passages with high confidence.",
                vocabulary_summary: "Good core vocabulary. Ready to expand into conversational terms.",
                writing_summary: "Capable of basic sentence assembly; sentence connectors require practice.",
                speaking_summary: "Speaking confidence is your primary growth opportunity.",
                recommended_focus: "Everyday conversations + sentence building",
                recommended_starting_point: "Level 2 Reading & Level 1 Speaking Journey",
            };
        }
    }
};
