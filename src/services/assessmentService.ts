import { apiClient } from './api';
import { StorageService } from './mockData';
import { Question, AILearnerInsight } from '../types';

export const assessmentService = {
    async getDiagnosticQuestions(): Promise<Question[]> {
        try {
            const response = await apiClient.get<{ questions: Question[] }>('/assessment/questions/');
            return response.questions;
        } catch (err: any) {
            const profile = StorageService.getProfile();
            const comfLang = profile?.comfortable_language?.name || 'Telugu';
            const targetLang = profile?.target_language?.name || 'English';

            // Fallback seed questions if backend is offline
            if (targetLang === 'Hindi' || targetLang === 'hi') {
                return [
                    {
                        id: 'q1',
                        skill: 'Alphabet & Reading',
                        question_type: 'reading_passage',
                        prompt: 'गद्यांश पढ़कर "पानी" शब्द का सही अर्थ चुनें:',
                        passage: 'रवि हर सुबह पानी पीता है और पुस्तकालय जाता है। उसे पढ़ना बहुत पसंद है।',
                        highlight_word: 'पानी',
                        comfortable_bridge: comfLang === 'Telugu' ? 'పాఠ్యాంశాన్ని చదివి "पानी" (మంచి నీరు) పదానికి సరిపోయే అర్థాన్ని ఎంచుకోండి:' : 'गद्यांश पढ़कर "पानी" शब्द का सही अर्थ चुनें:',
                        options: [
                            { id: 1, text: 'जल (Water)', is_correct: true },
                            { id: 2, text: 'घर (Ghar)', is_correct: false },
                            { id: 3, text: 'किताब (Kitab)', is_correct: false },
                            { id: 4, text: 'खाना (Khana)', is_correct: false },
                        ],
                        explanation: "'पानी' का अर्थ जल होता है।"
                    },
                    {
                        id: 'q2',
                        skill: 'Vocabulary',
                        question_type: 'match_words',
                        prompt: '"अवसर" शब्द के लिए सही पर्याय चुनें:',
                        highlight_word: 'अवसर',
                        comfortable_bridge: comfLang === 'Telugu' ? 'లక్ష్య పదం "अवसर" (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:' : 'सही पर्याय चुनें:',
                        options: [
                            { id: 1, text: 'शुभ समय / अनुकूल मौका', is_correct: true },
                            { id: 2, text: 'कठिन बाधा या विलंब', is_correct: false },
                            { id: 3, text: 'लिखने की गलती', is_correct: false },
                            { id: 4, text: 'पुराना ग्रंथ', is_correct: false },
                        ],
                        explanation: "'अवसर' का अर्थ अनुकूल मौका होता है।"
                    },
                    {
                        id: 'q3',
                        skill: 'Sentence Structure',
                        question_type: 'arrange_words',
                        prompt: 'सही हिंदी वाक्य बनाने के लिए शब्दों को क्रमबद्ध करें:',
                        comfortable_bridge: comfLang === 'Telugu' ? 'సరియైన వాక్య నిర్మాణాన్ని ఎంచుకోండి:' : 'सही क्रम चुनें:',
                        options: [
                            { id: 1, text: 'वह हर दिन हिंदी सीखता है।', is_correct: true },
                            { id: 2, text: 'हिंदी वह सीखता है हर दिन।', is_correct: false },
                            { id: 3, text: 'हर दिन सीखता हिंदी वह है।', is_correct: false },
                            { id: 4, text: 'सीखता है हर दिन वह हिंदी।', is_correct: false },
                        ],
                        explanation: 'कर्ता + समय + कर्म + क्रिया।'
                    },
                    {
                        id: 'q4',
                        skill: 'Comprehension & Context',
                        question_type: 'fill_blank',
                        prompt: 'सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।',
                        passage: 'सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।',
                        highlight_word: '_____',
                        comfortable_bridge: comfLang === 'Telugu' ? 'సరిపోయే పదంతో ఖాళీని భర్తీ చేయండి:' : 'सही शब्द चुनें:',
                        options: [
                            { id: 1, text: 'अभ्यास', is_correct: true },
                            { id: 2, text: 'आलस्य', is_correct: false },
                            { id: 3, text: 'भूल', is_correct: false },
                            { id: 4, text: 'क्रोध', is_correct: false },
                        ],
                        explanation: "'अभ्यास' वाक्य को सही अर्थ देता है।"
                    },
                    {
                        id: 'q5',
                        skill: 'Voice & Pronunciation',
                        question_type: 'voice_speaking',
                        prompt: 'वाक्य को जोर से बोलें:',
                        target_phrase: 'नमस्ते! मैं लिंगोपथ से हिंदी सीख रहा हूँ।',
                        comfortable_bridge: comfLang === 'Telugu' ? 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:' : 'वाक्य को जोर से बोलें:',
                        options: [],
                        explanation: 'स्पष्ट उच्चारण करें।'
                    },
                    {
                        id: 'q6',
                        skill: 'Grammar Basics',
                        question_type: 'fill_blank',
                        prompt: 'सही सर्वनाम चुनें:',
                        passage: '_____ एक परिश्रमी छात्र है।',
                        highlight_word: '_____',
                        comfortable_bridge: comfLang === 'Telugu' ? 'సరిపోయే పదాన్ని ఎంచుకోండి:' : 'सही सर्वनाम चुनें:',
                        options: [
                            { id: 1, text: 'वह', is_correct: true },
                            { id: 2, text: 'हम', is_correct: false },
                            { id: 3, text: 'वे', is_correct: false },
                            { id: 4, text: 'आप', is_correct: false },
                        ],
                        explanation: "एकवचन के लिए 'वह' प्रयुक्त होता है।"
                    },
                    {
                        id: 'q7',
                        skill: 'Advanced Sentence Building',
                        question_type: 'arrange_words',
                        prompt: 'शब्दों को सही क्रम में रखें:',
                        comfortable_bridge: comfLang === 'Telugu' ? 'సరియైన వాక్యాన్ని రూపొందించడానికి పదాలను అమర్చండి:' : 'शब्दों का सही क्रम चुनें:',
                        options: [
                            { id: 1, text: 'मैं हर सुबह ताजे फल खाता हूँ।', is_correct: true },
                            { id: 2, text: 'फल खाता मैं सुबह हर ताजे हूँ।', is_correct: false },
                            { id: 3, text: 'सुबह हर खाता मैं ताजे फल हूँ।', is_correct: false },
                            { id: 4, text: 'खाता हूँ ताजे फल हर सुबह मैं।', is_correct: false },
                        ],
                        explanation: 'कर्ता + काल + विशेषण + कर्म + क्रिया।'
                    },
                    {
                        id: 'q8',
                        skill: 'Contextual Vocabulary',
                        question_type: 'match_words',
                        prompt: '"मित्र" शब्द का सही अर्थ चुनें:',
                        highlight_word: 'मित्र',
                        comfortable_bridge: comfLang === 'Telugu' ? 'సరియైన అర్థాన్ని ఎంచుకోండి:' : 'सही अर्थ चुनें:',
                        options: [
                            { id: 1, text: 'सखा / साथी', is_correct: true },
                            { id: 2, text: 'शत्रु / विरोधी', is_correct: false },
                            { id: 3, text: 'शिक्षक / गुरु', is_correct: false },
                            { id: 4, text: 'अजनबी / अनजान', is_correct: false },
                        ],
                        explanation: "'मित्र' का अर्थ सखा या साथी है।"
                    },
                    {
                        id: 'q9',
                        skill: 'Reading Comprehension',
                        question_type: 'reading_passage',
                        prompt: 'गद्यांश पढ़कर मीना की रुचि चुनें:',
                        passage: 'मीना को शाम को पार्क में घूमना और नई भाषाएँ सीखना पसंद है।',
                        comfortable_bridge: comfLang === 'Telugu' ? 'పాఠ్యాంశాన్ని చదివి సరైన సమాధానాన్ని ఎంచుకోండి:' : 'पढ़कर सही उत्तर चुनें:',
                        options: [
                            { id: 1, text: 'नई भाषाएँ सीखना और पार्क में घूमना', is_correct: true },
                            { id: 2, text: 'दिन भर बिस्तर पर सोना', is_correct: false },
                            { id: 3, text: 'डरावनी फ़िल्में देखना', is_correct: false },
                            { id: 4, text: 'खाना बनाना', is_correct: false },
                        ],
                        explanation: 'गद्यांश में मीना की रुचि का वर्णन है।'
                    },
                    {
                        id: 'q10',
                        skill: 'Speaking Confidence',
                        question_type: 'voice_speaking',
                        prompt: 'वाक्य को स्पष्ट रूप से बोलें:',
                        target_phrase: 'मुझे नई भाषाएँ सीखना और बोलना बहुत पसंद है।',
                        comfortable_bridge: comfLang === 'Telugu' ? 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:' : 'स्पष्ट रूप से बोलें:',
                        options: [],
                        explanation: 'स्पष्ट उच्चारण करें।'
                    }
                ];
            } else if (targetLang === 'Telugu' || targetLang === 'te') {
                return [
                    {
                        id: 'q1',
                        skill: 'Alphabet & Reading',
                        question_type: 'reading_passage',
                        prompt: 'పాఠ్యాంశాన్ని చదివి "పుస్తకం" అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:',
                        passage: 'రవి పాఠశాలలో పుస్తకం చదువుతున్నాడు.',
                        highlight_word: 'పుస్తకం',
                        comfortable_bridge: comfLang === 'Hindi' ? 'गद्यांश पढ़कर "పుస్తకం" शब्द का अर्थ चुनें:' : 'పాఠ్యాంశాన్ని చదివి అర్థాన్ని ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'గ్రంథం / పుస్తకము', is_correct: true },
                            { id: 2, text: 'నీరు / జలము', is_correct: false },
                            { id: 3, text: 'ఇల్లు / గృహము', is_correct: false },
                            { id: 4, text: 'అన్నం / ఆహారము', is_correct: false },
                        ],
                        explanation: "'పుస్తకం' అనగా చదివే గ్రంథము."
                    },
                    {
                        id: 'q2',
                        skill: 'Vocabulary',
                        question_type: 'match_words',
                        prompt: '"అవకాశం" అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:',
                        highlight_word: 'అవకాశం',
                        comfortable_bridge: comfLang === 'Hindi' ? 'शब्द "అవకాశం" का अर्थ चुनें:' : 'సరైన అర్థాన్ని ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'మంచి తరుణం / శుభ సమయం', is_correct: true },
                            { id: 2, text: 'పెద్ద ఆటంకం లేదా ఆలస్యం', is_correct: false },
                            { id: 3, text: 'రాతలో దొర్లిన పొరపాటు', is_correct: false },
                            { id: 4, text: 'పాత కాలపు కథ', is_correct: false },
                        ],
                        explanation: "'అవకాశం' అంటే అనుకూలమైన సమయం."
                    },
                    {
                        id: 'q3',
                        skill: 'Sentence Structure',
                        question_type: 'arrange_words',
                        prompt: 'సరియైన తెలుగు వాక్యాన్ని అమర్చండి:',
                        comfortable_bridge: comfLang === 'Hindi' ? 'सही वाक्य क्रम चुनें:' : 'సరియైన వాక్య క్రమాన్ని ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'నేను ప్రతీ రోజూ తెలుగు నేర్చుకుంటాను.', is_correct: true },
                            { id: 2, text: 'తెలుగు నేను నేర్చుకుంటాను రోజూ.', is_correct: false },
                            { id: 3, text: 'రోజూ నేర్చుకుంటాను తెలుగు నేను.', is_correct: false },
                            { id: 4, text: 'నేర్చుకుంటాను నేను తెలుగు రోజూ.', is_correct: false },
                        ],
                        explanation: 'కర్త + కాలము + కర్మ + క్రియ.'
                    },
                    {
                        id: 'q4',
                        skill: 'Comprehension & Context',
                        question_type: 'fill_blank',
                        prompt: 'విజయానికి నిరంతర _____ అవసరం.',
                        passage: 'విజయానికి నిరంతర _____ అవసరం.',
                        highlight_word: '_____',
                        comfortable_bridge: comfLang === 'Hindi' ? 'सही शब्द से वाक्य पूरा करें:' : 'సరైన పదంతో ఖాళీని భర్తీ చేయండి:',
                        options: [
                            { id: 1, text: 'సాధన', is_correct: true },
                            { id: 2, text: 'నిద్ర', is_correct: false },
                            { id: 3, text: 'ఆలస్యం', is_correct: false },
                            { id: 4, text: 'కోపం', is_correct: false },
                        ],
                        explanation: "'సాధన' అనగా అభ్యాసము."
                    },
                    {
                        id: 'q5',
                        skill: 'Voice & Pronunciation',
                        question_type: 'voice_speaking',
                        prompt: 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                        target_phrase: 'నమస్కారం! నేను లింగోపాత్ తో తెలుగు చదవడం నేర్చుకుంటున్నాను.',
                        comfortable_bridge: comfLang === 'Hindi' ? 'इस वाक्य को स्पष्ट रूप से बोलें:' : 'ఈ వాక్యాన్ని బిగ్గరగా చదవండి:',
                        options: [],
                        explanation: 'స్పష్టమైన ఉచ్ఛారణతో చదవండి.'
                    },
                    {
                        id: 'q6',
                        skill: 'Grammar Basics',
                        question_type: 'fill_blank',
                        prompt: 'సరైన పదాన్ని ఎంచుకోండి:',
                        passage: 'శుభ _____! మీ రోజు ప్రశాంతంగా ఉండాలి.',
                        highlight_word: '_____',
                        comfortable_bridge: comfLang === 'Hindi' ? 'सही शब्द चुनें:' : 'సరైన పదాన్ని ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'ఉదయం', is_correct: true },
                            { id: 2, text: 'రాత్రి', is_correct: false },
                            { id: 3, text: 'కలం', is_correct: false },
                            { id: 4, text: 'దారి', is_correct: false },
                        ],
                        explanation: "'శుభ ఉదయం' అనగా వేకువ వేళల శుభాకాంక్ష."
                    },
                    {
                        id: 'q7',
                        skill: 'Advanced Sentence Building',
                        question_type: 'arrange_words',
                        prompt: 'పదాలను సక్రమమైన వరుసలో అమర్చండి:',
                        comfortable_bridge: comfLang === 'Hindi' ? 'शब्दों को सही क्रम में रखें:' : 'సరియైన వరుసలో అమర్చండి:',
                        options: [
                            { id: 1, text: 'మనం కలిసి కొత్త భాషలు నేర్చుకుందాం.', is_correct: true },
                            { id: 2, text: 'భాషలు మనం నేర్చుకుందాం కలిసి కొత్త.', is_correct: false },
                            { id: 3, text: 'కొత్త నేర్చుకుందాం కలిసి మనం భాషలు.', is_correct: false },
                            { id: 4, text: 'నేర్చుకుందాం కొత్త భాషలు మనం కలిసి.', is_correct: false },
                        ],
                        explanation: 'సరియైన వాక్య నిర్మాణం.'
                    },
                    {
                        id: 'q8',
                        skill: 'Contextual Vocabulary',
                        question_type: 'match_words',
                        prompt: '"స్నేహితుడు" అనే పదానికి అర్థాన్ని ఎంచుకోండి:',
                        highlight_word: 'స్నేహితుడు',
                        comfortable_bridge: comfLang === 'Hindi' ? 'सही अर्थ चुनें:' : 'సరైన అర్థాన్ని ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'మిత్రుడు / సహచరుడు', is_correct: true },
                            { id: 2, text: 'అపరిచితుడు', is_correct: false },
                            { id: 3, text: 'ఉపాధ్యాయుడు', is_correct: false },
                            { id: 4, text: 'శత్రువు', is_correct: false },
                        ],
                        explanation: "'స్నేహితుడు' అనగా మిత్రుడు."
                    },
                    {
                        id: 'q9',
                        skill: 'Reading Comprehension',
                        question_type: 'reading_passage',
                        prompt: 'పాఠ్యాంశాన్ని చదివి గీతకు ఏమి ఇష్టమో ఎంచుకోండి:',
                        passage: 'గీత ప్రతిరోజూ ఉదయాన్నే లేచి పుస్తకాలు చదువుతుంది.',
                        comfortable_bridge: comfLang === 'Hindi' ? 'गद्यांश पढ़कर सही उत्तर चुनें:' : 'చదివి సరైన సమాధానం ఎంచుకోండి:',
                        options: [
                            { id: 1, text: 'ఉదయాన్నే పుస్తకాలు చదవడం', is_correct: true },
                            { id: 2, text: 'రోజంతా టీవీ చూడటం', is_correct: false },
                            { id: 3, text: 'ఫోన్ లో ఆటలు ఆడటం', is_correct: false },
                            { id: 4, text: 'మధ్యాహ్నం వరకు నిద్రపోవడం', is_correct: false },
                        ],
                        explanation: 'గీత ఉదయాన్నే పుస్తకాలు చదువుతుంది.'
                    },
                    {
                        id: 'q10',
                        skill: 'Speaking Practice',
                        question_type: 'voice_speaking',
                        prompt: 'ఈ వాక్యాన్ని స్పష్టంగా మాట్లాడండి:',
                        target_phrase: 'నాకు చదవడం మరియు వ్రాయడం చాలా ఇష్టం.',
                        comfortable_bridge: comfLang === 'Hindi' ? 'स्पष्ट रूप से बोलें:' : 'స్పష్టంగా మాట్లాడండి:',
                        options: [],
                        explanation: 'స్పష్టమైన ఉచ్ఛారణతో చెప్పండి.'
                    }
                ];
            }

            // Default English Target Language Set
            return [
                {
                    id: 'q1',
                    skill: 'Reading Passage',
                    question_type: 'reading_passage',
                    prompt: `Read the passage and select the correct meaning of 'excited':`,
                    passage: `Ravi was excited to visit the library every morning. He loved reading stories about different countries.`,
                    highlight_word: 'excited',
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'క్రింది వాక్యాన్ని చదివి "excited" అనే పదానికి సరిపోయే అర్థాన్ని ఎంచుకోండి:'
                        : comfLang === 'Hindi'
                            ? 'गद्यांश पढ़कर "excited" शब्द का सही अर्थ चुनें:'
                            : `Read passage & select correct meaning for 'excited':`,
                    options: [
                        { id: 1, text: 'Enthusiastic and keen', is_correct: true },
                        { id: 2, text: 'Uninterested and bored', is_correct: false },
                        { id: 3, text: 'Fearful and hesitant', is_correct: false },
                        { id: 4, text: 'Tired and sleepy', is_correct: false },
                    ],
                    explanation: '"Excited" means eager and enthusiastic.'
                },
                {
                    id: 'q2',
                    skill: 'Vocabulary Matching',
                    question_type: 'match_words',
                    prompt: `Select the option that best matches the meaning of 'Opportunity'.`,
                    highlight_word: 'Opportunity',
                    comfortable_bridge: comfLang === 'Telugu'
                        ? '"Opportunity" (అవకాశం) కి సరిపోయే అర్థాన్ని ఎంచుకోండి:'
                        : comfLang === 'Hindi'
                            ? '"Opportunity" (अवसर) का सही पर्याय चुनें:'
                            : `Select closest meaning:`,
                    options: [
                        { id: 1, text: 'A favorable time or chance for progress', is_correct: true },
                        { id: 2, text: 'A sudden obstacle or error', is_correct: false },
                        { id: 3, text: 'A heavy tool used in building', is_correct: false },
                        { id: 4, text: 'An old story or fable', is_correct: false },
                    ],
                    explanation: 'Opportunity refers to a favorable chance.'
                },
                {
                    id: 'q3',
                    skill: 'Sentence Construction',
                    question_type: 'arrange_words',
                    prompt: `Arrange the words into a complete, correct sentence.`,
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'సరియైన వాక్య నిర్మాణాన్ని ఎంచుకోండి:'
                        : comfLang === 'Hindi'
                            ? 'सही वाक्य क्रम चुनें:'
                            : `Select grammatically correct sentence order:`,
                    options: [
                        { id: 1, text: 'I practice reading English every single morning.', is_correct: true },
                        { id: 2, text: 'Reading morning every single English practice I.', is_correct: false },
                        { id: 3, text: 'Every morning English practice reading I single.', is_correct: false },
                        { id: 4, text: 'Practice I English single morning reading every.', is_correct: false },
                    ],
                    explanation: 'Subject + Verb + Object + Time modifier.'
                },
                {
                    id: 'q4',
                    skill: 'Comprehension & Context',
                    question_type: 'fill_blank',
                    prompt: `Choose the correct word to fill in the blank.`,
                    passage: `To build a strong habit, it is important to practice _____ every single day.`,
                    highlight_word: '_____',
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'సరిపోయే పదంతో ఖాళీని భర్తీ చేయండి:'
                        : comfLang === 'Hindi'
                            ? 'सही शब्द से रिक्त स्थान भरें:'
                            : `Complete the sentence:`,
                    options: [
                        { id: 1, text: 'consistently', is_correct: true },
                        { id: 2, text: 'rarely', is_correct: false },
                        { id: 3, text: 'never', is_correct: false },
                        { id: 4, text: 'accidentally', is_correct: false },
                    ],
                    explanation: '"Consistently" fits the sentence.'
                },
                {
                    id: 'q5',
                    skill: 'Voice & Pronunciation',
                    question_type: 'voice_speaking',
                    prompt: `Speak the sentence aloud into your microphone.`,
                    target_phrase: `Welcome to LingoPath AI. I am excited to practice speaking!`,
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:'
                        : comfLang === 'Hindi'
                            ? 'इस वाक्य को स्पष्ट रूप से बोलें:'
                            : `Record your voice speaking this sentence:`,
                    options: [],
                    explanation: 'Focus on clear pronunciation.'
                },
                {
                    id: 'q6',
                    skill: 'Grammar Basics',
                    question_type: 'fill_blank',
                    prompt: `Choose the correct article to fill in the blank.`,
                    passage: `She wants to buy _____ umbrella before it starts raining.`,
                    highlight_word: '_____',
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'సరిపోయే ఆర్టికల్ ఎంచుకోండి:'
                        : comfLang === 'Hindi'
                            ? 'सही सर्वनाम / अनुच्छेद चुनें:'
                            : `Select correct article:`,
                    options: [
                        { id: 1, text: 'an', is_correct: true },
                        { id: 2, text: 'a', is_correct: false },
                        { id: 3, text: 'the', is_correct: false },
                        { id: 4, text: 'no article', is_correct: false },
                    ],
                    explanation: "Use 'an' before words beginning with a vowel sound."
                },
                {
                    id: 'q7',
                    skill: 'Advanced Sentence Building',
                    question_type: 'arrange_words',
                    prompt: `Arrange the words into a complete, correct sentence.`,
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'సరియైన వాక్యాన్ని అమర్చండి:'
                        : comfLang === 'Hindi'
                            ? 'शब्दों को सही क्रम में रखें:'
                            : `Arrange words into correct order:`,
                    options: [
                        { id: 1, text: 'We enjoy learning new languages together every morning.', is_correct: true },
                        { id: 2, text: 'Learning languages together we enjoy morning every.', is_correct: false },
                        { id: 3, text: 'Every morning together learning new languages we enjoy.', is_correct: false },
                        { id: 4, text: 'Languages new learning we enjoy together morning every.', is_correct: false },
                    ],
                    explanation: 'Subject + Verb + Object + Time.'
                },
                {
                    id: 'q8',
                    skill: 'Contextual Vocabulary',
                    question_type: 'match_words',
                    prompt: `Select the closest meaning for 'Abundant'.`,
                    highlight_word: 'Abundant',
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'సమృద్ధిగా (Meaning Bridge)'
                        : comfLang === 'Hindi'
                            ? 'प्रचुर / प्रचुर मात्रा (Meaning Bridge)'
                            : `Select closest meaning:`,
                    options: [
                        { id: 1, text: 'Existing or available in large quantities', is_correct: true },
                        { id: 2, text: 'Extremely rare and hard to find', is_correct: false },
                        { id: 3, text: 'Damaged or broken beyond repair', is_correct: false },
                        { id: 4, text: 'Quiet and silent', is_correct: false },
                    ],
                    explanation: "'Abundant' means plentiful."
                },
                {
                    id: 'q9',
                    skill: 'Reading Comprehension',
                    question_type: 'reading_passage',
                    prompt: `Read the passage and select why Ananya felt confident.`,
                    passage: `Ananya felt confident during her presentation because she practiced speaking aloud in front of the mirror every day.`,
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'పాఠ్యాంశాన్ని చదివి సమాధానాన్ని ఎంచుకోండి:'
                        : comfLang === 'Hindi'
                            ? 'गद्यांश पढ़कर सही उत्तर चुनें:'
                            : `Read passage & select correct answer:`,
                    options: [
                        { id: 1, text: 'She practiced speaking aloud every day', is_correct: true },
                        { id: 2, text: 'She read a book right before speaking', is_correct: false },
                        { id: 3, text: 'The presentation was very short', is_correct: false },
                        { id: 4, text: 'She guessed all the answers', is_correct: false },
                    ],
                    explanation: 'She practiced speaking aloud every day.'
                },
                {
                    id: 'q10',
                    skill: 'Speaking Fluency',
                    question_type: 'voice_speaking',
                    prompt: `Speak this sentence aloud into your microphone.`,
                    target_phrase: `Consistency and daily practice lead to fluency and confidence.`,
                    comfortable_bridge: comfLang === 'Telugu'
                        ? 'ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:'
                        : comfLang === 'Hindi'
                            ? 'इस वाक्य को स्पष्ट रूप से बोलें:'
                            : `Speak this sentence into microphone:`,
                    options: [],
                    explanation: 'Focus on clear pronunciation.'
                }
            ];
        }
    },

    async submitDiagnostic(answers: Record<string, any>): Promise<{ accuracy: number; insight: AILearnerInsight }> {
        try {
            return await apiClient.post<{ accuracy: number; insight: AILearnerInsight }>('/assessment/submit/', { answers });
        } catch (err: any) {
            const profile = StorageService.getProfile();
            const defaultInsight: AILearnerInsight = {
                summary_headline: "Personalized Literacy Assessment Complete ✨",
                reading_summary: "You are comfortable with short passages and everyday written signs.",
                vocabulary_summary: "You recognize common everyday words well.",
                writing_summary: "You can write simple words, but need practice forming full sentences.",
                speaking_summary: "Speaking confidence is your biggest growth opportunity.",
                recommended_focus: "Everyday conversations + sentence building",
                recommended_starting_point: "Level 2 Reading & Level 1 Speaking",
            };
            return { accuracy: 80.0, insight: defaultInsight };
        }
    },

    async getAILearnerInsights(): Promise<AILearnerInsight> {
        try {
            return await apiClient.get<AILearnerInsight>('/insights/');
        } catch (err: any) {
            return {
                summary_headline: "Personalized Literacy Diagnostic Complete ✨",
                reading_summary: "You recognize everyday words and simple passages with high confidence.",
                vocabulary_summary: "Good core vocabulary. Ready to expand into conversational terms.",
                writing_summary: "Capable of basic sentence assembly; sentence connectors require practice.",
                speaking_summary: "Speaking confidence is your primary growth opportunity.",
                recommended_focus: "Everyday conversations + sentence building",
                recommended_starting_point: "Level 2 Reading & Level 1 Speaking Journey",
            };
        }
    }
};
