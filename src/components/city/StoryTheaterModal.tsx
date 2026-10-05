import React, { useState, useEffect } from 'react';
import { CityStory, StoryScene, WordToken } from '../../types/lingoCity';
import { lingoCityService } from '../../services/lingoCityService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
    Play,
    Pause,
    Volume2,
    RotateCcw,
    Sparkles,
    CheckCircle2,
    Check,
    Mic,
    BookmarkPlus,
    X,
    Trophy,
    HelpCircle,
    ArrowRight
} from 'lucide-react';

interface Props {
    story: CityStory;
    isOpen: boolean;
    onClose: () => void;
    onCompleted: (storyId: string, xpEarned: number) => void;
}

export const StoryTheaterModal: React.FC<Props> = ({
    story,
    isOpen,
    onClose,
    onCompleted
}) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isSlowAudio, setIsSlowAudio] = useState(false);
    const [selectedWord, setSelectedWord] = useState<WordToken | null>(null);
    const [wordSavedToast, setWordSavedToast] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
    const [isPronouncing, setIsPronouncing] = useState(false);
    const [pronounceSuccess, setPronounceSuccess] = useState(false);
    const [isStoryFinished, setIsStoryFinished] = useState(false);
    const [learnedWordsCount, setLearnedWordsCount] = useState(0);

    const currentScene: StoryScene = story.scenes[currentSceneIndex] || story.scenes[0];

    useEffect(() => {
        if (isOpen) {
            setCurrentSceneIndex(0);
            setIsStoryFinished(false);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
            setSelectedWord(null);
            setPronounceSuccess(false);
        }
    }, [isOpen, story]);

    // Audio Playback
    const playAudio = (text: string, rate: number = 0.9) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = isSlowAudio ? 0.65 : rate;
        utterance.pitch = 1.05;

        if (story.targetLanguage === 'hi') utterance.lang = 'hi-IN';
        else if (story.targetLanguage === 'te') utterance.lang = 'te-IN';
        else if (story.targetLanguage === 'ta') utterance.lang = 'ta-IN';
        else utterance.lang = 'en-US';

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
    };

    const handleWordClick = (word: WordToken) => {
        setSelectedWord(word);
        playAudio(word.text);
    };

    const handleSaveWordToGarden = (word: WordToken) => {
        lingoCityService.addWordToGarden(word.text, word.romanized, word.meaning);
        setWordSavedToast(true);
        setLearnedWordsCount(prev => prev + 1);
        setTimeout(() => setWordSavedToast(false), 2200);
    };

    const handleMicPractice = () => {
        setIsPronouncing(true);
        setTimeout(() => {
            setIsPronouncing(false);
            setPronounceSuccess(true);
            setTimeout(() => setPronounceSuccess(false), 3000);
        }, 1800);
    };

    const handleNextScene = () => {
        if (currentSceneIndex < story.scenes.length - 1) {
            setCurrentSceneIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswerSubmitted(false);
            setPronounceSuccess(false);
        } else {
            // Finish Story
            setIsStoryFinished(true);
            lingoCityService.recordStoryCompleted(story.id, story.title);
            onCompleted(story.id, story.xpReward);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                window.speechSynthesis?.cancel();
                onClose();
            }}
            title={`🎬 Story Theater — ${story.title}`}
            className="max-w-2xl sm:max-w-3xl"
        >
            <div className="space-y-6">
                {!isStoryFinished ? (
                    <>
                        {/* Scene Header & Progress */}
                        <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">🎬</span>
                                <div>
                                    <h3 className="text-base font-black text-slate-900">{currentScene.title}</h3>
                                    <span className="text-xs font-semibold text-slate-500">
                                        Scene {currentSceneIndex + 1} of {story.scenes.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsSlowAudio(!isSlowAudio)}
                                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition ${
                                        isSlowAudio
                                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                    title="Toggle Turtle 0.75x Slow Audio"
                                >
                                    🐢 {isSlowAudio ? 'Slow Audio (0.65x)' : 'Normal Audio'}
                                </button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => playAudio(currentScene.audioText)}
                                    leftIcon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                    className="text-xs font-extrabold text-brand-700 border-brand-300"
                                >
                                    {isPlaying ? 'Playing...' : 'Play Narration'}
                                </Button>
                            </div>
                        </div>

                        {/* Animated Illustration Stage */}
                        <div className="h-44 sm:h-52 rounded-3xl bg-gradient-to-tr from-indigo-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center text-center p-6 shadow-inner">
                            {/* Animated Background Atmosphere */}
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-brand-500/30 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-teal-500/30 blur-3xl pointer-events-none" />

                            {/* Cartoon Scene Stage Elements */}
                            <div className="relative z-10 space-y-2">
                                <div className="text-5xl sm:text-6xl animate-bounce-subtle drop-shadow-lg">
                                    {currentScene.illustrationType === 'station' && '🚂 🚉 🛄'}
                                    {currentScene.illustrationType === 'cafe' && '☕ 🥐 🪑'}
                                    {currentScene.illustrationType === 'park' && '🌳 ⛲ 🐦'}
                                    {currentScene.illustrationType === 'market' && '🍎 🧺 🏪'}
                                    {currentScene.illustrationType === 'library' && '📚 🏛️ 🕯️'}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white">
                                    <span>{story.subtitle}</span> • <span>Scene {currentSceneIndex + 1}</span>
                                </div>
                            </div>
                        </div>

                        {/* Target Language Subtitles with Interactive Words */}
                        <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                                <span className="flex items-center gap-1.5">
                                    <Sparkles className="w-4 h-4 text-brand-600" />
                                    <span>Target Language Subtitle (Tap any word for meaning)</span>
                                </span>
                                <button
                                    onClick={() => playAudio(currentScene.audioText)}
                                    className="hover:underline flex items-center gap-1 text-brand-700"
                                >
                                    <Volume2 className="w-3.5 h-3.5" /> Listen Again
                                </button>
                            </div>

                            {/* Words Stream */}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {currentScene.words.map((w, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleWordClick(w)}
                                        className={`px-3 py-1.5 rounded-xl text-base sm:text-lg font-bold transition-all transform hover:scale-105 cursor-pointer shadow-2xs ${
                                            selectedWord?.text === w.text
                                                ? 'bg-brand-600 text-white shadow-md ring-2 ring-brand-300'
                                                : w.isKeyWord
                                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                                                : 'bg-white hover:bg-slate-100 text-slate-800 border border-indigo-100'
                                        }`}
                                    >
                                        {w.text}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Word Popover Display */}
                        {selectedWord && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl font-black text-slate-900">{selectedWord.text}</span>
                                        <span className="text-xs font-bold text-teal-700 italic">[{selectedWord.romanized}]</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">
                                        Meaning: <span className="text-brand-700 font-extrabold">{selectedWord.meaning}</span>
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => playAudio(selectedWord.text)}
                                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                                        title="Hear word"
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleSaveWordToGarden(selectedWord)}
                                        leftIcon={<BookmarkPlus className="w-3.5 h-3.5" />}
                                        className="text-xs font-bold border-teal-300 text-teal-800 bg-white"
                                    >
                                        🌱 Add to Garden
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Word Saved Toast */}
                        {wordSavedToast && (
                            <div className="bg-teal-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4" /> Word planted in your Language Garden!
                            </div>
                        )}

                        {/* Pronunciation Practice Moment (if available in scene) */}
                        {currentScene.pronunciationPrompt && (
                            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-3">
                                <div>
                                    <span className="text-[11px] font-black uppercase text-amber-800 tracking-wider flex items-center gap-1">
                                        <Mic className="w-3.5 h-3.5" /> Pronunciation Practice
                                    </span>
                                    <div className="text-sm font-extrabold text-slate-900 mt-1">
                                        "{currentScene.pronunciationPrompt.sentence}"
                                    </div>
                                    <div className="text-xs text-slate-500 italic">
                                        {currentScene.pronunciationPrompt.tip}
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleMicPractice}
                                    disabled={isPronouncing}
                                    leftIcon={pronounceSuccess ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Mic className={`w-3.5 h-3.5 ${isPronouncing ? 'animate-pulse text-rose-500' : ''}`} />}
                                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold border-none shrink-0"
                                >
                                    {isPronouncing ? 'Listening...' : pronounceSuccess ? 'Great Tone!' : 'Speak Line'}
                                </Button>
                            </div>
                        )}

                        {/* Comprehension Question (if available in scene) */}
                        {currentScene.comprehensionQuestion && (
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                                <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-700">
                                    <HelpCircle className="w-4 h-4 text-purple-600" />
                                    <span>Story Understanding: {currentScene.comprehensionQuestion.question}</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {currentScene.comprehensionQuestion.options.map((opt, oIdx) => {
                                        const isSelected = selectedOption === oIdx;
                                        const isCorrect = oIdx === currentScene.comprehensionQuestion?.correctIndex;

                                        return (
                                            <button
                                                key={oIdx}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedOption(oIdx);
                                                    setIsAnswerSubmitted(true);
                                                }}
                                                className={`p-2.5 rounded-xl text-xs font-bold text-left border transition ${
                                                    isAnswerSubmitted && isCorrect
                                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                                                        : isAnswerSubmitted && isSelected && !isCorrect
                                                        ? 'bg-rose-50 border-rose-400 text-rose-900'
                                                        : isSelected
                                                        ? 'bg-brand-50 border-brand-400 text-brand-900'
                                                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {isAnswerSubmitted && (
                                    <div className="text-xs font-semibold text-slate-600">
                                        💡 {currentScene.comprehensionQuestion.explanation}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Action Buttons: Next Scene */}
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs font-semibold text-slate-500">
                                Tap unfamiliar words to save them to your Language Garden.
                            </span>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleNextScene}
                                rightIcon={<ArrowRight className="w-4 h-4" />}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md cursor-pointer"
                            >
                                {currentSceneIndex < story.scenes.length - 1 ? 'Next Scene' : 'Finish Story'}
                            </Button>
                        </div>
                    </>
                ) : (
                    /* 🎉 Story Completed Celebration Screen */
                    <div className="text-center py-6 space-y-5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-amber-200 flex items-center justify-center text-4xl shadow-xl mx-auto animate-bounce-subtle">
                            🏆
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900">
                                Story Completed!
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 font-medium">
                                You experienced "{story.title}" ({story.subtitle}) in your target language!
                            </p>
                        </div>

                        {/* Stat Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto">
                            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                                <div className="text-lg font-black text-amber-700">+{story.xpReward}</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">XP Earned</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-center">
                                <div className="text-lg font-black text-teal-700">100%</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Listening</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 text-center">
                                <div className="text-lg font-black text-indigo-700">95%</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">Comprehension</div>
                            </div>
                            <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                                <div className="text-lg font-black text-purple-700">🏛️ Saved</div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase">To Museum</div>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-center gap-3">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={onClose}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md px-6"
                            >
                                Return to Lingo City
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
