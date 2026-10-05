import React from 'react';

/**
 * LearnerBackground:
 * Soft, light, airy pastel background for LingoPath AI.
 * Beautifully balanced on BOTH Left and Right sides:
 * - Left side: Curved dotted learning path weaving through 🔤 • • 📖 • • ⭐ • • 💬 • • 🌿 • • 🔤 • • ✏️
 * - Right side: Corresponding organic curved dotted path weaving through ⭐ • • 📝 • • 🔤 • • 🎵 • • 🔤 • • 📚
 * - Subtle 3D Cartoon depth: layered offset depth, soft ambient drop shadows, light edge highlights, gentle borders
 * - Subtle floating animations with floating shadow effect (4–8px movement, varied durations & delays)
 * - Independent asynchronous movement on both sides
 * - Butterfly completely removed
 * - Behind content (pointer-events: none, z-0)
 * - Strictly respects prefers-reduced-motion.
 */
export const LearnerBackground: React.FC = () => {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none select-none fixed inset-0 overflow-hidden z-0"
        >
            {/* LAYER 1: Soft Pastel Multi-Layer Atmosphere */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F4F8FE] via-[#FAF7FF] to-[#F1FAF8]" />

            {/* Subtle Learning Dot Matrix */}
            <div className="absolute inset-0 bg-learning-dots opacity-25" />

            {/* LAYER 2: Soft Radiant Ambient Glows */}
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-blue-300/18 via-indigo-200/12 to-transparent blur-3xl animate-glow-pulse" />
            <div className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full bg-gradient-to-bl from-teal-200/18 via-cyan-100/10 to-transparent blur-3xl animate-glow-pulse" />
            <div className="absolute top-[30%] left-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-200/14 via-fuchsia-100/8 to-transparent blur-3xl" />
            <div className="absolute -bottom-40 -left-20 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-200/14 via-teal-100/10 to-transparent blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-[680px] h-[680px] rounded-full bg-gradient-to-tl from-purple-200/14 via-teal-100/10 to-transparent blur-3xl" />

            {/* LAYER 3: SVG Vectors & Dotted Paths Connecting Both Gutters */}
            {/* Shared Definitions & Horizon Hill */}
            <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.30" />
                    </linearGradient>
                    <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#818CF8" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="#2DD4BF" stopOpacity="0.04" />
                        <stop offset="100%" stopColor="#C084FC" stopOpacity="0.05" />
                    </linearGradient>
                    <linearGradient id="leftPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.38" />
                        <stop offset="35%" stopColor="#3B82F6" stopOpacity="0.32" />
                        <stop offset="70%" stopColor="#14B8A6" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
                    </linearGradient>
                    <linearGradient id="rightPathGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity="0.38" />
                        <stop offset="35%" stopColor="#06B6D4" stopOpacity="0.32" />
                        <stop offset="70%" stopColor="#10B981" stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.25" />
                    </linearGradient>
                    <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* ☁️ Soft Illustrated Clouds */}
                <g className="animate-float-subtle-1" opacity="0.6">
                    <path
                        d="M 120 70 Q 140 40 180 50 Q 220 30 250 60 Q 280 65 270 90 Q 250 110 200 100 Q 150 115 120 90 Q 100 80 120 70 Z"
                        fill="url(#cloudGrad)"
                    />
                    <path
                        d="M 1100 110 Q 1130 80 1170 95 Q 1210 75 1240 105 Q 1270 115 1250 140 Q 1220 155 1160 145 Q 1110 150 1100 110 Z"
                        fill="url(#cloudGrad)"
                    />
                </g>

                {/* Soft Horizon Hill */}
                <path
                    d="M 0 850 Q 350 780 750 830 T 1600 820 T 2400 860 L 2400 1600 L 0 1600 Z"
                    fill="url(#hillGrad1)"
                />
            </svg>

            {/* LEFT DOTTED LEARNING PATH (Dedicated responsive ribbon) */}
            <svg
                className="hidden xl:block absolute left-0 top-0 w-36 xl:w-44 2xl:w-52 h-full pointer-events-none"
                viewBox="0 0 180 1500"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Left Curved Dotted Trail */}
                <path
                    d="M 90 70 C 45 220 135 370 80 530 C 40 680 125 840 75 1010 C 35 1170 115 1330 85 1500"
                    fill="none"
                    stroke="url(#leftPathGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="5 9"
                    strokeLinecap="round"
                    className="animate-path-left"
                    filter="url(#subtleGlow)"
                />

                {/* Left Waypoint Dots */}
                <circle cx="90" cy="130" r="3.5" fill="#6366F1" opacity="0.45" />
                <circle cx="90" cy="130" r="6.5" fill="none" stroke="#6366F1" strokeWidth="1" opacity="0.25" />
                <circle cx="108" cy="320" r="3.5" fill="#3B82F6" opacity="0.45" />
                <circle cx="78" cy="530" r="3.5" fill="#14B8A6" opacity="0.45" />
                <circle cx="78" cy="530" r="6.5" fill="none" stroke="#14B8A6" strokeWidth="1" opacity="0.25" />
                <circle cx="104" cy="760" r="3.5" fill="#10B981" opacity="0.45" />
                <circle cx="72" cy="1010" r="3.5" fill="#F59E0B" opacity="0.45" />
                <circle cx="72" cy="1010" r="6.5" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.25" />
                <circle cx="98" cy="1260" r="3.5" fill="#6366F1" opacity="0.45" />
            </svg>

            {/* RIGHT DOTTED LEARNING PATH (Dedicated responsive ribbon) */}
            <svg
                className="hidden xl:block absolute right-0 top-0 w-36 xl:w-44 2xl:w-52 h-full pointer-events-none"
                viewBox="0 0 180 1500"
                preserveAspectRatio="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Right Curved Dotted Trail (Independent, organic curve) */}
                <path
                    d="M 90 80 C 135 230 45 380 100 540 C 140 690 55 850 105 1020 C 145 1180 65 1340 90 1500"
                    fill="none"
                    stroke="url(#rightPathGrad)"
                    strokeWidth="2.5"
                    strokeDasharray="5 9"
                    strokeLinecap="round"
                    className="animate-path-right"
                    filter="url(#subtleGlow)"
                />

                {/* Right Waypoint Dots */}
                <circle cx="90" cy="140" r="3.5" fill="#A855F7" opacity="0.45" />
                <circle cx="90" cy="140" r="6.5" fill="none" stroke="#A855F7" strokeWidth="1" opacity="0.25" />
                <circle cx="68" cy="340" r="3.5" fill="#06B6D4" opacity="0.45" />
                <circle cx="102" cy="540" r="3.5" fill="#10B981" opacity="0.45" />
                <circle cx="102" cy="540" r="6.5" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.25" />
                <circle cx="74" cy="770" r="3.5" fill="#06B6D4" opacity="0.45" />
                <circle cx="105" cy="1020" r="3.5" fill="#F59E0B" opacity="0.45" />
                <circle cx="105" cy="1020" r="6.5" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.25" />
                <circle cx="80" cy="1270" r="3.5" fill="#A855F7" opacity="0.45" />
            </svg>

            {/* LAYER 4: FLOATING LITERACY ELEMENTS ON BOTH SIDES */}

            {/* LEFT SIDE GUTTER (Connected along the left trail) */}
            <div className="hidden xl:flex flex-col items-center gap-10 absolute left-4 2xl:left-10 top-24 z-10">
                {/* 1. 🔤 Devanagari Akshar: 'अ' with subtle 3D depth */}
                <div className="relative group select-none animate-float-3d-left-1 anim-delay-1">
                    {/* Ambient blurred drop shadow underneath */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-indigo-900/12 rounded-full blur-[3px]" />

                    {/* 3D Depth Layer (offset behind front letter) */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 text-7xl font-serif font-black text-indigo-600/22 translate-x-[2.5px] translate-y-[3.5px] select-none pointer-events-none"
                    >
                        अ
                    </span>

                    {/* Front Letter with soft highlight & gradient */}
                    <span className="relative block text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-indigo-400/55 via-indigo-500/45 to-indigo-600/40 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        अ
                    </span>
                </div>

                {/* 2. 📖 Open Book / Vocabulary Card: ज्ञान (Knowledge) */}
                <div className="relative group animate-float-3d-left-2 anim-delay-2">
                    {/* Ambient shadow underneath */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-indigo-950/10 rounded-full blur-[2px]" />

                    {/* 3D Floating Pill Card */}
                    <div className="relative px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-[3px] border border-white/90 border-b-2 border-b-indigo-200/80 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_12px_rgba(99,102,241,0.08),0_1px_2px_rgba(0,0,0,0.03)] flex items-center gap-1.5 rotate-[3deg]">
                        <span className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">📖</span>
                        <span className="text-[10px] font-bold tracking-wide text-indigo-900/80">ज्ञान (Knowledge)</span>
                    </div>
                </div>

                {/* 3. ⭐ Star Sparkle Accent: ✦ ⭐ */}
                <div className="flex items-center gap-1 text-amber-400 text-xl font-bold animate-float-3d-left-star anim-delay-3 select-none">
                    <span className="text-sm drop-shadow-[0_0_6px_rgba(251,191,36,0.45)]">✦</span>
                    <span className="text-base drop-shadow-[0_0_8px_rgba(251,191,36,0.50)]">⭐</span>
                </div>

                {/* 4. 💬 Speech Dialogue Bubble: नमस्ते */}
                <div className="relative group animate-float-3d-left-3 anim-delay-4">
                    {/* Ambient shadow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-indigo-950/10 rounded-full blur-[2px]" />

                    {/* Bubble Body */}
                    <div className="relative px-3.5 py-1.5 rounded-2xl bg-white/90 backdrop-blur-[3px] border border-white/90 border-b-2 border-b-indigo-200/80 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_12px_rgba(99,102,241,0.08)] flex items-center gap-1.5 rotate-[-4deg]">
                        <span className="text-[11px] font-bold text-indigo-900/85">💬 नमस्ते</span>
                        {/* Bubble Tail */}
                        <div className="absolute -bottom-1.5 left-4 w-2.5 h-2.5 bg-white/90 rotate-45 border-r border-b border-indigo-200/80" />
                    </div>
                </div>

                {/* 5. 🌿 Green Leaf / Plant Growth */}
                <div className="relative group animate-float-3d-left-4 anim-delay-5 select-none">
                    <div className="text-2xl opacity-60 drop-shadow-[0_4px_8px_rgba(16,185,129,0.25)]">
                        🌿
                    </div>
                </div>

                {/* 6. 🔤 Dravidian Alphabet Glyph: 'ಕ' with subtle 3D depth */}
                <div className="relative group select-none animate-float-3d-left-1 anim-delay-2">
                    {/* Ambient shadow */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-teal-950/10 rounded-full blur-[3px]" />

                    {/* 3D Depth Layer */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 text-6xl font-sans font-black text-teal-800/20 translate-x-[2.5px] translate-y-[3px] select-none pointer-events-none"
                    >
                        ಕ
                    </span>

                    {/* Front Letter */}
                    <span className="relative block text-6xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-teal-500/50 via-teal-600/40 to-teal-700/35 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        ಕ
                    </span>
                </div>

                {/* 7. ✏️ Pencil / Writing Motif */}
                <div className="relative group animate-float-3d-left-2 anim-delay-6">
                    {/* Ambient shadow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-indigo-950/12 rounded-full blur-[2px]" />

                    <div className="w-8 h-8 rounded-xl bg-white/85 backdrop-blur-[3px] border border-white/90 border-b-2 border-b-indigo-200/80 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_3px_8px_rgba(99,102,241,0.10)] flex items-center justify-center text-sm rotate-[-10deg]">
                        ✏️
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE GUTTER (Connected along the right trail) */}
            <div className="hidden xl:flex flex-col items-center gap-10 absolute right-4 2xl:right-10 top-24 z-10">
                {/* 1. ⭐ Golden Star Achievement: ✨ ⭐ */}
                <div className="flex items-center gap-1 text-amber-400 text-xl font-bold animate-float-3d-right-star anim-delay-1 select-none">
                    <span className="text-sm drop-shadow-[0_0_6px_rgba(245,158,11,0.45)]">✨</span>
                    <span className="text-base drop-shadow-[0_0_8px_rgba(245,158,11,0.50)]">⭐</span>
                </div>

                {/* 2. 📝 Vocabulary Note Card: పదం (Word) */}
                <div className="relative group animate-float-3d-right-1 anim-delay-2">
                    {/* Ambient shadow underneath */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-purple-950/10 rounded-full blur-[2px]" />

                    {/* 3D Floating Pill Card */}
                    <div className="relative px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-[3px] border border-white/90 border-b-2 border-b-purple-200/80 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_12px_rgba(168,85,247,0.08),0_1px_2px_rgba(0,0,0,0.03)] flex items-center gap-1.5 rotate-[-3deg]">
                        <span className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">📝</span>
                        <span className="text-[10px] font-bold tracking-wide text-purple-900/80">పదం (Word)</span>
                    </div>
                </div>

                {/* 3. 🔤 Global Latin Character: 'A' with subtle 3D depth */}
                <div className="relative group select-none animate-float-3d-right-2 anim-delay-3">
                    {/* Ambient shadow */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-14 h-3 bg-indigo-900/12 rounded-full blur-[3px]" />

                    {/* 3D Depth Layer */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 text-7xl font-serif font-black text-brand-700/22 translate-x-[2.5px] translate-y-[3.5px] select-none pointer-events-none"
                    >
                        A
                    </span>

                    {/* Front Letter */}
                    <span className="relative block text-7xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-b from-brand-400/55 via-brand-500/45 to-brand-600/40 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        A
                    </span>
                </div>

                {/* 4. 🎵 Music / Acoustic Audio Waves: ध्वनि (Sound) */}
                <div className="relative group animate-float-3d-right-3 anim-delay-4">
                    {/* Ambient shadow underneath */}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4/5 h-2 bg-teal-950/10 rounded-full blur-[2px]" />

                    {/* 3D Floating Pill Card */}
                    <div className="relative flex items-center gap-1.5 px-3.5 py-1.5 bg-white/90 backdrop-blur-[3px] rounded-2xl border border-white/90 border-b-2 border-b-teal-200/80 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_4px_12px_rgba(20,184,166,0.08)] rotate-[4deg]">
                        <span className="text-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">🎵</span>
                        <span className="text-[10px] font-bold tracking-wide text-teal-800/80">ध्वनि (Sound)</span>
                    </div>
                </div>

                {/* 5. 🔤 Tamil / Indic Glyph: 'அ' with subtle 3D depth */}
                <div className="relative group select-none animate-float-3d-right-4 anim-delay-5">
                    {/* Ambient shadow */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-12 h-3 bg-purple-950/10 rounded-full blur-[3px]" />

                    {/* 3D Depth Layer */}
                    <span
                        aria-hidden="true"
                        className="absolute inset-0 text-6xl font-sans font-black text-purple-700/20 translate-x-[2.5px] translate-y-[3px] select-none pointer-events-none"
                    >
                        அ
                    </span>

                    {/* Front Letter */}
                    <span className="relative block text-6xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-b from-purple-400/50 via-purple-500/40 to-purple-600/35 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        அ
                    </span>
                </div>

                {/* 6. 📚 Mini Book Stack */}
                <div className="relative group animate-float-3d-right-1 anim-delay-6 select-none">
                    <div className="text-2xl opacity-60 drop-shadow-[0_4px_8px_rgba(99,102,241,0.22)]">
                        📚
                    </div>
                </div>

                {/* Note: Butterfly has been completely removed as requested */}
            </div>
        </div>
    );
};
