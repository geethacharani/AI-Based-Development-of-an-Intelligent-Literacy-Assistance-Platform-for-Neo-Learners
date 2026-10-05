import React from 'react';
import { LearnerProficiency, SkillLevel } from '../../types';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Progress } from '../ui/Progress';
import { Badge } from '../ui/Badge';
import { BookOpen, PenTool, Brain, Mic, Sparkles } from 'lucide-react';

interface SkillGridProps {
    proficiency: LearnerProficiency;
}

const SKILL_MAP: {
    key: keyof Omit<LearnerProficiency, 'overall_level' | 'updated_at'>;
    title: string;
    icon: React.ReactNode;
    color: 'brand' | 'teal' | 'amber';
}[] = [
        { key: 'reading_level', title: 'Reading', icon: <BookOpen className="w-5 h-5 text-brand-600" />, color: 'brand' },
        { key: 'writing_level', title: 'Writing', icon: <PenTool className="w-5 h-5 text-teal-600" />, color: 'teal' },
        { key: 'vocabulary_level', title: 'Vocabulary', icon: <Brain className="w-5 h-5 text-amber-600" />, color: 'amber' },
        { key: 'speaking_level', title: 'Speaking', icon: <Mic className="w-5 h-5 text-brand-600" />, color: 'brand' },
    ];

const LEVEL_METERS: Record<SkillLevel, { value: number; label: string; desc: string }> = {
    Beginner: { value: 25, label: 'Beginner', desc: 'Learning fundamental alphabet & words' },
    Basic: { value: 50, label: 'Basic', desc: 'Understanding short sentences & phrases' },
    Intermediate: { value: 75, label: 'Intermediate', desc: 'Handling routine reading & conversations' },
    Advanced: { value: 95, label: 'Advanced', desc: 'Fluent expression & comprehensive reading' },
};

export const SkillGrid: React.FC<SkillGridProps> = ({ proficiency }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Your Starting Skills</span>
                    <Badge variant="neutral" size="sm" className="font-normal text-slate-500">Self-Reported</Badge>
                </h3>
                <span className="text-xs font-semibold text-slate-400">Baseline Evaluation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILL_MAP.map(({ key, title, icon, color }) => {
                    const level: SkillLevel = proficiency[key] || 'Beginner';
                    const meter = LEVEL_METERS[level];

                    return (
                        <Card key={key} className="p-5 border-slate-200/80 hover:shadow-soft-hover transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">{icon}</div>
                                    <div>
                                        <h4 className="text-base font-bold text-slate-900">{title}</h4>
                                        <p className="text-xs text-slate-500">{meter.desc}</p>
                                    </div>
                                </div>

                                <Badge
                                    variant={color === 'brand' ? 'brand' : color === 'teal' ? 'teal' : 'amber'}
                                    size="md"
                                    className="font-bold"
                                >
                                    {level}
                                </Badge>
                            </div>

                            {/* Skill meter bar */}
                            <div className="space-y-1.5 pt-2">
                                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                                    <span>Level Progress</span>
                                    <span className="font-mono">{meter.value}%</span>
                                </div>
                                <Progress value={meter.value} color={color} height="md" />
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
