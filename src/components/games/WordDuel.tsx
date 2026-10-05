import React, { useState } from 'react';
import { DuelBoss, GameAttemptData } from '../../types/game';
import { gameService } from '../../services/gameService';
import { Shield, Swords, Trophy, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface WordDuelProps {
    boss: DuelBoss;
    targetLang: string;
    comfortLang: string;
    onComplete?: () => void;
}

export const WordDuel: React.FC<WordDuelProps> = ({ boss, targetLang, comfortLang, onComplete }) => {
    const [qIdx, setQIdx] = useState(0);
    const [playerHp, setPlayerHp] = useState(100);
    const [bossHp, setBossHp] = useState(boss.maxHp);
    const [selected, setSelected] = useState<string | null>(null);
    const [phase, setPhase] = useState<'playing' | 'animating' | 'victory' | 'defeat'>('playing');
    const [animState, setAnimState] = useState<'none' | 'playerHit' | 'bossHit'>('none');
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const current = boss.questions[qIdx] || boss.questions[0];

    const handleSelect = (opt: string) => {
        if (phase !== 'playing' || selected) return;
        setSelected(opt);
        setPhase('animating');

        const isRight = opt === current.correct;

        if (isRight) {
            setAnimState('bossHit');
            setTimeout(() => {
                const nextBossHp = Math.max(0, bossHp - current.damage);
                setBossHp(nextBossHp);
                setScore(s => s + 150);
                setCorrectCount(c => c + 1);
                setAnimState('none');

                if (nextBossHp <= 0) {
                    setPhase('victory');
                    submitResult(true, score + 150, correctCount + 1);
                }
            }, 700);
        } else {
            setAnimState('playerHit');
            setTimeout(() => {
                const nextPlayerHp = Math.max(0, playerHp - 25);
                setPlayerHp(nextPlayerHp);
                setAnimState('none');

                if (nextPlayerHp <= 0) {
                    setPhase('defeat');
                    submitResult(false, score, correctCount);
                }
            }, 700);
        }
    };

    const submitResult = async (won: boolean, finalScore: number, finalCorrect: number) => {
        await gameService.submitGameAttempt({
            game_key: 'word_duel',
            level: 1,
            score: finalScore,
            xp_gained: finalScore,
            correct_attempts: finalCorrect,
            wrong_attempts: boss.questions.length - finalCorrect,
            completed: won,
            skill: 'Vocabulary Combat'
        });
    };

    const handleNext = () => {
        if (qIdx + 1 < boss.questions.length) {
            setQIdx(q => q + 1);
            setSelected(null);
            setPhase('playing');
        } else {
            if (bossHp <= playerHp) {
                setPhase('victory');
            } else {
                setPhase('defeat');
            }
        }
    };

    const handleRestart = () => {
        setQIdx(0);
        setPlayerHp(100);
        setBossHp(boss.maxHp);
        setSelected(null);
        setPhase('playing');
        setAnimState('none');
        setScore(0);
        setCorrectCount(0);
    };

    if (phase === 'victory' || phase === 'defeat') {
        const won = phase === 'victory';
        return (
            <div className={`bg-slate-900 border ${won ? 'border-amber-500/40' : 'border-rose-500/40'} rounded-3xl p-8 text-center text-white space-y-6 shadow-2xl max-w-xl mx-auto`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-lg text-4xl ${won ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-bounce' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'}`}>
                    {won ? '🏆' : '☠️'}
                </div>
                <h2 className="text-3xl font-black">{won ? 'Boss Defeated! ⚔️' : 'You Were Defeated!'}</h2>
                <p className="text-slate-300 text-sm">
                    {won ? `You dealt the final blow to ${boss.name}!` : `${boss.name} overwhelmed you. Try again!`}
                </p>
                <div className="grid grid-cols-3 gap-3">
                    {[['Player HP', `${playerHp}%`, 'text-emerald-400'], ['Boss HP', `${bossHp}`, 'text-rose-400'], ['Score', `${score}`, 'text-amber-400']].map(([l, v, c]) => (
                        <div key={l} className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
                            <div className={`text-2xl font-black ${c}`}>{v}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{l}</div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4">
                    <button onClick={handleRestart} className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition">
                        <RotateCcw className="w-4 h-4" /> Challenge Again
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
        <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-5 md:p-7 text-white space-y-6 shadow-2xl relative overflow-hidden">
            {/* Header / Battle Ground */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-500/20 rounded-2xl border border-rose-500/40 text-rose-400 text-xl">⚔️</div>
                    <div>
                        <h2 className="text-lg font-black">Word Duel</h2>
                        <p className="text-xs text-slate-400">Battle against {boss.name}</p>
                    </div>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-amber-400 text-xs font-black">
                    Score: {score}
                </div>
            </div>

            {/* Boss Arena visual */}
            <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-rose-500/20 rounded-2xl p-6 relative flex items-center justify-between min-h-[160px]">
                {/* Hero / Player */}
                <div className={`flex flex-col items-center gap-2 transition-transform duration-300 ${animState === 'playerHit' ? 'translate-x-6 text-rose-500 animate-ping' : ''}`}>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-3xl shadow-lg">
                        🧙‍♂️
                    </div>
                    <span className="text-xs font-black text-emerald-400">Hero (You)</span>
                    <div className="w-24 bg-slate-800 rounded-full h-2.5 border border-slate-700 overflow-hidden">
                        <div className="bg-emerald-400 h-full transition-all duration-500" style={{ width: `${playerHp}%` }} />
                    </div>
                </div>

                {/* Clash effect */}
                <div className="text-2xl font-black text-rose-500 animate-pulse">
                    {animState === 'bossHit' ? '💥 -' + current.damage : animState === 'playerHit' ? '💥 -25 HP' : 'VS'}
                </div>

                {/* Boss */}
                <div className={`flex flex-col items-center gap-2 transition-transform duration-300 ${animState === 'bossHit' ? '-translate-x-6 text-rose-500 animate-ping' : ''}`}>
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400/40 flex items-center justify-center text-3xl shadow-lg">
                        {boss.emoji}
                    </div>
                    <span className="text-xs font-black text-rose-400">{boss.name}</span>
                    <div className="w-24 bg-slate-800 rounded-full h-2.5 border border-slate-700 overflow-hidden">
                        <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${(bossHp / boss.maxHp) * 100}%` }} />
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center space-y-1">
                <p className="text-xs font-black text-rose-400 uppercase tracking-wider">Round {qIdx + 1} of {boss.questions.length}</p>
                <p className="text-lg font-black text-white">{current.prompt}</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-3">
                {current.options.map((opt, i) => {
                    const isAnswered = !!selected;
                    const isSelected = selected === opt;
                    const isCorrect = opt === current.correct;

                    let cls = 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-rose-500/10 hover:border-rose-500/40 cursor-pointer';
                    if (isAnswered && isCorrect) cls = 'bg-emerald-500/20 border-emerald-400 text-emerald-200';
                    else if (isAnswered && isSelected && !isCorrect) cls = 'bg-rose-500/20 border-rose-400 text-rose-200';

                    return (
                        <button
                            key={i}
                            onClick={() => handleSelect(opt)}
                            disabled={isAnswered || phase !== 'playing'}
                            className={`p-4 border rounded-2xl font-bold text-sm text-left transition-all ${cls}`}
                        >
                            <span className="text-slate-500 text-xs mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                            {opt}
                        </button>
                    );
                })}
            </div>

            {selected && phase !== 'playing' && animState === 'none' && (
                <div className={`rounded-2xl p-4 border space-y-2 ${selected === current.correct ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                    <p className={`font-black text-sm ${selected === current.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selected === current.correct ? `⚔️ Direct Hit! Dealt ${current.damage} damage to ${boss.name}!` : `🛡️ Missed! ${boss.name} counter-attacked for 25 HP!`}
                    </p>
                    <p className="text-xs text-slate-300">{current.explanation}</p>
                    <button onClick={handleNext} className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-sm rounded-xl flex items-center justify-center gap-2 transition mt-2">
                        {qIdx + 1 < boss.questions.length ? <>Next Attack →</> : <>View Battle Results 🏆</>}
                    </button>
                </div>
            )}
        </div>
    );
};
