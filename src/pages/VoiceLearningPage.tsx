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

export const VoiceLearningPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const targetLangCode = (profile?.target_language?.code || 'hi').toLowerCase();
    const targetLangName = profile?.target_language?.name || 'Hindi';
    const supportLangCode = profile?.comfortable_language?.code || 'en';

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

    const practicePhrases = languagePhrases[targetLangCode] || languagePhrases['hi'];

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
                    Back to Dashboard
                </Button>
                <Badge variant="amber" size="md" className="font-extrabold gap-1.5 bg-amber-400 text-slate-950 shadow-md">
                    <Mic className="w-4 h-4" /> Speaking & Voice Studio ({targetLangName})
                </Badge>
            </div>

            {/* Title & Description */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Interactive Speech Studio & Pronunciation Feedback
                </h1>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                    Listen to native TTS audio in <strong className="text-brand-700 font-bold">{targetLangName}</strong>, pronounce the sentence, and get AI pronunciation clarity feedback!
                </p>
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
                        Phrase {idx + 1} ({phrase.level})
                    </button>
                ))}
            </div>

            {/* Main Interactive Studio Card */}
            <Card className="p-6 sm:p-10 border-amber-200/80 shadow-2xl space-y-8 bg-gradient-to-b from-white to-amber-50/20 relative overflow-hidden rounded-3xl">
                {/* Target Phrase Card with Native Script, Phonetics & Translation */}
                <div className="p-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl text-center space-y-4 shadow-xl border border-indigo-900/50">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-amber-400/20 inline-block shadow-inner">
                        Target Phrase in {targetLangName}
                    </span>

                    {/* Native Script Large Display */}
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-300 leading-relaxed font-sans">
                        "{currentPhrase.text}"
                    </h2>

                    {/* Phonetic Pronunciation Guide & Translation */}
                    <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
                        <div className="text-teal-300 font-bold italic">
                            🗣️ Pronunciation Guide: "{currentPhrase.phonetic}"
                        </div>
                        <div className="text-slate-400 font-medium">
                            💡 Meaning: "{currentPhrase.englishMeaning}"
                        </div>
                    </div>

                    {/* Speech Rate Controls (TTS) */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-800">
                        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                            <Volume2 className="w-3.5 h-3.5 text-amber-400" /> TTS Speech Speed:
                        </span>
                        {[
                            { label: 'Slow (0.7x)', value: 0.7 },
                            { label: 'Normal (0.9x)', value: 0.9 },
                            { label: 'Fast (1.1x)', value: 1.1 },
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
                        Listen Text-to-Speech (TTS)
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
                                ? 'Listening... Speak into microphone 🎙️'
                                : 'Tap microphone to start real-time Speech-to-Text'}
                        </span>
                        <p className="text-xs text-slate-500">
                            Real-time STT captures your voice and evaluates pronunciation clarity.
                        </p>
                    </div>
                </div>

                {/* Real-Time Live STT Transcription Box */}
                {(isRecording || realtimeTranscription) && (
                    <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-1.5">
                                <Radio className={`w-3.5 h-3.5 ${isRecording ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
                                Live STT Transcription:
                            </span>
                            {isRecording && <span className="text-red-600 font-extrabold animate-pulse">RECORDING ACTIVE</span>}
                        </div>
                        <p className="text-base font-extrabold text-slate-900 min-h-[30px] italic">
                            "{realtimeTranscription || (isRecording ? 'Listening...' : '')}"
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
                                <span>Pronunciation Score</span>
                            </div>
                            <Badge variant="teal" size="md" className="font-extrabold text-teal-950 bg-teal-300">
                                {evaluationResult.rating} ({evaluationResult.score}% Clarity)
                            </Badge>
                        </div>

                        <p className="text-sm font-semibold text-teal-900 bg-white p-3 rounded-2xl border border-teal-100">
                            ✨ {evaluationResult.feedback}
                        </p>

                        {/* Word-by-Word Matched Breakdown */}
                        {evaluationResult.wordMatch.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Word Accuracy Breakdown:</span>
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

