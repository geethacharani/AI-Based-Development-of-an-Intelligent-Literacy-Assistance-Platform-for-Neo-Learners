import React, { useState, useEffect, useCallback } from 'react';
import { MemoryCard, GameAttemptData } from '../../types/game';
import { gameService } from '../../services/gameService';
import { Trophy, RotateCcw, Timer, Star } from 'lucide-react';

interface MemoryFlipProps {
    cards: MemoryCard[];
    targetLang: string;
    comfortLang: string;
    onComplete?: () => void;
}

interface CardState extends MemoryCard {
    idx: number;
    flipped: boolean;
    matched: boolean;
}

export const MemoryFlip: React.FC<MemoryFlipProps> = ({ cards, targetLang, onComplete }) => {
    const buildDeck = useCallback((): CardState[] =>
        [...cards].sort(() => Math.random() - 0.5).map((c, i) => ({ ...c, idx: i, flipped: false, matched: false }))
        , [cards]);

    const [deck, setDeck] = useState<CardState[]>(buildDeck);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [score, setScore] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [phase, setPhase] = useState<'playing' | 'victory'>('playing');
    const [shakeIdx, setShakeIdx] = useState<number[]>([]);
    const [glowIdx, setGlowIdx] = useState<number[]>([]);

    const totalPairs = cards.length / 2;

    // Timer
    useEffect(() => {
        if (phase !== 'playing') return;
        const id = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(id);
    }, [phase]);

    const handleFlip = (idx: number) => {
        const card = deck[idx];
        if (card.flipped || card.matched || flipped.length >= 2) return;

        const next = deck.map((c, i) => i === idx ? { ...c, flipped: true } : c);
        setDeck(next);

        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            const [a, b] = newFlipped;
            const cardA = next[a];
            const cardB = next[b];

            if (cardA.pairId === cardB.pairId) {
                // Match!
                setGlowIdx([a, b]);
                setTimeout(() => {
                    setDeck(d => d.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c));
                    setMatches(m => {
                        const newM = m + 1;
                        setScore(sc => sc + Math.max(50, 200 - seconds * 2));
                        setGlowIdx([]);
                        if (newM === totalPairs) {
                            setPhase('victory');
                            const finalScore = Math.max(100, 500 - moves * 10 - seconds * 2);
                            gameService.submitGameAttempt({
                                game_key: 'memory_flip', level: 1,
                                score: finalScore, xp_gained: finalScore,
                                correct_attempts: totalPairs, wrong_attempts: Math.max(0, moves - totalPairs),
                                completed: true, skill: 'Memory & Vocabulary Matching'
                            });
                        }
                        return newM;
                    });
                    setFlipped([]);
                }, 600);
            } else {
                // No match — shake then flip back
                setShakeIdx([a, b]);
                setTimeout(() => {
                    setDeck(d => d.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
                    setShakeIdx([]);
                    setFlipped([]);
                }, 900);
            }
        }
    };

    const handleRestart = () => {
        setDeck(buildDeck());
        setFlipped([]); setMoves(0); setMatches(0);
        setScore(0); setSeconds(0); setPhase('playing');
        setShakeIdx([]); setGlowIdx([]);
    };

    const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    if (phase === 'victory') {
        return (
            <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl max-w-xl mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center mx-auto shadow-lg">
                    <Trophy className="w-10 h-10 text-white animate-bounce" />
                </div>
                <h2 className="text-3xl font-black">All Pairs Matched!</h2>
                <div className="grid grid-cols-3 gap-3">
                    {[['Time', fmt(seconds), 'text-pink-400'], ['Moves', `${moves}`, 'text-rose-400'], ['Score', `${score}`, 'text-amber-400']].map(([l, v, c]) => (
                        <div key={l} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className={`text-2xl font-black ${c}`}>{v}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{l}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Play Again
                    </button>
                    {onComplete && (
                        <button onClick={onComplete} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition">
                            Next Game →
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-pink-500/30 rounded-3xl p-5 md:p-7 text-white space-y-5 shadow-2xl">
            {/* HUD */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-pink-500/20 rounded-2xl border border-pink-500/40 text-pink-400 text-xl">🃏</div>
                    <div>
                        <h2 className="text-lg font-black">Memory Flip</h2>
                        <p className="text-xs text-slate-400">{matches}/{totalPairs} pairs matched</p>
                    </div>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-pink-400 flex items-center gap-1">
                        <Timer className="w-3 h-3" /> {fmt(seconds)}
                    </div>
                    <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-400">
                        {moves} moves
                    </div>
                </div>
            </div>

            {/* Progress */}
            <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(matches / totalPairs) * 100}%` }} />
            </div>

            {/* Card Grid */}
            <div className="grid grid-cols-4 gap-2.5">
                {deck.map((card, i) => {
                    const isShake = shakeIdx.includes(i);
                    const isGlow = glowIdx.includes(i);

                    return (
                        <div
                            key={i}
                            onClick={() => handleFlip(i)}
                            style={{ perspective: '600px' }}
                            className={`h-16 cursor-pointer ${!card.flipped && !card.matched ? 'hover:scale-105' : ''} transition-transform duration-200`}
                        >
                            <div
                                className="relative w-full h-full transition-all duration-500"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: card.flipped || card.matched ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    animation: isShake ? 'shake 0.5s ease-in-out' : 'none',
                                }}
                            >
                                {/* Card Back */}
                                <div
                                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-pink-600 to-rose-500 flex items-center justify-center shadow-md border border-pink-400/30"
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    <span className="text-2xl">❓</span>
                                </div>
                                {/* Card Front */}
                                <div
                                    className={`absolute inset-0 rounded-xl flex items-center justify-center shadow-md border text-center p-1 font-black text-sm
                                        ${card.matched
                                            ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-300'
                                            : 'bg-slate-800 border-pink-500/40 text-white'
                                        }
                                        ${isGlow ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900' : ''}`}
                                    style={{
                                        backfaceVisibility: 'hidden',
                                        transform: 'rotateY(180deg)',
                                    }}
                                >
                                    {card.matched && <Star className="absolute top-1 right-1 w-3 h-3 text-emerald-400" />}
                                    <p className="leading-tight text-xs">{card.word}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <style>{`@keyframes shake{0%,100%{transform:rotateY(180deg) translateX(0)}25%{transform:rotateY(180deg) translateX(-4px)}75%{transform:rotateY(180deg) translateX(4px)}}`}</style>

            <p className="text-center text-xs text-slate-500">Flip cards to match {targetLang} words with their English meanings!</p>
        </div>
    );
};
