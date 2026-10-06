import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiTeacherService, ChatMessage } from '../../services/aiTeacherService';
import { voiceService } from '../../services/voiceService';
import { LingoBot } from '../common/LingoCharacters';
import { useTranslation } from '../../utils/translations';
import { getLocalizedName } from '../../utils/nameLocalization';
import {
    Sparkles,
    X,
    Minimize2,
    Send,
    Mic,
    MicOff,
    Volume2,
    Bot,
    Compass,
    BookOpen,
    HelpCircle,
    CheckCircle2,
    Copy,
    Check,
    RotateCcw,
    AlertCircle
} from 'lucide-react';

export const FloatingAITeacher: React.FC = () => {
    const { profile } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const currentLang = (supportLangCode || 'en').toLowerCase().slice(0, 2);

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

    const targetLangName = profile?.target_language?.name || 'Hindi';
    const targetLangCode = profile?.target_language?.code || 'hi';
    const comfLangName = profile?.comfortable_language?.name || 'English';
    const rawLearnerName = profile?.full_name?.split(' ')[0] || 'Learner';
    const learnerName = getLocalizedName(rawLearnerName, currentLang);
    const learnerLevel = (profile as any)?.proficiency?.overall_level || 'Beginner';

    const CHIPS_BY_LANG: Record<string, string[]> = {
        en: ["💡 Explain current lesson", "📝 Check my grammar", "🗣️ Practice a dialogue", "🔍 Explain my mistakes"],
        kn: ["💡 ಪ್ರಸ್ತುತ ಪಾಠವನ್ನು ವಿವರಿಸಿ", "📝 ನನ್ನ ವ್ಯಾಕರಣ ಪರಿಶೀಲಿಸಿ", "🗣️ ಸಂಭಾಷಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ", "🔍 ನನ್ನ ತಪ್ಪುಗಳನ್ನು ವಿವರಿಸಿ"],
        te: ["💡 ప్రస్తుత పాఠాన్ని వివరించండి", "📝 నా వ్యాకరణాన్ని తనిఖీ చేయండి", "🗣️ సంభాషణ సాధన చేయండి", "🔍 నా తప్పులను వివరించండి"],
        hi: ["💡 वर्तमान पाठ समझाएं", "📝 मेरा व्याकरण जांचें", "🗣️ संवाद अभ्यास करें", "🔍 मेरी गलतियां समझाएं"],
        ta: ["💡 தற்போதைய பாடத்தை விளக்குங்கள்", "📝 என் இலக்கணத்தை சரிபார்க்கவும்", "🗣️ உரையாடல் பயிற்சி செய்யுங்கள்", "🔍 என் பிழைகளை விளக்குங்கள்"],
        ml: ["💡 നിലവിലെ പാഠം വിശദീകരിക്കുക", "📝 എൻ്റെ വ്യാകരണം പരിശോധിക്കുക", "🗣️ സംഭാഷണം പരിശീലിക്കുക", "🔍 എൻ്റെ തെറ്റുകൾ വിശദീകരിക്കുക"]
    };

    const WELCOME_BY_LANG: Record<string, { text: string; audio: string }> = {
        en: {
            text: `Hello ${learnerName}! I am LingoBot, your AI Language Teacher. Ask me anything about ${targetLangName} grammar, vocabulary, or lesson exercises!`,
            audio: `Hello ${learnerName}!`
        },
        kn: {
            text: `ನಮಸ್ಕಾರ ${learnerName}! ನಾನು ಲಿಂಗೋಬೋಟ್, ನಿಮ್ಮ AI ಭಾಷಾ ಶಿಕ್ಷಕ. ${targetLangName} ವ್ಯಾಕರಣ, ಶಬ್ದಕೋಶ ಅಥವಾ ಪಾಠಗಳ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ!`,
            audio: `ನಮಸ್ಕಾರ ${learnerName}!`
        },
        te: {
            text: `నమస్కారం ${learnerName}! నేను లింగోబోట్, మీ AI భాషా గురువును. ${targetLangName} వ్యాకరణం, పదజాలం లేదా పాఠాల గురించి నన్ను ఏదైనా అడగండి!`,
            audio: `నమస్కారం ${learnerName}!`
        },
        hi: {
            text: `नमस्ते ${learnerName}! मैं लिंगोबॉट हूँ, आपका AI भाषा शिक्षक। ${targetLangName} व्याकरण, शब्दावली या पाठों के बारे में मुझसे कुछ भी पूछें!`,
            audio: `नमस्ते ${learnerName}!`
        },
        ta: {
            text: `வணக்கம் ${learnerName}! நான் லிங்கோபோட், உங்கள் AI மொழி ஆசிரியர். ${targetLangName} இலக்கணம், சொல்லகராதி அல்லது பாடங்கள் குறித்து எதையும் கேட்கலாம்!`,
            audio: `வணக்கம் ${learnerName}!`
        },
        ml: {
            text: `നമസ്കാരം ${learnerName}! ഞാൻ ലിംഗോബോട്ട്, നിങ്ങളുടെ AI ഭാഷാ അധ്യാപകൻ. ${targetLangName} വ്യാകരണം, പദാവലി അല്ലെങ്കിൽ പാഠങ്ങളെക്കുറിച്ച് എന്തും ചോദിക്കൂ!`,
            audio: `നമസ്കാരം ${learnerName}!`
        }
    };

    const activeWelcome = WELCOME_BY_LANG[currentLang] || WELCOME_BY_LANG.en;
    const activeChips = CHIPS_BY_LANG[currentLang] || CHIPS_BY_LANG.en;

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'init_1',
            sender: 'teacher',
            text: activeWelcome.text,
            audioText: activeWelcome.audio,
            targetLang: targetLangName,
            tips: activeChips.slice(0, 3),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);

    // Reactively update initial welcome message when interface language changes
    useEffect(() => {
        setMessages(prev => {
            if (prev.length === 1 && prev[0].id === 'init_1') {
                return [{
                    id: 'init_1',
                    sender: 'teacher',
                    text: activeWelcome.text,
                    audioText: activeWelcome.audio,
                    targetLang: targetLangName,
                    tips: activeChips.slice(0, 3),
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }];
            }
            return prev;
        });
    }, [currentLang, targetLangName, learnerName]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen, isMinimized, isLoading]);

    const handleSpeak = (text: string, langCode?: string) => {
        voiceService.speakText(text, langCode || targetLangCode, 0.9);
    };

    const handleCopy = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleSendMessage = async (textToSend?: string) => {
        const query = (textToSend || inputMessage).trim();
        if (!query || isLoading) return;

        const userMsg: ChatMessage = {
            id: `usr_${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        if (!textToSend) setInputMessage('');
        setIsLoading(true);
        setLastFailedMessage(null);

        // Build recent conversation history (last 8 messages)
        const historyPayload = messages.slice(-8).map(m => ({
            sender: m.sender,
            text: m.text
        }));

        try {
            const res = await aiTeacherService.sendMessage({
                message: query,
                history: historyPayload,
                context: 'floating_teacher',
                interfaceLang: comfLangName,
                targetLang: targetLangName,
                targetCode: targetLangCode,
                proficiency: learnerLevel
            });

            const teacherMsg: ChatMessage = {
                id: `tch_${Date.now()}`,
                sender: 'teacher',
                text: res.reply,
                audioText: res.audio_text,
                targetLang: res.target_language,
                targetCode: res.target_code,
                tips: res.tips,
                correction: res.correction,
                vocabulary: res.vocabulary,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, teacherMsg]);

            if (res.audio_text) {
                handleSpeak(res.audio_text, res.target_code);
            }
        } catch (err: any) {
            console.error('AI Teacher Chat Error:', err);
            setLastFailedMessage(query);
            const errorMsg: ChatMessage = {
                id: `err_${Date.now()}`,
                sender: 'teacher',
                text: 'AI Teacher is temporarily unavailable. Please try again.',
                isError: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = () => {
        if (lastFailedMessage) {
            handleSendMessage(lastFailedMessage);
        }
    };

    const handleVoiceRecognition = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        const langMap: Record<string, string> = {
            hi: 'hi-IN',
            te: 'te-IN',
            kn: 'kn-IN',
            ta: 'ta-IN',
            ml: 'ml-IN',
            en: 'en-US'
        };
        recognition.lang = langMap[targetLangCode] || langMap[currentLang] || 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        recognition.onresult = (e: any) => {
            const transcript = e.results[0][0].transcript;
            setInputMessage(transcript);
            handleSendMessage(transcript);
        };

        recognition.start();
    };

    const quickChips = activeChips;

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans antialiased">
            {/* Floating Chat Panel */}
            {isOpen && (
                <div
                    className={`bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all duration-300 ${
                        isMinimized ? 'h-14 w-80' : 'w-96 max-w-[calc(100vw-2rem)] h-[520px] mb-3'
                    }`}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-teal-600 text-white px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-xs">
                                <Bot className="w-5 h-5 text-amber-300 animate-pulse-subtle" />
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold flex items-center gap-1.5 leading-tight">
                                    <span>{t('ai_teacher_drawer_title')}</span>
                                    <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-bold">
                                        {targetLangName}
                                    </span>
                                </h3>
                                <p className="text-[10px] text-brand-100 font-medium leading-none">
                                    {t('ai_teacher_online')} • {learnerLevel}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition cursor-pointer"
                                title={isMinimized ? "Expand" : "Minimize"}
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition cursor-pointer"
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Messages Body */}
                    {!isMinimized && (
                        <>
                            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60 text-xs">
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed shadow-2xs relative group ${
                                                msg.sender === 'user'
                                                    ? 'bg-brand-600 text-white rounded-br-none'
                                                    : msg.isError
                                                        ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-none'
                                                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                                            }`}
                                        >
                                            {/* Action Bar (Copy) */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCopy(msg.id, msg.text)}
                                                    className="p-1 rounded bg-black/10 hover:bg-black/20 text-current transition cursor-pointer"
                                                    title="Copy message"
                                                >
                                                    {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>

                                            {msg.isError ? (
                                                <div className="flex items-start gap-2">
                                                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-semibold text-rose-900">{msg.text}</p>
                                                        {lastFailedMessage && (
                                                            <button
                                                                type="button"
                                                                onClick={handleRetry}
                                                                className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold shadow-xs transition cursor-pointer"
                                                            >
                                                                <RotateCcw className="w-3 h-3" />
                                                                <span>Retry</span>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="font-medium whitespace-pre-wrap pr-4">{msg.text}</p>
                                            )}

                                            {/* Correction callout if model detected mistake */}
                                            {msg.correction && (
                                                <div className="mt-2 p-2 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900">
                                                    <span className="font-bold flex items-center gap-1 text-amber-800">
                                                        <Sparkles className="w-3 h-3 text-amber-600" /> Helpful Correction:
                                                    </span>
                                                    <span className="mt-0.5 block">{msg.correction}</span>
                                                </div>
                                            )}

                                            {/* Vocabulary cards if returned */}
                                            {msg.vocabulary && msg.vocabulary.length > 0 && (
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                                                    <span className="text-[10px] font-extrabold uppercase text-purple-700 tracking-wider">
                                                        Vocabulary Highlight:
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {msg.vocabulary.map((v, i) => (
                                                            <span key={i} className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-purple-900 text-[10px] font-semibold">
                                                                <strong>{v.word}</strong> {v.phonetics ? `(${v.phonetics})` : ''} - {v.meaning}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Audio Pronunciation Option */}
                                            {msg.audioText && !msg.isError && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSpeak(msg.audioText!, msg.targetCode || voiceService.detectLanguageFromText(msg.audioText!))}
                                                    className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 text-[10px] font-bold transition cursor-pointer"
                                                >
                                                    <Volume2 className="w-3.5 h-3.5 text-teal-600" />
                                                    <span>
                                                        {currentLang === 'kn' ? `${msg.targetLang || targetLangName} ನಲ್ಲಿ ಆಲಿಸಿ` :
                                                         currentLang === 'te' ? `${msg.targetLang || targetLangName} లో వినండి` :
                                                         currentLang === 'hi' ? `${msg.targetLang || targetLangName} में सुनें` :
                                                         currentLang === 'ta' ? `${msg.targetLang || targetLangName} இல் கேளுங்கள்` :
                                                         currentLang === 'ml' ? `${msg.targetLang || targetLangName}-ൽ കേൾക്കുക` :
                                                         `Listen in ${msg.targetLang || targetLangName}`}
                                                    </span>
                                                </button>
                                            )}

                                            {/* Educational Tips */}
                                            {msg.tips && msg.tips.length > 0 && (
                                                <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1">
                                                    {msg.tips.map((tip, idx) => (
                                                        <div key={idx} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                                            <span>{tip}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                                    </div>
                                ))}

                                {/* Animated Thinking Indicator */}
                                {isLoading && (
                                    <div className="flex items-center gap-2.5 text-slate-600 text-xs py-2 px-3 bg-purple-50/80 rounded-2xl border border-purple-100 w-fit animate-pulse">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce" />
                                            <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-2 h-2 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                        <span className="text-[11px] font-bold text-brand-900">
                                            {currentLang === 'kn' ? '🤖 ಲಿಂಗೋಬೋಟ್ ಯೋಚಿಸುತ್ತಿದೆ...' :
                                             currentLang === 'te' ? '🤖 లింగోబోట్ ఆలోచిస్తోంది...' :
                                             currentLang === 'hi' ? '🤖 लिंगोबॉट सोच रहा है...' :
                                             currentLang === 'ta' ? '🤖 லிங்கோபோட் சிந்திக்கிறது...' :
                                             currentLang === 'ml' ? '🤖 ലിംഗോബോട്ട് ചിന്തിക്കുന്നു...' :
                                             '🤖 LingoBot is thinking...'}
                                        </span>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Action Chips */}
                            <div className="p-2 bg-white border-t border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
                                {quickChips.map((chip, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={isLoading}
                                        onClick={() => handleSendMessage(chip)}
                                        className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-[10px] font-bold text-slate-600 border border-slate-200/60 transition cursor-pointer disabled:opacity-50"
                                    >
                                        {chip}
                                    </button>
                                ))}
                            </div>

                            {/* Input Form */}
                            <form
                                onSubmit={e => {
                                    e.preventDefault();
                                    handleSendMessage();
                                }}
                                className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
                            >
                                <button
                                    type="button"
                                    onClick={handleVoiceRecognition}
                                    disabled={isLoading}
                                    className={`p-2 rounded-xl transition cursor-pointer disabled:opacity-50 ${
                                        isListening
                                            ? 'bg-rose-500 text-white animate-pulse'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                    title={t('speak_voice_title')}
                                >
                                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                                </button>

                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={e => setInputMessage(e.target.value)}
                                    placeholder={
                                        isLoading ? (
                                            currentLang === 'kn' ? 'ಲಿಂಗೋಬೋಟ್ ಯೋಚಿಸುತ್ತಿದೆ...' :
                                            currentLang === 'te' ? 'లింగోబోట్ ఆలోచిస్తోంది...' :
                                            currentLang === 'hi' ? 'लिंगोबॉट सोच रहा है...' :
                                            currentLang === 'ta' ? 'லிங்கோபோட் சிந்திக்கிறது...' :
                                            currentLang === 'ml' ? 'ലിംഗോബോട്ട് ചിന്തിക്കുന്നു...' :
                                            'LingoBot is thinking...'
                                        ) : (
                                            currentLang === 'kn' ? 'ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಅಥವಾ ಕಲಿಯುವ ಭಾಷೆಯಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ...' :
                                            currentLang === 'te' ? 'మీ భాషలో లేదా లక్ష్య భాషలో గురువును అడగండి...' :
                                            currentLang === 'hi' ? 'अपनी भाषा या सीखने की भाषा में शिक्षक से पूछें...' :
                                            currentLang === 'ta' ? 'உங்கள் மொழியில் அல்லது கற்கும் மொழியில் ஆசிரியரிடம் கேளுங்கள்...' :
                                            currentLang === 'ml' ? 'നിങ്ങളുടെ ഭാഷയിലോ പഠന ഭാഷയിലോ അധ്യാപകനോട് ചോദിക്കൂ...' :
                                            'Ask teacher in your language or target language...'
                                        )
                                    }
                                    disabled={isLoading}
                                    className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-800 disabled:bg-slate-100 disabled:cursor-not-allowed"
                                />

                                <button
                                    type="submit"
                                    disabled={!inputMessage.trim() || isLoading}
                                    className="p-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white transition shadow-xs cursor-pointer"
                                    title={t('send_btn')}
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}

            {/* Floating Avatar Trigger Button */}
            {!isOpen && (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="relative group p-2 rounded-3xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-teal-500 text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 pr-4 border-2 border-white/80 cursor-pointer"
                    title={t('ai_teacher_btn_title')}
                >
                    <div className="relative">
                        <LingoBot size="sm" expression="teaching" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
                    </div>
                    <div className="text-left hidden sm:block">
                        <span className="text-[10px] font-black uppercase tracking-wider block text-brand-100 leading-none">
                            {t('ai_teacher_btn_title')}
                        </span>
                        <span className="text-xs font-extrabold text-white leading-tight">
                            Ask LingoBot
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
};
