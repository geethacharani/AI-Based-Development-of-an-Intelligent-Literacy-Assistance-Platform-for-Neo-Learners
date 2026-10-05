import React, { useState, useEffect } from 'react';
import { GardenPlant, PlantStage } from '../../types/lingoCity';
import { lingoCityService } from '../../services/lingoCityService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import {
    Sprout,
    Droplets,
    Volume2,
    Sparkles,
    CheckCircle2,
    Heart,
    RefreshCw
} from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onPlantWatered?: (xpEarned: number) => void;
}

export const LanguageGardenModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onPlantWatered
}) => {
    const [plants, setPlants] = useState<GardenPlant[]>([]);
    const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);
    const [waterAnimation, setWaterAnimation] = useState(false);
    const [levelUpToast, setLevelUpToast] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const list = lingoCityService.getGardenPlants();
            setPlants(list);
            setSelectedPlant(list[0] || null);
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

    const handleWaterPlant = (plant: GardenPlant) => {
        setWaterAnimation(true);
        playAudio(plant.word);

        setTimeout(() => {
            const { plant: updatedPlant, leveledUp, xpEarned } = lingoCityService.waterPlant(plant.id);
            setPlants(prev => prev.map(p => p.id === updatedPlant.id ? updatedPlant : p));
            setSelectedPlant(updatedPlant);
            setWaterAnimation(false);

            if (leveledUp) {
                setLevelUpToast(`🎉 "${updatedPlant.word}" grew into a ${updatedPlant.stage.toUpperCase()}! (+${xpEarned} XP)`);
                setTimeout(() => setLevelUpToast(null), 3000);
            }
            if (onPlantWatered) onPlantWatered(xpEarned);
        }, 700);
    };

    const getStageVisual = (stage: PlantStage) => {
        switch (stage) {
            case 'seed':
                return { icon: '🌱', label: 'Fresh Seed', color: 'text-amber-700 bg-amber-100' };
            case 'sprout':
                return { icon: '🌿', label: 'Growing Sprout', color: 'text-emerald-700 bg-emerald-100' };
            case 'flower':
                return { icon: '🌸', label: 'Blooming Flower', color: 'text-pink-700 bg-pink-100' };
            case 'tree':
                return { icon: '🌳', label: 'Mastered Tree', color: 'text-teal-900 bg-teal-200' };
        }
    };

    const seedsCount = plants.filter(p => p.stage === 'seed').length;
    const sproutsCount = plants.filter(p => p.stage === 'sprout').length;
    const flowersCount = plants.filter(p => p.stage === 'flower').length;
    const treesCount = plants.filter(p => p.stage === 'tree').length;

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                window.speechSynthesis?.cancel();
                onClose();
            }}
            title="🌱 Language Garden — Visual Vocabulary Growth"
            className="max-w-2xl sm:max-w-3xl"
        >
            <div className="space-y-6">
                {/* Garden Greenhouse Header */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                            Living Vocabulary Greenhouse
                        </div>
                        <h3 className="text-xl font-black">Vocabulary Bloom Conservatory</h3>
                        <p className="text-xs text-emerald-100 font-medium">
                            Every word you encounter in Lingo City stories is planted as a seed. Water them with daily practice to grow blossoming trees!
                        </p>
                    </div>

                    {/* Stage Distribution Counters */}
                    <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md rounded-2xl p-2 border border-white/20 shrink-0">
                        <div className="text-center px-2">
                            <span className="text-base">🌱</span>
                            <div className="text-xs font-black">{seedsCount}</div>
                        </div>
                        <div className="text-center px-2 border-l border-white/20">
                            <span className="text-base">🌿</span>
                            <div className="text-xs font-black">{sproutsCount}</div>
                        </div>
                        <div className="text-center px-2 border-l border-white/20">
                            <span className="text-base">🌸</span>
                            <div className="text-xs font-black">{flowersCount}</div>
                        </div>
                        <div className="text-center px-2 border-l border-white/20">
                            <span className="text-base">🌳</span>
                            <div className="text-xs font-black">{treesCount}</div>
                        </div>
                    </div>
                </div>

                {/* Level Up Notification Toast */}
                {levelUpToast && (
                    <div className="p-3 bg-emerald-600 text-white text-xs font-black rounded-2xl shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>{levelUpToast}</span>
                        </div>
                    </div>
                )}

                {/* 🌿 Garden Soil Plots Grid */}
                <div className="p-6 rounded-3xl bg-gradient-to-b from-[#E2F1E4] to-[#CDE9D2] border-2 border-emerald-300/80 shadow-soft">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black uppercase text-emerald-950 tracking-wider flex items-center gap-1.5">
                            <Sprout className="w-4 h-4 text-emerald-700" />
                            Your Cultivated Vocabulary Beds
                        </span>
                        <span className="text-xs font-bold text-emerald-800">
                            Click any plot to water & practice
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                        {plants.map(p => {
                            const isSelected = selectedPlant?.id === p.id;
                            const stageInfo = getStageVisual(p.stage);

                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                        setSelectedPlant(p);
                                        playAudio(p.word);
                                    }}
                                    className={`p-4 rounded-3xl border-2 text-left transition-all transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between shadow-soft relative overflow-hidden ${
                                        isSelected
                                            ? 'border-emerald-600 bg-white ring-2 ring-emerald-300 shadow-md'
                                            : 'border-emerald-200/90 bg-white/90 hover:bg-white'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-3xl shadow-inner">
                                            {stageInfo.icon}
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${stageInfo.color}`}>
                                            {stageInfo.label}
                                        </span>
                                    </div>

                                    <div className="mt-3">
                                        <h4 className="text-base font-black text-slate-900">{p.word}</h4>
                                        <div className="text-xs font-semibold text-emerald-700 italic">[{p.phonetic}]</div>
                                        <div className="text-xs font-bold text-slate-600 mt-0.5">{p.meaning}</div>
                                    </div>

                                    {/* Water droplets progress meter */}
                                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                                        <span className="flex items-center gap-0.5 text-cyan-600 font-bold">
                                            💧 {p.waterCount} / {p.maxWater}
                                        </span>
                                        <span>+{p.xpEarned} XP</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 💧 SELECTED PLANT INSPECTION & WATERING STATION */}
                {selectedPlant && (
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">{getStageVisual(selectedPlant.stage).icon}</span>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-xl font-black text-slate-900">{selectedPlant.word}</h3>
                                        <span className="text-xs font-bold text-emerald-700 italic">[{selectedPlant.phonetic}]</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-600">
                                        Meaning: <span className="text-brand-700 font-extrabold">{selectedPlant.meaning}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => playAudio(selectedPlant.word)}
                                    leftIcon={<Volume2 className="w-3.5 h-3.5 text-brand-600" />}
                                    className="text-xs font-bold"
                                >
                                    Hear Pronunciation
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleWaterPlant(selectedPlant)}
                                    disabled={waterAnimation || selectedPlant.stage === 'tree'}
                                    leftIcon={<Droplets className={`w-3.5 h-3.5 ${waterAnimation ? 'animate-bounce text-cyan-200' : ''}`} />}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold shadow-md border-none cursor-pointer"
                                >
                                    {waterAnimation
                                        ? 'Watering...'
                                        : selectedPlant.stage === 'tree'
                                        ? 'Fully Grown Tree'
                                        : 'Water with Practice (+20 XP)'}
                                </Button>
                            </div>
                        </div>

                        {/* Example sentence */}
                        <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                            <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                                Real-World Context Example
                            </div>
                            <div className="text-sm font-extrabold text-slate-900 mt-1">
                                "{selectedPlant.exampleSentence}"
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};
