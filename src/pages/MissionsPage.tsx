import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { missionsService, Mission, MissionStep } from '../services/missionsService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { AtlasTraveler, LingoBot } from '../components/common/LingoCharacters';
import {
    Compass,
    Volume2,
    Mic,
    MicOff,
    CheckCircle2,
    Award,
    ArrowRight,
    RefreshCw,
    Sparkles,
    Check,
    HelpCircle,
    MapPin,
    Globe,
    Send,
    User,
    Users,
    MessageSquare,
    Play,
    BookOpen,
    Smile,
    ArrowLeftRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../utils/translations';

interface QuickPhrase {
    english: string;
    targetByLang: Record<string, { script: string; phonetic: string }>;
}

export const MissionsPage: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();

    // Mode: 'travel_assistant' (two-way live tool) or 'scenario_missions' (gamified step-by-step roleplay)
    const [activeTab, setActiveTab] = useState<'travel_assistant' | 'scenario_missions'>('travel_assistant');

    // Location & Language states
    const [selectedLocation, setSelectedLocation] = useState('Delhi');
    const [targetLangCode, setTargetLangCode] = useState(profile?.target_language?.code || 'hi');
    const comfLangCode = profile?.comfortable_language?.code || 'en';

    // Scenario Selection
    const [selectedScenario, setSelectedScenario] = useState('auto');

    // Two-Way Communication State
    const [userQuery, setUserQuery] = useState('');
    const [translatedSpeech, setTranslatedSpeech] = useState<{ script: string; phonetic: string; english: string } | null>({
        english: 'How much will it cost to go to the railway station?',
        script: 'रेलवे स्टेशन जाने का कितना लगेगा?',
        phonetic: 'Railway station jaane ka kitna lagega?',
    });
    const [isTranslatingUser, setIsTranslatingUser] = useState(false);
    const [translationError, setTranslationError] = useState<string | null>(null);

    const [otherPersonTranscript, setOtherPersonTranscript] = useState('');
    const [otherPersonExplanation, setOtherPersonExplanation] = useState<{ original: string; explanation: string; replies: string[] } | null>(null);
    const [otherPersonManualInput, setOtherPersonManualInput] = useState('');
    const [isListeningOther, setIsListeningOther] = useState(false);
    const [isListeningUser, setIsListeningUser] = useState(false);
    const [isExplainingOther, setIsExplainingOther] = useState(false);
    const [speechError, setSpeechError] = useState<string | null>(null);

    // Learned Vocabulary list for this session
    const [learnedWords, setLearnedWords] = useState<Array<{ word: string; phonetic: string; meaning: string }>>([
        { word: 'स्टेशन (Station)', phonetic: 'Station', meaning: 'Railway / Metro Station' },
        { word: 'कितना (Kitna)', phonetic: 'Kitna', meaning: 'How much / Quantity' },
        { word: 'किराया (Kiraya)', phonetic: 'Kiraya', meaning: 'Fare / Price' },
        { word: 'कम करो (Kam karo)', phonetic: 'Kam karo', meaning: 'Reduce / Bargain' }
    ]);

    // Roleplay Missions (Preserved existing functionality)
    const [missions, setMissions] = useState<Mission[]>([]);
    const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [learnerInput, setLearnerInput] = useState('');
    const [stepSuccess, setStepSuccess] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completionData, setCompletionData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const locations = [
        { city: 'Delhi', defaultLang: 'hi', flag: '🇮🇳', langName: 'Hindi' },
        { city: 'Mumbai', defaultLang: 'mr', flag: '🇮🇳', langName: 'Marathi' },
        { city: 'Hyderabad', defaultLang: 'te', flag: '🇮🇳', langName: 'Telugu' },
        { city: 'Bengaluru', defaultLang: 'kn', flag: '🇮🇳', langName: 'Kannada' },
        { city: 'Chennai', defaultLang: 'ta', flag: '🇮🇳', langName: 'Tamil' },
        { city: 'Kolkata', defaultLang: 'bn', flag: '🇮🇳', langName: 'Bengali' },
        { city: 'Jaipur', defaultLang: 'hi', flag: '🇮🇳', langName: 'Hindi' },
        { city: 'Paris', defaultLang: 'fr', flag: '🇫🇷', langName: 'French' },
        { city: 'Madrid', defaultLang: 'es', flag: '🇪🇸', langName: 'Spanish' },
        { city: 'Tokyo', defaultLang: 'ja', flag: '🇯🇵', langName: 'Japanese' }
    ];

    const scenarios = [
        { id: 'auto', label: '🚕 Auto / Taxi', desc: 'Station fare, meter, price reduction, destination' },
        { id: 'shopping', label: '🛍 Shopping & Bargaining', desc: 'Price check, too expensive, discount, size/color' },
        { id: 'restaurant', label: '🍽 Restaurant & Food', desc: 'Menu, vegetarian, spice level, water, bill' },
        { id: 'bus', label: '🚌 Bus & Transit', desc: 'Bus route, stop location, ticket price, destination' },
        { id: 'hotel', label: '🏨 Hotel & Stay', desc: 'Check-in, room availability, WiFi, amenities' },
        { id: 'hospital', label: '🏥 Hospital & Clinic', desc: 'Doctor appointment, symptoms, pharmacy, non-diagnosis' },
        { id: 'bank', label: '🏦 Bank & ATM', desc: 'Cash withdrawal, currency exchange, service counter' },
        { id: 'directions', label: '🗺 Directions', desc: 'Where is..., straight/left/right, distance' },
        { id: 'college', label: '🎓 College & Campus', desc: 'Classroom location, library, office inquiries' },
        { id: 'workplace', label: '💼 Workplace', desc: 'Meetings, greetings, polite work requests' }
    ];

    // Situation Specific Quick Phrases Database
    const quickPhrasesByScenario: Record<string, QuickPhrase[]> = {
        auto: [
            {
                english: 'How much will it cost to go to the railway station?',
                targetByLang: {
                    hi: { script: 'रेलवे स्टेशन जाने का कितना लगेगा?', phonetic: 'Railway station jaane ka kitna lagega?' },
                    te: { script: 'రైల్వే స్టేషన్‌కి ఎంత అవుతుంది?', phonetic: 'Railway station-ki entha avuthundi?' },
                    mr: { script: 'रेल्वे स्टेशनला जायला किती होईल?', phonetic: 'Railway stationla jayla kiti hoil?' },
                    ta: { script: 'ரயில் நிலையத்திற்கு செல்ல எவ்வளவு ஆகும்?', phonetic: 'Railway nilaiyathirku chella evvalavu aagum?' },
                    kn: { script: 'ರೈಲ್ವೆ ನಿಲ್ದಾಣಕ್ಕೆ ಹೋಗಲು ಎಷ್ಟು ಆಗುತ್ತದೆ?', phonetic: 'Railway nildanakke hogalu eshtu aaguttade?' }
                }
            },
            {
                english: 'Please turn on the meter.',
                targetByLang: {
                    hi: { script: 'कृपया मीटर चालू कीजिए।', phonetic: 'Kripya meter chaalu kijiye.' },
                    te: { script: 'దయచేసి మీటర్ వేయండి.', phonetic: 'Dayachesi meter veyandi.' },
                    mr: { script: 'कृपया मीटर सुरू करा.', phonetic: 'Krupaya meter suru kara.' },
                    ta: { script: 'மீட்டர் போடுங்கள்.', phonetic: 'Meter podungal.' }
                }
            },
            {
                english: 'Can you reduce the price a little?',
                targetByLang: {
                    hi: { script: 'थोड़ा कम कर लीजिए ना?', phonetic: 'Thoda kam kar lijiye na?' },
                    te: { script: 'కొంచెం తగ్గించండి ప్లీజ్.', phonetic: 'Konchem thaggimchandi please.' },
                    mr: { script: 'थोडं कमी करा ना.', phonetic: 'Thoda kami kara na.' },
                    ta: { script: 'கொஞ்சம் குறைத்து கொடுங்கள்.', phonetic: 'Konjam kuraithu kodungal.' }
                }
            },
            {
                english: 'How long will it take to reach?',
                targetByLang: {
                    hi: { script: 'पहुँचने में कितना समय लगेगा?', phonetic: 'Pahunchne mein kitna samay lagega?' },
                    te: { script: 'చేరుకోవడానికి ఎంత సమయం పడుతుంది?', phonetic: 'Cherukovadaniki entha samayam paduthundi?' },
                    mr: { script: 'पोहोचायला किती वेळ लागेल?', phonetic: 'Pahochayla kiti vel lagel?' },
                    ta: { script: 'அங்கு செல்ல எவ்வளவு நேரம் ஆகும்?', phonetic: 'Angu chella evvalavu neram aagum?' }
                }
            }
        ],
        shopping: [
            {
                english: 'How much is this?',
                targetByLang: {
                    hi: { script: 'यह कितने का है?', phonetic: 'Yeh kitne ka hai?' },
                    te: { script: 'ఇది ఎంత?', phonetic: 'Idi entha?' },
                    mr: { script: 'हे कितीचे आहे?', phonetic: 'He kitiche aahe?' },
                    ta: { script: 'இதன் விலை என்ன?', phonetic: 'Idhan vilai enna?' }
                }
            },
            {
                english: 'That is too expensive. What is your final price?',
                targetByLang: {
                    hi: { script: 'यह बहुत महंगा है। आखिरी कीमत क्या है?', phonetic: 'Yeh bahut mehenga hai. Aakhiri keemat kya hai?' },
                    te: { script: 'చాలా ఎక్కువ. చివరి ధర ఎంత?', phonetic: 'Chala ekkuva. Chivari dhara entha?' },
                    mr: { script: 'खूप महाग आहे. शेवटची किंमत काय?', phonetic: 'Khup mahag aahe. Shevatchi kimmat kaay?' },
                    ta: { script: 'விலை மிக அதிகம். கடைசி விலை என்ன?', phonetic: 'Vilai miga adhigam. Kadaisi vilai enna?' }
                }
            },
            {
                english: 'Do you have another color or size?',
                targetByLang: {
                    hi: { script: 'क्या आपके पास दूसरा रंग या साइज है?', phonetic: 'Kya aapke paas doosra rang ya size hai?' },
                    te: { script: 'వేరే రంగు లేదా సైజు ఉందా?', phonetic: 'Vere rangu leda size unda?' },
                    mr: { script: 'दुसरा रंग किंवा साईज आहे का?', phonetic: 'Dusra rang kinva size aahe ka?' },
                    ta: { script: 'வேறு நிறம் அல்லது அளவு உள்ளதா?', phonetic: 'Veru niram alladhu alavu ulladha?' }
                }
            }
        ],
        restaurant: [
            {
                english: 'Can I please see the menu?',
                targetByLang: {
                    hi: { script: 'क्या मुझे मेन्यू मिल सकता है?', phonetic: 'Kya mujhe menu mil sakta hai?' },
                    te: { script: 'మెనూ కార్డు ఇస్తారా?', phonetic: 'Menu card isthara?' },
                    mr: { script: 'मेन्यू कार्ड मिळेल का?', phonetic: 'Menu card milel ka?' },
                    ta: { script: 'மெனு பார்க்கலாமா?', phonetic: 'Menu paarkalaama?' }
                }
            },
            {
                english: 'Is this food completely vegetarian?',
                targetByLang: {
                    hi: { script: 'क्या यह खाना शुद्ध शाकाहारी है?', phonetic: 'Kya yeh khana shuddh shakahari hai?' },
                    te: { script: 'ఇది శాకాహార భోజనమేనా?', phonetic: 'Idi shakahara bhojanamaena?' },
                    mr: { script: 'हे जेवण पूर्ण शाकाहारी आहे का?', phonetic: 'He jevan poorna shakahari aahe ka?' },
                    ta: { script: 'இது சைவ உணவா?', phonetic: 'Idhu saiva unavaa?' }
                }
            },
            {
                english: 'Please make it less spicy.',
                targetByLang: {
                    hi: { script: 'कृपया तीखा कम रखिएगा।', phonetic: 'Kripya teekha kam rakhiyega.' },
                    te: { script: 'కారము తక్కువగా వేయండి.', phonetic: 'Kaaram thakkuvaga veyandi.' },
                    mr: { script: 'तिखट कमी करा कृपया.', phonetic: 'Tikhat kami kara krupaya.' },
                    ta: { script: 'காரம் குறைவாக போடுங்கள்.', phonetic: 'Kaaram kuraivaaga podungal.' }
                }
            },
            {
                english: 'Could we have the bill, please?',
                targetByLang: {
                    hi: { script: 'बिल ले आइए, कृपया।', phonetic: 'Bill le aaiye, kripya.' },
                    te: { script: 'బిల్ తీసుకురండి, ప్లీజ్.', phonetic: 'Bill theesukurandi, please.' },
                    mr: { script: 'बिल द्या कृपया.', phonetic: 'Bill dya krupaya.' },
                    ta: { script: 'பில் கொண்டு வாருங்கள்.', phonetic: 'Bill kondu vaarungal.' }
                }
            }
        ],
        hospital: [
            {
                english: 'I need to see a doctor immediately.',
                targetByLang: {
                    hi: { script: 'मुझे डॉक्टर से तुरंत मिलना है।', phonetic: 'Mujhe doctor se turant milna hai.' },
                    te: { script: 'నేను వెంటనే డాక్టర్‌ని కలవాలి.', phonetic: 'Nenu ventane doctor-ni kalavali.' },
                    mr: { script: 'मला त्वरित डॉक्टरांना भेटायचे आहे.', phonetic: 'Mala twarit doctoranna bhetayche aahe.' },
                    ta: { script: 'நான் உடனடியாக மருத்துவரை பார்க்க வேண்டும்.', phonetic: 'Naan udanadiyaaga maruthuvarai paarka vendum.' }
                }
            },
            {
                english: 'Where is the pharmacy / medicine shop?',
                targetByLang: {
                    hi: { script: 'दवाइयों की दुकान कहाँ है?', phonetic: 'Dawaniyon ki dukaan kahan hai?' },
                    te: { script: 'మందుల షాప్ ఎక్కడ ఉంది?', phonetic: 'Mandula shop ekkada undi?' },
                    mr: { script: 'औषधांचे दुकान कुठे आहे?', phonetic: 'Aushadhanchi dukaan kuthe aahe?' },
                    ta: { script: 'மருந்துக் கடை எங்கே உள்ளது?', phonetic: 'Marundhu kadai enge ulladhu?' }
                }
            }
        ]
    };

    // Universal Courtesy / Emergency Phrases per target language
    const universalCourtesyPhrasesByLang: Record<string, Array<{ label: string; script: string; phonetic: string }>> = {
        hi: [
            { label: 'How much?', script: 'कितना हुआ?', phonetic: 'Kitna hua?' },
            { label: 'Please speak slowly', script: 'कृपया धीरे बोलिए।', phonetic: 'Kripya dheere boliye.' },
            { label: 'Please say that again', script: 'फिर से बोलिए?', phonetic: 'Phir se boliye?' },
            { label: 'Where is this?', script: 'यह कहाँ है?', phonetic: 'Yeh kahan hai?' },
            { label: 'Please help me', script: 'कृपया मेरी मदद कीजिए।', phonetic: 'Kripya meri madad kijiye.' },
            { label: 'Thank you', script: 'धन्यवाद!', phonetic: 'Dhanyavaad!' }
        ],
        te: [
            { label: 'How much?', script: 'ఎంత అయింది?', phonetic: 'Entha ayindi?' },
            { label: 'Please speak slowly', script: 'దయచేసి నెమ్మదిగా మాట్లాడండి.', phonetic: 'Dayachesi nemmadigaa maatlaadandi.' },
            { label: 'Please say that again', script: 'మరోసారి చెప్పండి?', phonetic: 'Marosaari cheppandi?' },
            { label: 'Where is this?', script: 'ఇది ఎక్కడ ఉంది?', phonetic: 'Idi ekkada undi?' },
            { label: 'Please help me', script: 'దయచేసి నాకు సహాయం చేయండి.', phonetic: 'Dayachesi naaku sahaayam cheyandi.' },
            { label: 'Thank you', script: 'ధన్యవాదాలు!', phonetic: 'Dhanyavaadaalu!' }
        ],
        ta: [
            { label: 'How much?', script: 'எவ்வளவு ஆனது?', phonetic: 'Evvalavu aanathu?' },
            { label: 'Please speak slowly', script: 'தயவுசெய்து மெதுவாகப் பேசுங்கள்.', phonetic: 'Thayavuseythu methuvaaga pesungal.' },
            { label: 'Please say that again', script: 'மீண்டும் சொல்லுங்கள்?', phonetic: 'Meendum sollungal?' },
            { label: 'Where is this?', script: 'இது எங்கே உள்ளது?', phonetic: 'Ithu enge ullathu?' },
            { label: 'Please help me', script: 'தயவுசெய்து எனக்கு உதவுங்கள்.', phonetic: 'Thayavuseythu enakku uthavungal.' },
            { label: 'Thank you', script: 'நன்றி!', phonetic: 'Nandri!' }
        ],
        mr: [
            { label: 'How much?', script: 'किती झाले?', phonetic: 'Kiti jhaale?' },
            { label: 'Please speak slowly', script: 'कृपया हळू बोला.', phonetic: 'Kripya halu bola.' },
            { label: 'Please say that again', script: 'पुन्हा सांगा?', phonetic: 'Punha saanga?' },
            { label: 'Where is this?', script: 'हे कुठे आहे?', phonetic: 'He kuthe aahe?' },
            { label: 'Please help me', script: 'कृपया मला मदत करा.', phonetic: 'Kripya mala madat kara.' },
            { label: 'Thank you', script: 'धन्यवाद!', phonetic: 'Dhanyavaad!' }
        ],
        kn: [
            { label: 'How much?', script: 'ಎಷ್ಟಾಯಿತು?', phonetic: 'Eshtaayitu?' },
            { label: 'Please speak slowly', script: 'ದಯವಿಟ್ಟು ನಿಧಾನವಾಗಿ ಮಾತನಾಡಿ.', phonetic: 'Dayavittu nidhaanavaagi maatanaadi.' },
            { label: 'Please say that again', script: 'ಮತ್ತೊಮ್ಮೆ ಹೇಳಿ?', phonetic: 'Mattomme heli?' },
            { label: 'Where is this?', script: 'ಇದು ಎಲ್ಲಿದೆ?', phonetic: 'Idu ellide?' },
            { label: 'Please help me', script: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ.', phonetic: 'Dayavittu nanage sahaaya maadi.' },
            { label: 'Thank you', script: 'ಧನ್ಯವಾದಗಳು!', phonetic: 'Dhanyavaadagalu!' }
        ]
    };

    // Load initial missions for roleplay tab
    useEffect(() => {
        const fetchMissions = async () => {
            setIsLoading(true);
            try {
                const res = await missionsService.getMissions();
                setMissions(res.missions);
                if (res.missions.length > 0) {
                    setSelectedMission(res.missions[0]);
                }
            } catch (err) {
                console.error('Error loading missions', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMissions();
    }, []);

    // Helper to get locale for speech recognition and TTS
    const getLocaleForLang = (langCode: string) => {
        const map: Record<string, string> = {
            hi: 'hi-IN',
            te: 'te-IN',
            ta: 'ta-IN',
            mr: 'mr-IN',
            kn: 'kn-IN',
            bn: 'bn-IN',
            fr: 'fr-FR',
            es: 'es-ES',
            ja: 'ja-JP',
            en: 'en-US'
        };
        return map[langCode] || `${langCode}-IN`;
    };

    // Text to Speech in Target Language
    const handleSpeak = (text: string, lang = targetLangCode) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.lang = getLocaleForLang(lang);
        window.speechSynthesis.speak(utterance);
    };

    // Handle Quick Phrase Click (Converts to selected Target Language dynamically)
    const handleSelectQuickPhrase = (qp: QuickPhrase) => {
        const target = qp.targetByLang[targetLangCode] || qp.targetByLang['hi'];
        setTranslatedSpeech({
            english: qp.english,
            script: target.script,
            phonetic: target.phonetic
        });
        handleSpeak(target.script, targetLangCode);
    };

    // Handle User Freeform Input (Typed or Spoken)
    const handleTranslateUserQuery = async (queryText?: string) => {
        const query = (queryText || userQuery).trim();
        if (!query) return;

        setIsTranslatingUser(true);
        setTranslationError(null);

        try {
            const res = await missionsService.translateLive(
                query,
                targetLangCode,
                comfLangCode,
                selectedScenario
            );

            setTranslatedSpeech({
                english: query,
                script: res.script,
                phonetic: res.phonetic
            });

            // Automatically speak translated phrase in target language
            handleSpeak(res.script, targetLangCode);

            // Add newly learned vocabulary dynamically
            if (res.learned_vocab && res.learned_vocab.length > 0) {
                setLearnedWords(prev => {
                    const existingWords = new Set(prev.map(p => p.word));
                    const newItems = res.learned_vocab!.filter(v => !existingWords.has(v.word));
                    return [...newItems, ...prev];
                });
            }

            if (!queryText) setUserQuery('');
        } catch (err) {
            console.error('Translation error', err);
            setTranslationError('Unable to translate. Please try again.');
        } finally {
            setIsTranslatingUser(false);
        }
    };

    // User Voice Input (Converts speech into target language translation)
    const handleUserVoice = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setTranslationError("Speech recognition not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = comfLangCode === 'hi' ? 'hi-IN' : 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListeningUser(true);
            setTranslationError(null);
        };
        recognition.onend = () => setIsListeningUser(false);
        recognition.onerror = (e: any) => {
            setIsListeningUser(false);
            if (e.error === 'not-allowed') {
                setTranslationError("Microphone permission is required for live conversation.");
            } else {
                setTranslationError("Couldn't understand the speech. Please try again.");
            }
        };
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setUserQuery(transcript);
            handleTranslateUserQuery(transcript);
        };

        recognition.start();
    };

    // Other Person Listening (Target Language Speech Recognition)
    const handleListenToOtherPerson = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError("Speech recognition not supported in this browser. Please type what the person said below.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = getLocaleForLang(targetLangCode);
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListeningOther(true);
            setSpeechError(null);
        };
        recognition.onend = () => setIsListeningOther(false);
        recognition.onerror = (e: any) => {
            setIsListeningOther(false);
            if (e.error === 'not-allowed') {
                setSpeechError("Microphone permission is required for live conversation.");
            } else {
                setSpeechError("Couldn't understand the speech. Please try again.");
            }
        };
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            if (!transcript || !transcript.trim()) {
                setSpeechError("Couldn't understand clearly. Please try again.");
                return;
            }
            setOtherPersonTranscript(transcript);
            handleProcessOtherSpeech(transcript);
        };

        recognition.start();
    };

    // Process & Explain Other Person's Actual Speech
    const handleProcessOtherSpeech = async (speechText: string) => {
        const text = speechText.trim();
        if (!text) return;

        setIsExplainingOther(true);
        setSpeechError(null);

        try {
            const res = await missionsService.explainLive(
                text,
                targetLangCode,
                comfLangCode,
                selectedScenario
            );

            setOtherPersonTranscript(text);
            setOtherPersonExplanation({
                original: text,
                explanation: res.explanation,
                replies: res.replies
            });

            if (res.learned_vocab && res.learned_vocab.length > 0) {
                setLearnedWords(prev => {
                    const existingWords = new Set(prev.map(p => p.word));
                    const newItems = res.learned_vocab!.filter(v => !existingWords.has(v.word));
                    return [...newItems, ...prev];
                });
            }

            setOtherPersonManualInput('');
        } catch (err) {
            console.error('Explanation error', err);
            setSpeechError('Unable to explain speech. Please try again.');
        } finally {
            setIsExplainingOther(false);
        }
    };

    const currentStep: MissionStep | undefined = selectedMission?.steps[currentStepIndex];

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-fade-in pb-16 font-sans">
            {/* Header Hero Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-teal-700 via-brand-700 to-indigo-800 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10 max-w-xl">
                    <Badge variant="teal" size="sm" className="font-extrabold text-slate-950 bg-teal-300 border-none">
                        🌍 REAL-WORLD TWO-WAY ASSISTANT
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        {t('mis_title')}
                    </h1>
                    <p className="text-teal-100 text-xs sm:text-sm font-medium leading-relaxed">
                        {t('mis_subtitle')}
                    </p>
                </div>

                <div className="z-10 flex items-center gap-3 shrink-0">
                    <AtlasTraveler size="lg" className="hidden sm:inline-flex" />
                </div>
            </div>

            {/* Navigation Mode Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                <button
                    onClick={() => setActiveTab('travel_assistant')}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'travel_assistant'
                            ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                >
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>{t('mis_tab_travel')}</span>
                </button>
                <button
                    onClick={() => setActiveTab('scenario_missions')}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                        activeTab === 'scenario_missions'
                            ? 'bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/40'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                >
                    <Award className="w-4 h-4" />
                    <span>{t('mis_tab_scenarios')}</span>
                </button>
            </div>

            {activeTab === 'travel_assistant' ? (
                <div className="space-y-6">
                    {/* Location & Language Selector Bar */}
                    <Card className="p-4 sm:p-5 bg-white/95 backdrop-blur-xs border-slate-200/80 shadow-soft">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-brand-600" /> Current City:
                                </span>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => {
                                        const loc = locations.find(l => l.city === e.target.value);
                                        setSelectedLocation(e.target.value);
                                        if (loc) {
                                            const newLang = loc.defaultLang;
                                            setTargetLangCode(newLang);
                                            if (translatedSpeech?.english) {
                                                missionsService.translateLive(translatedSpeech.english, newLang, comfLangCode, selectedScenario)
                                                    .then(res => setTranslatedSpeech({
                                                        english: translatedSpeech.english,
                                                        script: res.script,
                                                        phonetic: res.phonetic
                                                    }));
                                            }
                                        }
                                    }}
                                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc.city} value={loc.city}>
                                            {loc.flag} {loc.city} ({loc.langName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                    Target Language:
                                </span>
                                <span className="text-xs font-extrabold px-3 py-1 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl">
                                    🗣 {targetLangCode.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Scenario Category Selector Chips */}
                        <div className="mt-4 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
                            <div className="flex items-center gap-2 min-w-max">
                                {scenarios.map((sc) => (
                                    <button
                                        key={sc.id}
                                        onClick={() => setSelectedScenario(sc.id)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                                            selectedScenario === sc.id
                                                ? 'bg-slate-900 text-white shadow-xs'
                                                : 'bg-slate-100/80 hover:bg-slate-200 text-slate-700'
                                        }`}
                                    >
                                        {sc.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </Card>

                    {/* TWO-WAY INTERACTIVE INTERFACE (USER SPEAK vs OTHER PERSON SPEAK) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* SIDE 1: USER WANTS TO SAY (USER -> OTHER PERSON) */}
                        <Card className="p-6 bg-gradient-to-br from-brand-50/70 via-white/95 to-indigo-50/50 border-brand-200/90 shadow-soft flex flex-col justify-between space-y-5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">
                                                1. You Want to Say
                                            </h3>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Say or type in your language
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-brand-100 text-brand-700 rounded-lg">
                                        TO OTHER PERSON
                                    </span>
                                </div>

                                {/* Custom Speech Input Form */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={userQuery}
                                        onChange={(e) => setUserQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleTranslateUserQuery()}
                                        placeholder="Type phrase (e.g. How much to the airport?)..."
                                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleUserVoice}
                                        disabled={isTranslatingUser}
                                        className={`p-2.5 rounded-xl border transition cursor-pointer ${
                                            isListeningUser
                                                ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                                                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                        }`}
                                        title="Speak via microphone"
                                    >
                                        <Mic className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTranslateUserQuery()}
                                        disabled={!userQuery.trim() || isTranslatingUser}
                                        className="px-3.5 py-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                                    >
                                        {isTranslatingUser ? 'Translating...' : 'Translate'}
                                    </button>
                                </div>

                                {/* Translation Error Notification */}
                                {translationError && (
                                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                                        ⚠️ {translationError}
                                    </div>
                                )}

                                {/* Target Language Card Ready to Play Loudly */}
                                {translatedSpeech && (
                                    <div className="p-4 bg-white rounded-2xl border-2 border-brand-300 shadow-sm space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                                                Input: "{translatedSpeech.english}"
                                            </span>
                                            <Badge variant="teal" size="sm" className="text-[9px] font-bold">
                                                Target Ready ({targetLangCode.toUpperCase()})
                                            </Badge>
                                        </div>

                                        {/* Large Native Script */}
                                        <p className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                                            {translatedSpeech.script}
                                        </p>

                                        {/* Romanized Phonetic Pronunciation */}
                                        <p className="text-xs font-bold text-brand-600">
                                            [{translatedSpeech.phonetic}]
                                        </p>

                                        {/* Audio Play Trigger */}
                                        <div className="pt-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleSpeak(translatedSpeech.script, targetLangCode)}
                                                leftIcon={<Volume2 className="w-4 h-4" />}
                                                className="w-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md cursor-pointer"
                                            >
                                                🔊 PLAY LOUDLY IN {locations.find(l => l.defaultLang === targetLangCode)?.langName.toUpperCase() || targetLangCode.toUpperCase()}
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Situational Quick Phrases Chips */}
                                <div className="space-y-1.5 pt-1">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        ⚡ Quick Phrases for {scenarios.find(s => s.id === selectedScenario)?.label}:
                                    </p>
                                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                                        {(quickPhrasesByScenario[selectedScenario] || quickPhrasesByScenario['auto']).map((qp, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleSelectQuickPhrase(qp)}
                                                className="text-left px-3 py-2 bg-white hover:bg-brand-50 border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 transition flex items-center justify-between group cursor-pointer shadow-2xs"
                                            >
                                                <span>"{qp.english}"</span>
                                                <span className="text-[11px] text-brand-600 font-extrabold group-hover:translate-x-0.5 transition-transform">
                                                    Play ({targetLangCode.toUpperCase()}) →
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* SIDE 2: OTHER PERSON IS SPEAKING (OTHER PERSON -> USER) */}
                        <Card className="p-6 bg-gradient-to-br from-teal-50/70 via-white/95 to-emerald-50/50 border-teal-200/90 shadow-soft flex flex-col justify-between space-y-5">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-slate-900">
                                                2. Other Person is Speaking
                                            </h3>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                AI translates and explains meaning
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-teal-100 text-teal-700 rounded-lg">
                                        TO YOU
                                    </span>
                                </div>

                                {/* Big Listen Button */}
                                <button
                                    onClick={handleListenToOtherPerson}
                                    disabled={isListeningOther}
                                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm ${
                                        isListeningOther
                                            ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
                                            : 'bg-white hover:bg-teal-50/60 border-teal-300 text-teal-900'
                                    }`}
                                >
                                    <Mic className={`w-6 h-6 ${isListeningOther ? 'text-rose-600 animate-bounce' : 'text-teal-600'}`} />
                                    <div className="text-left">
                                        <span className="block text-sm font-black">
                                            {isListeningOther ? `Listening in ${targetLangCode.toUpperCase()}... (Speak now)` : `🎤 TAP WHEN OTHER PERSON SPEAKS (${targetLangCode.toUpperCase()})`}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-medium">
                                            Hold phone near person to capture live speech
                                        </span>
                                    </div>
                                </button>

                                {/* Speech Error Notification */}
                                {speechError && (
                                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
                                        ⚠️ {speechError}
                                    </div>
                                )}

                                {/* Manual Speech Test Input (For easy testing and verification) */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                                        Or test with typed speech:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={otherPersonManualInput}
                                            onChange={(e) => setOtherPersonManualInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleProcessOtherSpeech(otherPersonManualInput)}
                                            placeholder="e.g. 80 रुपये किलो, 100 रुपये, कम नहीं होगा..."
                                            className="flex-1 px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleProcessOtherSpeech(otherPersonManualInput)}
                                            disabled={!otherPersonManualInput.trim() || isExplainingOther}
                                            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
                                        >
                                            {isExplainingOther ? 'Explaining...' : 'Explain'}
                                        </button>
                                    </div>
                                </div>

                                {/* AI Explanation Result */}
                                {otherPersonExplanation ? (
                                    <div className="p-4 bg-white rounded-2xl border border-teal-200 shadow-sm space-y-3">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                                                THEY SAID:
                                            </span>
                                            <p className="text-base font-extrabold text-slate-900 mt-0.5">
                                                "{otherPersonExplanation.original}"
                                            </p>
                                        </div>

                                        <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-100">
                                            <span className="text-[10px] font-black text-teal-800 uppercase tracking-wider block">
                                                💡 MEANING:
                                            </span>
                                            <p className="text-xs font-bold text-slate-800 mt-0.5">
                                                {otherPersonExplanation.explanation}
                                            </p>
                                        </div>

                                        {/* Suggested Quick Replies */}
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                                                SUGGESTED REPLIES:
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {otherPersonExplanation.replies.map((rep, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => {
                                                            const script = rep.split('(')[0].trim();
                                                            setTranslatedSpeech({
                                                                english: rep,
                                                                script,
                                                                phonetic: rep
                                                            });
                                                            handleSpeak(script, targetLangCode);
                                                        }}
                                                        className="px-2.5 py-1 bg-white hover:bg-brand-50 border border-slate-200 rounded-lg text-xs font-bold text-brand-700 transition cursor-pointer"
                                                    >
                                                        {rep}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-5 bg-white/70 rounded-2xl border border-dashed border-teal-200 text-center space-y-1">
                                        <p className="text-xs font-bold text-slate-600">
                                            Waiting for speech...
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Tap microphone to listen or type phrase above to test meaning.
                                        </p>
                                    </div>
                                )}

                                {/* Universal Courtesy Toolbar */}
                                <div className="space-y-1.5 pt-1">
                                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        🙏 Universal Emergency & Courtesy Phrases:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {(universalCourtesyPhrasesByLang[targetLangCode] || universalCourtesyPhrasesByLang['hi']).map((uc, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setTranslatedSpeech({
                                                        english: uc.label,
                                                        script: uc.script,
                                                        phonetic: uc.phonetic
                                                    });
                                                    handleSpeak(uc.script, targetLangCode);
                                                }}
                                                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer"
                                            >
                                                {uc.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* ✨ LEARN FROM REAL-WORLD COMMUNICATION SECTION */}
                    <Card className="p-6 bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border-amber-200/90 shadow-soft space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <span className="text-2xl">✨</span>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">
                                        YOU LEARNED FROM THIS CONVERSATION
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Key real-world vocabulary captured during your communication session
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate('/voice-learning')}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black border-none text-xs"
                            >
                                🎙️ PRACTICE THESE WORDS
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                            {learnedWords.map((item, idx) => (
                                <div key={idx} className="p-3 bg-white border border-amber-100 rounded-2xl shadow-2xs space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-slate-900">{item.word}</span>
                                        <button
                                            onClick={() => handleSpeak(item.word.split(' ')[0])}
                                            className="text-amber-600 hover:text-amber-700"
                                        >
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <span className="text-[11px] font-bold text-amber-700 block">[{item.phonetic}]</span>
                                    <span className="text-[10px] text-slate-500 block">{item.meaning}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            ) : (
                /* TAB 2: ROLEPLAY SCENARIO MISSIONS (Preserved full existing mission engine) */
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mission Selection List */}
                        <div className="space-y-3">
                            <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-wider">
                                Guided Roleplay Missions
                            </h2>
                            <div className="space-y-2">
                                {missions.map((m) => {
                                    const isSel = selectedMission?.id === m.id;
                                    return (
                                        <div
                                            key={m.id}
                                            onClick={() => {
                                                setSelectedMission(m);
                                                setCurrentStepIndex(0);
                                                setLearnerInput('');
                                                setStepSuccess(false);
                                                setIsCompleted(false);
                                            }}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                                isSel
                                                    ? 'bg-teal-50 border-teal-500 shadow-sm'
                                                    : 'bg-white hover:bg-slate-50 border-slate-200'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl">{m.icon}</span>
                                                <Badge variant="teal" size="sm" className="text-[10px] font-extrabold">
                                                    +{m.xp_reward} XP
                                                </Badge>
                                            </div>
                                            <h3 className="font-extrabold text-sm text-slate-900 mt-2">{m.title}</h3>
                                            <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active Mission Interactive Dialogue Simulation */}
                        <div className="md:col-span-2 space-y-4">
                            {selectedMission && currentStep && !isCompleted && (
                                <Card className="p-6 space-y-6 border-slate-200">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                        <div>
                                            <Badge variant="teal" size="sm">
                                                Step {currentStepIndex + 1} of {selectedMission.steps.length}
                                            </Badge>
                                            <h3 className="text-lg font-black text-slate-900 mt-1">
                                                {selectedMission.title}
                                            </h3>
                                        </div>
                                        <span className="text-2xl">{selectedMission.icon}</span>
                                    </div>

                                    {/* Partner Speech */}
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                                            Partner Speaks:
                                        </span>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold text-slate-900">
                                                "{currentStep.driver_speech}"
                                            </p>
                                            <button
                                                onClick={() => handleSpeak(currentStep.driver_speech)}
                                                className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50"
                                            >
                                                <Volume2 className="w-4 h-4 text-teal-600" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-slate-500 italic">
                                            Meaning: {currentStep.driver_translation}
                                        </p>
                                    </div>

                                    {/* Learner Task Prompt */}
                                    <div className="p-4 bg-brand-50 rounded-2xl border border-brand-200 space-y-3">
                                        <span className="text-xs font-black text-brand-900 block">
                                            Your Task: {currentStep.prompt}
                                        </span>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={learnerInput}
                                                onChange={(e) => setLearnerInput(e.target.value)}
                                                placeholder={`Say or type in target language...`}
                                                className="flex-1 px-4 py-2.5 bg-white border border-brand-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                                            />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => {
                                                    if (learnerInput.length > 2) {
                                                        setStepSuccess(true);
                                                    } else {
                                                        alert(`Try saying: ${currentStep.target_phrase}`);
                                                    }
                                                }}
                                                className="bg-brand-600 text-white font-bold"
                                            >
                                                Verify
                                            </Button>
                                        </div>

                                        <div className="pt-1 flex items-center justify-between text-xs text-slate-600">
                                            <span>Target Phrase: <strong>{currentStep.target_phrase}</strong></span>
                                            <button
                                                onClick={() => handleSpeak(currentStep.target_phrase)}
                                                className="text-brand-600 hover:underline flex items-center gap-1 font-bold"
                                            >
                                                <Volume2 className="w-3.5 h-3.5" /> Listen
                                            </button>
                                        </div>
                                    </div>

                                    {stepSuccess && (
                                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                                <span>Great job! Target communication successful.</span>
                                            </div>
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={async () => {
                                                    if (currentStepIndex + 1 < selectedMission.steps.length) {
                                                        setCurrentStepIndex(prev => prev + 1);
                                                        setLearnerInput('');
                                                        setStepSuccess(false);
                                                    } else {
                                                        await missionsService.submitMission(selectedMission.id, 95, selectedMission.xp_reward);
                                                        setIsCompleted(true);
                                                    }
                                                }}
                                                className="bg-emerald-600 text-white font-bold"
                                            >
                                                Next Step →
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            )}

                            {isCompleted && (
                                <Card className="p-8 text-center space-y-4 border-emerald-200 bg-emerald-50/50">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl">
                                        🏆
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">
                                        Mission Accomplished!
                                    </h3>
                                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                                        You successfully navigated a real-life situation. Real-world communication XP awarded to your profile!
                                    </p>
                                    <Button
                                        variant="primary"
                                        size="md"
                                        onClick={() => {
                                            setIsCompleted(false);
                                            setCurrentStepIndex(0);
                                            setActiveTab('travel_assistant');
                                        }}
                                        className="bg-emerald-600 text-white font-bold"
                                    >
                                        Back to Two-Way Assistant
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MissionsPage;
