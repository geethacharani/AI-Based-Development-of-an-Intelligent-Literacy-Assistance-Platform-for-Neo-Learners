import React, { useState } from 'react';
import { DetectiveCase, DetectiveClue } from '../../types/lingoCity';
import { lingoCityService } from '../../services/lingoCityService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
    Search,
    Volume2,
    CheckCircle2,
    AlertCircle,
    FileText,
    Headphones,
    Image as ImageIcon,
    MessageSquare,
    Sparkles,
    Trophy,
    Award
} from 'lucide-react';

interface Props {
    caseItem: DetectiveCase;
    isOpen: boolean;
    onClose: () => void;
    onCaseSolved: (caseId: string, xpEarned: number) => void;
}

export const DetectiveBureauModal: React.FC<Props> = ({
    caseItem,
    isOpen,
    onClose,
    onCaseSolved
}) => {
    const [selectedClue, setSelectedClue] = useState<DetectiveClue>(caseItem.clues[0]);
    const [inspectedClues, setInspectedClues] = useState<string[]>([caseItem.clues[0].id]);
    const [selectedDeduction, setSelectedDeduction] = useState<string | null>(null);
    const [isDeductionSubmitted, setIsDeductionSubmitted] = useState(false);
    const [isCaseSolved, setIsCaseSolved] = useState(false);

    const playAudio = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.0;
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
    };

    const handleSelectClue = (clue: DetectiveClue) => {
        setSelectedClue(clue);
        if (!inspectedClues.includes(clue.id)) {
            setInspectedClues(prev => [...prev, clue.id]);
        }
        playAudio(clue.targetContent);
    };

    const handleSubmitDeduction = () => {
        if (!selectedDeduction) return;
        setIsDeductionSubmitted(true);
        const choice = caseItem.deductionOptions.find(o => o.id === selectedDeduction);
        if (choice?.isCorrect) {
            setIsCaseSolved(true);
            lingoCityService.recordCaseSolved(caseItem.id, caseItem.title);
            onCaseSolved(caseItem.id, caseItem.solvedXp);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                window.speechSynthesis?.cancel();
                onClose();
            }}
            title={`🕵️ Detective Bureau — ${caseItem.caseNumber}: ${caseItem.title}`}
            className="max-w-2xl sm:max-w-3xl"
        >
            <div className="space-y-6">
                {/* Case Briefing Banner */}
                <div className="p-4 rounded-2xl bg-amber-900/90 text-amber-50 border border-amber-800 flex items-start gap-3 shadow-md">
                    <div className="p-2.5 rounded-xl bg-amber-800 text-amber-300 text-xl shrink-0">
                        🔍
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-800 px-2 py-0.5 rounded-full text-amber-200">
                                Case Briefing
                            </span>
                            <span className="text-xs font-semibold text-amber-300">
                                Location: {caseItem.location}
                            </span>
                        </div>
                        <p className="text-xs leading-relaxed text-amber-100 font-medium">
                            {caseItem.mysteryDescription}
                        </p>
                    </div>
                </div>

                {/* 📌 INVESTIGATION BOARD (Corkboard Aesthetic) */}
                <div className="p-5 rounded-3xl bg-gradient-to-b from-[#E7D6BE] to-[#D9C4A6] border-4 border-[#8B5A2B] shadow-lg relative overflow-hidden">
                    {/* Pushpin header */}
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#C4AC8D]">
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-sm border border-red-800" />
                            <span className="text-xs font-black uppercase text-[#5C3A1E] tracking-widest">
                                Investigation Evidence Board
                            </span>
                        </div>
                        <div className="text-[11px] font-bold text-[#6D4524]">
                            Clues Inspected: {inspectedClues.length} / {caseItem.clues.length}
                        </div>
                    </div>

                    {/* Clue Index Cards Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {caseItem.clues.map((clue, idx) => {
                            const isSelected = selectedClue.id === clue.id;
                            const isInspected = inspectedClues.includes(clue.id);

                            return (
                                <button
                                    key={clue.id}
                                    type="button"
                                    onClick={() => handleSelectClue(clue)}
                                    className={`p-3 rounded-2xl border-2 text-left transition-all transform hover:-translate-y-1 cursor-pointer shadow-sm relative ${
                                        isSelected
                                            ? 'bg-white border-red-600 ring-2 ring-red-300 shadow-md'
                                            : isInspected
                                            ? 'bg-[#FDFBF7] border-[#A88B68] text-slate-800'
                                            : 'bg-[#F5EFE6] border-[#BAA181] opacity-90'
                                    }`}
                                >
                                    {/* Red Pushpin */}
                                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-600 shadow-xs border border-red-900" />

                                    <div className="flex items-center gap-2 mb-1.5 mt-1">
                                        <span className="text-lg">{clue.icon}</span>
                                        <span className="text-[10px] font-black uppercase text-slate-500">
                                            Evidence #{idx + 1}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                                        {clue.title}
                                    </h4>
                                    <span className="text-[10px] text-slate-500">
                                        {isInspected ? '✓ Inspected' : 'Click to inspect'}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 🔎 SELECTED CLUE DETAIL INSPECTION */}
                {selectedClue && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-soft space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">{selectedClue.icon}</span>
                                <div>
                                    <h3 className="text-sm font-black text-slate-900">{selectedClue.title}</h3>
                                    <span className="text-xs text-slate-500 font-medium">{selectedClue.contextNote}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => playAudio(selectedClue.targetContent)}
                                leftIcon={<Volume2 className="w-4 h-4 text-brand-600" />}
                                className="text-xs font-bold"
                            >
                                Play Audio Clue
                            </Button>
                        </div>

                        {/* Clue Content in Target Language */}
                        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                            <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                                Target Language Evidence
                            </div>
                            <div className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                                "{selectedClue.targetContent}"
                            </div>
                            <div className="text-xs text-slate-600 italic">
                                [{selectedClue.romanized}]
                            </div>
                            <div className="text-xs font-bold text-brand-700 pt-1">
                                Translated Meaning: {selectedClue.meaning}
                            </div>
                        </div>

                        {/* Extracted Clue Vocabulary Terms */}
                        <div className="space-y-1.5">
                            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                                Key Clue Vocabulary
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedClue.keyVocabulary.map((v, i) => (
                                    <div
                                        key={i}
                                        className="px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                                    >
                                        <span className="text-brand-700 font-extrabold">{v.word}</span>
                                        <span className="text-slate-400">→</span>
                                        <span>{v.meaning}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 🧠 DEDUCTION RESOLUTION SECTION */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1 text-xs font-black uppercase text-indigo-900 tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                            Final Deduction
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">
                            {caseItem.deductionQuestion}
                        </h4>
                    </div>

                    {/* Deduction Choices */}
                    <div className="space-y-2">
                        {caseItem.deductionOptions.map((opt) => {
                            const isSelected = selectedDeduction === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => {
                                        if (!isCaseSolved) {
                                            setSelectedDeduction(opt.id);
                                            setIsDeductionSubmitted(false);
                                        }
                                    }}
                                    className={`w-full p-3.5 rounded-xl border text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                        isSelected
                                            ? 'bg-white border-brand-500 shadow-sm ring-2 ring-brand-300 text-brand-950'
                                            : 'bg-white/80 hover:bg-white border-slate-200 text-slate-800'
                                    }`}
                                >
                                    <span>{opt.text}</span>
                                    {isSelected && <span className="text-brand-600 text-sm">●</span>}
                                </button>
                            );
                        })}
                    </div>

                    {/* Feedback message upon submission */}
                    {isDeductionSubmitted && (
                        <div className={`p-3.5 rounded-xl text-xs font-bold flex items-center gap-2 ${
                            isCaseSolved ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                            {isCaseSolved ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                            <span>
                                {caseItem.deductionOptions.find(o => o.id === selectedDeduction)?.feedback}
                            </span>
                        </div>
                    )}

                    {/* Case Solved Celebration */}
                    {isCaseSolved ? (
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-indigo-200">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🎉</span>
                                <div>
                                    <div className="text-xs font-black text-emerald-800">
                                        CASE CLOSED — REWARD UNLOCKED!
                                    </div>
                                    <div className="text-[11px] text-slate-600 font-medium">
                                        +{caseItem.solvedXp} XP • Unlocked: {caseItem.unlockedReward} in Dress LingoBot!
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={onClose}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md cursor-pointer"
                            >
                                Complete Investigation
                            </Button>
                        </div>
                    ) : (
                        <div className="flex justify-end pt-2">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSubmitDeduction}
                                disabled={!selectedDeduction}
                                leftIcon={<Search className="w-4 h-4" />}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md cursor-pointer"
                            >
                                Submit Deduction
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
