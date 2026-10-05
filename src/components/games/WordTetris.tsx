import React, { useState, useEffect, useRef } from 'react';
import { TetrisBlock, GameAttemptData } from '../../types/game';
import { gameService } from '../../services/gameService';
import { LayoutGrid, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface WordTetrisProps {
    blocks: TetrisBlock[];
    targetLang: string;
    comfortLang: string;
    onComplete?: () => void;
}

export const WordTetris: React.FC<WordTetrisProps> = ({ blocks, targetLang, comfortLang, onComplete }) => {
    const [blockIdx, setBlockIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [phase, setPhase] = useState<'playing' | 'feedback' | 'victory'>('playing');
    const [correctCount, setCorrectCount] = useState(0);
    const [fallingY, setFallingY] = useState(0);
    const animRef = useRef<number>(0);

    const current = blocks[blockIdx] || blocks[0];

    // Animate falling letters
    useEffect(() => {
        if (phase !== 'playing') return;
        setFallingY(0);
        let y = 0;
        const animate = () => {
            y = (y + 1.5) % 60;
            setFallingY(y);
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animRef.current);
    }, [blockIdx, phase]);

    const handleSelect = (opt: string) => {
        if (selected) return;
        setSelected(opt);
        cancelAnimationFrame(animRef.current);
        if (opt === current.correct) {
            setScore(p => p + 200);
            setCorrectCount(p => p + 1);
        } else {
            setScore(p => Math.max(0, p - 30));
        }
        setPhase('feedback');
    };

    const handleNext = async () => {
        setSelected(null);
        if (blockIdx + 1 < blocks.length) {
            setBlockIdx(p => p + 1);
            setPhase('playing');
        } else {
            setPhase('victory');
            await gameService.submitGameAttempt({
                game_key: 'word_tetris',
                level: blocks.length,
                score,
                xp_gained: score,
                correct_attempts: correctCount,
                wrong_attempts: blocks.length - correctCount,
                completed: true,
                skill: 'Word Assembly & Letter Ordering'
            });
        }
    };

    const handleRestart = () => {
        setBlockIdx(0); setScore(0); setSelected(null);
        setCorrectCount(0); setPhase('playing');
    };

    if (phase === 'victory') {
        return (
            <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl max-w-2xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-black">Tetris Master!</h2>
                <p className="text-slate-300 text-sm">You stacked all the word blocks perfectly!</p>
                <div className="grid grid-cols-3 gap-3">
                    {[['Score', `${score}`, 'text-cyan-400'], ['XP', `+${score}`, 'text-blue-400'], ['Formed', `${correctCount}/${blocks.length}`, 'text-emerald-400']].map(([l, v, c]) => (
                        <div key={l} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className={`text-2xl font-black ${c}`}>{v}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{l}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Play Again
                    </button>
                    {onComplete && (
                        <button onClick={onComplete} className="flex-1 py-3.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                            Next Game <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl p-5 md:p-7 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/20 rounded-2xl border border-cyan-500/40 text-cyan-400">
                        <LayoutGrid className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black">Word Tetris 🧱</h2>
                        <p className="text-xs text-slate-400">Block {blockIdx + 1} of {blocks.length}</p>
                    </div>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-cyan-400 border border-slate-700 text-xs font-black">Score: {score}</div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${(blockIdx / blocks.length) * 100}%` }} />
            </div>

            {/* Tetris Grid Visual */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/20 rounded-2xl p-5 space-y-4">
                <p className="text-xs font-black text-cyan-400 uppercase tracking-wider">🎮 {current.prompt}</p>

                {/* Animated falling letter blocks */}
                <div className="flex justify-center gap-3 h-20 items-end overflow-hidden relative">
                    {current.letters.map((letter, i) => (
                        <div
                            key={i}
                            className="w-12 h-12 bg-gradient-to-tr from-cyan-600 to-cyan-400 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg border border-cyan-300/30 transition-transform"
                            style={{
                                transform: `translateY(${phase === 'playing' ? -fallingY * (1 + i * 0.1) % 50 : 0}px)`,
                            }}
                        >
                            {letter}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <div className="flex gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="w-8 h-1 rounded-full bg-cyan-500/30" />
                        ))}
                    </div>
                </div>

                <p className="text-center text-xs text-slate-400">Arrange the falling blocks into the correct word:</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt, i) => {
                    const isAnswered = !!selected;
                    const isSelected = selected === opt;
                    const isCorrect = opt === current.correct;

                    let cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-cyan-500/10 hover:border-cyan-500/40 cursor-pointer';
                    if (isAnswered && isCorrect) cls = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                    else if (isAnswered && isSelected && !isCorrect) cls = 'bg-rose-500/20 border-rose-400 text-rose-200';

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={isAnswered}
                            className={`p-4 border rounded-2xl font-black text-xl text-center transition-all ${cls}`}
                        >
                            {opt}
                            <div className="text-[10px] font-bold text-slate-500 mt-1 tracking-widest">{opt.split('').join(' · ')}</div>
                            {isAnswered && isCorrect && <CheckCircle2 className="inline w-4 h-4 ml-2 text-emerald-400" />}
                            {isAnswered && isSelected && !isCorrect && <XCircle className="inline w-4 h-4 ml-2 text-rose-400" />}
                        </button>
                    );
                })}
            </div>

            {phase === 'feedback' && selected && (
                <div className={`rounded-2xl p-4 border space-y-2 ${selected === current.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                    <p className={`font-black text-sm ${selected === current.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selected === current.correct ? `✅ "${current.correct}" stacked perfectly!` : `❌ The correct word was "${current.correct}".`}
                    </p>
                    <button onClick={handleNext} className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition mt-2">
                        {blockIdx + 1 < blocks.length ? <>Next Block <ArrowRight className="w-4 h-4" /></> : <>Finish Game <CheckCircle2 className="w-4 h-4" /></>}
                    </button>
                </div>
            )}
        </div>
    );
};
