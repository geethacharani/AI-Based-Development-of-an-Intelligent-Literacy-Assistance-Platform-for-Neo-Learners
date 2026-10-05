import React from 'react';
import { LearnerProfile } from '../../types';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Globe, Target, Calendar, User, Sparkles } from 'lucide-react';

interface ProfileHeaderProps {
    profile: LearnerProfile;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
    const formattedDate = new Date(profile.created_at || Date.now()).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });

    return (
        <Card className="relative overflow-hidden p-6 md:p-8 border-brand-100 bg-gradient-to-r from-white via-brand-50/20 to-teal-50/20">
            {/* Decorative background circle */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-bl from-brand-200/30 to-teal-200/30 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 relative z-10">
                {/* Avatar */}
                <Avatar name={profile.full_name} size="xl" className="shadow-soft-hover" />

                {/* Learner Info */}
                <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1">
                            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                                {profile.full_name}
                            </h1>
                            <Badge variant="teal" size="md" className="gap-1 font-bold">
                                <Sparkles className="w-3.5 h-3.5" />
                                Learner Profile
                            </Badge>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{profile.email}</p>
                    </div>

                    {/* Language pill indicators */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs pt-1">
                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-sm flex items-center space-x-2">
                            <span className="text-slate-500 font-medium">Comfortable language:</span>
                            <span className="font-bold text-brand-700 flex items-center gap-1">
                                <span>{profile.comfortable_language?.flagEmoji || '🇮🇳'}</span>
                                <span>{profile.comfortable_language?.name || 'Telugu'}</span>
                            </span>
                        </div>

                        <div className="bg-white border border-teal-200 px-3 py-1.5 rounded-2xl shadow-sm flex items-center space-x-2">
                            <span className="text-slate-500 font-medium">Learning language:</span>
                            <span className="font-bold text-teal-700 flex items-center gap-1">
                                <span>{profile.target_language?.flagEmoji || '🇬🇧'}</span>
                                <span>{profile.target_language?.name || 'English'}</span>
                            </span>
                        </div>

                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-sm flex items-center space-x-1.5 text-slate-600">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Age: {profile.age_group}</span>
                        </div>

                        {profile.qualification && (
                            <div className="bg-white border border-amber-200 px-3 py-1.5 rounded-2xl shadow-sm flex items-center space-x-1.5 text-slate-700">
                                <span>🎓</span>
                                <span>Qualification: <strong>{profile.qualification}</strong></span>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-2xl shadow-sm flex items-center space-x-1.5 text-slate-600">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Joined {formattedDate}</span>
                        </div>
                    </div>

                    {/* Learning Goals */}
                    {profile.learning_goals && profile.learning_goals.length > 0 && (
                        <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2">
                            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                <Target className="w-3.5 h-3.5 text-teal-600" /> Goals:
                            </span>
                            {profile.learning_goals.map((goal) => (
                                <Badge key={goal} variant="brand" size="sm" className="bg-brand-50/80 text-brand-800">
                                    {goal}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
