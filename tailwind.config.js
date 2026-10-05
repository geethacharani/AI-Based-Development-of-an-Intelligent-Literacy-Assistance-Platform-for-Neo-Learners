/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5', // Primary Deep Indigo
                    700: '#4338CA',
                    800: '#3730A3',
                    900: '#312E81',
                    950: '#1E1B4B',
                },
                teal: {
                    50: '#F0FDFA',
                    100: '#CCFBF1',
                    200: '#99F6E4',
                    300: '#5EEAD4',
                    400: '#2DD4BF',
                    500: '#14B8A6',
                    600: '#0D9488', // Secondary Accent Teal
                    700: '#0F766E',
                    800: '#115E59',
                    900: '#134E4A',
                },
                amber: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B', // Milestone/Achievement Amber
                    600: '#D97706',
                    700: '#B45309',
                },
                lavender: {
                    50: '#FAF5FF',
                    100: '#F3E8FF',
                    200: '#E9D5FF',
                    300: '#D8B4FE',
                },
                surface: {
                    light: '#F8FAFC',
                    card: '#FFFFFF',
                    dark: '#0F172A',
                }
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 4px 20px -2px rgba(79, 70, 229, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
                'soft-hover': '0 12px 30px -4px rgba(79, 70, 229, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
                'glow': '0 0 25px -5px rgba(13, 148, 136, 0.3)',
            },
            animation: {
                'bounce-soft': 'bounceSoft 2s infinite',
                'pulse-subtle': 'pulseSubtle 3s infinite',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            },
            keyframes: {
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(-3%)' },
                    '50%': { transform: 'translateY(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.85 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(12px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
