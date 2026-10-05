import { LearningPathUnit, LessonNode } from '../types';

export interface CurriculumStage {
    stageNumber: number;
    title: string;
    description: string;
    targetLangCode: string;
    comfortLangCode: string;
    colorTheme: 'brand' | 'teal' | 'purple' | 'amber';
    nodes: LessonNode[];
}

// Stage generator per target language & learner diagnostic level
export const curriculumService = {
    generateCurriculum(
        targetLangCode: string = 'hi',
        comfortLangCode: string = 'en',
        diagnosticLevel: 'beginner' | 'intermediate' | 'advanced' = 'beginner',
        completedLessons: string[] = ['node_1_1']
    ): LearningPathUnit[] {

        // Determine starting stage based on diagnostic level & completed lessons
        let currentSectionNumber = 1;
        if (diagnosticLevel === 'intermediate') currentSectionNumber = 2;
        if (diagnosticLevel === 'advanced') currentSectionNumber = 3;

        // Content repository per target language
        const languageData: Record<string, {
            langName: string;
            alphabets: { symbol: string; sound: string; example: string; meaning: string }[];
            words: { word: string; phonetics: string; meaning: string }[];
            sentences: { targetText: string; phonetics: string; meaning: string }[];
            practical: { targetText: string; phonetics: string; meaning: string }[];
            fluency: { targetText: string; phonetics: string; meaning: string }[];
            mastery: { targetText: string; phonetics: string; meaning: string }[];
        }> = {
            hi: {
                langName: 'Hindi',
                alphabets: [
                    { symbol: 'अ', sound: 'a', example: 'अनार', meaning: 'Pomegranate' },
                    { symbol: 'आ', sound: 'aa', example: 'आम', meaning: 'Mango' },
                    { symbol: 'इ', sound: 'i', example: 'इमली', meaning: 'Tamarind' },
                    { symbol: 'ई', sound: 'ee', example: 'ईख', meaning: 'Sugarcane' },
                    { symbol: 'क', sound: 'ka', example: 'कमल', meaning: 'Lotus' },
                    { symbol: 'ख', sound: 'kha', example: 'खरगोश', meaning: 'Rabbit' },
                ],
                words: [
                    { word: 'नमस्ते', phonetics: 'Namaste', meaning: 'Hello / Greetings' },
                    { word: 'पानी', phonetics: 'Paani', meaning: 'Water' },
                    { word: 'किताब', phonetics: 'Kitaab', meaning: 'Book' },
                    { word: 'घर', phonetics: 'Ghar', meaning: 'Home' },
                    { word: 'खाना', phonetics: 'Khaana', meaning: 'Food' },
                    { word: 'मित्र', phonetics: 'Mitr', meaning: 'Friend' },
                ],
                sentences: [
                    { targetText: 'यह एक किताब है।', phonetics: 'Yeh ek kitaab hai.', meaning: 'This is a book.' },
                    { targetText: 'मुझे पानी चाहिए।', phonetics: 'Mujhe paani chahiye.', meaning: 'I need water.' },
                    { targetText: 'आप कैसे हैं?', phonetics: 'Aap kaise hain?', meaning: 'How are you?' },
                    { targetText: 'मैं ठीक हूँ।', phonetics: 'Main theek hoon.', meaning: 'I am fine.' },
                ],
                practical: [
                    { targetText: 'रेलवे स्टेशन कहाँ है?', phonetics: 'Railway station kahan hai?', meaning: 'Where is the railway station?' },
                    { targetText: 'यह कितने का है?', phonetics: 'Yeh kitne ka hai?', meaning: 'How much does this cost?' },
                    { targetText: 'कृपया मेरी मदद कीजिए।', phonetics: 'Kripya meri madad kijiye.', meaning: 'Please help me.' },
                ],
                fluency: [
                    { targetText: 'मुझे नई भाषाएं सीखना बहुत पसंद है।', phonetics: 'Mujhe nayi bhashayein seekhna bahut pasand hai.', meaning: 'I really enjoy learning new languages.' },
                    { targetText: 'कल का मौसम बहुत सुहावना था।', phonetics: 'Kal ka mausam bahut suhavana tha.', meaning: 'Yesterday\'s weather was very pleasant.' },
                ],
                mastery: [
                    { targetText: 'सांस्कृतिक विविधता हमारे समाज की सबसे बड़ी शक्ति है।', phonetics: 'Sanskritik vividhta hamare samaj ki sabse badi shakti hai.', meaning: 'Cultural diversity is the greatest strength of our society.' },
                    { targetText: 'आधिकारिक पत्राचार में शिष्टता आवश्यक है।', phonetics: 'Aadhikarik patrachar mein shishtata aavashyak hai.', meaning: 'Politeness is essential in official correspondence.' },
                ]
            },
            en: {
                langName: 'English',
                alphabets: [
                    { symbol: 'A', sound: 'ay', example: 'Apple', meaning: 'Fruit' },
                    { symbol: 'B', sound: 'bee', example: 'Book', meaning: 'Object' },
                    { symbol: 'C', sound: 'see', example: 'Cat', meaning: 'Animal' },
                    { symbol: 'D', sound: 'dee', example: 'Dog', meaning: 'Animal' },
                ],
                words: [
                    { word: 'Hello', phonetics: 'heh-loh', meaning: 'Greeting' },
                    { word: 'Water', phonetics: 'wah-ter', meaning: 'Liquid' },
                    { word: 'Book', phonetics: 'buuk', meaning: 'Reading material' },
                    { word: 'Friend', phonetics: 'frend', meaning: 'Companion' },
                ],
                sentences: [
                    { targetText: 'This is a book.', phonetics: 'dis iz a buuk', meaning: 'Describing an object' },
                    { targetText: 'Good morning, teacher.', phonetics: 'gud mor-ning tee-cher', meaning: 'Morning greeting' },
                ],
                practical: [
                    { targetText: 'Where is the metro station?', phonetics: 'wair iz theh meh-tro stay-shun', meaning: 'Transit inquiry' },
                    { targetText: 'Could you please help me?', phonetics: 'kud yoo pleez help mee', meaning: 'Requesting help' },
                ],
                fluency: [
                    { targetText: 'I would like to share my perspective on this topic.', phonetics: 'eye wud like too shair', meaning: 'Expressing viewpoint' },
                ],
                mastery: [
                    { targetText: 'Effective leadership requires clear and empathetic communication.', phonetics: 'ee-fek-tiv lee-der-ship', meaning: 'Professional discourse' },
                ]
            },
            te: {
                langName: 'Telugu',
                alphabets: [
                    { symbol: 'అ', sound: 'a', example: 'అమ్మ', meaning: 'Mother' },
                    { symbol: 'ఆ', sound: 'aa', example: 'ఆవు', meaning: 'Cow' },
                    { symbol: 'ఇ', sound: 'i', example: 'ఇల్లు', meaning: 'House' },
                    { symbol: 'క', sound: 'ka', example: 'కలము', meaning: 'Pen' },
                ],
                words: [
                    { word: 'శుభోదయం', phonetics: 'Shubhodhayam', meaning: 'Good Morning' },
                    { word: 'మంచిది', phonetics: 'Manchidi', meaning: 'Good' },
                    { word: 'నీళ్ళు', phonetics: 'Neellu', meaning: 'Water' },
                    { word: 'పుస్తకం', phonetics: 'Pustakam', meaning: 'Book' },
                ],
                sentences: [
                    { targetText: 'ఇది ఒక పుస్తకం.', phonetics: 'Idi oka pustakam.', meaning: 'This is a book.' },
                    { targetText: 'మీరు ఎలా ఉన్నారు?', phonetics: 'Meeru ela unnaaru?', meaning: 'How are you?' },
                ],
                practical: [
                    { targetText: 'రైల్వే స్టేషన్ ఎక్కడ ఉంది?', phonetics: 'Railway station ekkada undi?', meaning: 'Where is the railway station?' },
                    { targetText: 'దీని ధర ఎంత?', phonetics: 'Deeni dhara entha?', meaning: 'How much does this cost?' },
                ],
                fluency: [
                    { targetText: 'నాకు కొత్త విషయాలు నేర్చుకోవడం చాలా ఇష్టం.', phonetics: 'Naaku kottha vishayalu...', meaning: 'I like learning new things.' },
                ],
                mastery: [
                    { targetText: 'సమాజ ప్రగతికి విద్యావంతుల సహకారం ఎంతో అవసరం.', phonetics: 'Samaja pragatiki...', meaning: 'Educated citizens\' cooperation is vital.' },
                ]
            },
            ta: {
                langName: 'Tamil',
                alphabets: [
                    { symbol: 'அ', sound: 'a', example: 'அம்மா', meaning: 'Mother' },
                    { symbol: 'ஆ', sound: 'aa', example: 'ஆடு', meaning: 'Goat' },
                    { symbol: 'இ', sound: 'i', example: 'இலை', meaning: 'Leaf' },
                ],
                words: [
                    { word: 'வணக்கம்', phonetics: 'Vanakkam', meaning: 'Greetings / Hello' },
                    { word: 'தண்ணீர்', phonetics: 'Thanneer', meaning: 'Water' },
                    { word: 'புத்தகம்', phonetics: 'Puthagam', meaning: 'Book' },
                ],
                sentences: [
                    { targetText: 'இது ஒரு புத்தகம்.', phonetics: 'Ithu oru puthagam.', meaning: 'This is a book.' },
                    { targetText: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', phonetics: 'Neengal eppadi irukkeergal?', meaning: 'How are you?' },
                ],
                practical: [
                    { targetText: 'பேருந்து நிலையம் எங்கே உள்ளது?', phonetics: 'Perundhu nilayam enge ullathu?', meaning: 'Where is the bus stand?' },
                ],
                fluency: [
                    { targetText: 'மொழி கற்றல் வாழ்க்கைக்கு புதிய கதவுகளைத் திறக்கிறது.', phonetics: 'Mozhi katral...', meaning: 'Language learning opens new doors in life.' },
                ],
                mastery: [
                    { targetText: 'தமிழின் தொன்மை மற்றும் பண்பாட்டு வளம் உலகப்புகழ் பெற்றது.', phonetics: 'Thamizhin thonmai...', meaning: 'Tamil\'s antiquity is globally renowned.' },
                ]
            },
            kn: {
                langName: 'Kannada',
                alphabets: [
                    { symbol: 'ಅ', sound: 'a', example: 'ಅರಸ', meaning: 'King' },
                    { symbol: 'ಆ', sound: 'aa', example: 'ಆನೆ', meaning: 'Elephant' },
                ],
                words: [
                    { word: 'ನಮಸ್ಕಾರ', phonetics: 'Namaskara', meaning: 'Greetings' },
                    { word: 'ನೀರು', phonetics: 'Neeru', meaning: 'Water' },
                ],
                sentences: [
                    { targetText: 'ಇದು ಒಂದು ಪುಸ್ತಕ.', phonetics: 'Idu ondu pustaka.', meaning: 'This is a book.' },
                ],
                practical: [
                    { targetText: 'ಬಸ್ ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?', phonetics: 'Bus nildana ellide?', meaning: 'Where is the bus stand?' },
                ],
                fluency: [
                    { targetText: 'ಕನ್ನಡ ಕಲಿಯುವುದು ನನಗೆ ತುಂಬಾ ಸಂತೋಷ ತರುತ್ತದೆ.', phonetics: 'Kannada kaliyuvudu...', meaning: 'Learning Kannada brings me great joy.' },
                ],
                mastery: [
                    { targetText: 'ವೃತ್ತಿಪರ ಸಂವಹನದಲ್ಲಿ ನಿಖರತೆ ಅತ್ಯಂತ ಮಹತ್ವದ್ದು.', phonetics: 'Vruttipara samvahanadalli...', meaning: 'Accuracy is paramount in professional communication.' },
                ]
            },
            ml: {
                langName: 'Malayalam',
                alphabets: [
                    { symbol: 'അ', sound: 'a', example: 'അമ്മ', meaning: 'Mother' },
                    { symbol: 'ആ', sound: 'aa', example: 'ആന', meaning: 'Elephant' },
                ],
                words: [
                    { word: 'നമസ്കാരം', phonetics: 'Namaskaram', meaning: 'Greetings' },
                    { word: 'വെള്ളം', phonetics: 'Vellam', meaning: 'Water' },
                ],
                sentences: [
                    { targetText: 'ഇത് ഒരു പുസ്തകമാണ്.', phonetics: 'Ithu oru pusthakamaan.', meaning: 'This is a book.' },
                ],
                practical: [
                    { targetText: 'റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?', phonetics: 'Railway station evideyanu?', meaning: 'Where is the railway station?' },
                ],
                fluency: [
                    { targetText: 'ഭാഷാ പഠനം പുതിയ സംസ്കാരങ്ങളെ മനസ്സിലാക്കാൻ സഹായിക്കുന്നു.', phonetics: 'Bhasha padanam...', meaning: 'Language learning helps understand cultures.' },
                ],
                mastery: [
                    { targetText: 'സാംസ്കാരിക പൈതൃകത്തിന്റെ സംരക്ഷണം ഓരോ പൗരന്റെയും കടമയാണ്.', phonetics: 'Samskarika paithrukathinte...', meaning: 'Preserving cultural heritage is every citizen\'s duty.' },
                ]
            }
        };

        const currentLang = languageData[targetLangCode] || languageData['hi'];

        // Helper to check if node completed
        const isDone = (id: string) => completedLessons.includes(id);

        // ==========================================
        // SECTION 1: FOUNDATIONS & SCRIPT
        // ==========================================
        const sec1Nodes: LessonNode[] = [
            {
                id: 'node_1_1',
                title: `Alphabet & Characters (${currentLang.alphabets[0]?.symbol} & ${currentLang.alphabets[1]?.symbol})`,
                subtitle: `Listen and recognize foundational ${currentLang.langName} letters and vowel shapes`,
                node_type: 'reading',
                order: 1,
                xp_reward: 50,
                status: isDone('node_1_1') ? 'completed' : 'unlocked',
                payload: {
                    stage: 1,
                    teachItem: currentLang.alphabets[0],
                    options: currentLang.alphabets.map(a => ({ text: `${a.symbol} (${a.sound}) - ${a.example}`, isCorrect: a.symbol === currentLang.alphabets[0].symbol }))
                }
            },
            {
                id: 'node_1_2',
                title: 'Basic Sounds & Phonics',
                subtitle: 'Listen to native audio and identify matching sound patterns',
                node_type: 'listening',
                order: 2,
                xp_reward: 60,
                status: isDone('node_1_2') ? 'completed' : isDone('node_1_1') ? 'unlocked' : 'locked',
                payload: {
                    stage: 1,
                    teachItem: currentLang.alphabets[1],
                    options: currentLang.alphabets.map(a => ({ text: `${a.symbol} (${a.meaning})`, isCorrect: a.symbol === currentLang.alphabets[1].symbol }))
                }
            },
            {
                id: 'node_1_3',
                title: 'Pronunciation Basics & Greetings',
                subtitle: `Speak basic greetings in ${currentLang.langName} aloud`,
                node_type: 'speaking',
                order: 3,
                xp_reward: 75,
                status: isDone('node_1_3') ? 'completed' : isDone('node_1_2') ? 'unlocked' : 'locked',
                payload: {
                    stage: 1,
                    targetPhrase: currentLang.words[0]?.word || 'नमस्ते',
                    phonetics: currentLang.words[0]?.phonetics || 'Namaste'
                }
            },
            {
                id: 'node_1_4',
                title: 'Numbers & Very Common Words',
                subtitle: 'Master 1-10 counting and vital starter words',
                node_type: 'vocabulary',
                order: 4,
                xp_reward: 70,
                status: isDone('node_1_4') ? 'completed' : isDone('node_1_3') ? 'unlocked' : 'locked',
                payload: {
                    stage: 1,
                    teachItem: currentLang.words[1] || currentLang.words[0]
                }
            },
            {
                id: 'node_1_5',
                title: 'Foundations & Script Milestone Check',
                subtitle: 'Demonstrate character recognition and core sound mastery to advance',
                node_type: 'milestone',
                order: 5,
                xp_reward: 100,
                status: isDone('node_1_5') ? 'completed' : isDone('node_1_4') ? 'unlocked' : 'locked'
            }
        ];

        const sec1CompletedCount = sec1Nodes.filter(n => n.status === 'completed').length;
        const sec1Pct = Math.round((sec1CompletedCount / sec1Nodes.length) * 100);
        const sec1Status = sec1Pct === 100 ? 'completed' : 'current';

        const unit1: LearningPathUnit = {
            id: 'unit_stage_1',
            unit_number: 1,
            title: 'Section 1: Foundations & Script',
            description: `Build your firm foundation in ${currentLang.langName} script, sound identification, basic phonics, numbers, and starter greetings.`,
            color_theme: 'brand',
            status: sec1Status,
            completion_percentage: sec1Pct,
            skills: ['Character recognition', 'Basic pronunciation', 'Greetings & etiquette', 'Numbers & common starter words'],
            preview: {
                whatYouWillLearn: ['Letter shapes and vowel markers (matras)', 'Aspirated and smooth consonant sounds', 'Everyday greetings & numbers 1-10'],
                whyItMatters: 'Recognizing characters and accurate phonics is the bedrock of reading and speaking independence.',
                howToUnlock: 'Unlocked by default as your starting step.'
            },
            nodes: sec1Nodes
        };

        // ==========================================
        // SECTION 2: CORE VOCABULARY & SENTENCES
        // ==========================================
        const sec2Nodes: LessonNode[] = [
            {
                id: 'node_2_1',
                title: 'Everyday Vocabulary (Home, Family & Food)',
                subtitle: `Learn 50 essential nouns and daily objects in ${currentLang.langName}`,
                node_type: 'vocabulary',
                order: 1,
                xp_reward: 60,
                status: isDone('node_2_1') ? 'completed' : (sec1Pct >= 80 || currentSectionNumber >= 2) ? 'unlocked' : 'locked',
                payload: {
                    stage: 2,
                    teachItem: currentLang.words[2] || currentLang.words[0]
                }
            },
            {
                id: 'node_2_2',
                title: 'Common Actions & Verbs',
                subtitle: 'Master frequent action verbs: go, come, eat, drink, read, and write',
                node_type: 'reading',
                order: 2,
                xp_reward: 70,
                status: isDone('node_2_2') ? 'completed' : isDone('node_2_1') ? 'unlocked' : 'locked',
                payload: {
                    stage: 2,
                    teachItem: currentLang.words[3] || currentLang.words[1]
                }
            },
            {
                id: 'node_2_3',
                title: 'Sentence Builder (SOV Structure)',
                subtitle: 'Arrange words into simple Subject-Object-Verb pattern sentences',
                node_type: 'reading',
                order: 3,
                xp_reward: 75,
                status: isDone('node_2_3') ? 'completed' : isDone('node_2_2') ? 'unlocked' : 'locked',
                payload: {
                    stage: 2,
                    teachItem: currentLang.sentences[0]
                }
            },
            {
                id: 'node_2_4',
                title: 'Questions & Answers',
                subtitle: 'Learn question markers: what, where, who, how much, and why',
                node_type: 'speaking',
                order: 4,
                xp_reward: 80,
                status: isDone('node_2_4') ? 'completed' : isDone('node_2_3') ? 'unlocked' : 'locked',
                payload: {
                    stage: 2,
                    targetPhrase: currentLang.sentences[2]?.targetText || 'आप कैसे हैं?',
                    phonetics: currentLang.sentences[2]?.phonetics || 'Aap kaise hain?'
                }
            },
            {
                id: 'node_2_5',
                title: 'Core Sentences Milestone Check',
                subtitle: 'Form 5 sentences and answer simple everyday questions accurately',
                node_type: 'milestone',
                order: 5,
                xp_reward: 100,
                status: isDone('node_2_5') ? 'completed' : isDone('node_2_4') ? 'unlocked' : 'locked'
            }
        ];

        const sec2CompletedCount = sec2Nodes.filter(n => n.status === 'completed').length;
        const sec2Pct = Math.round((sec2CompletedCount / sec2Nodes.length) * 100);
        const sec2Status = sec2Pct === 100 ? 'completed' : (sec1Pct >= 80 || currentSectionNumber >= 2) ? 'current' : 'locked';

        const unit2: LearningPathUnit = {
            id: 'unit_stage_2',
            unit_number: 2,
            title: 'Section 2: Core Vocabulary & Sentences',
            description: 'Move from single isolated words to building full, meaningful sentences with proper grammar and verb agreement.',
            color_theme: 'teal',
            status: sec2Status,
            completion_percentage: sec2Pct,
            skills: ['Everyday vocabulary depth', 'Action verbs & conjugation', 'SOV sentence formation', 'Question & answer patterns'],
            unlock_requirement: 'Complete Section 1 to unlock',
            preview: {
                whatYouWillLearn: ['Household, market, and travel vocabulary', 'Subject-Object-Verb rules and verb endings', 'Asking and answering common questions'],
                whyItMatters: 'Enables you to express your thoughts and needs instead of just naming objects.',
                howToUnlock: 'Complete Section 1: Foundations & Script milestone.'
            },
            nodes: sec2Nodes
        };

        // ==========================================
        // SECTION 3: READING, WRITING & COMPREHENSION
        // ==========================================
        const sec3Nodes: LessonNode[] = [
            {
                id: 'node_3_1',
                title: 'Word & Sign Reading',
                subtitle: 'Read everyday shop boards, street signs, and station notices',
                node_type: 'reading',
                order: 1,
                xp_reward: 70,
                status: isDone('node_3_1') ? 'completed' : (sec2Pct >= 80 || currentSectionNumber >= 3) ? 'unlocked' : 'locked',
                payload: {
                    stage: 3,
                    teachItem: currentLang.sentences[0]
                }
            },
            {
                id: 'node_3_2',
                title: 'Sentence Reading & Comprehension',
                subtitle: 'Read 3-4 sentence paragraphs and extract key information',
                node_type: 'reading',
                order: 2,
                xp_reward: 75,
                status: isDone('node_3_2') ? 'completed' : isDone('node_3_1') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_3_3',
                title: 'Short Cultural Stories & Fables',
                subtitle: 'Immerse in bilingual folk tales with reading comprehension questions',
                node_type: 'reading',
                order: 3,
                xp_reward: 85,
                status: isDone('node_3_3') ? 'completed' : isDone('node_3_2') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_3_4',
                title: 'Writing & Spelling Practice',
                subtitle: 'Write correct spellings and construct short written responses',
                node_type: 'vocabulary',
                order: 4,
                xp_reward: 80,
                status: isDone('node_3_4') ? 'completed' : isDone('node_3_3') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_3_5',
                title: 'Functional Literacy Milestone',
                subtitle: 'Demonstrate functional comprehension of written text and notices',
                node_type: 'milestone',
                order: 5,
                xp_reward: 120,
                status: isDone('node_3_5') ? 'completed' : isDone('node_3_4') ? 'unlocked' : 'locked'
            }
        ];

        const sec3CompletedCount = sec3Nodes.filter(n => n.status === 'completed').length;
        const sec3Pct = Math.round((sec3CompletedCount / sec3Nodes.length) * 100);
        const sec3Status = sec3Pct === 100 ? 'completed' : (sec2Pct >= 80 || currentSectionNumber >= 3) ? 'current' : 'locked';

        const unit3: LearningPathUnit = {
            id: 'unit_stage_3',
            unit_number: 3,
            title: 'Section 3: Reading, Writing & Comprehension',
            description: 'Develop functional literacy by reading continuous passages, understanding notices, and writing simple sentences.',
            color_theme: 'purple',
            status: sec3Status,
            completion_percentage: sec3Pct,
            skills: ['Continuous word reading', 'Sentence comprehension', 'Signboard & notice interpretation', 'Spelling & short writing'],
            unlock_requirement: 'Complete Section 2 to unlock',
            preview: {
                whatYouWillLearn: ['Reading short stories and authentic notices', 'Comprehension strategies for unfamiliar words', 'Constructing simple written notes'],
                whyItMatters: 'Functional literacy allows you to navigate public spaces, read books, and understand documents independently.',
                howToUnlock: 'Complete Section 2: Core Vocabulary & Sentences.'
            },
            nodes: sec3Nodes
        };

        // ==========================================
        // SECTION 4: PRACTICAL COMMUNICATION
        // ==========================================
        const sec4Nodes: LessonNode[] = [
            {
                id: 'node_4_1',
                title: 'Transit & Directions Inquiries',
                subtitle: 'Ask for buses, trains, autos, and street directions clearly',
                node_type: 'speaking',
                order: 1,
                xp_reward: 80,
                status: isDone('node_4_1') ? 'completed' : (sec3Pct >= 80 || currentSectionNumber >= 4) ? 'unlocked' : 'locked',
                payload: {
                    stage: 4,
                    targetPhrase: currentLang.practical[0]?.targetText || 'रेलवे स्टेशन कहाँ है?',
                    phonetics: currentLang.practical[0]?.phonetics || 'Railway station kahan hai?'
                }
            },
            {
                id: 'node_4_2',
                title: 'Market, Shop & Price Bargaining',
                subtitle: 'Ask prices, negotiate quantities, and complete purchases',
                node_type: 'speaking',
                order: 2,
                xp_reward: 85,
                status: isDone('node_4_2') ? 'completed' : isDone('node_4_1') ? 'unlocked' : 'locked',
                payload: {
                    stage: 4,
                    targetPhrase: currentLang.practical[1]?.targetText || 'यह कितने का है?',
                    phonetics: currentLang.practical[1]?.phonetics || 'Yeh kitne ka hai?'
                }
            },
            {
                id: 'node_4_3',
                title: 'Asking for Help & Expressing Needs',
                subtitle: 'Request assistance politely in medical, travel, or emergency situations',
                node_type: 'speaking',
                order: 3,
                xp_reward: 90,
                status: isDone('node_4_3') ? 'completed' : isDone('node_4_2') ? 'unlocked' : 'locked',
                payload: {
                    stage: 4,
                    targetPhrase: currentLang.practical[2]?.targetText || 'कृपया मेरी मदद कीजिए।',
                    phonetics: currentLang.practical[2]?.phonetics || 'Kripya meri madad kijiye.'
                }
            },
            {
                id: 'node_4_4',
                title: 'Practical Communication Milestone',
                subtitle: 'Prepares you for Real-World interactive dialogue missions',
                node_type: 'milestone',
                order: 4,
                xp_reward: 130,
                status: isDone('node_4_4') ? 'completed' : isDone('node_4_3') ? 'unlocked' : 'locked'
            }
        ];

        const sec4CompletedCount = sec4Nodes.filter(n => n.status === 'completed').length;
        const sec4Pct = Math.round((sec4CompletedCount / sec4Nodes.length) * 100);
        const sec4Status = sec4Pct === 100 ? 'completed' : (sec3Pct >= 80 || currentSectionNumber >= 4) ? 'current' : 'locked';

        const unit4: LearningPathUnit = {
            id: 'unit_stage_4',
            unit_number: 4,
            title: 'Section 4: Practical Communication',
            description: 'Apply your language skills in realistic scenarios: transit, bargaining, ordering food, and requesting assistance.',
            color_theme: 'amber',
            status: sec4Status,
            completion_percentage: sec4Pct,
            skills: ['Real-world question formation', 'Transit & transit navigation', 'Transaction dialogues', 'Requesting help & expressing needs'],
            unlock_requirement: 'Complete Section 3 to unlock',
            preview: {
                whatYouWillLearn: ['Conversational transit and market phrases', 'Polite requests and cultural interaction etiquette', 'Handling realistic two-way spoken exchanges'],
                whyItMatters: 'Bridges theoretical grammar to real street and marketplace interactions.',
                howToUnlock: 'Complete Section 3: Reading, Writing & Comprehension.'
            },
            nodes: sec4Nodes
        };

        // ==========================================
        // SECTION 5: CONFIDENCE & FLUENCY
        // ==========================================
        const sec5Nodes: LessonNode[] = [
            {
                id: 'node_5_1',
                title: 'Extended Conversational Dialogues',
                subtitle: 'Engage in multi-turn spoken discussions on hobbies, weather, and routines',
                node_type: 'speaking',
                order: 1,
                xp_reward: 90,
                status: isDone('node_5_1') ? 'completed' : (sec4Pct >= 80 || currentSectionNumber >= 5) ? 'unlocked' : 'locked',
                payload: {
                    stage: 5,
                    targetPhrase: currentLang.fluency[0]?.targetText || 'मुझे नई भाषाएं सीखना बहुत पसंद है।',
                    phonetics: currentLang.fluency[0]?.phonetics || 'Mujhe nayi bhashayein seekhna bahut pasand hai.'
                }
            },
            {
                id: 'node_5_2',
                title: 'Speaking Fluency & Pronunciation Refinement',
                subtitle: 'Refine intonation, syllable timing, and speech rhythm with AI voice feedback',
                node_type: 'speaking',
                order: 2,
                xp_reward: 95,
                status: isDone('node_5_2') ? 'completed' : isDone('node_5_1') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_5_3',
                title: 'Expressing Opinions & Experiences',
                subtitle: 'Describe past events, explain personal viewpoints, and compare preferences',
                node_type: 'reading',
                order: 3,
                xp_reward: 95,
                status: isDone('node_5_3') ? 'completed' : isDone('node_5_2') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_5_4',
                title: 'Fluency & Storytelling Milestone',
                subtitle: 'Narrate a 1-minute personal story in the target language',
                node_type: 'milestone',
                order: 4,
                xp_reward: 140,
                status: isDone('node_5_4') ? 'completed' : isDone('node_5_3') ? 'unlocked' : 'locked'
            }
        ];

        const sec5CompletedCount = sec5Nodes.filter(n => n.status === 'completed').length;
        const sec5Pct = Math.round((sec5CompletedCount / sec5Nodes.length) * 100);
        const sec5Status = sec5Pct === 100 ? 'completed' : (sec4Pct >= 80 || currentSectionNumber >= 5) ? 'current' : 'locked';

        const unit5: LearningPathUnit = {
            id: 'unit_stage_5',
            unit_number: 5,
            title: 'Section 5: Confidence & Fluency',
            description: 'Move toward spontaneous, natural communication with complex sentences, opinions, and longer spoken dialogues.',
            color_theme: 'brand',
            status: sec5Status,
            completion_percentage: sec5Pct,
            skills: ['Multi-turn conversation', 'Speech rhythm & native intonation', 'Expressing viewpoints & opinions', 'Extended storytelling'],
            unlock_requirement: 'Complete Section 4 to unlock',
            preview: {
                whatYouWillLearn: ['Multi-sentence discourse', 'Past, present, and future storytelling', 'Expressing opinions with reasoning'],
                whyItMatters: 'Builds spontaneous confidence so you no longer translate in your head before speaking.',
                howToUnlock: 'Complete Section 4: Practical Communication.'
            },
            nodes: sec5Nodes
        };

        // ==========================================
        // SECTION 6: INDEPENDENT LANGUAGE MASTERY
        // ==========================================
        const sec6Nodes: LessonNode[] = [
            {
                id: 'node_6_1',
                title: 'Advanced Vocabulary & Idioms',
                subtitle: 'Nuanced adjectives, cultural metaphors, and idiomatic phrases',
                node_type: 'vocabulary',
                order: 1,
                xp_reward: 100,
                status: isDone('node_6_1') ? 'completed' : (sec5Pct >= 80 || currentSectionNumber >= 6) ? 'unlocked' : 'locked',
                payload: {
                    stage: 6,
                    teachItem: currentLang.mastery[0]
                }
            },
            {
                id: 'node_6_2',
                title: 'Formal vs. Colloquial Register Nuances',
                subtitle: 'Master polite honorifics, workplace conventions, and casual peer slang',
                node_type: 'reading',
                order: 2,
                xp_reward: 110,
                status: isDone('node_6_2') ? 'completed' : isDone('node_6_1') ? 'unlocked' : 'locked',
                payload: {
                    stage: 6,
                    teachItem: currentLang.mastery[1]
                }
            },
            {
                id: 'node_6_3',
                title: 'Real-World Documents & News Comprehension',
                subtitle: 'Read articles, official announcements, and professional correspondence',
                node_type: 'reading',
                order: 3,
                xp_reward: 120,
                status: isDone('node_6_3') ? 'completed' : isDone('node_6_2') ? 'unlocked' : 'locked'
            },
            {
                id: 'node_6_4',
                title: 'Summit of Fluency & Master Certification',
                subtitle: 'Comprehensive capstone assessment demonstrating independent bilingual mastery',
                node_type: 'milestone',
                order: 4,
                xp_reward: 200,
                status: isDone('node_6_4') ? 'completed' : isDone('node_6_3') ? 'unlocked' : 'locked'
            }
        ];

        const sec6CompletedCount = sec6Nodes.filter(n => n.status === 'completed').length;
        const sec6Pct = Math.round((sec6CompletedCount / sec6Nodes.length) * 100);
        const sec6Status = sec6Pct === 100 ? 'completed' : (sec5Pct >= 80 || currentSectionNumber >= 6) ? 'current' : 'locked';

        const unit6: LearningPathUnit = {
            id: 'unit_stage_6',
            unit_number: 6,
            title: 'Section 6: Independent Language Mastery',
            description: 'Achieve autonomous language mastery capable of understanding complex media, professional discourse, and nuanced cultural communication.',
            color_theme: 'teal',
            status: sec6Status,
            completion_percentage: sec6Pct,
            skills: ['Autonomous comprehension', 'Register shifting (formal/informal)', 'Professional & civic literacy', 'Comprehensive bilingual mastery'],
            unlock_requirement: 'Complete Section 5 to unlock',
            preview: {
                whatYouWillLearn: ['Advanced cultural idioms & metaphors', 'Official, workplace, and academic writing styles', 'Unassisted comprehension of television, news, and literature'],
                whyItMatters: 'Attaining full language independence allows you to thrive professionally, culturally, and socially in the target language.',
                howToUnlock: 'Complete Section 5: Confidence & Fluency.'
            },
            nodes: sec6Nodes
        };

        return [unit1, unit2, unit3, unit4, unit5, unit6];
    }
};
