import {
    CityStory,
    DetectiveCase,
    GardenPlant,
    MuseumExhibit,
    LingoCityState
} from '../types/lingoCity';

const CITY_STATE_KEY = 'lingopath_lingo_city_state';
const GARDEN_KEY = 'lingopath_lingo_city_garden';
const MUSEUM_KEY = 'lingopath_lingo_city_museum';

const INITIAL_CITY_STATE: LingoCityState = {
    level: 1,
    cityName: 'Lingo Haven',
    storiesCompleted: [],
    casesSolved: [],
    gardenMasteredCount: 2,
    unlockedDecorations: ['welcome_arch', 'fountain', 'theater_lights']
};

export const lingoCityService = {
    getCityState(): LingoCityState {
        try {
            const raw = localStorage.getItem(CITY_STATE_KEY);
            if (raw) return { ...INITIAL_CITY_STATE, ...JSON.parse(raw) };
        } catch (e) {
            console.warn(e);
        }
        return { ...INITIAL_CITY_STATE };
    },

    saveCityState(state: LingoCityState): void {
        try {
            localStorage.setItem(CITY_STATE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn(e);
        }
    },

    // 🎬 STORIES CATALOG
    getStories(targetLanguage: string = 'hi'): CityStory[] {
        // Return rich bilingual educational stories adapted to target language
        if (targetLanguage === 'te') {
            return [
                {
                    id: 'story_letter',
                    title: 'రహస్య లేఖ',
                    subtitle: 'The Mysterious Letter',
                    description: 'A blue envelope is found on the metro bench. Who is waiting at Platform 2?',
                    coverIcon: '✉️',
                    difficulty: 'Beginner',
                    xpReward: 60,
                    estimatedMins: 4,
                    targetLanguage: 'te',
                    scenes: [
                        {
                            sceneNumber: 1,
                            title: 'స్టేషన్‌లో ఆరంభం (At the Station)',
                            illustrationType: 'station',
                            targetDialogue: 'ఉదయం ఎనిమిది గంటలకు లింగోబోట్ రైల్వే స్టేషన్‌కు వచ్చింది.',
                            audioText: 'ఉదయం ఎనిమిది గంటలకు లింగోబోట్ రైల్వే స్టేషన్‌కు వచ్చింది.',
                            words: [
                                { text: 'ఉదయం', romanized: 'Udayam', meaning: 'Morning', isKeyWord: true },
                                { text: 'ఎనిమిది', romanized: 'Enimidi', meaning: 'Eight', isKeyWord: true },
                                { text: 'గంటలకు', romanized: 'Gantalaku', meaning: "O'clock" },
                                { text: 'రైల్వే స్టేషన్‌కు', romanized: 'Railway station-ku', meaning: 'To the railway station' },
                                { text: 'వచ్చింది', romanized: 'Vachindi', meaning: 'Arrived / came', isKeyWord: true }
                            ],
                            comprehensionQuestion: {
                                question: 'What time did LingoBot arrive at the railway station?',
                                options: ['8:00 AM (ఎనిమిది గంటలు)', '10:00 AM (పది గంటలు)', '6:00 PM (సాయంత్రం ఆరు)'],
                                correctIndex: 0,
                                explanation: "'ఎనిమిది' (Enimidi) means 8 in Telugu."
                            },
                            pronunciationPrompt: {
                                sentence: 'ఉదయం ఎనిమిది గంటలకు',
                                romanized: 'Udayam enimidi gantalaku',
                                tip: 'Focus on the clean "u" vowel sound in Udayam.'
                            }
                        },
                        {
                            sceneNumber: 2,
                            title: 'నీలి రంగు లేఖ (The Blue Envelope)',
                            illustrationType: 'park',
                            targetDialogue: 'బెంచీ మీద ఒక అందమైన నీలి రంగు ఉత్తరం కనిపించింది.',
                            audioText: 'బెంచీ మీద ఒక అందమైన నీలి రంగు ఉత్తరం కనిపించింది.',
                            words: [
                                { text: 'బెంచీ', romanized: 'Benchi', meaning: 'Bench' },
                                { text: 'మీద', romanized: 'Meeda', meaning: 'On / upon' },
                                { text: 'అందమైన', romanized: 'Andamaina', meaning: 'Beautiful', isKeyWord: true },
                                { text: 'నీలి రంగు', romanized: 'Neeli rangu', meaning: 'Blue color', isKeyWord: true },
                                { text: 'ఉత్తరం', romanized: 'Uttaram', meaning: 'Letter / Envelope', isKeyWord: true },
                                { text: 'కనిపించింది', romanized: 'Kanipinchindi', meaning: 'Was seen / appeared' }
                            ],
                            choice: {
                                prompt: 'What should LingoBot do with the letter?',
                                options: [
                                    { label: 'లేఖను చదవండి (Read the letter)', nextSceneNumber: 3 },
                                    { label: 'స్టేషన్ మాస్టర్‌కు ఇవ్వండి (Hand to station master)', nextSceneNumber: 3 }
                                ]
                            }
                        },
                        {
                            sceneNumber: 3,
                            title: 'స్నేహితుడి సందేశం (A Friend’s Greeting)',
                            illustrationType: 'cafe',
                            targetDialogue: 'లేఖలో ఇలా రాసి ఉంది: "స్నేహితుడా, లైబ్రరీలో కలుద్దాం!"',
                            audioText: 'లేఖలో ఇలా రాసి ఉంది: స్నేహితుడా, లైబ్రరీలో కలుద్దాం!',
                            words: [
                                { text: 'లేఖలో', romanized: 'Lekhalo', meaning: 'In the letter' },
                                { text: 'ఇలా', romanized: 'Ila', meaning: 'Like this' },
                                { text: 'రాసి ఉంది', romanized: 'Raasi undi', meaning: 'It is written' },
                                { text: 'స్నేహితుడా', romanized: 'Snehithuda', meaning: 'Friend!', isKeyWord: true },
                                { text: 'లైబ్రరీలో', romanized: 'Library-lo', meaning: 'In the library' },
                                { text: 'కలుద్దాం', romanized: 'Kaluddam', meaning: "Let's meet", isKeyWord: true }
                            ]
                        }
                    ]
                }
            ];
        }

        // Default: Hindi (and universal multilingual fallback)
        return [
            {
                id: 'story_letter',
                title: 'रहस्यमयी पत्र',
                subtitle: 'The Mysterious Letter',
                description: 'A blue envelope is discovered on the morning metro bench. Who is waiting at Platform 2?',
                coverIcon: '✉️',
                difficulty: 'Beginner',
                xpReward: 60,
                estimatedMins: 4,
                targetLanguage: 'hi',
                scenes: [
                    {
                        sceneNumber: 1,
                        title: 'स्टेशन पर सुबह (Morning at the Station)',
                        illustrationType: 'station',
                        targetDialogue: 'सुबह आठ बजे लिंगोबॉट रेलवे स्टेशन पहुँचा।',
                        audioText: 'सुबह आठ बजे लिंगोबॉट रेलवे स्टेशन पहुँचा।',
                        words: [
                            { text: 'सुबह', romanized: 'Subah', meaning: 'Morning', isKeyWord: true },
                            { text: 'आठ', romanized: 'Aath', meaning: 'Eight', isKeyWord: true },
                            { text: 'बजे', romanized: 'Baje', meaning: "O'clock" },
                            { text: 'रेलवे स्टेशन', romanized: 'Railway station', meaning: 'Railway station' },
                            { text: 'पहुँचा', romanized: 'Pahuncha', meaning: 'Arrived / reached', isKeyWord: true }
                        ],
                        comprehensionQuestion: {
                            question: 'At what time did LingoBot reach the station?',
                            options: ['8:00 AM (सुबह आठ बजे)', '10:00 AM (सुबह दस बजे)', '4:00 PM (शाम चार बजे)'],
                            correctIndex: 0,
                            explanation: "'आठ बजे' (Aath baje) means 8 o'clock."
                        },
                        pronunciationPrompt: {
                            sentence: 'सुबह आठ बजे',
                            romanized: 'Subah aath baje',
                            tip: 'Keep the "h" softly voiced at the end of Subah.'
                        }
                    },
                    {
                        sceneNumber: 2,
                        title: 'नीला लिफ़ाफ़ा (The Blue Envelope)',
                        illustrationType: 'park',
                        targetDialogue: 'बेंच पर एक सुंदर नीला लिफ़ाफ़ा रखा हुआ था।',
                        audioText: 'बेंच पर एक सुंदर नीला लिफ़ाफ़ा रखा हुआ था।',
                        words: [
                            { text: 'बेंच', romanized: 'Bench', meaning: 'Bench' },
                            { text: 'पर', romanized: 'Par', meaning: 'On / upon' },
                            { text: 'सुंदर', romanized: 'Sundar', meaning: 'Beautiful', isKeyWord: true },
                            { text: 'नीला', romanized: 'Neela', meaning: 'Blue color', isKeyWord: true },
                            { text: 'लिफ़ाफ़ा', romanized: 'Lifaafa', meaning: 'Envelope / Letter', isKeyWord: true },
                            { text: 'रखा हुआ था', romanized: 'Rakha hua tha', meaning: 'Was kept / placed' }
                        ],
                        choice: {
                            prompt: 'What should LingoBot do with the envelope?',
                            options: [
                                { label: 'पत्र को खोलकर पढ़ें (Open and read the letter)', nextSceneNumber: 3 },
                                { label: 'स्टेशन मास्टर को दें (Hand over to station master)', nextSceneNumber: 3 }
                            ]
                        }
                    },
                    {
                        sceneNumber: 3,
                        title: 'दोस्त का संदेश (A Friend’s Secret Note)',
                        illustrationType: 'cafe',
                        targetDialogue: 'पत्र में लिखा था: "प्रिय मित्र, आज दोपहर पुस्तकालय में मिलते हैं!"',
                        audioText: 'पत्र में लिखा था: प्रिय मित्र, आज दोपहर पुस्तकालय में मिलते हैं!',
                        words: [
                            { text: 'पत्र', romanized: 'Patra', meaning: 'Letter' },
                            { text: 'में', romanized: 'Mein', meaning: 'In / inside' },
                            { text: 'लिखा था', romanized: 'Likha tha', meaning: 'Was written' },
                            { text: 'प्रिय', romanized: 'Priya', meaning: 'Dear', isKeyWord: true },
                            { text: 'मित्र', romanized: 'Mitra', meaning: 'Friend', isKeyWord: true },
                            { text: 'आज', romanized: 'Aaj', meaning: 'Today', isKeyWord: true },
                            { text: 'दोपहर', romanized: 'Dopahar', meaning: 'Afternoon' },
                            { text: 'पुस्तकालय', romanized: 'Pustakalaya', meaning: 'Library', isKeyWord: true },
                            { text: 'मिलते हैं', romanized: 'Milte hain', meaning: "Let's meet / we meet" }
                        ],
                        comprehensionQuestion: {
                            question: 'Where does the letter invite the friend to meet?',
                            options: ['At the Library (पुस्तकालय में)', 'At the Market (बाज़ार में)', 'At the Airport (हवाई अड्डे पर)'],
                            correctIndex: 0,
                            explanation: "'पुस्तकालय' (Pustakalaya) is the word for Library."
                        }
                    }
                ]
            },
            {
                id: 'story_backpack',
                title: 'खोया हुआ बस्ता',
                subtitle: 'The Lost Backpack',
                description: 'A student left their yellow backpack at the cafe. Follow the clues to return it before class starts!',
                coverIcon: '🎒',
                difficulty: 'Beginner',
                xpReward: 65,
                estimatedMins: 5,
                targetLanguage: 'hi',
                scenes: [
                    {
                        sceneNumber: 1,
                        title: 'चाय की दुकान पर (At the Tea Shop)',
                        illustrationType: 'cafe',
                        targetDialogue: 'दुकानदार ने कहा: "यह पीला बस्ता मेज़ के नीचे छूट गया है।"',
                        audioText: 'दुकानदार ने कहा: यह पीला बस्ता मेज़ के नीचे छूट गया है।',
                        words: [
                            { text: 'दुकानदार', romanized: 'Dukaandar', meaning: 'Shopkeeper', isKeyWord: true },
                            { text: 'ने कहा', romanized: 'Ne kaha', meaning: 'Said' },
                            { text: 'पीला', romanized: 'Peela', meaning: 'Yellow color', isKeyWord: true },
                            { text: 'बस्ता', romanized: 'Basta', meaning: 'Backpack / Bag', isKeyWord: true },
                            { text: 'मेज़', romanized: 'Mez', meaning: 'Table' },
                            { text: 'नीचे', romanized: 'Neeche', meaning: 'Under / below', isKeyWord: true }
                        ],
                        comprehensionQuestion: {
                            question: 'What color was the backpack?',
                            options: ['Yellow (पीला)', 'Red (लाल)', 'Green (हरा)'],
                            correctIndex: 0,
                            explanation: "'पीला' (Peela) means yellow."
                        }
                    },
                    {
                        sceneNumber: 2,
                        title: 'नाम की पर्ची (The Name Tag)',
                        illustrationType: 'park',
                        targetDialogue: 'बस्ते पर एक छोटी पर्ची थी: "कक्षा 5, भाषा विद्यालय।"',
                        audioText: 'बस्ते पर एक छोटी पर्ची थी: कक्षा पाँच, भाषा विद्यालय।',
                        words: [
                            { text: 'छोटी', romanized: 'Chhoti', meaning: 'Small' },
                            { text: 'पर्ची', romanized: 'Parchi', meaning: 'Slip / Tag', isKeyWord: true },
                            { text: 'कक्षा', romanized: 'Kaksha', meaning: 'Grade / Class', isKeyWord: true },
                            { text: 'पाँच', romanized: 'Paanch', meaning: 'Five', isKeyWord: true },
                            { text: 'विद्यालय', romanized: 'Vidyalaya', meaning: 'School', isKeyWord: true }
                        ]
                    }
                ]
            },
            {
                id: 'story_rainy',
                title: 'बारिश की एक सुबह',
                subtitle: 'A Rainy Morning',
                description: 'Sudden rain pours over Lingo City! Neighbors share colorful umbrellas and hot tea.',
                coverIcon: '🌧️',
                difficulty: 'Intermediate',
                xpReward: 70,
                estimatedMins: 4,
                targetLanguage: 'hi',
                scenes: [
                    {
                        sceneNumber: 1,
                        title: 'बादल और बारिश (Clouds and Rain)',
                        illustrationType: 'park',
                        targetDialogue: 'आसमान में काले बादल छाए और तेज़ बारिश शुरू हो गई।',
                        audioText: 'आसमान में काले बादल छाए और तेज़ बारिश शुरू हो गई।',
                        words: [
                            { text: 'आसमान', romanized: 'Aasman', meaning: 'Sky', isKeyWord: true },
                            { text: 'काले बादल', romanized: 'Kaale baadal', meaning: 'Dark clouds', isKeyWord: true },
                            { text: 'तेज़', romanized: 'Tez', meaning: 'Heavy / fast', isKeyWord: true },
                            { text: 'बारिश', romanized: 'Baarish', meaning: 'Rain', isKeyWord: true },
                            { text: 'शुरू', romanized: 'Shuru', meaning: 'Started / begin' }
                        ]
                    }
                ]
            }
        ];
    },

    // 🕵️ DETECTIVE CASES CATALOG
    getDetectiveCases(targetLanguage: string = 'hi'): DetectiveCase[] {
        return [
            {
                id: 'case_01',
                caseNumber: 'CASE #01',
                title: 'The Metro Platform Mystery',
                location: 'Central Metro Station — Platform 2',
                mysteryDescription: 'A passenger left a locked briefcase on the train. To return it to the rightful traveler, analyze the four target-language clues found on the bench.',
                solvedXp: 80,
                unlockedReward: 'Detective Fedora & Trench Coat',
                clues: [
                    {
                        id: 'clue_note',
                        type: 'written',
                        title: 'Handwritten Schedule Note',
                        icon: '📄',
                        targetContent: 'गाड़ी संख्या 12450 प्लेटफार्म 2 पर शाम पाँच बजे आएगी।',
                        romanized: 'Gaadi sankhya 12450 platform 2 par shaam paanch baje aayegi.',
                        meaning: 'Train number 12450 will arrive at platform 2 at five in the evening.',
                        contextNote: 'Mentions train number 12450 arriving at 5:00 PM.',
                        keyVocabulary: [
                            { word: 'गाड़ी (Gaadi)', phonetic: 'Gaadi', meaning: 'Train / Vehicle' },
                            { word: 'पाँच बजे (Paanch baje)', phonetic: 'Paanch baje', meaning: '5 o’clock' },
                            { word: 'शाम (Shaam)', phonetic: 'Shaam', meaning: 'Evening' }
                        ]
                    },
                    {
                        id: 'clue_audio',
                        type: 'audio',
                        title: 'Station Audio Announcement',
                        icon: '🎧',
                        targetContent: 'यात्री कृपया ध्यान दें, जयपुर जाने वाली गाड़ी तैयार है।',
                        romanized: 'Yatri kripya dhyan dein, Jaipur jaane wali gaadi taiyaar hai.',
                        meaning: 'Attention passengers, the train going to Jaipur is ready on the platform.',
                        contextNote: 'Identifies the destination as the historic city of Jaipur.',
                        keyVocabulary: [
                            { word: 'यात्री (Yatri)', phonetic: 'Yatri', meaning: 'Passenger' },
                            { word: 'जाने वाली (Jaane wali)', phonetic: 'Jaane wali', meaning: 'Departing / heading to' },
                            { word: 'तैयार (Taiyaar)', phonetic: 'Taiyaar', meaning: 'Ready' }
                        ]
                    },
                    {
                        id: 'clue_ticket',
                        type: 'visual',
                        title: 'Used Ticket Stub',
                        icon: '🖼️',
                        targetContent: 'टिकट: दिल्ली से जयपुर — कोच B3 — सीट 24',
                        romanized: 'Ticket: Delhi se Jaipur — Coach B3 — Seat 24',
                        meaning: 'Ticket: Delhi to Jaipur — Coach B3 — Seat 24.',
                        contextNote: 'Specifies Coach B3 and Seat 24 for the passenger.',
                        keyVocabulary: [
                            { word: 'से (Se)', phonetic: 'Se', meaning: 'From' },
                            { word: 'सीट (Seat)', phonetic: 'Seat', meaning: 'Seat number' }
                        ]
                    },
                    {
                        id: 'clue_sms',
                        type: 'message',
                        title: 'Saved Message on Device',
                        icon: '💬',
                        targetContent: '"दादाजी, मैं जयपुर पहुँचकर आपको फ़ोन करूँगा।"',
                        romanized: 'Dadaji, main Jaipur pahunchkar aapko phone karunga.',
                        meaning: '"Grandfather, I will call you after reaching Jaipur."',
                        contextNote: 'Reveals the passenger is traveling to visit their grandfather.',
                        keyVocabulary: [
                            { word: 'दादाजी (Dadaji)', phonetic: 'Dadaji', meaning: 'Grandfather' },
                            { word: 'पहुँचकर (Pahunchkar)', phonetic: 'Pahunchkar', meaning: 'After arriving' }
                        ]
                    }
                ],
                deductionQuestion: 'Connecting the clues: Which train and seat should LingoBot inspect to find the traveler?',
                deductionOptions: [
                    {
                        id: 'opt_1',
                        text: 'Train 12450 to Jaipur, Coach B3, Seat 24 at 5:00 PM',
                        isCorrect: true,
                        feedback: 'Case Solved! All clues (time 5:00 PM, destination Jaipur, coach B3, seat 24) match perfectly!'
                    },
                    {
                        id: 'opt_2',
                        text: 'Morning Express to Mumbai, Coach A1, Seat 10',
                        isCorrect: false,
                        feedback: 'Incorrect destination and timing. Review the train ticket and audio announcement.'
                    },
                    {
                        id: 'opt_3',
                        text: 'Local metro shuttle heading to Kolkata',
                        isCorrect: false,
                        feedback: 'The announcement clearly stated Jaipur (जयपुर).'
                    }
                ]
            },
            {
                id: 'case_02',
                caseNumber: 'CASE #02',
                title: 'The Secret Recipe in the Sweet Shop',
                location: 'Lingo City Central Bazaar',
                mysteryDescription: 'The baker misplaced the secret proportion of cardamom and saffron for the royal dessert. Decode the baker’s handwritten ledger!',
                solvedXp: 90,
                unlockedReward: 'Chef Apron & Golden Spoon',
                clues: [
                    {
                        id: 'clue_recipe_note',
                        type: 'written',
                        title: 'Old Recipe Ledger',
                        icon: '📄',
                        targetContent: 'दो चम्मच इलायची पाउडर और एक चुटकी केसर मिलाइए।',
                        romanized: 'Do chammach elaichi powder aur ek chutki kesar milaiye.',
                        meaning: 'Mix two spoonfuls of cardamom powder and one pinch of saffron.',
                        contextNote: 'Lists exact measurements: 2 spoons cardamom, 1 pinch saffron.',
                        keyVocabulary: [
                            { word: 'दो चम्मच (Do chammach)', phonetic: 'Do chammach', meaning: 'Two spoons' },
                            { word: 'इलायची (Elaichi)', phonetic: 'Elaichi', meaning: 'Cardamom' },
                            { word: 'केसर (Kesar)', phonetic: 'Kesar', meaning: 'Saffron' }
                        ]
                    }
                ],
                deductionQuestion: 'What is the secret spice ratio needed for the royal sweet?',
                deductionOptions: [
                    {
                        id: 'opt_1',
                        text: '2 spoons Cardamom (इलायची) + 1 pinch Saffron (केसर)',
                        isCorrect: true,
                        feedback: 'Case Solved! You accurately decoded the traditional culinary measurements.'
                    },
                    {
                        id: 'opt_2',
                        text: '5 cups sugar and 2 cloves',
                        isCorrect: false,
                        feedback: 'Check the ledger line for इलायची (Cardamom) and केसर (Saffron).'
                    }
                ]
            }
        ];
    },

    // 🌱 LANGUAGE GARDEN
    getGardenPlants(): GardenPlant[] {
        try {
            const raw = localStorage.getItem(GARDEN_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn(e);
        }

        // Initial default plants
        const defaults: GardenPlant[] = [
            {
                id: 'plant_subah',
                word: 'सुबह',
                phonetic: 'Subah',
                meaning: 'Morning',
                exampleSentence: 'सुबह की ताज़ा हवा सेहत के लिए अच्छी है।',
                category: 'nature',
                stage: 'tree',
                waterCount: 4,
                maxWater: 4,
                xpEarned: 40
            },
            {
                id: 'plant_mitra',
                word: 'मित्र',
                phonetic: 'Mitra',
                meaning: 'Friend',
                exampleSentence: 'सच्चा मित्र हमेशा साथ निभाता है।',
                category: 'people',
                stage: 'flower',
                waterCount: 3,
                maxWater: 4,
                xpEarned: 30
            },
            {
                id: 'plant_pustak',
                word: 'पुस्तकालय',
                phonetic: 'Pustakalaya',
                meaning: 'Library',
                exampleSentence: 'पुस्तकालय में शांति बनाए रखें।',
                category: 'travel',
                stage: 'sprout',
                waterCount: 2,
                maxWater: 4,
                xpEarned: 20
            },
            {
                id: 'plant_sundar',
                word: 'सुंदर',
                phonetic: 'Sundar',
                meaning: 'Beautiful',
                exampleSentence: 'यह बगीचा बहुत सुंदर है।',
                category: 'nature',
                stage: 'flower',
                waterCount: 3,
                maxWater: 4,
                xpEarned: 30
            },
            {
                id: 'plant_pani',
                word: 'पानी',
                phonetic: 'Paani',
                meaning: 'Water',
                exampleSentence: 'रोज़ पर्याप्त पानी पीना चाहिए।',
                category: 'nature',
                stage: 'seed',
                waterCount: 1,
                maxWater: 4,
                xpEarned: 10
            },
            {
                id: 'plant_namaste',
                word: 'नमस्ते',
                phonetic: 'Namaste',
                meaning: 'Greetings / Hello',
                exampleSentence: 'नमस्ते, आपका दिन शुभ हो।',
                category: 'people',
                stage: 'tree',
                waterCount: 4,
                maxWater: 4,
                xpEarned: 40
            }
        ];
        this.saveGardenPlants(defaults);
        return defaults;
    },

    saveGardenPlants(plants: GardenPlant[]): void {
        try {
            localStorage.setItem(GARDEN_KEY, JSON.stringify(plants));
        } catch (e) {
            console.warn(e);
        }
    },

    waterPlant(plantId: string): { plant: GardenPlant; leveledUp: boolean; xpEarned: number } {
        const plants = this.getGardenPlants();
        const plant = plants.find(p => p.id === plantId);
        if (!plant) throw new Error('Plant not found');

        const prevStage = plant.stage;
        plant.waterCount = Math.min(plant.maxWater, plant.waterCount + 1);
        plant.lastWatered = new Date().toISOString();

        if (plant.waterCount >= 4) plant.stage = 'tree';
        else if (plant.waterCount >= 3) plant.stage = 'flower';
        else if (plant.waterCount >= 2) plant.stage = 'sprout';
        else plant.stage = 'seed';

        const leveledUp = plant.stage !== prevStage;
        const xpEarned = leveledUp ? 20 : 5;
        plant.xpEarned += xpEarned;

        this.saveGardenPlants(plants);

        // Update city state mastered count
        const cityState = this.getCityState();
        cityState.gardenMasteredCount = plants.filter(p => p.stage === 'tree').length;
        this.saveCityState(cityState);

        return { plant, leveledUp, xpEarned };
    },

    addWordToGarden(word: string, phonetic: string, meaning: string, example: string = ''): void {
        const plants = this.getGardenPlants();
        if (plants.some(p => p.word.toLowerCase() === word.toLowerCase())) return;

        const newPlant: GardenPlant = {
            id: `plant_${Date.now()}`,
            word,
            phonetic,
            meaning,
            exampleSentence: example || `${word} is a valuable word in your vocabulary.`,
            category: 'nature',
            stage: 'seed',
            waterCount: 1,
            maxWater: 4,
            xpEarned: 10
        };
        plants.push(newPlant);
        this.saveGardenPlants(plants);
    },

    // 🏛️ LANGUAGE MUSEUM
    getMuseumExhibits(): MuseumExhibit[] {
        try {
            const raw = localStorage.getItem(MUSEUM_KEY);
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.warn(e);
        }

        const defaults: MuseumExhibit[] = [
            {
                id: 'exhibit_letter',
                category: 'story',
                title: 'The Mysterious Letter',
                subtitle: 'First completed visual interactive story',
                icon: '📜',
                dateUnlocked: 'Recently Mastered',
                badge: 'Storyteller Badge'
            },
            {
                id: 'exhibit_case1',
                category: 'detective',
                title: 'Metro Platform 2 Case',
                subtitle: 'Case #01 solved with 4 multilingual clues',
                icon: '🕵️',
                dateUnlocked: 'Case Closed',
                badge: 'Silver Magnifier'
            },
            {
                id: 'exhibit_devanagari',
                category: 'script',
                title: 'Devanagari Vowels & Matras',
                subtitle: 'Mastered 11 vowels and nasal conjuncts',
                icon: '🔤',
                scriptText: 'अ आ इ ई उ ऊ ऋ ए ऐ ओ औ',
                meaning: 'Core script foundation mastered with 96% accuracy',
                dateUnlocked: 'Foundation Milestone'
            },
            {
                id: 'exhibit_audio',
                category: 'sound',
                title: 'Native Speaker Phoneme Archive',
                subtitle: 'Audio recordings of marketplace and station announcements',
                icon: '🎧',
                meaning: 'Acoustic recordings captured during real-world simulation',
                dateUnlocked: 'Audio Collection'
            }
        ];
        this.saveMuseumExhibits(defaults);
        return defaults;
    },

    saveMuseumExhibits(exhibits: MuseumExhibit[]): void {
        try {
            localStorage.setItem(MUSEUM_KEY, JSON.stringify(exhibits));
        } catch (e) {
            console.warn(e);
        }
    },

    recordStoryCompleted(storyId: string, title: string): void {
        const cityState = this.getCityState();
        if (!cityState.storiesCompleted.includes(storyId)) {
            cityState.storiesCompleted.push(storyId);
            this.saveCityState(cityState);
        }

        const exhibits = this.getMuseumExhibits();
        if (!exhibits.some(e => e.id === `exhibit_${storyId}`)) {
            exhibits.unshift({
                id: `exhibit_${storyId}`,
                category: 'story',
                title,
                subtitle: 'Celebrated theater production completed',
                icon: '🎬',
                dateUnlocked: new Date().toLocaleDateString(),
                badge: 'Theater Ribbon'
            });
            this.saveMuseumExhibits(exhibits);
        }
    },

    recordCaseSolved(caseId: string, caseTitle: string): void {
        const cityState = this.getCityState();
        if (!cityState.casesSolved.includes(caseId)) {
            cityState.casesSolved.push(caseId);
            this.saveCityState(cityState);
        }

        const exhibits = this.getMuseumExhibits();
        if (!exhibits.some(e => e.id === `exhibit_${caseId}`)) {
            exhibits.unshift({
                id: `exhibit_${caseId}`,
                category: 'detective',
                title: caseTitle,
                subtitle: 'Solved by connecting language evidence',
                icon: '🏆',
                dateUnlocked: new Date().toLocaleDateString(),
                badge: 'Detective Star'
            });
            this.saveMuseumExhibits(exhibits);
        }
    }
};
