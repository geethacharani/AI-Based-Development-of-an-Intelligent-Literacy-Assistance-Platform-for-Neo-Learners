import React, { useState, useEffect } from 'react';
import { LingoBotCustomization, DEFAULT_CUSTOMIZATION, BOT_COLORS } from '../../types/lingobot';

interface Props {
    customization?: Partial<LingoBotCustomization>;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    expression?: 'happy' | 'wink' | 'celebrating' | 'thinking' | 'curious';
    animate?: boolean;
    className?: string;
    onClick?: () => void;
}

const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-36 h-36',
    xl: 'w-52 h-52',
    '2xl': 'w-64 h-64 sm:w-76 sm:h-76'
};

export const CustomizableLingoBot: React.FC<Props> = ({
    customization = {},
    size = 'lg',
    expression = 'happy',
    animate = true,
    className = '',
    onClick
}) => {
    const config: LingoBotCustomization = { ...DEFAULT_CUSTOMIZATION, ...customization };
    const [blink, setBlink] = useState(false);

    // Cute automatic blink effect every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(true);
            setTimeout(() => setBlink(false), 220);
        }, 4200);
        return () => clearInterval(interval);
    }, []);

    const selectedColor = BOT_COLORS.find(c => c.id === config.themeColor) || BOT_COLORS[0];

    return (
        <div
            onClick={onClick}
            className={`relative inline-flex items-center justify-center select-none ${sizeMap[size]} ${className} ${
                animate ? 'animate-float-subtle transition-transform duration-300' : ''
            }`}
        >
            <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-xl overflow-visible">
                <defs>
                    {/* Bot Body Gradient */}
                    <linearGradient id={`botBodyGrad-${selectedColor.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={selectedColor.secondary} />
                        <stop offset="100%" stopColor={selectedColor.hex} />
                    </linearGradient>

                    {/* Visor Screen Gradient */}
                    <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0B132B" />
                        <stop offset="100%" stopColor="#1C2541" />
                    </linearGradient>

                    {/* Gold Gradient for Accessories */}
                    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FDE047" />
                        <stop offset="100%" stopColor="#CA8A04" />
                    </linearGradient>

                    {/* Detective Fabric Gradient */}
                    <linearGradient id="detectiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A16207" />
                        <stop offset="100%" stopColor="#713F12" />
                    </linearGradient>

                    {/* Soft Shadow Filter */}
                    <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* 🌟 1. BACK AURA LAYER */}
                {config.aura === 'star_sparkles' && (
                    <g className="animate-spin-slow origin-center" opacity="0.85">
                        <circle cx="100" cy="110" r="88" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="6 12" />
                        <path d="M 40 40 L 44 48 L 52 52 L 44 56 L 40 64 L 36 56 L 28 52 L 36 48 Z" fill="#FBBF24" />
                        <path d="M 160 50 L 163 56 L 169 59 L 163 62 L 160 68 L 157 62 L 151 59 L 157 56 Z" fill="#FBBF24" />
                        <path d="M 155 160 L 158 165 L 163 167 L 158 169 L 155 174 L 152 169 L 147 167 L 152 165 Z" fill="#FBBF24" />
                    </g>
                )}
                {config.aura === 'rainbow_prism' && (
                    <g opacity="0.6">
                        <path d="M 30 140 A 75 75 0 0 1 170 140" fill="none" stroke="#EC4899" strokeWidth="6" strokeLinecap="round" />
                        <path d="M 36 140 A 69 69 0 0 1 164 140" fill="none" stroke="#FBBF24" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 42 140 A 63 63 0 0 1 158 140" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
                    </g>
                )}
                {config.aura === 'cosmic_nebula' && (
                    <circle cx="100" cy="110" r="92" fill="#6366F1" opacity="0.18" filter="url(#glowEffect)" />
                )}
                {config.aura === 'nature_flora' && (
                    <g opacity="0.75" className="animate-pulse">
                        <circle cx="36" cy="70" r="7" fill="#34D399" />
                        <circle cx="164" cy="76" r="6" fill="#10B981" />
                        <circle cx="168" cy="140" r="8" fill="#6EE7B7" />
                    </g>
                )}

                {/* 🦸 Superhero Cape (Back) */}
                {config.clothes === 'superhero_cape' && (
                    <path d="M 60 135 L 30 205 Q 100 195 170 205 L 140 135 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="3" />
                )}

                {/* 🎒 Backpack (Back outline) */}
                {config.bag === 'adventure_pack' && (
                    <rect x="52" y="125" width="96" height="60" rx="14" fill="#047857" stroke="#064E3B" strokeWidth="3" />
                )}

                {/* 🤖 2. LEGS & SHOES */}
                <g id="legs-and-shoes">
                    {/* Left Leg */}
                    <rect x="70" y="172" width="18" height="24" rx="8" fill="#334155" />
                    {/* Right Leg */}
                    <rect x="112" y="172" width="18" height="24" rx="8" fill="#334155" />

                    {/* Shoes Variations */}
                    {config.shoes === 'sneakers' && (
                        <>
                            {/* Left Sneaker */}
                            <path d="M 64 190 L 88 190 A 6 6 0 0 1 94 196 L 94 204 L 58 204 L 58 196 A 6 6 0 0 1 64 190 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                            <rect x="56" y="202" width="40" height="4" rx="2" fill="#FFFFFF" />
                            {/* Right Sneaker */}
                            <path d="M 106 190 L 130 190 A 6 6 0 0 1 136 196 L 136 204 L 100 204 L 100 196 A 6 6 0 0 1 106 190 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
                            <rect x="98" y="202" width="40" height="4" rx="2" fill="#FFFFFF" />
                        </>
                    )}
                    {config.shoes === 'boots' && (
                        <>
                            <path d="M 62 182 L 90 182 L 94 204 L 56 204 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                            <path d="M 104 182 L 132 182 L 136 204 L 98 204 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
                        </>
                    )}
                    {config.shoes === 'jet_boots' && (
                        <>
                            <rect x="62" y="184" width="30" height="18" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
                            <ellipse cx="77" cy="206" rx="10" ry="4" fill="#38BDF8" className="animate-pulse" />
                            <rect x="104" y="184" width="30" height="18" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
                            <ellipse cx="119" cy="206" rx="10" ry="4" fill="#38BDF8" className="animate-pulse" />
                        </>
                    )}
                </g>

                {/* 🤖 3. MAIN TORSO / BODY */}
                <rect
                    x="56"
                    y="120"
                    width="88"
                    height="62"
                    rx="22"
                    fill={`url(#botBodyGrad-${selectedColor.id})`}
                    stroke="#1E1B4B"
                    strokeWidth="3.5"
                />

                {/* 🤖 4. CLOTHING OVERLAY */}
                {config.clothes === 'scholar_vest' && (
                    <g id="cloth-scholar-vest">
                        <path d="M 66 122 L 90 122 L 86 178 L 62 178 Z" fill="#312E81" />
                        <path d="M 134 122 L 110 122 L 114 178 L 138 178 Z" fill="#312E81" />
                        {/* Golden buttons */}
                        <circle cx="100" cy="142" r="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
                        <circle cx="100" cy="158" r="4" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="1" />
                        {/* Red Bowtie / Collar */}
                        <polygon points="90,126 110,126 100,135" fill="#EF4444" />
                        <polygon points="90,136 110,136 100,127" fill="#DC2626" />
                        <circle cx="100" cy="131" r="3" fill="#B91C1C" />
                    </g>
                )}
                {config.clothes === 'detective_coat' && (
                    <g id="cloth-detective">
                        <path d="M 58 122 L 142 122 L 140 180 L 60 180 Z" fill="url(#detectiveGrad)" stroke="#451A03" strokeWidth="2.5" />
                        {/* Coat Lapels */}
                        <polygon points="76,122 100,148 68,148" fill="#5A2E07" />
                        <polygon points="124,122 100,148 132,148" fill="#5A2E07" />
                        {/* Belt */}
                        <rect x="58" y="156" width="84" height="10" fill="#451A03" />
                        <rect x="92" y="153" width="16" height="16" rx="3" fill="none" stroke="#FBBF24" strokeWidth="3" />
                    </g>
                )}
                {config.clothes === 'traditional_kurta' && (
                    <g id="cloth-kurta">
                        <rect x="60" y="122" width="80" height="58" rx="8" fill="#EA580C" stroke="#9A3412" strokeWidth="2" />
                        <path d="M 100 122 L 100 160" stroke="#FDE047" strokeWidth="3" strokeDasharray="3 3" />
                        <circle cx="100" cy="132" r="2.5" fill="#FEF08A" />
                        <circle cx="100" cy="144" r="2.5" fill="#FEF08A" />
                        <circle cx="100" cy="156" r="2.5" fill="#FEF08A" />
                        <path d="M 64 175 L 136 175" stroke="#FDE047" strokeWidth="3" strokeDasharray="4 2" />
                    </g>
                )}
                {config.clothes === 'space_suit' && (
                    <g id="cloth-spacesuit">
                        <rect x="58" y="122" width="84" height="58" rx="16" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="3" />
                        <circle cx="80" cy="148" r="10" fill="#0284C7" />
                        <path d="M 75 148 L 85 144 L 85 152 Z" fill="#FFFFFF" />
                        <rect x="102" y="140" width="22" height="16" rx="4" fill="#334155" />
                        <circle cx="108" cy="148" r="2.5" fill="#22C55E" />
                        <circle cx="118" cy="148" r="2.5" fill="#EF4444" />
                    </g>
                )}
                {config.clothes === 'casual_hoodie' && (
                    <g id="cloth-hoodie">
                        <rect x="58" y="122" width="84" height="58" rx="16" fill="#10B981" stroke="#047857" strokeWidth="3" />
                        {/* Kangaroo pocket */}
                        <path d="M 74 152 L 126 152 L 122 174 L 78 174 Z" fill="#059669" stroke="#047857" strokeWidth="2" />
                        {/* Drawstrings */}
                        <line x1="90" y1="124" x2="90" y2="142" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                        <line x1="110" y1="124" x2="110" y2="142" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                    </g>
                )}

                {/* 🤖 5. ARMS */}
                {/* Left Arm */}
                <rect x="36" y="128" width="18" height="42" rx="9" fill={selectedColor.hex} stroke="#1E1B4B" strokeWidth="3" />
                {/* Right Arm */}
                <rect x="146" y="128" width="18" height="42" rx="9" fill={selectedColor.hex} stroke="#1E1B4B" strokeWidth="3" />

                {/* 🎒 6. BAG / SATCHEL (Over Shoulder) */}
                {config.bag === 'leather_satchel' && (
                    <g id="satchel">
                        <line x1="58" y1="122" x2="134" y2="174" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                        <rect x="120" y="152" width="30" height="24" rx="5" fill="#92400E" stroke="#451A03" strokeWidth="2" />
                        <circle cx="135" cy="164" r="3" fill="#FDE047" />
                    </g>
                )}
                {config.bag === 'scroll_pouch' && (
                    <g id="scroll-pouch">
                        <line x1="140" y1="122" x2="64" y2="174" stroke="#854D0E" strokeWidth="5" strokeLinecap="round" />
                        <rect x="48" y="150" width="22" height="32" rx="6" fill="#CA8A04" stroke="#713F12" strokeWidth="2" />
                        <circle cx="59" cy="166" r="4" fill="#FEF08A" />
                    </g>
                )}
                {config.bag === 'star_messenger' && (
                    <g id="star-bag">
                        <line x1="58" y1="122" x2="134" y2="174" stroke="#6D28D9" strokeWidth="6" strokeLinecap="round" />
                        <rect x="120" y="152" width="30" height="24" rx="6" fill="#7C3AED" stroke="#4C1D95" strokeWidth="2" />
                        <path d="M 135 159 L 137 163 L 141 164 L 138 167 L 139 171 L 135 169 L 131 171 L 132 167 L 129 164 L 133 163 Z" fill="#FDE047" />
                    </g>
                )}

                {/* 🪄 7. ACCESSORY / HANDHELD */}
                {config.accessory === 'magic_quill' && (
                    <g transform="translate(148, 140) rotate(25)" id="quill">
                        <path d="M 0 0 C 10 -25 30 -35 45 -40 C 35 -15 25 5 0 20 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
                        <line x1="0" y1="20" x2="35" y2="-28" stroke="#FEF08A" strokeWidth="2" />
                        <circle cx="0" cy="20" r="3" fill="#D97706" />
                    </g>
                )}
                {config.accessory === 'magnifying_glass' && (
                    <g transform="translate(145, 145)" id="magnifier">
                        <line x1="12" y1="12" x2="30" y2="30" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="4" cy="4" r="16" fill="#E0F2FE" fillOpacity="0.7" stroke="#0284C7" strokeWidth="4" />
                        <line x1="-4" y1="-4" x2="4" y2="-4" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                    </g>
                )}
                {config.accessory === 'language_tome' && (
                    <g transform="translate(22, 138) rotate(-15)" id="book">
                        <rect x="0" y="0" width="28" height="34" rx="4" fill="#9333EA" stroke="#581C87" strokeWidth="2" />
                        <rect x="4" y="4" width="20" height="26" fill="#FAF5FF" />
                        <line x1="8" y1="10" x2="20" y2="10" stroke="#9333EA" strokeWidth="2" />
                        <line x1="8" y1="16" x2="18" y2="16" stroke="#9333EA" strokeWidth="2" />
                        <line x1="8" y1="22" x2="16" y2="22" stroke="#9333EA" strokeWidth="2" />
                    </g>
                )}
                {config.accessory === 'star_wand' && (
                    <g transform="translate(150, 130) rotate(15)" id="wand">
                        <line x1="0" y1="35" x2="0" y2="0" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />
                        <polygon points="0,-16 4,-4 16,-4 7,3 10,15 0,8 -10,15 -7,3 -16,-4 -4,-4" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
                    </g>
                )}

                {/* 🤖 8. HEAD & ANTENNA */}
                {/* Antenna Pole */}
                <line x1="100" y1="38" x2="100" y2="16" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                {/* Antenna Glowing Orb */}
                <circle cx="100" cy="12" r="9" fill="#14B8A6" stroke="#0D9488" strokeWidth="2.5" className="animate-pulse" />
                <circle cx="98" cy="9" r="3" fill="#CCFBF1" />

                {/* Head Box */}
                <rect
                    x="42"
                    y="36"
                    width="116"
                    height="92"
                    rx="32"
                    fill={`url(#botBodyGrad-${selectedColor.id})`}
                    stroke="#1E1B4B"
                    strokeWidth="4"
                />

                {/* Ear Headphone Dials */}
                <rect x="28" y="60" width="14" height="42" rx="7" fill="#14B8A6" stroke="#0F766E" strokeWidth="2.5" />
                <rect x="158" y="60" width="14" height="42" rx="7" fill="#14B8A6" stroke="#0F766E" strokeWidth="2.5" />

                {/* Screen Visor Face */}
                <rect
                    x="56"
                    y="48"
                    width="88"
                    height="68"
                    rx="22"
                    fill="url(#visorGrad)"
                    stroke="#334155"
                    strokeWidth="2.5"
                />

                {/* 🤖 9. EYES & EXPRESSION */}
                {blink ? (
                    // Blinking state
                    <>
                        <line x1="72" y1="78" x2="90" y2="78" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round" />
                        <line x1="110" y1="78" x2="128" y2="78" stroke="#2DD4BF" strokeWidth="4.5" strokeLinecap="round" />
                    </>
                ) : (
                    <>
                        {expression === 'happy' && (
                            <>
                                {/* Left Eye */}
                                <circle cx="81" cy="76" r="8" fill="#2DD4BF" />
                                <circle cx="78" cy="73" r="3" fill="#FFFFFF" />
                                {/* Right Eye */}
                                <circle cx="119" cy="76" r="8" fill="#2DD4BF" />
                                <circle cx="116" cy="73" r="3" fill="#FFFFFF" />
                                {/* Happy Smiling Arc */}
                                <path d="M 92 92 Q 100 98 108 92" fill="none" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />
                            </>
                        )}
                        {expression === 'wink' && (
                            <>
                                <circle cx="81" cy="76" r="8" fill="#2DD4BF" />
                                <circle cx="78" cy="73" r="3" fill="#FFFFFF" />
                                {/* Wink line */}
                                <path d="M 112 77 Q 119 72 126 77" fill="none" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" />
                                <path d="M 94 92 Q 100 98 106 92" fill="none" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />
                            </>
                        )}
                        {expression === 'celebrating' && (
                            <>
                                <path d="M 72 73 Q 81 65 90 73" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                                <path d="M 110 73 Q 119 65 128 73" fill="none" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
                                <ellipse cx="100" cy="94" rx="8" ry="6" fill="#F59E0B" />
                            </>
                        )}
                        {expression === 'thinking' && (
                            <>
                                <circle cx="81" cy="74" r="8" fill="#818CF8" />
                                <circle cx="119" cy="78" r="6" fill="#818CF8" />
                                <line x1="92" y1="94" x2="108" y2="94" stroke="#818CF8" strokeWidth="3.5" strokeLinecap="round" />
                            </>
                        )}
                        {expression === 'curious' && (
                            <>
                                <circle cx="81" cy="75" r="9" fill="#38BDF8" />
                                <circle cx="119" cy="75" r="9" fill="#38BDF8" />
                                <circle cx="83" cy="73" r="3" fill="#FFFFFF" />
                                <circle cx="121" cy="73" r="3" fill="#FFFFFF" />
                                <circle cx="100" cy="94" r="4" fill="#38BDF8" />
                            </>
                        )}
                    </>
                )}

                {/* Cute Rosy Cheeks */}
                <ellipse cx="68" cy="88" rx="5" ry="3" fill="#FB7185" opacity="0.65" />
                <ellipse cx="132" cy="88" rx="5" ry="3" fill="#FB7185" opacity="0.65" />

                {/* 👓 10. GLASSES LAYER */}
                {config.glasses === 'professor_specs' && (
                    <g id="specs-professor">
                        <circle cx="81" cy="76" r="14" fill="none" stroke="#D97706" strokeWidth="3" />
                        <circle cx="119" cy="76" r="14" fill="none" stroke="#D97706" strokeWidth="3" />
                        <line x1="95" y1="76" x2="105" y2="76" stroke="#D97706" strokeWidth="3" />
                        <line x1="56" y1="76" x2="67" y2="76" stroke="#D97706" strokeWidth="2.5" />
                        <line x1="133" y1="76" x2="144" y2="76" stroke="#D97706" strokeWidth="2.5" />
                    </g>
                )}
                {config.glasses === 'cool_sunglasses' && (
                    <g id="specs-cool">
                        <path d="M 64 68 L 94 68 L 90 85 L 68 85 Z" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                        <path d="M 106 68 L 136 68 L 132 85 L 110 85 Z" fill="#0F172A" stroke="#475569" strokeWidth="2" />
                        <line x1="94" y1="70" x2="106" y2="70" stroke="#0F172A" strokeWidth="4" />
                        {/* Cool glare lines */}
                        <line x1="70" y1="72" x2="80" y2="82" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
                        <line x1="112" y1="72" x2="122" y2="82" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
                    </g>
                )}
                {config.glasses === 'cyber_goggles' && (
                    <g id="specs-cyber">
                        <rect x="62" y="66" width="76" height="20" rx="6" fill="#06B6D4" fillOpacity="0.3" stroke="#0891B2" strokeWidth="3" />
                        <line x1="68" y1="76" x2="132" y2="76" stroke="#22D3EE" strokeWidth="2" strokeDasharray="4 2" />
                    </g>
                )}
                {config.glasses === 'monocle' && (
                    <g id="specs-monocle">
                        <circle cx="119" cy="76" r="14" fill="none" stroke="#FBBF24" strokeWidth="3.5" />
                        <line x1="119" y1="90" x2="125" y2="120" stroke="#FBBF24" strokeWidth="1.5" />
                    </g>
                )}

                {/* 🎩 11. HATS LAYER */}
                {config.hat === 'grad_cap' && (
                    <g id="hat-grad">
                        {/* Diamond top */}
                        <polygon points="100,12 154,26 100,40 46,26" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
                        {/* Cap skull cap */}
                        <path d="M 68 33 L 132 33 L 126 50 L 74 50 Z" fill="#0F172A" />
                        {/* Golden Tassel */}
                        <circle cx="100" cy="26" r="4" fill="#FBBF24" />
                        <path d="M 100 26 Q 130 32 142 48" fill="none" stroke="#FBBF24" strokeWidth="3" />
                        <rect x="139" y="48" width="6" height="12" rx="2" fill="#D97706" />
                    </g>
                )}
                {config.hat === 'detective_fedora' && (
                    <g id="hat-fedora">
                        {/* Brim */}
                        <ellipse cx="100" cy="40" rx="62" ry="12" fill="#713F12" stroke="#451A03" strokeWidth="2.5" />
                        {/* Crown */}
                        <path d="M 68 40 L 74 14 Q 100 20 126 14 L 132 40 Z" fill="#854D0E" stroke="#451A03" strokeWidth="2" />
                        {/* Dark Ribbon */}
                        <path d="M 70 38 L 130 38 L 131 32 L 69 32 Z" fill="#1E293B" />
                        {/* Feather */}
                        <polygon points="124,32 136,12 128,26" fill="#DC2626" />
                    </g>
                )}
                {config.hat === 'royal_crown' && (
                    <g id="hat-crown">
                        <polygon points="62,38 68,14 84,28 100,10 116,28 132,14 138,38" fill="url(#goldGrad)" stroke="#B45309" strokeWidth="2.5" />
                        {/* Jewels */}
                        <circle cx="68" cy="14" r="3" fill="#EF4444" />
                        <circle cx="100" cy="10" r="4" fill="#3B82F6" />
                        <circle cx="132" cy="14" r="3" fill="#10B981" />
                        <rect x="64" y="34" width="72" height="6" rx="2" fill="#92400E" />
                    </g>
                )}
                {config.hat === 'safari_helmet' && (
                    <g id="hat-safari">
                        <ellipse cx="100" cy="40" rx="58" ry="12" fill="#A3E635" stroke="#4D7C0F" strokeWidth="2" />
                        <path d="M 70 40 A 30 30 0 0 1 130 40 Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2" />
                        <rect x="96" y="10" width="8" height="6" rx="2" fill="#4D7C0F" />
                    </g>
                )}
                {config.hat === 'beanie' && (
                    <g id="hat-beanie">
                        <path d="M 64 42 Q 100 2 136 42 Z" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
                        <rect x="60" y="38" width="80" height="10" rx="5" fill="#DB2777" />
                        {/* Pom-pom */}
                        <circle cx="100" cy="12" r="10" fill="#F472B6" stroke="#DB2777" strokeWidth="2" />
                    </g>
                )}
            </svg>
        </div>
    );
};
