import React, { useState, useEffect } from 'react';
import { MuseumExhibit } from '../../types/lingoCity';
import { lingoCityService } from '../../services/lingoCityService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
    Landmark,
    BookOpen,
    FileText,
    Headphones,
    Trophy,
    Volume2,
    Sparkles,
    Check
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const LanguageMuseumModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const [exhibits, setExhibits] = useState<MuseumExhibit[]>([]);
    const [activeTab, setActiveTab] = useState<'all' | 'story' | 'detective' | 'script' | 'sound'>('all');
    const [selectedExhibit, setSelectedExhibit] = useState<MuseumExhibit | null>(null);

    useEffect(() => {
        if (isOpen) {
            const list = lingoCityService.getMuseumExhibits();
            setExhibits(list);
            setSelectedExhibit(list[0] || null);
        }
    }, [isOpen]);

    const playAudio = (text: string) => {
        if (!('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85;
        utterance.pitch = 1.05;
        utterance.lang = 'hi-IN';
        window.speechSynthesis.speak(utterance);
    };

    const filtered = activeTab === 'all'
        ? exhibits
        : exhibits.filter(e => e.category === activeTab);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                window.speechSynthesis?.cancel();
                onClose();
            }}
            title="🏛️ Language Museum — Hall of Discoveries"
            className="max-w-2xl sm:max-w-3xl"
        >
            <div className="space-y-6">
                {/* Museum Hall Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-600 via-purple-600 to-indigo-700 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            Permanent Exhibition Hall
                        </div>
                        <h3 className="text-xl font-black">LingoPath Heritage Gallery</h3>
                        <p className="text-xs text-indigo-100 font-medium">
                            A curated showcase of every visual story you've finished, detective mystery solved, and linguistic alphabet mastered.
                        </p>
                    </div>

                    <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-2 text-center border border-white/20 shrink-0">
                        <div className="text-[10px] uppercase font-bold text-amber-300">Total Artifacts</div>
                        <div className="text-2xl font-black">{exhibits.length}</div>
                    </div>
                </div>

                {/* Exhibit Category Switcher */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    {[
                        { id: 'all', label: 'All Artifacts', icon: '🏛️' },
                        { id: 'story', label: 'Story Archives', icon: '📜' },
                        { id: 'detective', label: 'Solved Mysteries', icon: '🕵️' },
                        { id: 'script', label: 'Alphabet & Script', icon: '🔤' },
                        { id: 'sound', label: 'Acoustic Sounds', icon: '🎧' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                                activeTab === tab.id
                                    ? 'bg-brand-600 text-white shadow-md'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Exhibits Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(item => {
                        const isSelected = selectedExhibit?.id === item.id;
                        return (
                            <div
                                key={item.id}
                                onClick={() => {
                                    setSelectedExhibit(item);
                                    if (item.scriptText) playAudio(item.scriptText);
                                }}
                                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between relative shadow-soft ${
                                    isSelected
                                        ? 'border-brand-500 bg-gradient-to-br from-indigo-50/90 to-purple-50/70 shadow-md ring-2 ring-brand-300'
                                        : 'border-slate-200 hover:border-brand-300 bg-white hover:bg-slate-50'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-100 to-indigo-100 border border-indigo-200 flex items-center justify-center text-2xl shadow-xs">
                                            {item.icon}
                                        </div>
                                        {item.badge && (
                                            <Badge variant="amber" size="sm" className="font-bold text-[10px]">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 line-clamp-1">{item.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{item.subtitle}</p>
                                    </div>

                                    {item.scriptText && (
                                        <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-sm font-black text-brand-700 font-mono tracking-wider line-clamp-1">
                                            {item.scriptText}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500">
                                    <span>{item.dateUnlocked}</span>
                                    <span className="text-brand-600 hover:underline">Inspect Plaque →</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Selected Exhibit Plaque Detail */}
                {selectedExhibit && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                                Exhibit Plaque: {selectedExhibit.title}
                            </span>
                            {selectedExhibit.scriptText && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => playAudio(selectedExhibit.scriptText || '')}
                                    leftIcon={<Volume2 className="w-3.5 h-3.5" />}
                                    className="text-xs font-bold border-amber-300 text-amber-900 bg-white"
                                >
                                    Play Pronunciation
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-medium">
                            {selectedExhibit.meaning || selectedExhibit.subtitle}
                        </p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
