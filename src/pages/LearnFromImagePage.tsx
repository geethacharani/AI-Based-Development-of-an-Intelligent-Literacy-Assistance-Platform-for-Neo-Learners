import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { imageLearnService, ExtractedImageItem, ImageOCRResponse } from '../services/imageLearnService';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
    Camera,
    Upload,
    Volume2,
    Mic,
    Bookmark,
    Check,
    Scan,
    Sparkles,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

export const LearnFromImagePage: React.FC = () => {
    const { profile } = useAuth();
    const [selectedSample, setSelectedSample] = useState<string>('menu');
    const [ocrData, setOcrData] = useState<ImageOCRResponse | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [savedItemIds, setSavedItemIds] = useState<string[]>([]);
    const [practicingId, setPracticingId] = useState<string | null>(null);
    const [practiceScore, setPracticeScore] = useState<number | null>(null);

    const targetLangName = profile?.target_language?.name || 'Hindi';
    const comfLangName = profile?.comfortable_language?.name || 'English';

    const sampleImages = [
        { id: 'menu', title: 'Restaurant Food Menu', icon: '📋', desc: 'Dishes, beverages & prices' },
        { id: 'signboard', title: 'Bus & Street Signboard', icon: '🚏', desc: 'Public transit directions & gates' },
        { id: 'label', title: 'Product Grocery Label', icon: '🏷️', desc: 'Packaged food & ingredients' }
    ];

    const handleAnalyze = async (sampleType: string) => {
        setSelectedSample(sampleType);
        setIsAnalyzing(true);
        try {
            const data = await imageLearnService.analyzeSample(sampleType);
            setOcrData(data);
        } catch (err) {
            console.error('Error analyzing image', err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Load initial sample
    React.useEffect(() => {
        handleAnalyze('menu');
        const saved = imageLearnService.getSavedVocabulary();
        setSavedItemIds(saved.map(s => s.id));
    }, []);

    const handleSpeak = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
    };

    const handleSaveWord = (item: ExtractedImageItem) => {
        imageLearnService.saveVocabularyWord(item);
        setSavedItemIds(prev => [...prev, item.id]);
    };

    const handlePracticeVoice = (item: ExtractedImageItem) => {
        setPracticingId(item.id);
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser. Please use Chrome/Edge.");
            setPracticingId(null);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = profile?.target_language?.code === 'hi' ? 'hi-IN' : 'en-US';
        recognition.onresult = () => {
            setPracticeScore(95);
            setPracticingId(null);
        };
        recognition.onerror = () => setPracticingId(null);
        recognition.onend = () => setPracticingId(null);
        recognition.start();
    };

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fade-in pb-16 font-sans">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="space-y-2 z-10">
                    <Badge variant="brand" size="sm" className="font-extrabold text-slate-950 bg-blue-300 border-none">
                        📸 OCR & VISUAL LEARNING
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                        Learn from Real-World Images
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base font-medium max-w-xl">
                        Upload or scan street boards, menus, packaging, and signboards to extract authentic <strong className="text-white font-bold">{targetLangName}</strong> vocabulary.
                    </p>
                </div>

                <div className="flex items-center gap-2 z-10">
                    <label className="cursor-pointer px-4 py-3 bg-white/15 hover:bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-center flex items-center gap-2 transition text-xs font-bold text-white">
                        <Upload className="w-4 h-4 text-cyan-300" />
                        <span>Upload Image</span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={() => handleAnalyze('menu')}
                        />
                    </label>
                </div>
            </div>

            {/* Sample Images Selection */}
            <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                    Try Authentic Real-Life Samples
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sampleImages.map(sample => (
                        <button
                            key={sample.id}
                            type="button"
                            onClick={() => handleAnalyze(sample.id)}
                            className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                selectedSample === sample.id
                                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm'
                                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                            }`}
                        >
                            <span className="text-2xl block mb-1">{sample.icon}</span>
                            <h4 className="text-sm font-extrabold text-slate-800">{sample.title}</h4>
                            <p className="text-xs text-slate-500 font-medium">{sample.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* OCR Extracted Learning Results */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                            <Scan className="w-5 h-5 text-indigo-600" />
                            <span>Extracted Target Vocabulary</span>
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Read → Listen → Understand → Practice → Save to your personal vocabulary
                        </p>
                    </div>

                    {isAnalyzing && (
                        <span className="text-xs font-bold text-indigo-600 animate-pulse flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            Scanning Image...
                        </span>
                    )}
                </div>

                {ocrData && (
                    <div className="space-y-3">
                        {ocrData.items.map(item => {
                            const isSaved = savedItemIds.includes(item.id);
                            return (
                                <Card key={item.id} className="p-5 border-slate-200/90 space-y-3 hover:border-indigo-200 transition">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-extrabold text-slate-900">
                                                    {item.target_text}
                                                </h3>
                                                <Badge variant="brand" size="sm" className="text-[10px] font-bold">
                                                    {item.category}
                                                </Badge>
                                            </div>
                                            <span className="text-xs text-indigo-600 font-bold block">
                                                Phonetic: {item.phonetic}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Listen Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleSpeak(item.target_text)}
                                                className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 transition flex items-center gap-1 text-xs font-bold cursor-pointer"
                                                title="Listen Pronunciation"
                                            >
                                                <Volume2 className="w-4 h-4" />
                                                <span>Listen</span>
                                            </button>

                                            {/* Practice Voice Button */}
                                            <button
                                                type="button"
                                                onClick={() => handlePracticeVoice(item)}
                                                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                                    practicingId === item.id
                                                        ? 'bg-rose-500 text-white animate-pulse'
                                                        : 'bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-600'
                                                }`}
                                                title="Practice Speaking"
                                            >
                                                <Mic className="w-4 h-4" />
                                                <span>{practicingId === item.id ? 'Listening...' : 'Practice'}</span>
                                            </button>

                                            {/* Save Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleSaveWord(item)}
                                                disabled={isSaved}
                                                className={`p-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                                                    isSaved
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs'
                                                }`}
                                                title={isSaved ? "Saved in Vocabulary" : "Save Word"}
                                            >
                                                {isSaved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                                <span>{isSaved ? 'Saved' : 'Save'}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meaning & Example Sentence */}
                                    <div className="p-3 bg-slate-50/80 rounded-xl space-y-1 text-xs">
                                        <p className="font-bold text-slate-800">
                                            <span className="text-slate-400 font-normal">Meaning ({comfLangName}): </span>
                                            {item.meaning}
                                        </p>
                                        <p className="text-slate-600 font-medium">
                                            <span className="text-slate-400 font-normal">Example Sentence: </span>
                                            <span className="font-bold text-slate-800">{item.example_sentence}</span>
                                        </p>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
