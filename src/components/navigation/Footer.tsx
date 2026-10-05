import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Globe, Shield, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">

                    {/* Brand Info */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-teal-400 flex items-center justify-center text-white shadow-soft">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                                LingoPath<span className="text-brand-400"> AI</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Personalized literacy learning for everyone. Powered by adaptive assessment, native language support, and intelligent recommendations.
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
                            <span className="flex items-center gap-1 text-teal-400 font-medium">
                                <Globe className="w-4 h-4" /> 6+ Regional Languages
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="hover:text-brand-400 transition-colors">Hero Overview</Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-brand-400 transition-colors">Learner Registration</Link>
                            </li>
                            <li>
                                <Link to="/login" className="hover:text-brand-400 transition-colors">Learner Login</Link>
                            </li>
                            <li>
                                <Link to="/assessment" className="hover:text-brand-400 transition-colors">Skill Assessment</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Supported Languages */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200">Supported Languages</h4>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇬🇧 English</span>
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇮🇳 Telugu (తెలుగు)</span>
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇮🇳 Hindi (हिन्दी)</span>
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇮🇳 Tamil (தமிழ்)</span>
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇮🇳 Kannada (കന്നഡ)</span>
                            <span className="px-2.5 py-1 bg-slate-800 rounded-lg text-slate-300">🇮🇳 Malayalam (മലയാളം)</span>
                        </div>
                    </div>

                    {/* Architecture */}
                    <div className="space-y-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-slate-200">Platform Architecture</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Designed for full REST API integration with Python / Django backend & PostgreSQL database.
                        </p>
                        <div className="flex items-center space-x-2 text-xs font-mono text-teal-400 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
                            <BookOpen className="w-4 h-4 shrink-0 text-brand-400" />
                            <span>Week 1 Framework Complete</span>
                        </div>
                    </div>

                </div>

                {/* Bottom copyright */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} LingoPath AI. All rights reserved.</p>
                    <div className="flex items-center gap-1 text-slate-400">
                        <span>Built with care for neo-learners</span>
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current ml-1" />
                    </div>
                </div>
            </div>
        </footer>
    );
};
