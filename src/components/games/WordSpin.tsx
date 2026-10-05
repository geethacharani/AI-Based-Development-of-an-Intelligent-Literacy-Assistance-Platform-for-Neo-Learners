import React, { useState } from 'react';
import { SpinRound, GameAttemptData } from '../../types/game';
import { gameService } from '../../services/gameService';
import { Trophy, RotateCcw, ArrowRight, Disc } from 'lucide-react';

interface WordSpinProps {
    rounds: SpinRound[];
    targetLang: string;
    comfortLang: string;
    onComplete?: () => void;
}

export const WordSpin: React.FC<WordSpinProps> = ({ rounds, targetLang, comfortLang, onComplete }) => {
    const [rIdx, setRIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed' | 'feedback' | 'victory'>('idle');
    const [correctCount, setCorrectCount] = useState(0);

    const current = rounds[rIdx] || rounds[0];

    const handleSpin = () => {
        if (spinning || phase !== 'idle') return;
        setSpinning(true);
        setPhase('spinning');

        // Spin 4 to 8 full rotations + random angle
        const extraDegree = Math.floor(Math.random() * 360) + 1440;
        const nextRotation = rotation + extraDegree;
        setRotation(nextRotation);

        setTimeout(() => {
            setSpinning(false);
            setPhase('landed');
        }, 3000);
    };

    const handleSelect = (opt: string) => {
        if (selected || phase !== 'landed') return;
        setSelected(opt);

        const isRight = opt === current.correct;
        if (isRight) {
            setScore(s => s + 200);
            setCorrectCount(c => c + 1);
        } else {
            setScore(s => Math.max(0, s - 30));
        }
        setPhase('feedback');
    };

    const handleNext = async () => {
        setSelected(null);
        if (rIdx + 1 < rounds.length) {
            setRIdx(r => r + 1);
            setPhase('idle');
        } else {
            setPhase('victory');
            await gameService.submitGameAttempt({
                game_key: 'word_spin',
                level: rounds.length,
                score,
                xp_gained: score,
                correct_attempts: correctCount,
                wrong_attempts: rounds.length - correctCount,
                completed: true,
                skill: 'Spin Wheel Vocabulary Matching'
            });
        }
    };

    const handleRestart = () => {
        setRIdx(0); setScore(0); setSelected(null);
        setRotation(0); setCorrectCount(0); setPhase('idle');
    };

    if (phase === 'victory') {
        return (
            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center mx-auto shadow-lg animate-bounce text-4xl">
                    🎲
                </div>
                <h2 className="text-3xl font-black">Word Spin Master!</h2>
                <p className="text-slate-300 text-sm">You spun the wheel and mastered every vocabulary challenge!</p>
                <div className="grid grid-cols-3 gap-3">
                    {[['Score', `${score}`, 'text-purple-400'], ['Correct', `${correctCount}/${rounds.length}`, 'text-emerald-400'], ['XP', `+${score}`, 'text-amber-400']].map(([l, v, c]) => (
                        <div key={l} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className={`text-2xl font-black ${c}`}>{v}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{l}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Spin Again
                    </button>
                    {onComplete && (
                        <button onClick={onComplete} className="flex-1 py-3.5 bg-purple-600 text-white font-bold rounded-2xl transition hover:brightness-110">
                            Next Game →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const numSlices = current.wheelWords.length;
    const sliceAngle = 360 / numSlices;

    return (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-5 md:p-7 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/20 rounded-2xl border border-purple-500/40 text-purple-400 text-xl">🎲</div>
                    <div>
                        <h2 className="text-lg font-black">Word Spin</h2>
                        <p className="text-xs text-slate-400">Round {rIdx + 1} of {rounds.length}</p>
                    </div>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-purple-400 text-xs font-black">
                    Score: {score}
                </div>
            </div>

            {/* Wheel Visual */}
            <div className="flex flex-col items-center justify-center py-2 space-y-4">
                {/* Pointer indicator */}
                <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-400 z-10 -mb-4 drop-shadow-md" />

                {/* Rotating Wheel Container */}
                <div className="relative w-64 h-64 rounded-full border-4 border-slate-700 shadow-2xl overflow-hidden">
                    <div
                        className="w-full h-full rounded-full relative transition-transform duration-[3000ms] cubic-bezier(0.15, 0.9, 0.2, 1)"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {current.wheelWords.map((item, i) => {
                            const angle = i * sliceAngle;
                            return (
                                <div
                                    key={i}
                                    className="absolute w-1/2 h-1/2 top-0 right-0 origin-bottom-left flex items-center justify-center border border-slate-900/40"
                                    style={{
                                        backgroundColor: item.color,
                                        transform: `rotate(${angle}deg)`,
                                        clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                                    }}
                                >
                                    <span
                                        className="text-white font-black text-xs drop-shadow transform -rotate-45 block whitespace-nowrap"
                                        style={{ transform: `rotate(${sliceAngle / 2}deg) translate(35px, -15px)` }}
                                    >
                                        {item.word}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Wheel Center Cap */}
                    <div className="absolute inset-0 m-auto w-14 h-14 bg-slate-900 border-2 border-amber-400 rounded-full flex items-center justify-center text-xl shadow-lg z-10">
                        🎲
                    </div>
                </div>

                {phase === 'idle' && (
                    <button
                        onClick={handleSpin}
                        className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-base rounded-2xl shadow-xl flex items-center gap-2 transform hover:scale-105 transition"
                    >
                        <Disc className="w-5 h-5 animate-spin" /> SPIN THE WHEEL!
                    </button>
                )}
            </div>

            {/* Question Prompt when landed or feedback */}
            {(phase === 'landed' || phase === 'feedback') && (
                <div className="space-y-4">
                    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
                        <p className="text-xs font-black text-purple-400 uppercase tracking-wider mb-1">Challenge Prompt</p>
                        <p className="text-base font-black text-white">{current.prompt}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {current.wheelWords.map((item, i) => {
                            const opt = item.word;
                            const isAnswered = !!selected;
                            const isSelected = selected === opt;
                            const isCorrect = opt === current.correct;

                            let cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-purple-500/10 hover:border-purple-500/40 cursor-pointer';
                            if (isAnswered && isCorrect) cls = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                            else if (isAnswered && isSelected && !isCorrect) cls = 'bg-rose-500/20 border-rose-400 text-rose-200';

                            return (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(opt)}
                                    disabled={isAnswered}
                                    className={`p-3.5 border rounded-2xl font-black text-sm text-center transition-all ${cls}`}
                                >
                                    {opt}
                                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{item.meaning}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {phase === 'feedback' && selected && (
                <div className={`rounded-2xl p-4 border space-y-2 ${selected === current.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                    <p className={`font-black text-sm ${selected === current.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selected === current.correct ? `🎲 Correct! +200 XP!` : `❌ Wrong! The correct word was "${current.correct}".`}
                    </p>
                    <button onClick={handleNext} className="w-full py-2.5 bg-purple-600 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition mt-2">
                        {rIdx + 1 < rounds.length ? <>Next Spin →</> : <>View Results 🏆</>}
                    </button>
                </div>
            )}
        </div>
    );
};
