import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { voiceService } from '../services/voiceService';
import { VoiceAnalysisResult } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useTranslation } from '../utils/translations';
import {
    Mic,
    Volume2,
    Sparkles,
    CheckCircle2,
    ArrowLeft,
    RotateCcw,
    Radio,
    Award,
    Activity,
    BookOpen,
    Square,
    Play,
    Zap,
    HelpCircle
} from 'lucide-react';

const VOICE_STUDIO_TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        back: "Back to Dashboard",
        badge: "Speaking & Voice Studio",
        title: "Interactive Speech Studio & Pronunciation Feedback",
        desc: "Listen to native TTS audio, pronounce the sentence, and get real-time AI pronunciation feedback!",
        select_lang: "Select Language to Practice:",
        phrase: "Phrase",
        target_in: "Target Phrase in",
        guide: "Pronunciation Guide",
        meaning: "Meaning",
        tts_speed: "TTS Speech Speed:",
        slow: "Slow (0.7x)",
        normal: "Normal (0.9x)",
        fast: "Fast (1.1x)",
        listen_tts: "Listen Text-to-Speech (TTS)",
        mic_listening: "Listening... Speak into microphone 🎙️",
        mic_tap: "Tap microphone to start real-time Speech-to-Text",
        stt_sub: "Real-time STT captures your voice and evaluates pronunciation clarity.",
        live_stt: "Live STT Transcription:",
        rec_active: "RECORDING ACTIVE",
        score_title: "Pronunciation Score",
        clarity: "Clarity",
        word_breakdown: "Word Accuracy Breakdown:"
    },
    kn: {
        back: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
        badge: "ಧ್ವನಿ & ಉಚ್ಚಾರಣಾ ಸ್ಟುಡಿಯೋ",
        title: "ಸಂವಾದಾತ್ಮಕ ಧ್ವನಿ ಸ್ಟುಡಿಯೋ & ಉಚ್ಚಾರಣಾ ಮಾರ್ಗದರ್ಶಿ",
        desc: "ನೈಜ ಆಡಿಯೊ ಆಲಿಸಿ, ವಾಕ್ಯವನ್ನು ಮಾತನಾಡಿ ಮತ್ತು ತಕ್ಷಣದ AI ಉಚ್ಚಾರಣಾ ಪ್ರತಿಕ್ರಿಯೆ ಪಡೆಯಿರಿ!",
        select_lang: "ಅಭ್ಯಾಸ ಮಾಡಲು ಭಾಷೆ ಆರಿಸಿ:",
        phrase: "ವಾಕ್ಯ",
        target_in: "ಗುರಿ ವಾಕ್ಯ",
        guide: "ಉಚ್ಚಾರಣಾ ಮಾರ್ಗದರ್ಶಿ",
        meaning: "ಅರ್ಥ",
        tts_speed: "ಧ್ವನಿ ವೇಗ:",
        slow: "ನಿಧಾನ (0.7x)",
        normal: "ಸಾಮಾನ್ಯ (0.9x)",
        fast: "ವೇಗ (1.1x)",
        listen_tts: "ಧ್ವನಿಯನ್ನು ಆಲಿಸಿ (TTS)",
        mic_listening: "ಆಲಿಸುತ್ತಿದೆ... ಮೈಕ್ರೊಫೋನ್‌ನಲ್ಲಿ ಮಾತನಾಡಿ 🎙️",
        mic_tap: "ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ",
        stt_sub: "ನಿಮ್ಮ ಧ್ವನಿಯನ್ನು ಗುರುತಿಸಿ ಉಚ್ಚಾರಣೆಯ ನಿಖರತೆಯನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡುತ್ತದೆ.",
        live_stt: "ನೇರ ಪ್ರತಿಲೇಖನ:",
        rec_active: "ರೆಕಾರ್ಡಿಂಗ್ ಸಕ್ರಿಯವಾಗಿದೆ",
        score_title: "ಉಚ್ಚಾರಣಾ ಅಂಕ",
        clarity: "ಸ್ಪಷ್ಟತೆ",
        word_breakdown: "ಪದಗಳ ನಿಖರತೆಯ ವಿವರ:"
    },
    te: {
        back: "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్లండి",
        badge: "వాయిస్ & ఉచ్చారణ స్టూడియో",
        title: "ఇంటరాక్టివ్ స్పీచ్ స్టూడియో & ఉచ్చారణ ఫీడ్‌బ్యాక్",
        desc: "స్వర ఆడియో వినండి, వాక్యాన్ని పలకండి మరియు నిజ-సమయ AI ఫీడ్‌బ్యాక్ పొందండి!",
        select_lang: "సాధన కోసం భాషను ఎంచుకోండి:",
        phrase: "వాక్యం",
        target_in: "లక్ష్య వాక్యం",
        guide: "ఉచ్చారణ గైడ్",
        meaning: "అర్థం",
        tts_speed: "స్పీచ్ వేగం:",
        slow: "నెమ్మదిగా (0.7x)",
        normal: "సాధారణం (0.9x)",
        fast: "వేగంగా (1.1x)",
        listen_tts: "ఆడియో వినండి (TTS)",
        mic_listening: "వింటోంది... మైక్రోఫోన్‌లో మాట్లాడండి 🎙️",
        mic_tap: "స్పీచ్-టు-టెక్స్ట్ ప్రారంభించడానికి మైక్‌ని నొక్కండి",
        stt_sub: "మీ స్వరాన్ని గుర్తించి ఉచ్చారణ స్పష్టతను అంచనా వేస్తుంది.",
        live_stt: "ప్రత్యక్ష లిప్యంతరీకరణ:",
        rec_active: "రికార్డింగ్ యాక్టివ్",
        score_title: "ఉచ్చారణ స్కోరు",
        clarity: "స్పష్టత",
        word_breakdown: "పదాల ఖచ్చితత్వం:"
    },
    hi: {
        back: "डैशबोर्ड पर वापस जाएं",
        badge: "ध्वनि एवं उच्चारण स्टूडियो",
        title: "इंटरैक्टिव स्पीच स्टूडियो और उच्चारण फीडबैक",
        desc: "ऑडियो सुनें, वाक्य बोलें और तत्काल एआई उच्चारण स्पष्टता प्रतिक्रिया प्राप्त करें!",
        select_lang: "अभ्यास के लिए भाषा चुनें:",
        phrase: "वाक्य",
        target_in: "लक्षित वाक्य",
        guide: "उच्चारण गाइड",
        meaning: "अर्थ",
        tts_speed: "बोलने की गति:",
        slow: "धीमी (0.7x)",
        normal: "सामान्य (0.9x)",
        fast: "तेज़ (1.1x)",
        listen_tts: "ऑडियो सुनें (TTS)",
        mic_listening: "सुन रहा है... माइक्रोफ़ोन में बोलें 🎙️",
        mic_tap: "बोलने के लिए माइक पर टैप करें",
        stt_sub: "आपकी आवाज़ पहचानकर उच्चारण की स्पष्टता का मूल्यांकन करता है।",
        live_stt: "लाइव ट्रांसक्रिप्शन:",
        rec_active: "रिकॉर्डिंग सक्रिय है",
        score_title: "उच्चारण स्कोर",
        clarity: "स्पष्टता",
        word_breakdown: "शब्द सटीकता विवरण:"
    },
    ta: {
        back: "டாஷ்போர்டுக்குத் திரும்பு",
        badge: "குரல் & உச்சரிப்பு அரங்கம்",
        title: "ஊடாடும் குரல் அரங்கம் & உச்சரிப்பு கருத்து",
        desc: "ஆடியோவைக் கேளுங்கள், வாக்கியத்தைப் பேசுங்கள் மற்றும் உடனடி AI கருத்தைப் பெறுங்கள்!",
        select_lang: "பயிற்சிக்கு மொழியைத் தேர்வு செய்யவும்:",
        phrase: "வாக்கியம்",
        target_in: "இலக்கு வாக்கியம்",
        guide: "உச்சரிப்பு வழிகாட்டி",
        meaning: "பொருள்",
        tts_speed: "பேச்சு வேகம்:",
        slow: "மெதுவாக (0.7x)",
        normal: "இயல்பான (0.9x)",
        fast: "வேகமாக (1.1x)",
        listen_tts: "ஆடியோவைக் கேள் (TTS)",
        mic_listening: "கேட்கிறது... மைக்ரோஃபோனில் பேசுங்கள் 🎙️",
        mic_tap: "பேச மைக்ரோஃபோனைத் தட்டவும்",
        stt_sub: "உங்கள் குரலைக் கேட்டு உச்சரிப்புத் தெளிவை மதிப்பிடுகிறது.",
        live_stt: "நேரடி உரை மாற்றம்:",
        rec_active: "பதிவு செய்யப்படுகிறது",
        score_title: "உச்சரிப்பு மதிப்பெண்",
        clarity: "தெளிவு",
        word_breakdown: "சொல் துல்லியம்:"
    },
    ml: {
        back: "ഡാഷ്‌ബോർഡിലേക്ക് മടങ്ങുക",
        badge: "വോയ്‌സ് & ഉച്ചാരണ സ്റ്റുഡിയോ",
        title: "സംവേദനാത്മക സംസാര സ്റ്റുഡിയോ & ഉച്ചാരണ ഫീഡ്‌ബാക്ക്",
        desc: "ഓഡിയോ കേൾക്കൂ, വാക്യം പറയൂ, തത്സമയ AI ഫീഡ്‌ബാക്ക് നേടൂ!",
        select_lang: "പരിശീലിക്കാൻ ഭാഷ തിരഞ്ഞെടുക്കൂ:",
        phrase: "വാക്യം",
        target_in: "ലക്ഷ്യ വാക്യം",
        guide: "ഉച്ചാരണ സഹായി",
        meaning: "അർത്ഥം",
        tts_speed: "സംസാര വേഗത:",
        slow: "പതുക്കെ (0.7x)",
        normal: "സാധാരണം (0.9x)",
        fast: "വേഗത്തിൽ (1.1x)",
        listen_tts: "ഓഡിയോ കേൾക്കൂ (TTS)",
        mic_listening: "കേൾക്കുന്നു... മൈക്രോഫോണിൽ സംസാരിക്കൂ 🎙️",
        mic_tap: "സംസാരിക്കാൻ മൈക്ക് തൊടുക",
        stt_sub: "നിങ്ങളുടെ ശബ്ദം തിരിച്ചറിഞ്ഞു ഉച്ചാരണം വിലയിരുത്തുന്നു.",
        live_stt: "തത്സമയ ടെക്സ്റ്റ്:",
        rec_active: "റെക്കോർഡിംഗ് സജീവം",
        score_title: "ഉച്ചാരണ സ്കോർ",
        clarity: "വ്യക്തത",
        word_breakdown: "വാക്കുകളുടെ കൃത്യത:"
    }
};

const PHRASE_MEANINGS: Record<number, Record<string, string>> = {
    1: {
        en: "Good morning! How are you today?",
        hi: "शुभप्रभात! आप आज कैसे हैं?",
        kn: "ಶುಭೋದಯ! ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ?",
        te: "శుభోదయం! మీరు ఈ రోజు ఎలా ఉన్నారు?",
        ta: "காலை வணக்கம்! நீங்கள் இன்று எப்படி இருக்கிறீர்கள்?",
        ml: "സുപ്രഭാതം! നിങ്ങൾക്ക് ഇന്ന് സുഖമാണോ?"
    },
    2: {
        en: "Welcome to LingoPath AI platform.",
        hi: "लिंगोपाथ एआई प्लेटफॉर्म में आपका स्वागत है।",
        kn: "ಲಿಂಗೋಪಾತ್ AI ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ.",
        te: "లింగోపాత్ AI ప్లాట్‌ఫారమ్‌కు స్వాగతం.",
        ta: "லிங்கோபாத் AI தளத்திற்கு நல்வரவு.",
        ml: "ലിംഗോപാത്ത് AI പ്ലാറ്റ്‌ഫോമിലേക്ക് സ്വാഗതം."
    },
    3: {
        en: "I am learning a new language step by step every day.",
        hi: "मैं हर दिन कदम दर कदम नई भाषा सीख रहा हूँ।",
        kn: "ನಾನು ಪ್ರತಿದಿನ ಹಂತ ಹಂತವಾಗಿ ಹೊಸ ಭಾಷೆಯನ್ನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ.",
        te: "నేను ప్రతిరోజు కొత్త భాషను నేర్చుకుంటున్నాను.",
        ta: "நான் தினமும் புதிய மொழியை கற்றுக்கொள்கிறேன்.",
        ml: "ഞാൻ ദിവസവും പുതിയ ഭാഷ പഠിക്കുന്നു."
    },
    4: {
        en: "Education opens up new opportunities for growth.",
        hi: "शिक्षा व्यक्तिगत विकास के नए अवसर खोलती है।",
        kn: "ಶಿಕ್ಷಣವು ಹೊಸ ಅವಕಾಶಗಳನ್ನು ತೆರೆಯುತ್ತದೆ.",
        te: "విద్య వ్యక్తిగత ఎదుగుదలకు అవకాశాలను ఇస్తుంది.",
        ta: "கல்வி தனிப்பட்ட வளர்ச்சிக்கு கதவுகளை திறக்கிறது.",
        ml: "വിദ്യാഭ്യാസം പുതിയ അവസരങ്ങൾ തുറക്കുന്നു."
    }
};

export const VoiceLearningPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const langKey = (supportLangCode || 'en').toLowerCase().slice(0, 2);
    const cur = VOICE_STUDIO_TRANSLATIONS[langKey] || VOICE_STUDIO_TRANSLATIONS['en'];

    const VOICE_LANGUAGES = [
        { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
        { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
        { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
        { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
        { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
        { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
    ];

    const initialLang = (profile?.target_language?.code || 'kn').toLowerCase();
    const [selectedLang, setSelectedLang] = useState<string>(initialLang);

    // Sync selected learning language when learner profile or target language updates
    useEffect(() => {
        if (profile?.target_language?.code) {
            const code = profile.target_language.code.toLowerCase();
            setSelectedLang(code);
            setSelectedPhraseIndex(0);
        }
    }, [profile?.target_language?.code]);

    const activeLangObj = VOICE_LANGUAGES.find(l => l.code === selectedLang) || VOICE_LANGUAGES[0];
    const targetLangCode = selectedLang;
    const targetLangName = activeLangObj.name;

    const languagePhrases: Record<string, Array<{
        id: number;
        text: string;
        phonetic: string;
        englishMeaning: string;
        level: string;
    }>> = {
        hi: [
            { id: 1, text: "शुभप्रभात! आप आज कैसे हैं?", phonetic: "Shubhprabhat! Aap aaj kaise hain?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "लिंगोपाथ एआई प्लेटफॉर्म में आपका स्वागत है।", phonetic: "LingoPath AI platform mein aapka swaagat hai.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "मैं हर दिन कदम दर कदम नई भाषा सीख रहा हूँ।", phonetic: "Main har din kadam dar kadam nayi bhasha seekh raha hoon.", englishMeaning: "I am learning a new language step by step every day.", level: "Intermediate" },
            { id: 4, text: "शिक्षा व्यक्तिगत विकास के नए अवसर खोलती है।", phonetic: "Shiksha vyaktigat vikaas ke naye avsar kholti hai.", englishMeaning: "Education opens up new opportunities for growth.", level: "Intermediate" },
        ],
        te: [
            { id: 1, text: "శుభోదయం! మీరు ఈ రోజు ఎలా ఉన్నారు?", phonetic: "Shubhodayam! Meeru ee roju elaa unnaaru?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "లింగోపాత్ AI ప్లాట్‌ఫారమ్‌కు స్వాగతం.", phonetic: "LingoPath AI platform ku swaagatam.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "నేను ప్రతిరోజు కొత్త భాషను నేర్చుకుంటున్నాను.", phonetic: "Nenu prati roju kotta bhashanu nerchukuntunnanu.", englishMeaning: "I am learning a new language every day.", level: "Intermediate" },
            { id: 4, text: "విద్య వ్యక్తిగత ఎదుగుదలకు అవకాశాలను ఇస్తుంది.", phonetic: "Vidya vyaktigata edugudalaku avakaasaalanu istundi.", englishMeaning: "Education gives opportunities for growth.", level: "Intermediate" },
        ],
        ta: [
            { id: 1, text: "காலை வணக்கம்! நீங்கள் இன்று எப்படி இருக்கிறீர்கள்?", phonetic: "Kaalai vanakkam! Neengal indru eppadi irukkireergal?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "லிங்கோபாத் AI தளத்திற்கு நல்வரவு.", phonetic: "LingoPath AI thalathirku nalvaravu.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "நான் தினமும் புதிய மொழியை கற்றுக்கொள்கிறேன்.", phonetic: "Naan dhinamum pudhiya mozhiyai katrukkolkairen.", englishMeaning: "I am learning a new language every day.", level: "Intermediate" },
            { id: 4, text: "கல்வி தனிப்பட்ட வளர்ச்சிக்கு கதவுகளை திறக்கிறது.", phonetic: "Kalvi thanippatta valarchikku kadhavukalai thirakkiradhu.", englishMeaning: "Education opens doors for personal growth.", level: "Intermediate" },
        ],
        kn: [
            { id: 1, text: "ಶುಭೋದಯ! ನೀವು ಇಂದು ಹೇಗಿದ್ದೀರಿ?", phonetic: "Shubhodayam! Neevu indu hegiddiri?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "ಲಿಂಗೋಪಾತ್ AI ವೇದಿಕೆಗೆ ಸುಸ್ವಾಗತ.", phonetic: "LingoPath AI vedikege suswaagatha.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "ನಾನು ಪ್ರತಿದಿನ ಹೊಸ ಭಾಷೆಯನ್ನು ಕಲಿಯುತ್ತಿದ್ದೇನೆ.", phonetic: "Naanu pratidina hosa bhasheyannu kaliyuttiddene.", englishMeaning: "I am learning a new language every day.", level: "Intermediate" },
            { id: 4, text: "ಶಿಕ್ಷಣವು ಹೊಸ ಅವಕಾಶಗಳನ್ನು ತೆರೆಯುತ್ತದೆ.", phonetic: "Shikshanavu hosa avakaashagalannu tereyuttade.", englishMeaning: "Education opens up new opportunities.", level: "Intermediate" },
        ],
        ml: [
            { id: 1, text: "സുപ്രഭാതം! നിങ്ങൾക്ക് ഇന്ന് എങ്ങനെയുണ്ട്?", phonetic: "Suprabhatham! Njangalkku innu enganeyundu?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "ലിംഗോപാത് AI പ്ലാറ്റ്‌ഫോമിലേക്ക് സ്വാഗതം.", phonetic: "LingoPath AI platform ilekku swaagatham.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "ഞാൻ ദിവസവും പുതിയ ഭാഷ പഠിക്കുന്നു.", phonetic: "Njaan dhivasavum pudhiya bhasha padikkunnu.", englishMeaning: "I am learning a new language every day.", level: "Intermediate" },
            { id: 4, text: "വിദ്യാഭ്യാസം പുതിയ അവസരങ്ങൾ തുറക്കുന്നു.", phonetic: "Vidhyabhyasam pudhiya avasarangal thurakkunnu.", englishMeaning: "Education opens new opportunities.", level: "Intermediate" },
        ],
        en: [
            { id: 1, text: "Good morning! How are you today?", phonetic: "Good morning! How are you today?", englishMeaning: "Good morning! How are you today?", level: "Basic" },
            { id: 2, text: "Welcome to LingoPath AI platform.", phonetic: "Welcome to LingoPath AI platform.", englishMeaning: "Welcome to LingoPath AI platform.", level: "Basic" },
            { id: 3, text: "I am learning a new language step by step every day.", phonetic: "I am learning a new language step by step every day.", englishMeaning: "I am learning a new language step by step every day.", level: "Intermediate" },
            { id: 4, text: "Education opens up exciting opportunities for growth.", phonetic: "Education opens up exciting opportunities for growth.", englishMeaning: "Education opens up exciting opportunities for growth.", level: "Intermediate" },
        ]
    };

    const practicePhrases = languagePhrases[targetLangCode] || languagePhrases['kn'];

    const [selectedPhraseIndex, setSelectedPhraseIndex] = useState(0);
    const [speechRate, setSpeechRate] = useState<number>(0.85); // 0.7 = Slow, 0.85 = Medium, 1.0 = Normal
    const [isRecording, setIsRecording] = useState(false);
    const [realtimeTranscription, setRealtimeTranscription] = useState('');
    const [sttError, setSttError] = useState<string | null>(null);
    const [evaluationResult, setEvaluationResult] = useState<{
        score: number;
        rating: string;
        feedback: string;
        wordMatch: { word: string; matched: boolean }[];
    } | null>(null);

    const activeSttRef = useRef<{ stop: () => void } | null>(null);

    const currentPhrase = practicePhrases[selectedPhraseIndex] || practicePhrases[0];

    useEffect(() => {
        // Cleanup STT recorder on unmount
        return () => {
            if (activeSttRef.current) {
                activeSttRef.current.stop();
            }
            voiceService.stopSpeaking();
        };
    }, []);

    const handlePlayNativeAudio = () => {
        voiceService.speakText(currentPhrase.text, targetLangCode, speechRate);
    };

    const handleStartRecording = () => {
        setSttError(null);
        setRealtimeTranscription('');
        setEvaluationResult(null);
        setIsRecording(true);

        const stt = voiceService.startSpeechToText(
            (transcript, isFinal) => {
                setRealtimeTranscription(transcript);
                if (isFinal) {
                    handleStopRecording(transcript);
                }
            },
            (errorMsg) => {
                setSttError(errorMsg);
                setIsRecording(false);
            },
            targetLangCode
        );

        if (stt) {
            activeSttRef.current = stt;
        } else {
            setIsRecording(false);
        }
    };

    const handleStopRecording = (finalSpeech?: string) => {
        if (activeSttRef.current) {
            activeSttRef.current.stop();
            activeSttRef.current = null;
        }
        setIsRecording(false);

        const speechToEvaluate = finalSpeech || realtimeTranscription;
        if (speechToEvaluate) {
            const evalRes = voiceService.evaluatePronunciation(speechToEvaluate, currentPhrase.text);
            setEvaluationResult(evalRes);
        }
    };

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-6 animate-fade-in pb-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                    {cur.back}
                </Button>
                <Badge variant="amber" size="md" className="font-extrabold gap-1.5 bg-amber-400 text-slate-950 shadow-md">
                    <Mic className="w-4 h-4" /> {cur.badge} ({targetLangName})
                </Badge>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {cur.title}
                </h1>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                    {cur.desc}
                </p>
            </div>

            {/* Quick Practice Language Selector */}
            <div className="bg-white p-3 rounded-2xl border-2 border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 px-1">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>{cur.select_lang}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {VOICE_LANGUAGES.map(l => (
                        <button
                            key={l.code}
                            onClick={() => {
                                setSelectedLang(l.code);
                                setSelectedPhraseIndex(0);
                                setRealtimeTranscription('');
                                setEvaluationResult(null);
                                setSttError(null);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                selectedLang === l.code
                                    ? 'bg-amber-400 text-slate-950 font-extrabold shadow-md ring-2 ring-amber-300 scale-105'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        >
                            <span>{l.flag}</span>
                            <span>{l.name}</span>
                            <span className="opacity-75">({l.native})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Phrase Selector Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
                {practicePhrases.map((phrase, idx) => (
                    <button
                        key={phrase.id}
                        onClick={() => {
                            setSelectedPhraseIndex(idx);
                            setRealtimeTranscription('');
                            setEvaluationResult(null);
                            setSttError(null);
                        }}
                        className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all shadow-sm ${selectedPhraseIndex === idx
                            ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-300 scale-105'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {cur.phrase} {idx + 1} ({phrase.level})
                    </button>
                ))}
            </div>

            {/* Main Interactive Studio Card */}
            <Card className="p-6 sm:p-10 border-amber-200/80 shadow-2xl space-y-8 bg-gradient-to-b from-white to-amber-50/20 relative overflow-hidden rounded-3xl">
                {/* Target Phrase Card with Native Script, Phonetics & Translation */}
                <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl text-center space-y-4 shadow-xl border border-indigo-900/50">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-block shadow-inner">
                        {cur.target_in} {targetLangName}
                    </span>

                    {/* Native Script Large Display */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 leading-relaxed font-sans">
                        "{currentPhrase.text}"
                    </h2>

                    {/* Phonetic Pronunciation Guide & Translation */}
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                        <div className="text-teal-300 font-bold italic">
                            🗣️ {cur.guide}: "{currentPhrase.phonetic}"
                        </div>
                        <div className="text-slate-400 font-medium">
                            💡 {cur.meaning}: "{PHRASE_MEANINGS[currentPhrase.id]?.[langKey] || currentPhrase.englishMeaning}"
                        </div>
                    </div>

                    {/* Speech Rate Controls (TTS) */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" /> {cur.tts_speed}
                        </span>
                        {[
                            { label: cur.slow, value: 0.7 },
                            { label: cur.normal, value: 0.9 },
                            { label: cur.fast, value: 1.1 },
                        ].map(speed => (
                            <button
                                key={speed.value}
                                onClick={() => setSpeechRate(speed.value)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition ${speechRate === speed.value
                                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {speed.label}
                            </button>
                        ))}
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={handlePlayNativeAudio}
                        leftIcon={<Play className="w-4 h-4 fill-brand-600 text-brand-600" />}
                        className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold shadow-md border-none"
                    >
                        {cur.listen_tts}
                    </Button>
                </div>

                {/* Real-time STT Speech-To-Text Microphone Studio */}
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <button
                        onClick={isRecording ? () => handleStopRecording() : handleStartRecording}
                        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${isRecording
                            ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200 scale-110'
                            : 'bg-amber-500 hover:bg-amber-600 text-white ring-8 ring-amber-100 hover:scale-105'
                            }`}
                    >
                        {isRecording ? <Square className="w-10 h-10 fill-white" /> : <Mic className="w-10 h-10 sm:w-12 sm:h-12" />}
                    </button>

                    <div className="text-center space-y-1">
                        <span className="text-sm font-extrabold text-slate-900 block">
                            {isRecording
                                ? cur.mic_listening
                                : cur.mic_tap}
                        </span>
                        <p className="text-xs text-slate-500">
                            {cur.stt_sub}
                        </p>
                    </div>
                </div>

                {/* Real-Time Live STT Transcription Box */}
                {(isRecording || realtimeTranscription) && (
                    <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <Radio className={`w-3.5 h-3.5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                                {cur.live_stt}
                            </span>
                            {isRecording && <span className="text-red-600 font-extrabold animate-pulse">{cur.rec_active}</span>}
                        </div>
                        <p className="text-base font-extrabold text-slate-900 min-h-[30px] italic">
                            "{realtimeTranscription || (isRecording ? cur.mic_listening : '')}"
                        </p>
                    </div>
                )}

                {/* STT Error Alert */}
                {sttError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                        ⚠️ Speech recognition notice: {sttError}
                    </div>
                )}

                {/* STT Evaluation Feedback */}
                {evaluationResult && (
                    <div className="p-6 bg-teal-50 border-2 border-teal-200 rounded-3xl space-y-4 animate-fade-in shadow-md">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 font-extrabold text-teal-900 text-base">
                                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                                <span>{cur.score_title}</span>
                            </div>
                            <Badge variant="teal" size="md" className="font-extrabold text-teal-950 bg-teal-300">
                                {evaluationResult.rating} ({evaluationResult.score}% {cur.clarity})
                            </Badge>
                        </div>

                        <p className="text-sm font-semibold text-teal-900 bg-white p-3 rounded-2xl border border-teal-100">
                            ✨ {evaluationResult.feedback}
                        </p>

                        {/* Word-by-Word Matched Breakdown */}
                        {evaluationResult.wordMatch.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">{cur.word_breakdown}</span>
                                <div className="flex flex-wrap gap-2">
                                    {evaluationResult.wordMatch.map((wm, idx) => (
                                        <span
                                            key={idx}
                                            className={`px-3 py-1 rounded-xl text-xs font-extrabold border ${wm.matched
                                                ? 'bg-teal-100 border-teal-300 text-teal-900'
                                                : 'bg-amber-100 border-amber-300 text-amber-900'
                                                }`}
                                        >
                                            {wm.word} {wm.matched ? '✓' : '•'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

