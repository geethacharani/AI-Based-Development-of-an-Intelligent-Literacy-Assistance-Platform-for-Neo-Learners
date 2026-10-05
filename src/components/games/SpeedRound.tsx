import React, { useState, useEffect, useRef } from 'react';
import { SpeedQuestion, GameAttemptData } from '../../types/game';
import { gameService } from '../../services/gameService';
import { Zap, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface SpeedRoundProps {
    questions: SpeedQuestion[];
    targetLang: string;
    comfortLang: string;
    onComplete?: () => void;
}

export const SpeedRound: React.FC<SpeedRoundProps> = ({ questions, targetLang, comfortLang, onComplete }) => {
    const [qIdx, setQIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [phase, setPhase] = useState<'playing' | 'feedback' | 'victory'>('playing');
    const [correctCount, setCorrectCount] = useState(0);
    const timerRef = useRef<number | null>(null);

    const current = questions[qIdx] || questions[0];

    useEffect(() => {
        if (phase !== 'playing') return;
        setTimeLeft(current.timeLimitSeconds);
        const startTime = Date.now();
        const duration = current.timeLimitSeconds * 1000;

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const remain = Math.max(0, (duration - elapsed) / 1000);
            setTimeLeft(remain);

            if (remain <= 0) {
                clearInterval(interval);
                handleTimeOut();
            }
        }, 50);

        timerRef.current = interval as unknown as number;
        return () => clearInterval(interval);
    }, [qIdx, phase]);

    const handleTimeOut = () => {
        setSelected('TIMEOUT');
        setPhase('feedback');
    };

    const handleSelect = (opt: string) => {
        if (selected || phase !== 'playing') return;
        if (timerRef.current) clearInterval(timerRef.current);
        setSelected(opt);

        const isRight = opt === current.correct;
        if (isRight) {
            const bonus = Math.round(timeLeft * 30);
            setScore(s => s + 100 + bonus);
            setCorrectCount(c => c + 1);
        } else {
            setScore(s => Math.max(0, s - 20));
        }
        setPhase('feedback');
    };

    const handleNext = async () => {
        setSelected(null);
        if (qIdx + 1 < questions.length) {
            setQIdx(q => q + 1);
            setPhase('playing');
        } else {
            setPhase('victory');
            await gameService.submitGameAttempt({
                game_key: 'speed_round',
                level: questions.length,
                score,
                xp_gained: score,
                correct_attempts: correctCount,
                wrong_attempts: questions.length - correctCount,
                completed: true,
                skill: 'Rapid Recall & Vocabulary Speed'
            });
        }
    };

    const handleRestart = () => {
        setQIdx(0); setScore(0); setSelected(null);
        setCorrectCount(0); setPhase('playing');
    };

    const pct = Math.max(0, (timeLeft / current.timeLimitSeconds) * 100);

    if (phase === 'victory') {
        return (
            <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center mx-auto shadow-lg animate-bounce text-4xl">
                    ⚡
                </div>
                <h2 className="text-3xl font-black">Speed Round Complete!</h2>
                <p className="text-slate-300 text-sm">Lightning fast answers! You cleared all questions under pressure.</p>
                <div className="grid grid-cols-3 gap-3">
                    {[['Score', `${score}`, 'text-amber-400'], ['Accuracy', `${Math.round((correctCount / questions.length) * 100)}%`, 'text-teal-400'], ['Correct', `${correctCount}/${questions.length}`, 'text-emerald-400']].map(([l, v, c]) => (
                        <div key={l} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className={`text-2xl font-black ${c}`}>{v}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{l}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Try Again
                    </button>
                    {onComplete && (
                        <button onClick={onComplete} className="flex-1 py-3.5 bg-amber-500 text-slate-950 font-bold rounded-2xl transition hover:brightness-110">
                            Next Game →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-amber-500/30 rounded-3xl p-5 md:p-7 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/20 rounded-2xl border border-amber-500/40 text-amber-400 text-xl">⚡</div>
                    <div>
                        <h2 className="text-lg font-black">Speed Round</h2>
                        <p className="text-xs text-slate-400">Question {qIdx + 1} of {questions.length}</p>
                    </div>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-400 text-xs font-black">
                    Score: {score}
                </div>
            </div>

            {/* Circular Timer Visual */}
            <div className="flex justify-center items-center py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                        <circle
                            cx="56" cy="56" r="48"
                            stroke={pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#10b981'}
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - pct / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-75"
                        />
                    </svg>
                    <span className={`absolute text-2xl font-black ${pct < 30 ? 'text-rose-500 animate-ping' : 'text-white'}`}>
                        {timeLeft.toFixed(1)}s
                    </span>
                </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center">
                <p className="text-xl font-black text-white">{current.prompt}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt, i) => {
                    const isAnswered = !!selected;
                    const isSelected = selected === opt;
                    const isCorrect = opt === current.correct;

                    let cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-amber-500/10 hover:border-amber-500/40 cursor-pointer';
                    if (isAnswered && isCorrect) cls = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                    else if (isAnswered && isSelected && !isCorrect) cls = 'bg-rose-500/20 border-rose-400 text-rose-200';

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={isAnswered}
                            className={`p-4 border rounded-2xl font-bold text-sm text-left transition-all ${cls}`}
                        >
                            <span className="text-slate-500 text-xs mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {phase === 'feedback' && (
                <div className={`rounded-2xl p-4 border space-y-2 ${selected === current.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                    <p className={`font-black text-sm ${selected === current.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selected === current.correct ? `⚡ Fast! +${100 + Math.round(timeLeft * 30)} XP!` : selected === 'TIMEOUT' ? '⏰ Time Ran Out!' : `❌ Wrong! Correct answer was: ${current.correct}`}
                    </p>
                    <button onClick={handleNext} className="w-full py-2.5 bg-amber-500 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 transition mt-2">
                        {qIdx + 1 < questions.length ? <>Next Question →</> : <>View Results 🏆</>}
                    </button>
                </div>
            )}
        </div>
    );
};
