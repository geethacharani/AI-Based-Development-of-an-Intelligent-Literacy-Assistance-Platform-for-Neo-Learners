export const getLocalizedName = (name: string, langCode: string): string => {
    if (!name) return 'Learner';
    const lang = (langCode || 'en').toLowerCase().slice(0, 2);
    if (lang === 'en') return name;

    const NAME_MAP: Record<string, Record<string, string>> = {
        'geetha swaminathan': {
            kn: 'ಗೀತಾ ಸ್ವಾಮಿನಾಥನ್',
            te: 'గీత స్వామినాథన్',
            hi: 'गीता स्वामीनाथन',
            ta: 'கீதா சுவாமிநாதன்',
            ml: 'ഗീത സ്വാമിനാഥൻ',
        },
        'geetha charani kakollu': {
            kn: 'ಗೀತಾ ಚರಣಿ ಕಾಕೊಳ್ಳು',
            te: 'గీత చరణి కాకొల్లు',
            hi: 'गीता चरणी काकोल्लू',
            ta: 'கீதா சரணி காகொல்லு',
            ml: 'ഗീത ചരണി കാകൊല്ലു',
        },
        'geetha': {
            kn: 'ಗೀತಾ',
            te: 'గీత',
            hi: 'गीता',
            ta: 'கீதா',
            ml: 'ഗീത',
        },
        'priya sharma': {
            kn: 'ಪ್ರಿಯಾ ಶರ್ಮಾ',
            te: 'ప్రియా శర్మ',
            hi: 'प्रिया शर्मा',
            ta: 'பிரியா சர்மா',
            ml: 'പ്രിയ ശർമ്മ',
        },
        'rahul verma': {
            kn: 'ರಾಹುಲ್ ವರ್ಮಾ',
            te: 'రాహుల్ వర్మ',
            hi: 'राहुल वर्मा',
            ta: 'ராகுல் வர்மா',
            ml: 'രാഹുൽ വർമ്മ',
        },
        'ananya reddy': {
            kn: 'ಅನನ್ಯಾ ರೆಡ್ಡಿ',
            te: 'అనన్య రెడ్డి',
            hi: 'अनन्या रेड्डी',
            ta: 'அனன்யா ரெட்டி',
            ml: 'അനന്യ റെഡ്ഡി',
        },
        'kiran kumar': {
            kn: 'ಕಿರಣ್ ಕುಮಾರ್',
            te: 'కిరణ్ కుమార్',
            hi: 'किरण कुमार',
            ta: 'கிரண் குமார்',
            ml: 'കിരൺ കുമാർ',
        },
        'learner': {
            kn: 'ಕಲಿಯುವವರು',
            te: 'అభ్యాసకుడు',
            hi: 'शिक्षार्थी',
            ta: 'கற்பவர்',
            ml: 'പഠിതാവ്',
        },
        'you': {
            kn: 'ನೀವು',
            te: 'మీరు',
            hi: 'आप',
            ta: 'நீங்கள்',
            ml: 'നിങ്ങൾ',
        }
    };

    const clean = name.trim().toLowerCase();
    if (NAME_MAP[clean] && NAME_MAP[clean][lang]) {
        return NAME_MAP[clean][lang];
    }

    // Check partial matches (e.g. Geetha)
    for (const [key, translations] of Object.entries(NAME_MAP)) {
        if (clean.includes(key) && translations[lang]) {
            return translations[lang];
        }
    }

    return name;
};
