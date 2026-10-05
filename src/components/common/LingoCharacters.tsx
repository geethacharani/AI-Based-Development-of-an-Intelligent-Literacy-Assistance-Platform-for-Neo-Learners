import React from 'react';

/**
 * Original LingoPath Character Mascots (100% Original Vector Designs)
 * 
 * 1. LingoBot: Friendly AI Teacher & Guide
 * 2. Lexi: Enthusiastic Reading Scholar
 * 3. Vox: Dynamic Voice & Speech Guide
 * 4. Atlas: Global Real-World Communication Explorer
 */

interface CharacterProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    expression?: 'happy' | 'teaching' | 'celebrating' | 'thinking' | 'encouraging';
}

const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
};

// 🤖 LingoBot — AI Teacher Character
export const LingoBot: React.FC<CharacterProps> = ({
    className = '',
    size = 'md',
    expression = 'happy'
}) => {
    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Antenna */}
                <line x1="50" y1="22" x2="50" y2="10" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
                <circle cx="50" cy="8" r="5" fill="#14B8A6" className="animate-pulse" />

                {/* Head Outer */}
                <rect x="22" y="22" width="56" height="50" rx="18" fill="url(#botGrad)" stroke="#4338CA" strokeWidth="3" />

                {/* Face Visor / Screen */}
                <rect x="28" y="30" width="44" height="34" rx="12" fill="#0F172A" />

                {/* Eyes */}
                {expression === 'happy' && (
                    <>
                        <path d="M 36 46 Q 42 40 48 46" fill="none" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M 52 46 Q 58 40 64 46" fill="none" stroke="#2DD4BF" strokeWidth="3.5" strokeLinecap="round" />
                    </>
                )}
                {expression === 'teaching' && (
                    <>
                        <circle cx="42" cy="45" r="4.5" fill="#2DD4BF" />
                        <circle cx="58" cy="45" r="4.5" fill="#2DD4BF" />
                        <path d="M 44 56 Q 50 60 56 56" fill="none" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
                {expression === 'celebrating' && (
                    <>
                        <path d="M 36 44 L 46 44" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M 54 44 L 64 44" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />
                        <path d="M 42 54 Q 50 62 58 54" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" />
                    </>
                )}
                {expression === 'thinking' && (
                    <>
                        <circle cx="42" cy="42" r="4" fill="#818CF8" />
                        <circle cx="58" cy="46" r="3.5" fill="#818CF8" />
                        <line x1="45" y1="56" x2="55" y2="56" stroke="#818CF8" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}
                {expression === 'encouraging' && (
                    <>
                        <circle cx="41" cy="44" r="4" fill="#2DD4BF" />
                        <circle cx="59" cy="44" r="4" fill="#2DD4BF" />
                        <path d="M 44 54 Q 50 60 56 54" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round" />
                    </>
                )}

                {/* Ear Headsets */}
                <rect x="16" y="38" width="6" height="18" rx="3" fill="#14B8A6" />
                <rect x="78" y="38" width="6" height="18" rx="3" fill="#14B8A6" />

                {/* Body Collar */}
                <path d="M 34 72 L 66 72 L 60 88 L 40 88 Z" fill="#6366F1" stroke="#4338CA" strokeWidth="2.5" />
                <circle cx="50" cy="80" r="3" fill="#FBBF24" />

                {/* Gradients */}
                <defs>
                    <linearGradient id="botGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="100%" stopColor="#4F46E5" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// 📚 Lexi — Reading Explorer Character
export const LexiReader: React.FC<CharacterProps> = ({
    className = '',
    size = 'md',
    expression = 'happy'
}) => {
    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Scholar Cap / Feather */}
                <path d="M 50 14 L 80 26 L 50 38 L 20 26 Z" fill="#312E81" />
                <circle cx="50" cy="26" r="3" fill="#F59E0B" />
                <path d="M 72 30 Q 76 42 74 52" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />

                {/* Face Circle */}
                <circle cx="50" cy="52" r="26" fill="#FEF3C7" stroke="#D97706" strokeWidth="2.5" />

                {/* Glasses */}
                <circle cx="40" cy="50" r="10" fill="rgba(255,255,255,0.7)" stroke="#0D9488" strokeWidth="2.5" />
                <circle cx="60" cy="50" r="10" fill="rgba(255,255,255,0.7)" stroke="#0D9488" strokeWidth="2.5" />
                <line x1="50" y1="50" x2="50" y2="50" stroke="#0D9488" strokeWidth="2.5" />

                {/* Pupils */}
                <circle cx="41" cy="50" r="3" fill="#0F172A" />
                <circle cx="61" cy="50" r="3" fill="#0F172A" />

                {/* Beak / Smile */}
                <polygon points="47,56 53,56 50,62" fill="#F59E0B" />

                {/* Open Book in Front */}
                <path d="M 28 82 Q 50 78 50 88 Q 50 78 72 82 L 70 94 Q 50 90 50 98 Q 50 90 30 94 Z" fill="#0D9488" stroke="#115E59" strokeWidth="2" />
                <path d="M 32 84 Q 50 80 50 90 Q 50 80 68 84" fill="none" stroke="#E6FFFA" strokeWidth="2" />
            </svg>
        </div>
    );
};

// 🎙️ Vox — Voice & Speaking Guide
export const VoxSpeaker: React.FC<CharacterProps> = ({
    className = '',
    size = 'md'
}) => {
    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Headphones Band */}
                <path d="M 22 50 A 28 28 0 0 1 78 50" fill="none" stroke="#4F46E5" strokeWidth="5" strokeLinecap="round" />

                {/* Body Core */}
                <circle cx="50" cy="54" r="26" fill="url(#voxGrad)" stroke="#0D9488" strokeWidth="2.5" />

                {/* Sound Wave Rings radiating */}
                <circle cx="50" cy="54" r="34" fill="none" stroke="rgba(20,184,166,0.3)" strokeWidth="2" strokeDasharray="4 6" className="animate-spin" style={{ animationDuration: '18s' }} />

                {/* Headphone Cups */}
                <rect x="16" y="42" width="10" height="20" rx="5" fill="#4F46E5" stroke="#312E81" strokeWidth="2" />
                <rect x="74" y="42" width="10" height="20" rx="5" fill="#4F46E5" stroke="#312E81" strokeWidth="2" />

                {/* Happy Face */}
                <circle cx="42" cy="50" r="3.5" fill="#0F172A" />
                <circle cx="58" cy="50" r="3.5" fill="#0F172A" />
                <path d="M 44 60 Q 50 68 56 60" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />

                {/* Microphone Arm */}
                <path d="M 24 58 Q 32 76 44 72" fill="none" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                <circle cx="44" cy="72" r="4" fill="#F59E0B" />

                <defs>
                    <linearGradient id="voxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#99F6E4" />
                        <stop offset="100%" stopColor="#2DD4BF" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};

// 🌍 Atlas — Real-World Travel & Communication Guide
export const AtlasTraveler: React.FC<CharacterProps> = ({
    className = '',
    size = 'md'
}) => {
    return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                {/* Globe Back Glow */}
                <circle cx="50" cy="50" r="38" fill="url(#atlasGrad)" stroke="#0284C7" strokeWidth="2" />

                {/* Lat/Long Lines */}
                <ellipse cx="50" cy="50" rx="22" ry="38" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                {/* Continents Outline */}
                <path d="M 38 32 Q 48 28 54 36 Q 62 38 66 48 Q 54 52 46 44 Z" fill="rgba(16,185,129,0.7)" />
                <path d="M 32 58 Q 42 62 48 76 Q 34 78 30 68 Z" fill="rgba(16,185,129,0.7)" />

                {/* Compass Star in Center */}
                <polygon points="50,34 53,47 66,50 53,53 50,66 47,53 34,50 47,47" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="50" cy="50" r="3" fill="#DC2626" />

                {/* Travel Tag / Pin */}
                <circle cx="72" cy="24" r="7" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="72" cy="24" r="2.5" fill="#FFFFFF" />

                <defs>
                    <linearGradient id="atlasGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="100%" stopColor="#0284C7" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
