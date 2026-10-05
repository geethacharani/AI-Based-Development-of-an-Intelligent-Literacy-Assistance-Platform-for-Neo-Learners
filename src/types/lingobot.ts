export type ItemCategory = 'clothes' | 'hats' | 'glasses' | 'bags' | 'accessories' | 'auras';

export interface UnlockWord {
    word: string;
    script: Record<string, string>;
    phonetic: string;
    meaning: Record<string, string>;
    icon: string;
}

export interface ItemLearningContent {
    targetWord: string; // e.g. "Vest", "Hat"
    targetScript: Record<string, string>; // { hi: 'वेस्ट', te: 'వెస్ట్', ta: 'வெஸ்ட்', kn: 'ವೆಸ್ಟ್', ml: 'വെസ്റ്റ്', en: 'Vest' }
    phonetic: Record<string, string>; // { hi: 'Vest', te: 'Vest', ... }
    meaning: Record<string, string>; // Interface language explanation
    exampleSentence: Record<string, string>; // Target language sentence
    exampleMeaning: Record<string, string>; // Interface language translation
    pronunciationTip?: string;
    skillType: 'vocabulary' | 'reading' | 'speaking' | 'mystery';
    unlockActivity?: {
        title: string;
        description: string;
        words: UnlockWord[];
    };
}

export interface CustomizationItem {
    id: string;
    name: string;
    category: ItemCategory;
    description: string;
    xpRequired: number;
    icon: string;
    previewColor: string;
    themeStyle?: string;
    unlockedByDefault?: boolean;
    learning: ItemLearningContent;
}

export interface LingoBotCustomization {
    themeColor: string;
    clothes: string;
    hat: string;
    glasses: string;
    shoes: string;
    bag: string;
    accessory: string;
    aura: string;
}

export interface LearnedCustomizationWord {
    itemId: string;
    targetWord: string;
    script: string;
    phonetic: string;
    meaning: string;
    example: string;
    category: ItemCategory;
    learnedAt: string;
}

export const DEFAULT_CUSTOMIZATION: LingoBotCustomization = {
    themeColor: 'indigo',
    clothes: 'scholar_vest',
    hat: 'none',
    glasses: 'none',
    shoes: 'sneakers',
    bag: 'none',
    accessory: 'none',
    aura: 'none'
};

export const BOT_COLORS = [
    { id: 'indigo', name: 'Cosmic Indigo', hex: '#4F46E5', secondary: '#818CF8' },
    { id: 'teal', name: 'Emerald Teal', hex: '#0D9488', secondary: '#2DD4BF' },
    { id: 'purple', name: 'Royal Purple', hex: '#7C3AED', secondary: '#C084FC' },
    { id: 'amber', name: 'Golden Honey', hex: '#D97706', secondary: '#FBBF24' },
    { id: 'rose', name: 'Ruby Rose', hex: '#E11D48', secondary: '#FB7185' },
    { id: 'sky', name: 'Azure Sky', hex: '#0284C7', secondary: '#38BDF8' }
];

export const CUSTOMIZATION_ITEMS: CustomizationItem[] = [
    // ==========================================
    // 👕 1. CLOTHES CATEGORY
    // ==========================================
    {
        id: 'scholar_vest',
        name: 'Scholar Vest',
        category: 'clothes',
        description: 'Neat academic vest with golden literacy button',
        xpRequired: 0,
        icon: '🦺',
        previewColor: '#4F46E5',
        unlockedByDefault: true,
        learning: {
            targetWord: 'Vest',
            targetScript: {
                hi: 'वेस्ट (सदरिया)',
                te: 'వెస్ట్ (జాకెట్)',
                ta: 'வெஸ்ட் (மேலங்கி)',
                kn: 'ವೆಸ್ಟ್ (ಅಂಗಿ)',
                ml: 'വെസ്റ്റ് (കുപ്പായം)',
                en: 'Vest'
            },
            phonetic: { hi: 'Vest (Sadriya)', te: 'Vest (Jacket)', ta: 'Vest', kn: 'Vest', ml: 'Vest', en: 'Vest' },
            meaning: {
                en: 'A neat sleeveless garment worn over a shirt for formal learning.',
                te: 'చొక్కాపై ధరించే స్లీవ్‌లెస్ వస్త్రం.',
                hi: 'कमीज़ के ऊपर पहना जाने वाला बिना आस्तीन का कपड़ा।',
                ta: 'சட்டைக்கு மேல் அணியப்படும் ஒரு நேர்த்தியான ஆடை.',
                kn: 'ಶರ್ಟ್ ಮೇಲೆ ಧರಿಸುವ ತೋಳಿಲ್ಲದ ಉಡುಪು.',
                ml: 'ഷർട്ടിനു മുകളിൽ ധരിക്കുന്ന സ്ലീവ്‌ലെസ് വസ്ത്രം.'
            },
            exampleSentence: {
                hi: 'मेरा वेस्ट नीला और सुंदर है।',
                te: 'నా వెస్ట్ నీలం రంగులో అందంగా ఉంది।',
                ta: 'என் வெஸ்ட் நீல நிறத்தில் அழகாக உள்ளது।',
                kn: 'ನನ್ನ ವೆಸ್ಟ್ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿ ಸುಂದರವಾಗಿದೆ।',
                ml: 'എന്റെ വെസ്റ്റ് നീല നിറത്തിൽ മനോഹരമാണ്.',
                en: 'My vest is blue and neat.'
            },
            exampleMeaning: {
                en: 'My vest is blue and neat.',
                te: 'నా వెస్ట్ నీలం రంగులో అందంగా ఉంది.',
                hi: 'मेरा वेस्ट नीला और सुंदर है।',
                ta: 'என் வெஸ்ட் நீல நிறத்தில் அழகாக உள்ளது.',
                kn: 'ನನ್ನ ವೆಸ್ಟ್ ನೀಲಿ ಬಣ್ಣದಲ್ಲಿ ಸುಂದರವಾಗಿದೆ.',
                ml: 'എന്റെ വെസ്റ്റ് നീല നിറത്തിൽ മനോഹരമാണ്.'
            },
            pronunciationTip: 'Say "Vest" with clear initial V-sound without puffing air.',
            skillType: 'vocabulary'
        }
    },
    {
        id: 'detective_coat',
        name: 'Detective Trench',
        category: 'clothes',
        description: 'Classic mystery-solving inspector trench coat',
        xpRequired: 150,
        icon: '🧥',
        previewColor: '#78350F',
        learning: {
            targetWord: 'Overcoat / Trench Coat',
            targetScript: {
                hi: 'कोट (लम्बा लबादा)',
                te: 'ఓవర్‌కోట్ (కోటు)',
                ta: 'நீண்ட அங்கி (கோட்)',
                kn: 'ಉದ್ದನೆಯ ಕೋಟ್',
                ml: 'നീണ്ട കോട്ട്',
                en: 'Overcoat'
            },
            phonetic: { hi: 'Kot / Labaada', te: 'Overcoat', ta: 'Coat', kn: 'Coat', ml: 'Coat', en: 'Overcoat' },
            meaning: {
                en: 'A long warm coat worn by investigators while inspecting clues.',
                te: 'రహస్య పరిశోధనల సమయంలో ధరించే పొడవైన కోటు.',
                hi: 'जासूसों द्वारा पहना जाने वाला लम्बा और गर्म कोट।',
                ta: 'துப்பறிவாளர்கள் அணியும் நீண்ட கோட்.',
                kn: 'ತನಿಖಾಧಿಕಾರಿಗಳು ಧರಿಸುವ ಉದ್ದನೆಯ ಕೋಟ್.',
                ml: 'കുറ്റാന്വേഷകർ ധരിക്കുന്ന നീളമുള്ള കോട്ട്.'
            },
            exampleSentence: {
                hi: 'जासूस ने अपना भूरा कोट पहना।',
                te: 'డిటెక్టివ్ తన బ్రౌన్ కోటు ధరించాడు।',
                ta: 'துப்பறிவாளர் தன் பழுப்பு நிற கோட்டை அணிந்தார்।',
                kn: 'ಪತ್ತೇದಾರಿ ತನ್ನ ಕಂದು ಬಣ್ಣದ ಕೋಟ್ ಧರಿಸಿದನು।',
                ml: 'ഡിറ്റക്ടീവ് തന്റെ തവിട്ട് കോട്ട് ധരിച്ചു.',
                en: 'The detective wore his brown coat.'
            },
            exampleMeaning: {
                en: 'The detective wore his brown coat.',
                te: 'డిటెక్టివ్ తన బ్రౌన్ కోటు ధరించాడు.',
                hi: 'जासूस ने अपना भूरा कोट पहना।',
                ta: 'துப்பறிவாளர் தன் பழுப்பு நிற கோட்டை அணிந்தார்.',
                kn: 'ಪತ್ತೇದಾರಿ ತನ್ನ ಕಂದು ಬಣ್ಣದ ಕೋಟ್ ಧರಿಸಿದನು.',
                ml: 'ഡിറ്റക്ടീവ് തന്റെ തവിട്ട് കോട്ട് ധരിച്ചു.'
            },
            pronunciationTip: 'Emphasize the initial K-sound in Kot with crisp delivery.',
            skillType: 'mystery',
            unlockActivity: {
                title: 'Learn 3 Investigation Words',
                description: 'Master these 3 detective terms to unlock the Detective Trench Coat:',
                words: [
                    { word: 'Detective', script: { hi: 'जासूस', te: 'డిటెక్టివ్', ta: 'துப்பறிவாளர்', kn: 'ಪತ್ತೇದಾರಿ', ml: 'ഡിറ്റക്ടീവ്', en: 'Detective' }, phonetic: 'Jasoos', meaning: { en: 'A mystery investigator', te: 'పరిశోధకుడు', hi: 'रहस्य सुलझाने वाला', ta: 'துப்பறிபவர்', kn: 'ಪತ್ತೇದಾರಿ', ml: 'അന്വേഷകൻ' }, icon: '🕵️' },
                    { word: 'Clue', script: { hi: 'सुराग', te: 'క్లూ / ఆధారము', ta: 'துப்பு', kn: 'ಸುಳಿವು', ml: 'സൂചന', en: 'Clue' }, phonetic: 'Suraag', meaning: { en: 'A hint that solves a mystery', te: 'సమస్య పరిష్కార ఆధారం', hi: 'रहस्य सुलझाने का संकेत', ta: 'துப்பு', kn: 'ಸುಳಿವು', ml: 'സൂചന' }, icon: '📜' },
                    { word: 'Search', script: { hi: 'तलाश', te: 'వెతకడం', ta: 'தேடுதல்', kn: 'ಹುಡುಕಾಟ', ml: 'തിരയുക', en: 'Search' }, phonetic: 'Talaash', meaning: { en: 'To look carefully for evidence', te: 'పరిశీలించడం', hi: 'सावधानी से खोजना', ta: 'தேடுதல்', kn: 'ಹುಡುಕುವುದು', ml: 'തിരയൽ' }, icon: '🔍' }
                ]
            }
        }
    },
    {
        id: 'traditional_kurta',
        name: 'Festive Kurta',
        category: 'clothes',
        description: 'Vibrant cultural embroidered festive wear',
        xpRequired: 200,
        icon: '🥻',
        previewColor: '#EA580C',
        learning: {
            targetWord: 'Kurta / Traditional Shirt',
            targetScript: {
                hi: 'कुर्ता',
                te: 'కుర్తా',
                ta: 'குர்தா',
                kn: 'ಕುರ್ತಾ',
                ml: 'കുർത്ത',
                en: 'Kurta'
            },
            phonetic: { hi: 'Kurta', te: 'Kurta', ta: 'Kurtha', kn: 'Kurta', ml: 'Kurtha', en: 'Kurta' },
            meaning: {
                en: 'A comfortable traditional long tunic worn during celebrations.',
                te: 'పండుగల్లో ధరించే సాంప్రదాయక వస్త్రం.',
                hi: 'त्योहारों पर पहना जाने वाला पारंपरिक आरामदायक वस्त्र।',
                ta: 'பண்டிகைகளில் அணியும் பாரம்பரிய ஆடை.',
                kn: 'ಹಬ್ಬಗಳಲ್ಲಿ ಧರಿಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಉಡುಪು.',
                ml: 'വിശേഷദിവസങ്ങളിൽ ധരിക്കുന്ന പരമ്പരാഗത വസ്ത്രം.'
            },
            exampleSentence: {
                hi: 'आज त्योहार पर सबने नया कुर्ता पहना है।',
                te: 'ఈ రోజు పండుగకు అందరూ కొత్త కుర్తా ధరించారు।',
                ta: 'இன்று பண்டிகைக்கு அனைவரும் புதிய குர்தா அணிந்துள்ளனர்।',
                kn: 'ಇಂದು ಹಬ್ಬಕ್ಕೆ ಎಲ್ಲರೂ ಹೊಸ ಕುರ್ತಾ ಧರಿಸಿದ್ದಾರೆ।',
                ml: 'ഇന്ന് ഉത്സവത്തിന് എല്ലാവരും പുതിയ കുർത്ത ധരിച്ചു.',
                en: 'Everyone wore a new kurta for the festival today.'
            },
            exampleMeaning: {
                en: 'Everyone wore a new kurta for the festival today.',
                te: 'ఈ రోజు పండుగకు అందరూ కొత్త కుర్తా ధరించారు.',
                hi: 'आज त्योहार पर सबने नया कुर्ता पहना है।',
                ta: 'இன்று பண்டிகைக்கு அனைவரும் புதிய குர்தா அணிந்துள்ளனர்.',
                kn: 'ಇಂದು ಹಬ್ಬಕ್ಕೆ ಎಲ್ಲರೂ ಹೊಸ ಕುರ್ತಾ ಧರಿಸಿದ್ದಾರೆ.',
                ml: 'ഇന്ന് ഉത്സവത്തിന് എല്ലാവരും പുതിയ കുർത്ത ധരിച്ചു.'
            },
            skillType: 'vocabulary'
        }
    },
    {
        id: 'casual_hoodie',
        name: 'Lingo Street Hoodie',
        category: 'clothes',
        description: 'Cozy modern hoodie for comfortable daily study',
        xpRequired: 50,
        icon: '👕',
        previewColor: '#10B981',
        learning: {
            targetWord: 'Hoodie / Sweatshirt',
            targetScript: {
                hi: 'हूडी (गर्म स्वेटर)',
                te: 'హూడీ',
                ta: 'ஹூடி',
                kn: 'ಹೂಡಿ',
                ml: 'ഹൂഡി',
                en: 'Hoodie'
            },
            phonetic: { hi: 'Hoodie', te: 'Hoodie', ta: 'Hoodie', kn: 'Hoodie', ml: 'Hoodie', en: 'Hoodie' },
            meaning: {
                en: 'A soft sweatshirt with a comfortable head hood for casual study.',
                te: 'చదువుకునే సమయంలో సౌకర్యవంతంగా ఉండే హుడ్ ఉన్న స్వెటర్.',
                hi: 'टोपी वाला आरामदायक गर्म स्वेटर।',
                ta: 'தலைக்கவசம் கொண்ட வசதியான கம்பளி ஆடை.',
                kn: 'ಆರಾಮದಾಯಕವಾದ ಟೋಪಿ ಹೊಂದಿರುವ ಸ್ವೆಟರ್.',
                ml: 'തല മൂടുന്ന തൊപ്പിയുള്ള സുഖപ്രദമായ സ്വെറ്റർ.'
            },
            exampleSentence: {
                hi: 'सर्दियों में यह हरा हूडी बहुत आरामदायक है।',
                te: 'శీతాకాలంలో ఈ ఆకుపచ్చ హూడీ చాలా సౌకర్యంగా ఉంటుంది।',
                ta: 'குளிர்காலத்தில் இந்த பச்சை ஹூடி மிகவும் வசதியானது।',
                kn: 'ಚಳಿಗಾಲದಲ್ಲಿ ಈ ಹಸಿರು ಹೂಡಿ ತುಂಬಾ ಆರಾಮದಾಯಕವಾಗಿದೆ।',
                ml: 'ശീതകാലത്ത് ഈ പച്ച ഹൂഡി വളരെ സുഖകരമാണ്.',
                en: 'This green hoodie is very cozy in winter.'
            },
            exampleMeaning: {
                en: 'This green hoodie is very cozy in winter.',
                te: 'శీతాకాలంలో ఈ ఆకుపచ్చ హూడీ చాలా సౌకర్యంగా ఉంటుంది.',
                hi: 'सर्दियों में यह हरा हूडी बहुत आरामदायक है।',
                ta: 'குளிர்காலத்தில் இந்த பச்சை ஹூடி மிகவும் வசதியானது.',
                kn: 'ಚಳಿಗಾಲದಲ್ಲಿ ಈ ಹಸಿರು ಹೂಡಿ ತುಂಬಾ ಆರಾಮದಾಯಕವಾಗಿದೆ.',
                ml: 'ശീതകാലത്ത് ഈ പച്ച ഹൂഡി വളരെ സുഖകരമാണ്.'
            },
            skillType: 'vocabulary'
        }
    },

    // ==========================================
    // 🎩 2. HATS & HEADWEAR CATEGORY
    // ==========================================
    {
        id: 'detective_fedora',
        name: 'Detective Fedora',
        category: 'hats',
        description: 'Worn by the sharpest clue-hunting language detectives',
        xpRequired: 180,
        icon: '🕵️',
        previewColor: '#92400E',
        learning: {
            targetWord: 'Hat / Fedora',
            targetScript: {
                hi: 'टोपी (फ़ेडोरा)',
                te: 'టోపీ (ఫెడోరా)',
                ta: 'தொப்பி',
                kn: 'ಟೋಪಿ',
                ml: 'തൊപ്പി',
                en: 'Fedora Hat'
            },
            phonetic: { hi: 'Topi (Fedora)', te: 'Topi', ta: 'Thoppi', kn: 'Topi', ml: 'Thoppi', en: 'Fedora' },
            meaning: {
                en: 'A classic brimmed felt hat worn for observation and sharp thinking.',
                te: 'తీవ్ర ఆలోచన మరియు పరిశీలన కోసం ధరించే గుండ్రని అంచుగల టోపీ.',
                hi: 'जासूसों द्वारा पहना जाने वाला किनारीदार टोपी।',
                ta: 'கூர்ந்து கவனிப்பதற்கான விளிம்புடைய தொப்பி.',
                kn: 'ಆಲೋಚನೆ ಮತ್ತು ತನಿಖೆಗಾಗಿ ಧರಿಸುವ ಅಂಚಿರುವ ಟೋಪಿ.',
                ml: 'തീക്ഷ്ണമായ ചിന്തയ്ക്കും നിരീക്ഷണത്തിനും ഉപയോഗിക്കുന്ന തൊപ്പി.'
            },
            exampleSentence: {
                hi: 'कृपया अपनी जासूसी टोपी पहनिए।',
                te: 'దయచేసి మీ డిటెక్టివ్ టోపీని ధరించండి।',
                ta: 'தயவுசெய்து உங்கள் துப்பறியும் தொப்பியை அணியுங்கள்।',
                kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪತ್ತೇದಾರಿ ಟೋಪಿಯನ್ನು ಧರಿಸಿ।',
                ml: 'ദയവായി നിങ്ങളുടെ ഡിറ്റക്ടീവ് തൊപ്പി ധരിക്കുക.',
                en: 'Please wear your detective hat.'
            },
            exampleMeaning: {
                en: 'Please wear your detective hat.',
                te: 'దయచేసి మీ డిటెక్టివ్ టోపీని ధరించండి.',
                hi: 'कृपया अपनी जासूसी टोपी पहनिए।',
                ta: 'தயவுசெய்து உங்கள் துப்பறியும் தொப்பியை அணியுங்கள்.',
                kn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪತ್ತೇದಾರಿ ಟೋಪಿಯನ್ನು ಧರಿಸಿ.',
                ml: 'ദയവായി നിങ്ങളുടെ ഡിറ്റക്ടീവ് തൊപ്പി ധരിക്കുക.'
            },
            pronunciationTip: 'Say "Topi" with light T-retroflex tap on palate.',
            skillType: 'mystery',
            unlockActivity: {
                title: 'Learn 4 Mystery Clue Words',
                description: 'Complete this vocabulary exercise to unlock the Detective Fedora:',
                words: [
                    { word: 'Mystery', script: { hi: 'रहस्य', te: 'రహస్యం', ta: 'மர்மம்', kn: 'ರಹಸ್ಯ', ml: 'രഹസ്യം', en: 'Mystery' }, phonetic: 'Rahasya', meaning: { en: 'Something puzzling or unknown', te: 'తెలియని చిక్కుముడి', hi: 'छुपी हुई बात', ta: 'மர்மம்', kn: 'ರಹಸ್ಯ', ml: 'രഹസ്യം' }, icon: '🔎' },
                    { word: 'Evidence', script: { hi: 'सबूत', te: 'రుజువు / సాక్ష్యం', ta: 'சான்று', kn: 'ಸಾಕ್ಷಿ', ml: 'തെളിവ്', en: 'Evidence' }, phonetic: 'Saboot', meaning: { en: 'Facts proving the truth', te: 'నిజం నిరూపించే ఆధారం', hi: 'सच्चाई सिद्ध करने वाला तथ्य', ta: 'சான்று', kn: 'ಸಾಕ್ಷ್ಯ', ml: 'തെളിവ്' }, icon: '🔍' },
                    { word: 'Secret', script: { hi: 'गुप्त', te: 'గుప్తమైనది', ta: 'ரகசியம்', kn: 'ಗುಪ್ತ', ml: 'രഹസ്യമായത്', en: 'Secret' }, phonetic: 'Gupt', meaning: { en: 'Kept hidden from others', te: 'దాచిన విషయం', hi: 'छुपाया गया ज्ञान', ta: 'ரகசியம்', kn: 'ಗುಪ್ತ', ml: 'രഹസ്യം' }, icon: '🔐' },
                    { word: 'Track', script: { hi: 'निशान', te: 'గుర్తు / అడుగుజాడ', ta: 'தடம்', kn: 'ಹೆಜ್ಜೆಗುರುತು', ml: 'അടയാളം', en: 'Track' }, phonetic: 'Nishaan', meaning: { en: 'A mark left behind to follow', te: 'అనుసరించాల్సిన గుర్తు', hi: 'पीछा करने वाला चिन्ह', ta: 'தடம்', kn: 'ಗುರುತು', ml: 'അടയാളം' }, icon: '👣' }
                ]
            }
        }
    },
    {
        id: 'grad_cap',
        name: 'Graduation Cap',
        category: 'hats',
        description: 'Celebrate academic milestone achievements',
        xpRequired: 100,
        icon: '🎓',
        previewColor: '#1E293B',
        learning: {
            targetWord: 'Graduation Cap / Mortarboard',
            targetScript: {
                hi: 'दीक्षांत टोपी (ग्रेजुएशन कैप)',
                te: 'పట్టభద్రుల టోపీ',
                ta: 'பட்டமளிப்புத் தொப்பி',
                kn: 'ಪದವಿ ಪ್ರದಾನ ಟೋಪಿ',
                ml: 'ബിരുദദാന തൊപ്പി',
                en: 'Graduation Cap'
            },
            phonetic: { hi: 'Deekshant Topi', te: 'Pattabhadrula Topi', ta: 'Pattamalipu Thoppi', kn: 'Padavi Topi', ml: 'Biruda Topi', en: 'Graduation Cap' },
            meaning: {
                en: 'A square academic cap honoring student graduation and literacy achievement.',
                te: 'విద్యాభ్యాసం మరియు పట్టభద్రతను గౌరవించే టోపీ.',
                hi: 'विद्या अध्ययन पूरा होने पर पहना जाने वाला सम्मानजनक टोपी।',
                ta: 'கல்வி தேர்ச்சியைக் குறிக்கும் சதுரத் தொப்பி.',
                kn: 'ವಿದ್ಯಾಭ್ಯಾಸ ಪೂರ್ಣಗೊಳಿಸಿದ ಗೌರವಾರ್ಥ ಧರಿಸುವ ಚೌಕಾಕಾರದ ಟೋಪಿ.',
                ml: 'വിദ്യാഭ്യാസം പൂർത്തിയാക്കിയതിന്റെ ബഹുമാനസൂചകമായ തൊപ്പി.'
            },
            exampleSentence: {
                hi: 'विद्यार्थी ने दीक्षांत टोपी पहनकर प्रमाण-पत्र लिया।',
                te: 'విద్యార్థి టోపీ ధరించి సర్టిఫికేట్ తీసుకున్నాడు।',
                ta: 'மாணவர் தொப்பி அணிந்து சான்றிதழைப் பெற்றார்।',
                kn: 'ವಿದ್ಯಾರ್ಥಿಯು ಟೋಪಿ ಧರಿಸಿ ಪ್ರಮಾಣಪತ್ರ ಪಡೆದನು।',
                ml: 'വിദ്യാർത്ഥി തൊപ്പി ധരിച്ച് സർട്ടിഫിക്കറ്റ് വാങ്ങി.',
                en: 'The student wore the graduation cap and received the certificate.'
            },
            exampleMeaning: {
                en: 'The student wore the graduation cap and received the certificate.',
                te: 'విద్యార్థి టోపీ ధరించి సర్టిఫికೇట్ తీసుకున్నాడు.',
                hi: 'विद्यार्थी ने दीक्षांत टोपी पहनकर प्रमाण-पत्र लिया।',
                ta: 'மாணவர் தொப்பி அணிந்து சான்றிதழைப் பெற்றார்.',
                kn: 'ವಿದ್ಯಾರ್ಥಿಯು ಟೋಪಿ ಧರಿಸಿ ಪ್ರಮಾಣಪತ್ರ ಪಡೆದನು.',
                ml: 'വിദ്യാർത്ഥി തൊപ്പി ധരിച്ച് സർട്ടിഫിക്കറ്റ് വാങ്ങി.'
            },
            skillType: 'reading'
        }
    },
    {
        id: 'royal_crown',
        name: 'Language Monarch Crown',
        category: 'hats',
        description: 'Gleaming golden crown studded with linguistic gems',
        xpRequired: 400,
        icon: '👑',
        previewColor: '#F59E0B',
        learning: {
            targetWord: 'Crown / Tiara',
            targetScript: {
                hi: 'मुकुट (ताज)',
                te: 'కిరీటం',
                ta: 'கிரீடம்',
                kn: 'ಕಿರೀಟ',
                ml: 'കിരീടം',
                en: 'Crown'
            },
            phonetic: { hi: 'Mukut / Taaj', te: 'Kireetam', ta: 'Kireedam', kn: 'Kireeta', ml: 'Kireedam', en: 'Crown' },
            meaning: {
                en: 'A royal headpiece awarded to learners who master extensive vocabulary.',
                te: 'అపారమైన పదసంపదను సాధించిన వారికి లభించే రాజ కిరీటం.',
                hi: 'उच्च भाषा ज्ञान और शब्दावली में निपुणता का प्रतीक सुनहरा ताज।',
                ta: 'சொல் வளம் மிக்க கற்பவருக்கு வழங்கப்படும் தங்க கிரீடம்.',
                kn: 'ಉನ್ನತ ಶಬ್ದಕೋಶ ಸಾಧನೆಗೆ ನೀಡಲಾಗುವ ಚಿನ್ನದ ಕಿರೀಟ.',
                ml: 'ഉന്നത പദസമ്പത്ത് നേടിയ പഠിതാക്കൾക്കുള്ള സ്വർണ്ണ കിരീടം.'
            },
            exampleSentence: {
                hi: 'राजा के सिर पर सुंदर स्वर्ण मुकुट सुशोभित है।',
                te: 'రాజు తలపై అందమైన బంగారు కిరీటం ప్రకాశిస్తోంది।',
                ta: 'அரசனின் தலையில் அழகான தங்கக் கிரீடம் மிளிர்கிறது।',
                kn: 'ರಾಜನ ತಲೆಯ ಮೇಲೆ ಸುಂದರ ಬಂಗಾರದ ಕಿರೀಟ ಶೋಭಿಸುತ್ತಿದೆ।',
                ml: 'രാജാവിന്റെ തലയിൽ മനോഹരമായ സ്വർണ്ണ കിരീടം തിളങ്ങുന്നു.',
                en: 'A radiant golden crown rests upon the king’s head.'
            },
            exampleMeaning: {
                en: 'A radiant golden crown rests upon the king’s head.',
                te: 'రాజు తలపై అందమైన బంగారు కిరీటం ప్రకాశిస్తోంది.',
                hi: 'राजा के सिर पर सुंदर स्वर्ण मुकुट सुशोभित है।',
                ta: 'அரசனின் தலையில் அழகான தங்கக் கிரீடம் மிளிர்கிறது.',
                kn: 'ರಾಜನ ತಲೆಯ ಮೇಲೆ ಸುಂದರ ಬಂಗಾರದ ಕಿರೀಟ ಶೋಭಿಸುತ್ತಿದೆ.',
                ml: 'രാജാവിന്റെ തലയിൽ മനോഹരമായ സ്വർണ്ണ കിരീടം തിളങ്ങുന്നു.'
            },
            skillType: 'vocabulary'
        }
    },

    // ==========================================
    // 👓 3. GLASSES & EYEWEAR CATEGORY
    // ==========================================
    {
        id: 'professor_specs',
        name: 'Professor Round Specs',
        category: 'glasses',
        description: 'Vintage round wire-frames for wise study and reading',
        xpRequired: 80,
        icon: '👓',
        previewColor: '#D97706',
        learning: {
            targetWord: 'Spectacles / Glasses',
            targetScript: {
                hi: 'चश्मा',
                te: 'కళ్ళద్దాలు',
                ta: 'கண்ணாடி',
                kn: 'ಕನ್ನಡಕ',
                ml: 'കണ്ണട',
                en: 'Spectacles'
            },
            phonetic: { hi: 'Chashma', te: 'Kalladdalu', ta: 'Kannaadi', kn: 'Kannadaka', ml: 'Kannada', en: 'Spectacles' },
            meaning: {
                en: 'Lenses worn in front of the eyes to aid clear reading and observation.',
                te: 'స్పష్టంగా చదవడానికి కళ్ళ ముందు ధరించే అద్దాలు.',
                hi: 'स्पष्ट पढ़ने और देखने के लिए आँखों पर पहना जाने वाला चश्मा।',
                ta: 'தெளிவாக வாசிப்பதற்கு அணியும் மூக்குக் கண்ணாடி.',
                kn: 'ಸ್ಪಷ್ಟವಾಗಿ ಓದಲು ಕಣ್ಣಿನ ಮುಂದೆ ಧರಿಸುವ ಕನ್ನಡಕ.',
                ml: 'വ്യക്തമായി വായിക്കാൻ ധരിക്കുന്ന കണ്ണട.'
            },
            exampleSentence: {
                hi: 'किताब पढ़ने के लिए उन्होंने अपना चश्मा लगाया।',
                te: 'పుస్తకం చదవడానికి వారు కళ్ళద్దాలు పెట్టుకున్నారు।',
                ta: 'புத்தகம் படிக்க அவர்கள் கண்ணாடி அணிந்தனர்।',
                kn: 'ಪುಸ್ತಕ ಓದಲು ಅವರು ಕನ್ನಡಕ ಧರಿಸಿದರು।',
                ml: 'പുസ്തകം വായിക്കാൻ അവർ കണ്ണട വെച്ചു.',
                en: 'They put on their glasses to read the book.'
            },
            exampleMeaning: {
                en: 'They put on their glasses to read the book.',
                te: 'పుస్తకం చదవడానికి వారు కళ్ళద్దాలు పెట్టుకున్నారు.',
                hi: 'किताब पढ़ने के लिए उन्होंने अपना चश्मा लगाया।',
                ta: 'புத்தகம் படிக்க அவர்கள் கண்ணாடி அணிந்தனர்.',
                kn: 'ಪುಸ್ತಕ ಓದಲು ಅವರು ಕನ್ನಡಕ ಧರಿಸಿದರು.',
                ml: 'പുസ്തകം വായിക്കാൻ അവർ കണ്ണട വെച്ചു.'
            },
            pronunciationTip: 'Pronounce "Chash-ma" with soft sh-sound.',
            skillType: 'reading'
        }
    },
    {
        id: 'cool_sunglasses',
        name: 'Celebrity Sunglasses',
        category: 'glasses',
        description: 'Ultra-cool dark shades for confident fluent speakers',
        xpRequired: 160,
        icon: '🕶️',
        previewColor: '#0F172A',
        learning: {
            targetWord: 'Sunglasses / Shades',
            targetScript: {
                hi: 'धूप का चश्मा',
                te: 'ఎండ కళ్ళద్దాలు',
                ta: 'குளிர் கண்ணாடி',
                kn: 'ಬಿಸಿಲಿನ ಕನ್ನಡಕ',
                ml: 'സൺഗ്ലാസ്',
                en: 'Sunglasses'
            },
            phonetic: { hi: 'Dhoop ka chashma', te: 'Enda kalladdalu', ta: 'Kulir kannaadi', kn: 'Bisilina kannadaka', ml: 'Sunglasses', en: 'Sunglasses' },
            meaning: {
                en: 'Tinted eyewear shielding eyes from the sun while speaking with flair.',
                te: 'ఎండ నుంచి కళ్లను కాపాడుతూ ఆత్మవిశ్వాసం ఇచ్చే నల్లని అద్దాలు.',
                hi: 'सूरज की धूप से आँखों की रक्षा करने वाला रंगीन चश्मा।',
                ta: 'சூரிய ஒளியிலிருந்து கண்களைப் பாதுகாக்கும் கறுப்புக் கண்ணாடி.',
                kn: 'ಬಿಸಿಲಿನಿಂದ ಕಣ್ಣುಗಳನ್ನು ರಕ್ಷಿಸುವ ಕಪ್ಪು ಕನ್ನಡಕ.',
                ml: 'സൂര്യപ്രകാശത്തിൽ നിന്ന് സംരക്ഷിക്കുന്ന കറുത്ത കണ്ണട.'
            },
            exampleSentence: {
                hi: 'तेज़ धूप में बाहर निकलते समय धूप का चश्मा पहनें।',
                te: 'తీవ్రమైన ఎండలో వెళ్లేటప్పుడు సన్‌గ్లాసెస్ ధరించండి।',
                ta: 'வெயிலில் செல்லும்போது குளிர் கண்ணாடி அணியுங்கள்।',
                kn: 'ಬಿಸಿಲಿನಲ್ಲಿ ಹೋಗುವಾಗ ಸನ್‌ಗ್ಲಾಸ್ ಧರಿಸಿ।',
                ml: 'വെയിലിൽ ഇറങ്ങുമ്പോൾ സൺഗ്ലാസ് ധരിക്കുക.',
                en: 'Wear sunglasses when stepping out in bright sunlight.'
            },
            exampleMeaning: {
                en: 'Wear sunglasses when stepping out in bright sunlight.',
                te: 'తీవ్రమైన ఎండలో వెళ్లేటప్పుడు సన్‌గ్లాసెస్ ధరించండి.',
                hi: 'तेज़ धूप में बाहर निकलते समय धूप का चश्मा पहनें।',
                ta: 'வெயிலில் செல்லும்போது குளிர் கண்ணாடி அணியுங்கள்.',
                kn: 'ಬಿಸಿಲಿನಲ್ಲಿ ಹೋಗುವಾಗ ಸನ್‌ಗ್ಲಾಸ್ ಧರಿಸಿ.',
                ml: 'വെയിലിൽ ഇറങ്ങുമ്പോൾ സൺഗ്ലാസ് ധരിക്കുക.'
            },
            skillType: 'speaking'
        }
    },

    // ==========================================
    // 🎒 4. BAGS & SATCHELS CATEGORY
    // ==========================================
    {
        id: 'leather_satchel',
        name: 'Leather Book Satchel',
        category: 'bags',
        description: 'Durable messenger satchel packed with storybooks and notebooks',
        xpRequired: 90,
        icon: '💼',
        previewColor: '#B45309',
        learning: {
            targetWord: 'Satchel / Bag',
            targetScript: {
                hi: 'बस्ता (झोला)',
                te: 'సంచీ (బ్యాగ్)',
                ta: 'தோள் பை',
                kn: 'ಚೀಲ (ಬ್ಯಾಗ್)',
                ml: 'സഞ്ചി / ബാഗ്',
                en: 'Satchel'
            },
            phonetic: { hi: 'Basta / Jhola', te: 'Sanchi / Bag', ta: 'Thol pai', kn: 'Cheela', ml: 'Sanchi', en: 'Satchel' },
            meaning: {
                en: 'A bag carried on the shoulder to hold books, notebooks, and pens.',
                te: 'పుస్తకాలు, పెన్నులు భద్రపరచడానికి భుజాన తగిలించుకునే సంచీ.',
                hi: 'किताबें और कॉपियाँ रखने के लिए कंधे पर टांगने वाला थैला।',
                ta: 'புத்தகங்களையும் எழுதுகோல்களையும் எடுத்துச்செல்லும் தோள் பை.',
                kn: 'ಪುಸ್ತಕಗಳು ಮತ್ತು ಪೆನ್ನುಗಳನ್ನು ಇಟ್ಟುಕೊಳ್ಳಲು ಭುಜದ ಮೇಲೆ ಹಾಕುವ ಚೀಲ.',
                ml: 'പുസ്തകങ്ങളും പേനകളും സൂക്ഷിക്കാൻ തോളിലിടുന്ന സഞ്ചി.'
            },
            exampleSentence: {
                hi: 'लिंगोबॉट ने अपना बस्ता खोला और किताब निकाली।',
                te: 'లింగోబోట్ తన సంచీని తెరిచి పుస్తకం తీసింది।',
                ta: 'லிங்கோபாட் தன் தோள் பையைத் திறந்து புத்தகம் எடுத்தது।',
                kn: 'ಲಿಂಗೋಬಾಟ್ ತನ್ನ ಬ್ಯಾಗ್ ತೆರೆದು ಪುಸ್ತಕ ತೆಗೆಯಿತು।',
                ml: 'ലിംഗോബോട്ട് തന്റെ ബാഗ് തുറന്ന് പുസ്തകം എടുത്തു.',
                en: 'LingoBot opened the satchel and took out the book.'
            },
            exampleMeaning: {
                en: 'LingoBot opened the satchel and took out the book.',
                te: 'లింగోబోట్ తన సంచీని తెరిచి పుస్తకం తీసింది.',
                hi: 'लिंगोबॉट ने अपना बस्ता खोला और किताब निकाली।',
                ta: 'லிங்கோபாட் தன் தோள் பையைத் திறந்து புத்தகம் எடுத்தது.',
                kn: 'ಲಿಂಗೋಬಾಟ್ ತನ್ನ ಬ್ಯಾಗ್ ತೆರೆದು ಪುಸ್ತಕ ತೆಗೆಯಿತು.',
                ml: 'ലിംഗോബോട്ട് തന്റെ ബാഗ് തുറന്ന് പുസ്തകം എടുത്തു.'
            },
            pronunciationTip: 'Say "Basta" with short crisp syllables.',
            skillType: 'reading'
        }
    },
    {
        id: 'adventure_pack',
        name: 'Explorer Backpack',
        category: 'bags',
        description: 'Equipped with water bottle and field notebook for city quests',
        xpRequired: 170,
        icon: '🎒',
        previewColor: '#047857',
        learning: {
            targetWord: 'Backpack / Rucksack',
            targetScript: {
                hi: 'पीठ का बस्ता (बैकपैक)',
                te: 'వీపు బ్యాగ్',
                ta: 'முதுகுப் பை',
                kn: 'ಬೆನ್ನಿನ ಚೀಲ',
                ml: 'ബാക്ക്പാക്ക്',
                en: 'Backpack'
            },
            phonetic: { hi: 'Peeth ka basta', te: 'Veepu bag', ta: 'Muthugu pai', kn: 'Bennina cheela', ml: 'Backpack', en: 'Backpack' },
            meaning: {
                en: 'A travel pack supported by two shoulder straps for city exploration.',
                te: 'నగర అన్వేషణకు వీపుపై సులభంగా మోయగల సంచీ.',
                hi: 'दोनों कंधों पर टांग कर यात्रा में ले जाने वाला मज़बूत बस्ता।',
                ta: 'முதுகில் மாட்டிச் செல்லக்கூடிய வலுவான பயணப் பை.',
                kn: 'ಎರಡು ಭುಜಗಳ ಮೇಲೆ ಧರಿಸಿ ಪ್ರಯಾಣಿಸಲು ಬಳಸುವ ಬ್ಯಾಗ್.',
                ml: 'യാത്രകളിൽ രണ്ട് തോളിലും താങ്ങി കൊണ്ടുപോകുന്ന ബാഗ്.'
            },
            exampleSentence: {
                hi: 'हम यात्रा के लिए अपना बैकपैक तैयार कर रहे हैं।',
                te: 'మేము ప్రయాణం కోసం మా బ్యాక్‌ప్యాక్ సిద్ధం చేస్తున్నాము।',
                ta: 'நாங்கள் பயணத்திற்கு எங்கள் முதுகுப்பையை தயார் செய்கிறோம்।',
                kn: 'ನಾವು ಪ್ರಯಾಣಕ್ಕಾಗಿ ನಮ್ಮ ಬೆನ್ನಿನ ಚೀಲವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇವೆ।',
                ml: 'ഞങ്ങൾ യാത്രയ്ക്കായി ബാക്ക്പാക്ക് തയാറാക്കുന്നു.',
                en: 'We are preparing our backpack for the trip.'
            },
            exampleMeaning: {
                en: 'We are preparing our backpack for the trip.',
                te: 'మేము ప్రయాణం కోసం మా బ్యాక్‌ప్యాక్ సిద్ధం చేస్తున్నాము.',
                hi: 'हम यात्रा के लिए अपना बैकपैक तैयार कर रहे हैं।',
                ta: 'நாங்கள் பயணத்திற்கு எங்கள் முதுகுப்பையை தயார் செய்கிறோம்.',
                kn: 'ನಾವು ಪ್ರಯಾಣಕ್ಕಾಗಿ ನಮ್ಮ ಬೆನ್ನಿನ ಚೀಲವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತಿದ್ದೇವೆ.',
                ml: 'ഞങ്ങൾ യാത്രയ്ക്കായി ബാക്ക്പാക്ക് തയാറാക്കുന്നു.'
            },
            skillType: 'vocabulary'
        }
    },

    // ==========================================
    // 🪄 5. ACCESSORIES & HANDHELD CATEGORY
    // ==========================================
    {
        id: 'magic_quill',
        name: 'Golden Feather Quill',
        category: 'accessories',
        description: 'Writes fluent scripts that shimmer on the page with golden ink',
        xpRequired: 120,
        icon: '🪶',
        previewColor: '#F59E0B',
        learning: {
            targetWord: 'Quill / Feather Pen',
            targetScript: {
                hi: 'कलम (पंख की कलम)',
                te: 'ఈక కలము (కలం)',
                ta: 'தூவல் பேனா',
                kn: 'ಗರಿ ಲೇಖನಿ',
                ml: 'തൂവൽ പേന',
                en: 'Quill Pen'
            },
            phonetic: { hi: 'Kalam (Pankh ki kalam)', te: 'Eeka kalamu', ta: 'Thooval pena', kn: 'Gari lekhani', ml: 'Thooval pena', en: 'Quill' },
            meaning: {
                en: 'A traditional writing instrument made from a feather for beautiful calligraphy.',
                te: 'అందమైన అక్షరాలను లిఖించడానికి వాడే సాంప్రదాయ పక్షి ఈక కలం.',
                hi: 'सुंदर लिपि लिखने के लिए पंख से बनी पारंपरिक कलम।',
                ta: 'அழகிய எழுத்துக்களை எழுதப் பயன்படும் பாரம்பரிய தூவல் பேனா.',
                kn: 'ಸುಂದರ ಅಕ್ಷರಗಳನ್ನು ಬರೆಯಲು ಬಳಸುವ ಸಾಂಪ್ರದಾಯಿಕ ಗರಿ ಲೇಖನಿ.',
                ml: 'മനോഹരമായ അക്ഷരങ്ങൾ എഴുതാൻ ഉപയോഗിക്കുന്ന തൂവൽ പേന.'
            },
            exampleSentence: {
                hi: 'सुलेखक ने सोने की कलम से सुंदर वाक्य लिखा।',
                te: 'రచయిత బంగారు కలంతో అందమైన వాక్యం రాశారు।',
                ta: 'எழுத்தாளர் தங்க தூவல் பேனாவால் அழகான வாக்கியத்தை எழுதினார்।',
                kn: 'ಲೇಖಕರು ಬಂಗಾರದ ಲೇಖನಿಯಿಂದ ಸುಂದರ ವಾಕ್ಯವನ್ನು ಬರೆದರು।',
                ml: 'എഴുത്തുകാരൻ സ്വർണ്ണ പേന കൊണ്ട് മനോഹരമായ വാക്യം എഴുതി.',
                en: 'The scribe wrote a beautiful sentence with the golden quill.'
            },
            exampleMeaning: {
                en: 'The scribe wrote a beautiful sentence with the golden quill.',
                te: 'రచయిత బంగారు కలంతో అందమైన వాక్యం రాశారు.',
                hi: 'सुलेखक ने सोने की कलम से सुंदर वाक्य लिखा।',
                ta: 'எழுத்தாளர் தங்க தூவல் பேனாவால் அழகான வாக்கியத்தை எழுதினார்.',
                kn: 'ಲೇಖಕರು ಬಂಗಾರದ ಲೇಖನಿಯಿಂದ ಸುಂದರ ವಾಕ್ಯವನ್ನು ಬರೆದರು.',
                ml: 'എഴുത്തുകാരൻ സ്വർണ്ണ പേന കൊണ്ട് മനോഹരമായ വാക്യം എഴുതി.'
            },
            pronunciationTip: 'Pronounce "Ka-lam" with balanced emphasis on both syllables.',
            skillType: 'reading'
        }
    },
    {
        id: 'magnifying_glass',
        name: 'Detective Magnifier',
        category: 'accessories',
        description: 'Reveals hidden phonetic clues in every sentence and script',
        xpRequired: 220,
        icon: '🔍',
        previewColor: '#0284C7',
        learning: {
            targetWord: 'Magnifying Glass',
            targetScript: {
                hi: 'आवर्धक लेंस (काँच)',
                te: 'భూతద్దం',
                ta: 'பூதக்கண்ணாடி',
                kn: 'ಭೂತಗನ್ನಡಿ',
                ml: 'ഭൂതക്കണ്ണാടി',
                en: 'Magnifying Glass'
            },
            phonetic: { hi: 'Aavardhak lens', te: 'Bhoothaddamu', ta: 'Bhootha kannaadi', kn: 'Bhootha gannadi', ml: 'Bhootha kannadi', en: 'Magnifier' },
            meaning: {
                en: 'An optical lens that makes small letters, matras, and clues appear larger.',
                te: 'చిన్న అక్షరాలు మరియు క్లూలను పెద్దవిగా చూపించే కటకము.',
                hi: 'छोटे अक्षरों और सुरागों को बड़ा करके देखने वाला काँच का लेंस।',
                ta: 'சிறிய எழுத்துக்களையும் துப்புகளையும் பெரிதாக்கிக் காட்டும் கண்ணாடி.',
                kn: 'ಚಿಕ್ಕ ಅಕ್ಷರಗಳು ಮತ್ತು ಸಾಕ್ಷ್ಯಗಳನ್ನು ದೊಡ್ಡದಾಗಿ ನೋಡಲು ಬಳಸುವ ಗಾಜು.',
                ml: 'ചെറിയ അക്ഷരങ്ങളെ വലുതായി കാണിക്കുന്ന ലെൻസ്.'
            },
            exampleSentence: {
                hi: 'जासूस ने आवर्धक लेंस से रहस्यमयी शब्द पढ़ा।',
                te: 'డిటెక్టివ్ భూతద్దంతో రహస్య పదాన్ని చదివాడు।',
                ta: 'துப்பறிவாளர் பூதக்கண்ணாடியால் மர்மமான வார்த்தையைப் படித்தார்।',
                kn: 'ಪತ್ತೇದಾರಿ ಭೂತಗನ್ನಡಿಯಿಂದ ರಹಸ್ಯ ಪದವನ್ನು ಓದಿದನು।',
                ml: 'ഡിറ്റക്ടീവ് ഭൂതക്കണ്ണാടിയിലൂടെ രഹസ്യ വാക്ക് വായിച്ചു.',
                en: 'The detective read the mysterious word with the magnifying glass.'
            },
            exampleMeaning: {
                en: 'The detective read the mysterious word with the magnifying glass.',
                te: 'డిటెక్టివ్ భూతద్దంతో రహస్య పదాన్ని చదివాడు.',
                hi: 'जासूस ने आवर्धक लेंस से रहस्यमयी शब्द पढ़ा।',
                ta: 'துப்பறிவாளர் பூதக்கண்ணாடியால் மர்மமான வார்த்தையைப் படித்தார்.',
                kn: 'ಪತ್ತೇದಾರಿ ಭೂತಗನ್ನಡಿಯಿಂದ ರಹಸ್ಯ ಪದವನ್ನು ಓದಿದನು.',
                ml: 'ഡിറ്റക്ടീവ് ഭൂതക്കണ്ണാടിയിലൂടെ രഹസ്യ വാക്ക് വായിച്ചു.'
            },
            skillType: 'mystery'
        }
    },

    // ==========================================
    // ✨ 6. AURAS & SPECIAL MOTTO PHRASES
    // ==========================================
    {
        id: 'star_sparkles',
        name: 'Stardust Sparkles',
        category: 'auras',
        description: 'Gently orbiting golden stars and glowing literacy dust',
        xpRequired: 140,
        icon: '🌟',
        previewColor: '#FBBF24',
        learning: {
            targetWord: 'Star / Sparkle',
            targetScript: {
                hi: 'सितारा (तारा)',
                te: 'నక్షత్రం (తార)',
                ta: 'நட்சத்திரம்',
                kn: 'ನಕ್ಷತ್ರ (ತಾರೆ)',
                ml: 'നക്ഷത്രം',
                en: 'Star'
            },
            phonetic: { hi: 'Sitaara / Taara', te: 'Nakshatram', ta: 'Natchathiram', kn: 'Nakshatra', ml: 'Nakshatram', en: 'Star' },
            meaning: {
                en: 'A shining celestial symbol of radiant knowledge and academic success.',
                te: 'జ్ఞానం మరియు విద్యా విజయానికి చిహ్నమైన మెరిసే నక్షత్రం.',
                hi: 'ज्ञान और सीखने की सफलता का चमकता हुआ प्रतीक।',
                ta: 'ஞானத்தையும் கல்வி வெற்றியையும் குறிக்கும் மின்னும் விண்மீன்.',
                kn: 'ಜ್ಞಾನ ಮತ್ತು ಶೈಕ್ಷಣಿಕ ವಿಜಯದ ಸಂಕೇತವಾಗಿ ಹೊಳೆಯುವ ನಕ್ಷತ್ರ.',
                ml: 'ജ്ഞാനത്തിന്റെയും പഠനവിജയത്തിന്റെയും പ്രതീകമായ നക്ഷത്രം.'
            },
            exampleSentence: {
                hi: 'ज्ञान का सितारा हमेशा चमकता रहता है।',
                te: 'జ్ఞాన నక్షత్రం ఎల్లప్పుడూ ప్రకాశిస్తుంది।',
                ta: 'ஞானத்தின் நட்சத்திரம் எப்போதும் ஒளிர்கிறது।',
                kn: 'ಜ್ಞಾನದ ನಕ್ಷತ್ರವು ಯಾವಾಗಲೂ ಹೊಳೆಯುತ್ತದೆ।',
                ml: 'ജ്ഞാനത്തിന്റെ നക്ഷത്രം എപ്പോഴും പ്രകാശിക്കുന്നു.',
                en: 'The star of knowledge shines forever.'
            },
            exampleMeaning: {
                en: 'The star of knowledge shines forever.',
                te: 'జ్ఞాన నక్షత్రం ఎల్లప్పుడూ ప్రకాశిస్తుంది.',
                hi: 'ज्ञान का सितारा हमेशा चमकता रहता है।',
                ta: 'ஞானத்தின் நட்சத்திரம் எப்போதும் ஒளிர்கிறது.',
                kn: 'ಜ್ಞಾನದ ನಕ್ಷತ್ರವು ಯಾವಾಗಲೂ ಹೊಳೆಯುತ್ತದೆ.',
                ml: 'ജ്ഞാനത്തിന്റെ നക്ഷത്രം എപ്പോഴും പ്രകാശിക്കുന്നു.'
            },
            skillType: 'speaking'
        }
    }
];
