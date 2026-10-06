import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningPathService } from '../services/learningPathService';
import { voiceService } from '../services/voiceService';
import { LearningPathUnit, LessonNode, LearnerProgress, SectionPreview } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useTranslation } from '../utils/translations';
import { LingoBot, LexiReader, VoxSpeaker, AtlasTraveler } from '../components/common/LingoCharacters';
import {
    Flame,
    Star,
    Trophy,
    Target,
    BookOpen,
    Brain,
    Mic,
    Headphones,
    CheckCircle2,
    Lock,
    Play,
    Sparkles,
    Volume2,
    X,
    Award,
    ArrowLeft,
    ChevronRight,
    Eye,
    Compass
} from 'lucide-react';

export const LearningPathPage: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();

    const [units, setUnits] = useState<LearningPathUnit[]>([]);
    const [progress, setProgress] = useState<LearnerProgress | null>(null);
    const [activeNode, setActiveNode] = useState<LessonNode | null>(null);
    const [previewUnit, setPreviewUnit] = useState<LearningPathUnit | null>(null);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [lessonAnswer, setLessonAnswer] = useState<number | null>(null);
    const [isLessonSubmitted, setIsLessonSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const supportLangCode = profile?.comfortable_language?.code || 'en';
    const { t } = useTranslation();
    const lang = (supportLangCode || 'en').toLowerCase().slice(0, 2);

    const getLocalizedSectionTitle = (unitNumber: number, fallback: string): string => {
        const titles: Record<number, Record<string, string>> = {
            1: {
                en: 'Foundations & Script',
                ta: 'அடிப்படைகள் & எழுத்துக்கள்',
                te: 'పునాదులు & లిపి',
                kn: 'ಮೂಲ ಅಡಿಪಾಯಗಳು & ಲಿಪಿ',
                hi: 'बुनियाद और लिपि',
                ml: 'അടിസ്ഥാനങ്ങൾ & ലിപി'
            },
            2: {
                en: 'Core Vocabulary & Sentences',
                ta: 'முக்கிய சொற்களஞ்சியம் & வாக்கியங்கள்',
                te: 'ముఖ్య పదజాలం & వాక్యాలు',
                kn: 'ಪ್ರಮುಖ ಶಬ್ದಕೋಶ & ವಾಕ್ಯಗಳು',
                hi: 'मुख्य शब्दावली और वाक्य',
                ml: 'പ്രധാന പദാവലി & വാക്യങ്ങൾ'
            },
            3: {
                en: 'Reading, Writing & Comprehension',
                ta: 'வாசிப்பு, எழுதுதல் & புரிதல்',
                te: 'చదవడం, రాయడం & గ్రహణ శక్తి',
                kn: 'ಓದುವಿಕೆ, ಬರವಣಿಗೆ & ಗ್ರಹಿಕೆ',
                hi: 'पठन, लेखन और समझ',
                ml: 'വായന, എഴുത്ത് & ഗ്രഹണം'
            },
            4: {
                en: 'Practical Communication',
                ta: 'நடைமுறை உரையாடல்',
                te: 'ఆచరణాత్మక సంభాషణ',
                kn: 'ಪ್ರಾಯೋಗಿಕ ಸಂವಹನ',
                hi: 'व्यावहारिक संवाद',
                ml: 'പ്രായോഗിക ആശയവിനിമയം'
            },
            5: {
                en: 'Confidence & Fluency',
                ta: 'நம்பிக்கை & சரளத்தன்மை',
                te: 'ఆత్మవిశ్వాసం & ధారాళత',
                kn: 'ಆತ್ಮವಿಶ್ವಾಸ & ಧಾರಾಳತೆ',
                hi: 'आत्मविश्वास और प्रवाह',
                ml: 'ആത്മവിശ്വാസം & ഒഴുക്ക്'
            },
            6: {
                en: 'Independent Language Mastery',
                ta: 'சுயாதீன மொழித் தேர்ச்சி',
                te: 'స్వతంత్ర భాషా నైపుణ్యం',
                kn: 'ಸ್ವತಂತ್ರ ಭಾಷಾ ಪ್ರವೀಣತೆ',
                hi: 'स्वतंत्र भाषा प्रवीणता',
                ml: 'സ്വതന്ത്ര ഭാഷാ വൈദഗ്ദ്ധ്യം'
            }
        };

        return titles[unitNumber]?.[lang] || titles[unitNumber]?.['en'] || fallback.replace(/^Section \d+:\s*/, '');
    };

    const getLocalizedSectionDesc = (unitNumber: number, fallback: string): string => {
        const descs: Record<number, Record<string, string>> = {
            1: {
                en: 'Build your firm foundation in script, sound identification, basic phonics, numbers, and starter greetings.',
                ta: 'எழுத்துக்கள், ஒலி அடையாளம், அடிப்படை ஒலிப்பு, எண்கள் மற்றும் வாழ்த்துக்களில் வலுவான அடித்தளத்தை உருவாக்குங்கள்.',
                te: 'లిపి, ధ్వనుల గుర్తింపు, ప్రాథమిక ఉచ్చారణ, సంఖ్యలు మరియు శుభాకాంక్షలలో బలమైన పునాదిని నిర్మించుకోండి.',
                kn: 'ಲಿಪಿ, ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ, ಮೂಲ ಉಚ್ಚಾರಣೆ, ಸಂಖ್ಯೆಗಳು ಮತ್ತು ಶುಭಾಶಯಗಳಲ್ಲಿ ದೃಢವಾದ ಅಡಿಪಾಯವನ್ನು ನಿರ್ಮಿಸಿ.',
                hi: 'लिपि, ध्वनि पहचान, बुनियादी ध्वन्यात्मकता, संख्या और बुनियादी अभिवादन में मजबूत नींव बनाएं।',
                ml: 'ലിപി, ശബ്ദം തിരിച്ചറിയൽ, അടിസ്ഥാന ഉച്ചാരണം, സംഖ്യകൾ, ആശംസകൾ എന്നിവയിൽ ഉറച്ച അടിത്തറ പണിയുക.'
            },
            2: {
                en: 'Expand everyday vocabulary, master subject-object-verb sentence patterns, and participate in basic question-answer exchanges.',
                ta: 'தினசரி சொற்களஞ்சியத்தை விரிவாக்குங்கள், வாக்கிய அமைப்புகளைக் கற்றுக் கொள்ளுங்கள், எளிய கேள்வி-பதில் உரையாடல்களில் ஈடுபடுங்கள்.',
                te: 'రోజువారీ పదజాలాన్ని విస్తరించండి, వాక్య నిర్మాణాన్ని నేర్చుకోండి మరియు సాధారణ ప్రశ్నోత్తరాలలో పాల్గొనండి.',
                kn: 'ದೈನಂದಿನ ಶಬ್ದಕೋಶವನ್ನು ವಿಸ್ತರಿಸಿ, ವಾಕ್ಯ ರಚನೆಯನ್ನು ಕಲಿಯಿರಿ ಮತ್ತು ಸರಳ ಪ್ರಶ್ನೋತ್ತರಗಳಲ್ಲಿ ಭಾಗವಹಿಸಿ.',
                hi: 'दैनिक शब्दावली का विस्तार करें, वाक्य संरचना में महारत हासिल करें और सरल प्रश्न-उत्तर संवाद में भाग लें।',
                ml: 'ദൈനംദിന പദസമ്പത്ത് വികസിപ്പിക്കുക, വാക്യഘടന മനസ്സിലാക്കുക, ലളിതമായ ചോദ്യോത്തരങ്ങളിൽ പങ്കാളിയാകുക.'
            },
            3: {
                en: 'Read everyday notices and signs, comprehend multi-sentence paragraphs, and practice written character accuracy.',
                ta: 'அன்றாட அறிவிப்புகள் மற்றும் பலகைகளை வாசியுங்கள், பத்திகளைப் புரிந்து கொள்ளுங்கள், துல்லியமாக எழுதப் பழகுங்கள்.',
                te: 'రోజువారీ బోర్డులు మరియు నోటీసులను చదవండి, పేరాలను అర్థం చేసుకోండి, స్పష్టంగా రాయడం ప్రాక్టీస్ చేయండి.',
                kn: 'ದೈನಂದಿನ ಸೂಚನೆಗಳನ್ನು ಓದಿ, ಪ್ಯಾರಾಗ್ರಾಫ್‌ಗಳನ್ನು ಗ್ರಹಿಸಿ, ಸ್ಪಷ್ಟವಾಗಿ ಬರೆಯಲು ಅಭ್ಯಾಸ ಮಾಡಿ.',
                hi: 'दैनिक नोटिस और संकेत पढ़ें, अनुच्छेदों को समझें और लिखित वर्णों की सटीकता का अभ्यास करें।',
                ml: 'ദൈനംദിന ബോർഡുകളും അറിയിപ്പുകളും വായിക്കുക, ഖണ്ഡികകൾ ഗ്രഹിക്കുക, കൃത്യമായി എഴുതി ശീലിക്കുക.'
            },
            4: {
                en: 'Confidently navigate shops, transit, medical clinics, and ask for directions or assistance in everyday real-world situations.',
                ta: 'கடைகள், பயணம், மருத்துவமனை மற்றும் வழிகேட்டல் போன்ற நிஜ வாழ்க்கை சூழல்களில் தன்னம்பிக்கையுடன் உரையாடுங்கள்.',
                te: 'దుకాణాలు, ప్రయాణాలు, సహాయం కోరడం వంటి నిజ జీవిత పరిస్థితులలో ఆత్మవిశ్వాసంతో సంభాషించండి.',
                kn: 'ಅಂಗಡಿಗಳು, ಪ್ರಯಾಣ, ಸಹಾಯ ಕೇಳುವುದು ಮುಂತಾದ ನೈಜ ಸಂದರ್ಭಗಳಲ್ಲಿ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಸಂವಹಿಸಿ.',
                hi: 'दुकानों, यात्रा, अस्पतालों और मदद मांगने जैसी वास्तविक स्थितियों में आत्मविश्वास से बात करें।',
                ml: 'കടകൾ, യാത്ര, സഹായം ചോദിക്കൽ തുടങ്ങിയ യഥാർത്ഥ സാഹചര്യങ്ങളിൽ ആത്മവിശ്വാസത്തോടെ സംസാരിക്കുക.'
            },
            5: {
                en: 'Speak naturally with native intonation, comprehend fast spoken dialogues, and converse about diverse daily topics.',
                ta: 'இயற்கையான உச்சரிப்புடன் பேசுங்கள், வேகமான உரையாடல்களைப் புரிந்து கொள்ளுங்கள், பல தலைப்புகளில் பேசுங்கள்.',
                te: 'సహజమైన ఉచ్చారణతో మాట్లాడండి, వేగవంతమైన సంభాషణలను అర్థం చేసుకోండి, వివిధ అంశాలపై చర్చించండి.',
                kn: 'ನೈಸರ್ಗಿಕ ಧ್ವನಿಯಲ್ಲಿ ಮಾತನಾಡಿ, ವೇಗದ ಸಂಭಾಷಣೆಗಳನ್ನು ಗ್ರಹಿಸಿ, ವಿವಿಧ ವಿಷಯಗಳ ಬಗ್ಗೆ ಚರ್ಚಿಸಿ.',
                hi: 'प्राकृतिक प्रवाह के साथ बोलें, तेज बातचीत को समझें और विभिन्न विषयों पर धाराप्रवाह चर्चा करें।',
                ml: 'സ്വാഭാവികമായ ഒഴുക്കോടെ സംസാരിക്കുക, വേഗതയേറിയ സംഭാഷണങ്ങൾ ഗ്രഹിക്കുക, വിവിധ വിഷയങ്ങളിൽ സംസാരിക്കുക.'
            },
            6: {
                en: 'Achieve autonomous language mastery capable of understanding complex media, professional discourse, and nuanced cultural communication.',
                ta: 'ஊடகங்கள், தொழில்சார் பேச்சுக்கள் மற்றும் பண்பாட்டு உரையாடல்களைப் புரிந்துகொள்ளும் முழுமையான மொழித் தேர்ச்சியை அடையுங்கள்.',
                te: 'మీడియా, వృత్తిపరమైన సంభాషణలు మరియు సాంస్కృతిక విషయాలను స్వతంత్రంగా అర్థం చేసుకునే పరిపూర్ణత సాధించండి.',
                kn: 'ಮಾಧ್ಯಮ, ವೃತ್ತಿಪರ ಭಾಷಣ ಮತ್ತು ಸಾಂಸ್ಕೃತಿಕ ವಿಷಯಗಳನ್ನು ಗ್ರಹಿಸುವ ಸಂಪೂರ್ಣ ಸ್ವತಂತ್ರ ಭಾಷಾ ಪ್ರವೀಣತೆಯನ್ನು ಪಡೆಯಿರಿ.',
                hi: 'जटिल मीडिया, व्यावसायिक संवाद और सांस्कृतिक बारीकियों को समझने में पूर्ण भाषा स्वतंत्रता हासिल करें।',
                ml: 'സങ്കീർണ്ണമായ മാധ്യമങ്ങൾ, തൊഴിൽപരമായ സംഭാഷണങ്ങൾ എന്നിവ ഗ്രഹിക്കാനുള്ള സ്വതന്ത്ര ഭാഷാ വൈദഗ്ദ്ധ്യം കൈവരിക്കുക.'
            }
        };

        return descs[unitNumber]?.[lang] || descs[unitNumber]?.['en'] || fallback;
    };

    const getLocalizedSkill = (skill: string): string => {
        const skillsMap: Record<string, Record<string, string>> = {
            'character recognition': { en: 'Character recognition', ta: 'எழுத்து அடையாளம்', te: 'అక్షరాల గుర్తింపు', kn: 'ಅಕ್ಷರ ಗುರುತಿಸುವಿಕೆ', hi: 'अक्षर पहचान', ml: 'അക്ഷര തിരിച്ചറിയൽ' },
            'basic pronunciation': { en: 'Basic pronunciation', ta: 'அடிப்படை உச்சரிப்பு', te: 'ప్రాథమిక ఉచ్చారణ', kn: 'ಮೂಲ ಉಚ್ಚಾರಣೆ', hi: 'बुनियादी उच्चारण', ml: 'അടിസ്ഥാന ഉച്ചാരണം' },
            'greetings & etiquette': { en: 'Greetings & etiquette', ta: 'வாழ்த்துக்கள் & மரியாதை', te: 'మర్యాదలు & శుభాకాంక్షలు', kn: 'ಶುಭಾಶಯಗಳು & ನಡವಳಿಕೆ', hi: 'अभिवादन और शिष्टाचार', ml: 'ആശംസകളും മര്യാദകളും' },
            'numbers & common starter words': { en: 'Numbers & starter words', ta: 'எண்கள் & தொடக்கச் சொற்கள்', te: 'సంఖ్యలు & ప్రాథమిక పదాలు', kn: 'ಸಂಖ್ಯೆಗಳು & ಸಾಮಾನ್ಯ ಪದಗಳು', hi: 'संख्या और शुरुआती शब्द', ml: 'സംഖ്യകളും വാക്കുകളും' },
            'everyday vocabulary depth': { en: 'Everyday vocabulary', ta: 'அன்றாட சொல்லகராதி', te: 'రోజువారీ పదజాలం', kn: 'ದೈನಂದಿನ ಶಬ್ದಕೋಶ', hi: 'दैनिक शब्दावली विस्तार', ml: 'ദൈനംദിന പദസമ്പത്ത്' },
            'action verbs & conjugation': { en: 'Action verbs', ta: 'செயல் வினைகள்', te: 'క్రియా రూపాలు', kn: 'ಕ್ರಿಯಾಪದಗಳು', hi: 'क्रियाएं और काल', ml: 'ക്രിയകൾ' },
            'sov sentence formation': { en: 'Sentence formation', ta: 'வாக்கிய அமைப்பு', te: 'వాక్య నిర్మాణం', kn: 'ವಾಕ್ಯ ರಚನೆ', hi: 'वाक्य निर्माण (SOV)', ml: 'വാക്യഘടന' },
            'question & answer patterns': { en: 'Question & answer', ta: 'கேள்வி பதில் முறைகள்', te: 'ప్రశ్నోత్తరాలు', kn: 'ಪ್ರಶ್ನೋತ್ತರಗಳು', hi: 'प्रश्न और उत्तर', ml: 'ചോദ്യോത്തരങ്ങൾ' },
            'continuous word reading': { en: 'Word reading', ta: 'சொல் வாசிப்பு', te: 'పదాల పఠనం', kn: 'ಪದಗಳ ಓದುವಿಕೆ', hi: 'शब्द पठन', ml: 'വാക്കുകൾ വായിക്കൽ' },
            'sentence comprehension': { en: 'Sentence comprehension', ta: 'வாக்கிய புரிதல்', te: 'వాక్య గ్రహణశక్తి', kn: 'ವಾಕ್ಯ ಗ್ರಹಿಕೆ', hi: 'वाक्य समझ', ml: 'വാക്യ ഗ്രഹണം' },
            'reading fluency': { en: 'Reading fluency', ta: 'வாசிப்பு சரளம்', te: 'చదివే ధారాళత', kn: 'ಓದುವ ಧಾರಾಳತೆ', hi: 'पठन प्रवाह', ml: 'വായനാ ഒഴുക്ക്' },
            'handwriting & spelling': { en: 'Spelling accuracy', ta: 'எழுத்துப்பிழை துல்லியம்', te: 'అక్షర క్రమం', kn: 'ಕಾಗುಣಿತ ನಿಖರತೆ', hi: 'वर्तनी और लेखन', ml: 'അക്ഷരത്തെറ്റില്ലാത്ത എഴുത്ത്' },
            'real-world question formation': { en: 'Real-world questions', ta: 'நடைமுறை கேள்விகள்', te: 'నిజజీవిత ప్రశ్నలు', kn: 'ಪ್ರಾಯೋಗಿಕ ಪ್ರಶ್ನೆಗಳು', hi: 'व्यावहारिक प्रश्न निर्माण', ml: 'പ്രായോഗിക ചോദ്യങ്ങൾ' },
            'transit & transit navigation': { en: 'Transit navigation', ta: 'பயண வழிகாட்டுதல்', te: 'ప్రయాణ మార్గాలు', kn: 'ಪ್ರಯಾಣ ಮಾರ್ಗದರ್ಶನ', hi: 'यात्रा और दिशा-निर्देश', ml: 'യാത്രാ വഴികൾ' },
            'market & commerce dialogue': { en: 'Market & shopping', ta: 'சந்தை உரையாடல்', te: 'షాపింగ్ సంభాషణ', kn: 'ಮಾರುಕಟ್ಟೆ ಸಂಭಾಷಣೆ', hi: 'बाज़ार और खरीदारी', ml: 'വിപണി സംഭാഷണം' },
            'emergency & health assistance': { en: 'Emergency phrases', ta: 'அவசர உதவி சொற்றொடர்', te: 'అత్యవసర సహాయం', kn: 'ತುರ್ತು ಸಹಾಯ', hi: 'आपातकालीन सहायता', ml: 'അടിയന്തര സഹായം' },
            'multi-turn conversation': { en: 'Multi-turn conversation', ta: 'தொடர் உரையாடல்', te: 'బహుళ-సంభాషణ', kn: 'ನಿರಂತರ ಸಂಭಾಷಣೆ', hi: 'निरंतर संवाद', ml: 'തുടർ സംഭാഷണം' },
            'speech rhythm & native intonation': { en: 'Native intonation', ta: 'இயற்கை உச்சரிப்பு', te: 'సహజ శైలి', kn: 'ನೈಸರ್ಗಿಕ ಧ್ವನಿ ಲಯ', hi: 'स्वाभाविक लय और सुर', ml: 'സ്വാഭാവിക ശൈലി' },
            'listening to native media': { en: 'Media listening', ta: 'ஊடகக் கேட்பு', te: 'ఆడియో శ్రవణం', kn: 'ಮಾಧ್ಯಮ ಆಲಿಸುವಿಕೆ', hi: 'ऑडियो और मीडिया समझ', ml: 'ശ്രവണ ഗ്രഹണം' },
            'idiomatic expressions': { en: 'Idiomatic expressions', ta: 'மரபுத்தொடர்கள்', te: 'సామెతలు & జాతీయాలు', kn: 'ನುಡಿಗಟ್ಟುಗಳು', hi: 'मुहावरे और लोकोक्तियाँ', ml: 'ശൈലികൾ' },
            'autonomous comprehension': { en: 'Autonomous comprehension', ta: 'சுயாதீன புரிதல்', te: 'స్వయం గ్రహణశక్తి', kn: 'ಸ್ವತಂತ್ರ ಗ್ರಹಿಕೆ', hi: 'स्वतंत्र समझ', ml: 'സ്വതന്ത്ര ഗ്രഹണം' },
            'register shifting (formal/informal)': { en: 'Formal / Informal', ta: 'முறைசாரா / முறைசார் பேச்சு', te: 'మర్యాదపూర్వక సంభాషణ', kn: 'ಔಪಚಾರಿಕ / ಅನೌಪಚಾರಿಕ', hi: 'औपचारिक व अनौपचारिक भाषा', ml: 'ഔദ്യോഗിക / അനൗദ്യോഗിക' },
            'professional & civic literacy': { en: 'Professional literacy', ta: 'தொழில்சார் கல்வியறிவு', te: 'వృత్తిపరమైన అక్షరాస్యత', kn: 'ವೃತ್ತಿಪರ ಸಾಕ್ಷರತೆ', hi: 'व्यावसायिक साक्षरता', ml: 'തൊഴിൽപരമായ അറിവ്' },
            'comprehensive bilingual mastery': { en: 'Bilingual mastery', ta: 'இருமொழித் தேர்ச்சி', te: 'ద్విభాషా ప్రావీణ్యం', kn: 'ದ್ವಿಭಾಷಾ ಪಾಂಡಿತ್ಯ', hi: 'द्विभाषी दक्षता', ml: 'ദ്വിഭാഷാ നൈപുണ്യം' }
        };

        const key = skill.toLowerCase().trim();
        return skillsMap[key]?.[lang] || skillsMap[key]?.['en'] || skill;
    };

    const getLocalizedNodeTitle = (title: string): string => {
        // Section 1
        if (/alphabet & characters|alphabet recognition/i.test(title)) {
            const tr: Record<string, string> = { en: 'Alphabet & Characters', ta: 'எழுத்துக்கள் & வடிவங்கள்', te: 'అక్షరాలు & లిపి', kn: 'ಅಕ್ಷರಗಳು & ರೂಪಗಳು', hi: 'वर्णमाला और अक्षर', ml: 'അക്ഷരങ്ങളും ലിപിയും' };
            return tr[lang] || tr['en'];
        }
        if (/basic sounds & phonics/i.test(title)) {
            const tr: Record<string, string> = { en: 'Basic Sounds & Phonics', ta: 'அடிப்படை ஒலிகள் & ஒலிப்பு', te: 'ప్రాథమిక శబ్దాలు & ఉచ్చారణ', kn: 'ಮೂಲ ಧ್ವನಿಗಳು & ಉಚ್ಚಾರಣೆ', hi: 'बुनियादी ध्वनियाँ और ध्वन्यात्मकता', ml: 'അടിസ്ഥാന ശബ്ദങ്ങൾ' };
            return tr[lang] || tr['en'];
        }
        if (/pronunciation basics & greetings|greetings & pronunciation/i.test(title)) {
            const tr: Record<string, string> = { en: 'Greetings & Pronunciation', ta: 'வாழ்த்துக்கள் & உச்சரிப்பு', te: 'శుభాకాంక్షలు & ఉచ్చారణ', kn: 'ಶುಭಾಶಯಗಳು & ಉಚ್ಚಾರಣೆ', hi: 'अभिवादन और उच्चारण', ml: 'ആശംസകളും ഉച്ചാരണവും' };
            return tr[lang] || tr['en'];
        }
        if (/numbers & very common words|numbers & common words/i.test(title)) {
            const tr: Record<string, string> = { en: 'Numbers & Common Words', ta: 'எண்கள் & பொதுச் சொற்கள்', te: 'సంఖ్యలు & సాధారణ పదాలు', kn: 'ಸಂಖ್ಯೆಗಳು & ಸಾಮಾನ್ಯ ಪದಗಳು', hi: 'संख्या और सामान्य शब्द', ml: 'സംഖ്യകളും പൊതുവാക്കുകളും' };
            return tr[lang] || tr['en'];
        }
        if (/foundations & script milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Foundations & Script Milestone', ta: 'அடிப்படை & எழுத்து மைல்கல் சோதனை', te: 'పునాది & లిపి మైలురాయి పరీక్ష', kn: 'ಮೂಲ & ಲಿಪಿ ಮೈಲಿಗಲ್ಲು ಪರೀಕ್ಷೆ', hi: 'बुनियाद और लिपि माइलस्टोन परीक्षा', ml: 'അടിസ്ഥാന നാഴികക്കല്ല് പരിശോധന' };
            return tr[lang] || tr['en'];
        }

        // Section 2
        if (/everyday vocabulary/i.test(title)) {
            const tr: Record<string, string> = { en: 'Everyday Vocabulary', ta: 'அன்றாட சொல்லகராதி', te: 'రోజువారీ పదజాలం', kn: 'ದೈನಂದಿನ ಶಬ್ದಕೋಶ', hi: 'दैनिक शब्दावली', ml: 'ദൈനംദിന പദാവലി' };
            return tr[lang] || tr['en'];
        }
        if (/common actions & verbs|action words/i.test(title)) {
            const tr: Record<string, string> = { en: 'Common Actions & Verbs', ta: 'பொதுவான செயல்கள் & வினைகள்', te: 'సాధారణ పనులు & క్రియలు', kn: 'ಸಾಮಾನ್ಯ ಕ್ರಿಯಾಪದಗಳು', hi: 'सामान्य क्रियाएं और कार्य', ml: 'സാധാരണ ക്രിയകൾ' };
            return tr[lang] || tr['en'];
        }
        if (/sentence builder/i.test(title)) {
            const tr: Record<string, string> = { en: 'Sentence Builder (SOV)', ta: 'வாக்கிய அமைப்பு (SOV)', te: 'వాక్యాల నిర్మాణం (SOV)', kn: 'ವಾಕ್ಯ ರಚನೆಕಾರ (SOV)', hi: 'वाक्य निर्माण (SOV)', ml: 'വാക്യ നിർമ്മാണം (SOV)' };
            return tr[lang] || tr['en'];
        }
        if (/questions & answers/i.test(title)) {
            const tr: Record<string, string> = { en: 'Questions & Answers', ta: 'கேள்விகள் & பதில்கள்', te: 'ప్రశ్నలు & సమాధానాలు', kn: 'ಪ್ರಶ್ನೆಗಳು & ಉತ್ತರಗಳು', hi: 'प्रश्न और उत्तर', ml: 'ചോദ്യങ്ങളും ഉത്തരങ്ങളും' };
            return tr[lang] || tr['en'];
        }
        if (/core sentences milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Core Sentences Milestone', ta: 'முக்கிய வாக்கியங்கள் மைல்கல் சோதனை', te: 'ముఖ్య వాక్యాల మైలురాయి పరీక్ష', kn: 'ಮುಖ್ಯ ವಾಕ್ಯಗಳ ಮೈಲಿಗಲ್ಲು ಪರೀಕ್ಷೆ', hi: 'मुख्य वाक्य माइलस्टोन परीक्षा', ml: 'പ്രധാന വാക്യങ്ങളുടെ നാഴികക്കല്ല്' };
            return tr[lang] || tr['en'];
        }

        // Section 3
        if (/word & sign reading|word reading/i.test(title)) {
            const tr: Record<string, string> = { en: 'Word & Sign Reading', ta: 'சொற்கள் & பலகைகள் வாசிப்பு', te: 'పదాలు & బోర్డుల పఠనం', kn: 'ಪದ ಮತ್ತು ಫಲಕಗಳ ಓದುವಿಕೆ', hi: 'शब्द और साइनबोर्ड पठन', ml: 'വാക്കുകളും ബോർഡുകളും വായിക്കൽ' };
            return tr[lang] || tr['en'];
        }
        if (/sentence reading & comprehension|sentence comprehension/i.test(title)) {
            const tr: Record<string, string> = { en: 'Sentence Reading & Comprehension', ta: 'வாக்கிய வாசிப்பு & புரிதல்', te: 'వాక్య పఠనం & గ్రహణశక్తి', kn: 'ವಾಕ್ಯ ಓದುವಿಕೆ & ಗ್ರಹಿಕೆ', hi: 'वाक्य पठन और समझ', ml: 'വാക്യ വായനയും ഗ്രഹണവും' };
            return tr[lang] || tr['en'];
        }
        if (/short cultural stories/i.test(title)) {
            const tr: Record<string, string> = { en: 'Short Cultural Stories & Fables', ta: 'கலாச்சார கதைகள் & நீதிக்கதைகள்', te: 'సాంస్కృతిక చిన్న కథలు & నీతికథలు', kn: 'ಸಾಂಸ್ಕೃತಿಕ ಸಣ್ಣ ಕಥೆಗಳು & ನೀತಿಕಥೆಗಳು', hi: 'लघु सांस्कृतिक कहानियाँ और लोककथाएं', ml: 'ചെറിയ സംസ്കാരിക കഥകൾ' };
            return tr[lang] || tr['en'];
        }
        if (/writing & spelling practice|spelling practice/i.test(title)) {
            const tr: Record<string, string> = { en: 'Writing & Spelling Practice', ta: 'எழுதுதல் & எழுத்துப் பயிற்சி', te: 'రాత & అక్షరక్రమ సాధన', kn: 'ಬರವಣಿಗೆ & ಕಾಗುಣಿತ ಅಭ್ಯಾಸ', hi: 'लेखन और वर्तनी अभ्यास', ml: 'എഴുത്തും അക്ഷരത്തെറ്റില്ലാത്ത പരിശീലനവും' };
            return tr[lang] || tr['en'];
        }
        if (/functional literacy milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Functional Literacy Milestone', ta: 'பயன்பாட்டு எழுத்தறிவு மைல்கல்', te: 'కార్యాచరణ అక్షరాస్యత మైలురాయి', kn: 'ಕಾರ್ಯಾತ್ಮಕ ಸಾಕ್ಷರತಾ ಮೈಲಿಗಲ್ಲು', hi: 'कार्यात्मक साक्षरता माइलस्टोन', ml: 'പ്രവർത്തന സാക്ഷരത നാഴികക്കല്ല്' };
            return tr[lang] || tr['en'];
        }

        // Section 4
        if (/transit & directions|transit navigation/i.test(title)) {
            const tr: Record<string, string> = { en: 'Transit & Directions Inquiries', ta: 'போக்குவரத்து & வழிகாட்டல் வினவல்கள்', te: 'ప్రయాణం & దారి వివరాలు', kn: 'ಸಾರಿಗೆ & ಮಾರ್ಗದರ್ಶನ ವಿಚಾರಣೆ', hi: 'यातायात और दिशा-निर्देश', ml: 'യാത്രയും വഴികളും ചോദിക്കൽ' };
            return tr[lang] || tr['en'];
        }
        if (/market.*bargaining|market.*dialogue|price bargaining/i.test(title)) {
            const tr: Record<string, string> = { en: 'Market & Price Bargaining', ta: 'சந்தை & பேரம் பேசுதல்', te: 'మార్కెట్ & బేరసారాల సంభాషణ', kn: 'ಮಾರುಕಟ್ಟೆ & ಚೌಕಾಶಿ ಸಂಭಾಷಣೆ', hi: 'बाज़ार और मोलभाव संवाद', ml: 'മാർക്കറ്റിലെ സാധനങ്ങൾ വാങ്ങലും വിലപേശലും' };
            return tr[lang] || tr['en'];
        }
        if (/asking for help|expressing needs/i.test(title)) {
            const tr: Record<string, string> = { en: 'Asking for Help & Expressing Needs', ta: 'உதவி கோருதல் & தேவைகள்', te: 'సహాయం కోరడం & అవసరాలు', kn: 'ಸಹಾಯ ಕೇಳುವುದು & ಅಗತ್ಯತೆಗಳು', hi: 'मदद मांगना और ज़रूरतें बताना', ml: 'സഹായം ചോദിക്കലും ആവശ്യങ്ങൾ പറയലും' };
            return tr[lang] || tr['en'];
        }
        if (/practical communication milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Practical Communication Milestone', ta: 'நடைமுறை தொடர்பு மைல்கல்', te: 'ఆచరణాత్మక కమ్యూనికేషన్ మైలురాయి', kn: 'ಪ್ರಾಯೋಗಿಕ ಸಂವಹನ ಮೈಲಿಗಲ್ಲು', hi: 'व्यावहारिक संवाद माइलस्टोन', ml: 'പ്രായോഗിക ആശയവിനിമയ നാഴികക്കല്ല്' };
            return tr[lang] || tr['en'];
        }

        // Section 5
        if (/extended conversational dialogues|multi-turn conversation/i.test(title)) {
            const tr: Record<string, string> = { en: 'Extended Conversational Dialogues', ta: 'நீண்ட உரையாடல் விவாதங்கள்', te: 'విస్తరించిన సంభాషణలు', kn: 'ವಿಸ್ತೃತ ಸಂಭಾಷಣೆಗಳು', hi: 'विस्तृत बातचीत और संवाद', ml: 'വിപുലമായ സംഭാഷണങ്ങൾ' };
            return tr[lang] || tr['en'];
        }
        if (/speaking fluency & pronunciation|pronunciation refinement/i.test(title)) {
            const tr: Record<string, string> = { en: 'Speaking Fluency & Refinement', ta: 'பேச்சு சரளம் & உச்சரிப்பு மேம்பாடு', te: 'మాట్లాడే సరళత & ఉచ్చారణ మెరుగుదల', kn: 'ಮಾತಿನ ನಿರರ್ಗಳತೆ & ಸುಧಾರಣೆ', hi: 'बोलने का प्रवाह और उच्चारण सुधार', ml: 'സംസാര ഒഴുക്കും ഉച്ചാരണ ശുദ്ധിയും' };
            return tr[lang] || tr['en'];
        }
        if (/expressing opinions|opinions & experiences/i.test(title)) {
            const tr: Record<string, string> = { en: 'Expressing Opinions & Experiences', ta: 'கருத்துக்கள் & அனுபவங்கள்', te: 'అభిప్రాయాలు & అనుభవాలు', kn: 'ಅಭಿಪ್ರಾಯಗಳು & ಅನುಭವಗಳು', hi: 'राय और अनुभव साझा करना', ml: 'അഭിപ്രായങ്ങളും അനുഭവങ്ങളും പങ്കിടൽ' };
            return tr[lang] || tr['en'];
        }
        if (/fluency & storytelling milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Fluency & Storytelling Milestone', ta: 'சரளம் & கதை சொல்லல் மைல்கல்', te: 'ధారాళత & కథనం మైలురాయి', kn: 'ನಿರರ್ಗಳತೆ & ಕಥೆ ಹೇಳುವ ಮೈಲಿಗಲ್ಲು', hi: 'धाराप्रवाह और कहानी वाचन माइलस्टोन', ml: 'ഒഴുക്കും കഥപറച്ചിലും നാഴികക്കല്ല്' };
            return tr[lang] || tr['en'];
        }

        // Section 6
        if (/advanced vocabulary & idioms|idiomatic expressions/i.test(title)) {
            const tr: Record<string, string> = { en: 'Advanced Vocabulary & Idioms', ta: 'மேம்பட்ட சொல்லகராதி & மரபுத்தொடர்கள்', te: 'ఉన్నత పదజాలం & జాతీయాలు', kn: 'ಸುಧಾರಿತ ಶಬ್ದಕೋಶ & ನುಡಿಗಟ್ಟುಗಳು', hi: 'उन्नत शब्दावली और मुहावरे', ml: 'ഉന്നത പദാവലിയും ശൈലികളും' };
            return tr[lang] || tr['en'];
        }
        if (/formal vs.*colloquial|register nuances/i.test(title)) {
            const tr: Record<string, string> = { en: 'Formal vs Colloquial Nuances', ta: 'முறைசார் vs நடைமுறை பேச்சு நுணுக்கங்கள்', te: 'మర్యాదపూర్వక vs సాధారణ భాషా శైలి', kn: 'ಔಪಚಾರಿಕ vs ಆಡುಮಾತಿನ ಭಾಷೆ', hi: 'औपचारिक बनाम अनौपचारिक भाषा शैली', ml: 'ഔദ്യോഗിക vs അനൗദ്യോഗിക സംഭാഷണം' };
            return tr[lang] || tr['en'];
        }
        if (/real-world documents|news comprehension/i.test(title)) {
            const tr: Record<string, string> = { en: 'Documents & News Comprehension', ta: 'செய்திகள் & ஆவணங்கள் புரிதல்', te: 'పత్రాలు & వార్తల గ్రహణశక్తి', kn: 'ನೈಜ ದಾಖಲೆಗಳು & ವಾರ್ತೆಗಳ ಗ್ರಹಿಕೆ', hi: 'समाचार और दस्तावेज़ समझ', ml: 'വാർത്തകളും ഔദ്യോഗിക രേഖകളും വായിക്കൽ' };
            return tr[lang] || tr['en'];
        }
        if (/summit of fluency|master certification/i.test(title)) {
            const tr: Record<string, string> = { en: 'Summit of Fluency & Master Certification', ta: 'முழு தேர்ச்சி உச்சி & சான்றிதழ்', te: 'భాషా ప్రావీణ్య శిఖరం & మాస్టర్ సర్టిఫికేషన్', kn: 'ಪ್ರವೀಣತೆಯ ಶಿಖರ & ಮಾಸ್ಟರ್ ಪ್ರಮಾಣಪತ್ರ', hi: 'धाराप्रवाह शिखर और मास्टर प्रमाणपत्र', ml: 'പൂർണ്ണ പ്രാവീണ്യവും മാസ്റ്റർ സർട്ടിഫിക്കറ്റും' };
            return tr[lang] || tr['en'];
        }

        // Generic Milestone fallback
        if (/milestone check|milestone/i.test(title)) {
            const tr: Record<string, string> = { en: 'Section Milestone Check', ta: 'மைல்கல் சோதனை', te: 'మైలురాయి పరీక్ష', kn: 'ಮೈಲಿಗಲ್ಲು ಪರೀಕ್ಷೆ', hi: 'माइलस्टोन परीक्षा', ml: 'നാഴികക്കല്ല് പരിശോധന' };
            return tr[lang] || tr['en'];
        }

        return title;
    };

    const getLocalizedNodeSubtitle = (sub: string): string => {
        if (/listen and recognize/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Listen and recognize letters and sounds', ta: 'எழுத்துக்களையும் ஒலிகளையும் கேட்டு அறியுங்கள்', te: 'అక్షరాలను మరియు శబ్దాలను విని గుర్తించండి', kn: 'ಅಕ್ಷರಗಳನ್ನು ಮತ್ತು ಧ್ವನಿಗಳನ್ನು ಕೇಳಿ ಗುರುತಿಸಿ', hi: 'अक्षरों और ध्वनियों को सुनकर पहचानें', ml: 'അക്ഷരങ്ങളും ശബ്ദങ്ങളും കേട്ട് തിരിച്ചറിയുക' };
            return tr[lang] || tr['en'];
        }
        if (/listen to native audio/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Listen to native audio and match patterns', ta: 'ஆடியோவைக் கேட்டு சரியானதை ஒப்பிடுங்கள்', te: 'ఆడియోను విని సరిపోలించండి', kn: 'ಆಡಿಯೊ ಆಲಿಸಿ ಸರಿಯಾದ್ದನ್ನು ಹೊಂದಿಸಿ', hi: 'ऑडियो सुनें और सही मिलान करें', ml: 'ഓഡിയോ കേട്ട് ശരിയായത് തിരഞ്ഞെടുക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/speak basic greetings|speak greetings/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Speak greetings aloud with teacher guidance', ta: 'ஆசிரியர் வழிகாட்டலுடன் உரக்கப் பேசுங்கள்', te: 'ఉపాధ్యాయుల మార్గదర్శకత్వంలో మాట్లాడండి', kn: 'ಶಿಕ್ಷಕರ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಮಾತನಾಡಿ', hi: 'शिक्षक के मार्गदर्शन से बोलकर अभ्यास करें', ml: 'അധ്യാപകന്റെ സഹായത്തോടെ ഉറക്കെ സംസാരിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/1-10 counting|starter words/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Master 1-10 counting and vital starter words', ta: '1-10 எண்களையும் தொடக்கச் சொற்களையும் கற்கவும்', te: '1-10 సంఖ్యలు మరియు ముఖ్యమైన ప్రాథమిక పదాలు', kn: '1-10 ಎಣಿಕೆ ಮತ್ತು ಮುಖ್ಯ ಆರಂಭಿಕ ಪದಗಳು', hi: '1-10 गिनती और आवश्यक शुरुआती शब्द सीखें', ml: '1-10 സംഖ്യകളും അടിസ്ഥാന വാക്കുകളും' };
            return tr[lang] || tr['en'];
        }
        if (/character recognition and core sound/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Demonstrate character recognition and core sound mastery', ta: 'எழுத்து அடையாளம் மற்றும் ஒலி தேர்ச்சியை நிரூபிக்கவும்', te: 'అక్షరాలు మరియు శబ్దాల ప్రావీణ్యం చూపించండి', kn: 'ಅಕ್ಷರ ಗುರುತಿಸುವಿಕೆ ಮತ್ತು ಧ್ವನಿ ಪ್ರಾವೀಣ್ಯತೆಯನ್ನು ಪ್ರದರ್ಶಿಸಿ', hi: 'वर्ण पहचान और ध्वनि दक्षता साबित करें', ml: 'അക്ഷരങ്ങളും ശബ്ദങ്ങളും തിരിച്ചറിയുക' };
            return tr[lang] || tr['en'];
        }
        if (/learn 50 essential nouns|nouns and daily objects/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Learn 50 essential nouns and daily objects', ta: '50 அன்றாட அத்தியாவசிய பெயர்களைக் கற்கவும்', te: '50 ముఖ్యమైన రోజువారీ వస్తువుల పేర్లు నేర్చుకోండి', kn: '50 ಅಗತ್ಯ ದೈನಂದಿನ ವಸ್ತುಗಳ ಹೆಸರುಗಳನ್ನು ಕಲಿಯಿರಿ', hi: '50 आवश्यक दैनिक वस्तुओं के नाम सीखें', ml: '50 അവശ്യ ദൈനംദിന പദങ്ങൾ പഠിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/frequent action verbs|action verbs/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Master frequent action verbs: go, come, eat, drink, read, and write', ta: 'முக்கிய செயல் வினைகளைத் தேர்ச்சி பெறுங்கள்: செல், வா, உண், குடி, படி, எழுது', te: 'ముఖ్యమైన క్రియా పదాలను నేర్చుకోండి: వెళ్ళు, రా, తిను, తాగు, చదువు, రాయి', kn: 'ಸಾಮಾನ್ಯ ಕ್ರಿಯಾಪದಗಳನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ: ಹೋಗು, ಬಾ, ತಿನ್ನು, ಕುಡಿ, ಓದು, ಬರೆ', hi: 'महत्वपूर्ण क्रियापदों पर महारत: जाना, आना, खाना, पीना, पढ़ना, लिखना', ml: 'പ്രധാന ക്രിയകൾ പരിശീലിക്കുക: പോകുക, വരിക, കഴിക്കുക, കുടിക്കുക, വായിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/arrange words into simple|subject-object-verb/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Arrange words into simple Subject-Object-Verb pattern sentences', ta: 'சொற்களை எளிய எழுவாய்-செயப்படுபொருள்-பயனிலை வாக்கியங்களாக அமையுங்கள்', te: 'పదాలను కర్త-కర్మ-క్రియ క్రమంలో సరళమైన వాక్యాలుగా అమర్చండి', kn: 'ಪದಗಳನ್ನು ಸರಳ ಕರ್ತೃ-ಕರ್ಮ-ಕ್ರಿಯೆ ಮಾದರಿಯ ವಾಕ್ಯಗಳಾಗಿ ಜೋಡಿಸಿ', hi: 'शब्दों को सरल कर्ता-कर्म-क्रिया (SOV) वाक्य में व्यवस्थित करें', ml: 'വാക്കുകൾ ചേർത്ത് ലളിതമായ വാക്യങ്ങൾ ഉണ്ടാക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/question markers|what, where/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Learn question markers: what, where, who, how much, and why', ta: 'கேள்விச் சொற்களைக் கற்கவும்: என்ன, எங்கே, யார், எவ்வளவு, ஏன்', te: 'ప్రశ్నల పదాలను నేర్చుకోండి: ఏమిటి, ఎక్కడ, ఎవరు, ఎంత, ఎందుకు', kn: 'ಪ್ರಶ್ನಾವಳಿ ಪದಗಳನ್ನು ಕಲಿಯಿರಿ: ಏನು, ಎಲ್ಲಿ, ಯಾರು, ಎಷ್ಟು, ಏಕೆ', hi: 'प्रश्नवाचक शब्द सीखें: क्या, कहाँ, कौन, कितना, और क्यों', ml: 'ചോദ്യ വാക്കുകൾ പഠിക്കുക: എന്താണ്, എവിടെ, ആര്, എത്ര, എന്ത് കൊണ്ട്' };
            return tr[lang] || tr['en'];
        }
        if (/form 5 sentences|answer simple everyday questions/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Form 5 sentences and answer simple everyday questions accurately', ta: '5 வாக்கியங்களை உருவாக்கி அன்றாடக் கேள்விகளுக்கு துல்லியமாக பதிலளிக்கவும்', te: '5 వాక్యాలను నిర్మించి సాధారణ ప్రశ్నలకు ఖచ్చితంగా సమాధానం ఇవ్వండి', kn: '5 ವಾಕ್ಯಗಳನ್ನು ರಚಿಸಿ ದೈನಂದಿನ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಿಖರವಾಗಿ ಉತ್ತರಿಸಿ', hi: '5 वाक्य बनाएं और दैनिक प्रश्नों के सटीक उत्तर दें', ml: '5 വാക്യങ്ങൾ ഉണ്ടാക്കി ലളിതമായ ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക' };
            return tr[lang] || tr['en'];
        }
        if (/shop boards, street signs|word & sign/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Read everyday shop boards, street signs, and station notices', ta: 'கடைகளின் பெயர்ப் பலகைகள், வீதிப் பலகைகள் மற்றும் அறிவிப்புகளைப் படியுங்கள்', te: 'షాప్ బోర్డులు, వీధి బోర్డులు మరియు స్టేషన్ నోటీసులు చదవండి', kn: 'ಅಂಗಡಿ ಫಲಕಗಳು, ರಸ್ತೆ ಫಲಕಗಳು ಮತ್ತು ನಿಲ್ದಾಣದ ಸೂಚನೆಗಳನ್ನು ಓದಿ', hi: 'दुकान के बोर्ड, सड़क के संकेत और स्टेशन की सूचनाएं पढ़ें', ml: 'കടകളുടെ ബോർഡുകളും സ്റ്റേഷൻ അറിയിപ്പുകളും വായിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/3-4 sentence paragraphs|extract key information/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Read 3-4 sentence paragraphs and extract key information', ta: '3-4 வாக்கியப் பத்திகளை வாசித்து முக்கிய தகவல்களைப் பிரித்தறியுங்கள்', te: '3-4 వాక్యాల పేరాలను చదివి ముఖ్యమైన సమాచారాన్ని గ్రహించండి', kn: '3-4 ವಾಕ್ಯಗಳ ಪ್ಯಾರಾಗ್ರಾಫ್‌ಗಳನ್ನು ಓದಿ ಮುಖ್ಯ ಮಾಹಿತಿ ಗ್ರಹಿಸಿ', hi: '3-4 वाक्यों के अनुच्छेदों को पढ़कर मुख्य जानकारी समझें', ml: '3-4 വാക്യ ഖണ്ഡികകൾ വായിച്ച് വിവരങ്ങൾ മനസ്സിലാക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/folk tales|cultural stories|reading comprehension/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Immerse in bilingual folk tales with reading comprehension questions', ta: 'இருமொழி நீதிக்கதைகளை வாசித்து புரிதல் வினாக்களுக்கு விடையளியுங்கள்', te: 'ద్విభాషా జానపద కథలను చదివి గ్రహణశక్తి ప్రశ్నలకు సమాధానమివ్వండి', kn: 'ದ್ವಿಭಾಷಾ ಜಾನಪದ ಕಥೆಗಳನ್ನು ಓದಿ ಗ್ರಹಿಕೆಯ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉತ್ತರಿಸಿ', hi: 'द्विभाषी लोककथाओं में डूबें और समझ आधारित प्रश्नों के उत्तर दें', ml: 'ദ്വിഭാഷാ നാടോടിക്കഥകൾ വായിച്ച് ചോദ്യങ്ങൾക്ക് ഉത്തരം നൽകുക' };
            return tr[lang] || tr['en'];
        }
        if (/correct spellings|writing & spelling/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Write correct spellings and construct short written responses', ta: 'சரியான எழுத்துக்கூட்டலுடன் எழுதி சிறு பதில்களை அமையுங்கள்', te: 'సరైన అక్షరక్రమంతో రాస్తూ చిన్న సమాధానాలు రాయండి', kn: 'ಸರಿಯಾದ ಕಾಗುಣಿತ ಬರೆಯಿರಿ ಮತ್ತು ಸಣ್ಣ ಲಿಖಿತ ಉತ್ತರಗಳನ್ನು ರಚಿಸಿ', hi: 'सही वर्तनी लिखें और छोटे लिखित उत्तर तैयार करें', ml: 'ശരിയായ അക്ഷരത്തെറ്റില്ലാതെ എഴുതാൻ പരിശീലിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/functional comprehension of written text/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Demonstrate functional comprehension of written text and notices', ta: 'எழுத்துப்பூர்வ உரைகள் மற்றும் அறிவிப்புகளின் பயன்பாட்டுப் புரிதலை நிரூபிக்கவும்', te: 'రాతపూర్వక వచనం మరియు నోటీసుల ఆచరణాత్మక గ్రహణశక్తిని ప్రదర్శించండి', kn: 'ಲಿಖಿತ ವಿಷಯ ಮತ್ತು ಸೂಚನೆಗಳ ಕಾರ್ಯಾತ್ಮಕ ಗ್ರಹಿಕೆಯನ್ನು ಪ್ರದರ್ಶಿಸಿ', hi: 'लिखित पाठ और सार्वजनिक सूचनाओं की व्यावहारिक समझ सिद्ध करें', ml: 'എഴുതിയ വാചകങ്ങൾ മനസ്സിലാക്കാനുള്ള കഴിവ് തെളിയിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/buses, trains, autos|street directions clearly/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Ask for buses, trains, autos, and street directions clearly', ta: 'பேருந்துகள், ரயில்கள், ஆட்டோக்கள் மற்றும் திசைகளைத் தெளிவாகக் கேளுங்கள்', te: 'బస్సులు, రైళ్లు, ఆటోలు మరియు వీధి మార్గాలను స్పష్టంగా అడగండి', kn: 'ಬಸ್ಸು, ರೈಲು, ಆಟೋ ಮತ್ತು ಬೀದಿ ಮಾರ್ಗಗಳನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿಚಾರಿಸಿ', hi: 'बस, ट्रेन, ऑटो और रास्ते के दिशा-निर्देश स्पष्ट रूप से पूछें', ml: 'ബസ്സ്, ട്രെയിൻ, ഓട്ടോ, വഴികൾ എന്നിവ വ്യക്തമായി ചോദിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/ask prices, negotiate quantities|complete purchases/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Ask prices, negotiate quantities, and complete purchases', ta: 'விலைகளைக் கேட்கவும், அளவுகளைப் பேரம் பேசவும், கொள்முதலை முடிக்கவும்', te: 'ధరలు అడగండి, పరిమాణాలపై బేరసారాలు చేయండి మరియు కొనుగోలు పూర్తి చేయండి', kn: 'ಬೆಲೆ ವಿಚಾರಿಸಿ, ಪ್ರಮಾಣ ಚೌಕಾಶಿ ಮಾಡಿ ಖರೀದಿಯನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ', hi: 'दाम पूछें, मात्रा पर मोलभाव करें और खरीदारी पूरी करें', ml: 'വില ചോദിക്കലും അളവുകൾ വിലപേശലും വാങ്ങലും' };
            return tr[lang] || tr['en'];
        }
        if (/request assistance politely|emergency situations/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Request assistance politely in medical, travel, or emergency situations', ta: 'மருத்துவம், பயணம் அல்லது அவசர சூழ்நிலைகளில் பணிவுடன் உதவி கோருங்கள்', te: 'వైద్య, ప్రయాణ లేదా అత్యవసర పరిస్థితుల్లో మర్యాదగా సహాయం కోరండి', kn: 'ವೈದ್ಯಕೀಯ, ಪ್ರಯಾಣ ಅಥವಾ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ವಿನಮ್ರವಾಗಿ ಸಹಾಯ ಕೇಳಿ', hi: 'चिकित्सा, यात्रा या आपात स्थिति में विनम्रता से सहायता मांगें', ml: 'ആരോഗ്യ, യാത്രാ അല്ലെങ്കിൽ അടിയന്തര ഘട്ടങ്ങളിൽ സഹായം തേടുക' };
            return tr[lang] || tr['en'];
        }
        if (/interactive dialogue missions/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Prepares you for Real-World interactive dialogue missions', ta: 'நடைமுறை ஊடாடும் உரையாடல் பணிகளுக்கு உங்களைத் தயார்படுத்துகிறது', te: 'నిజజీవిత పరస్పర సంభాషణల మిషన్లకు మిమ్మల్ని సిద్ధం చేస్తుంది', kn: 'ನೈಜ ಸಂವಾದಾತ್ಮಕ ಕಾರ್ಯಾಚರಣೆಗಳಿಗೆ ನಿಮ್ಮನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ', hi: 'आपको वास्तविक जीवन के संवादात्मक मिशनों के लिए तैयार करता है', ml: 'പ്രായോഗിക സംഭാഷണ ദൗത്യങ്ങൾക്ക് നിങ്ങളെ തയ്യാറാക്കുന്നു' };
            return tr[lang] || tr['en'];
        }
        if (/multi-turn spoken discussions|hobbies, weather, and routines/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Engage in multi-turn spoken discussions on hobbies, weather, and routines', ta: 'விருப்பங்கள், வானிலை மற்றும் அன்றாடப் பழக்கங்கள் குறித்து கலந்துரையாடுங்கள்', te: 'హాబీలు, వాతావరణం మరియు దినచర్యలపై బహుళ-సంభాషణలు సాగించండి', kn: 'ಹವ್ಯಾಸಗಳು, ಹವಾಮಾನ ಮತ್ತು ದಿನಚರಿಯ ಕುರಿತು ಬಹುಮುಖಿ ಸಂಭಾಷಣೆ ನಡೆಸಿ', hi: 'शौक, मौसम और दिनचर्या पर बहु-चरणीय बातचीत में भाग लें', ml: 'വിവിധ വിഷയങ്ങളിൽ തുടർ സംഭാഷണങ്ങൾ നടത്തുക' };
            return tr[lang] || tr['en'];
        }
        if (/refine intonation, syllable timing|speech rhythm/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Refine intonation, syllable timing, and speech rhythm with AI voice feedback', ta: 'AI பின்னூட்டத்துடன் ஒலி ஏற்ற இறக்கம், நேரக் கட்டுப்பாடு மற்றும் பேச்சு லயத்தை மேம்படுத்துங்கள்', te: 'AI ఫీడ్‌బ్యాక్‌తో ఉచ్చారణ శైలి, అక్షర సమయం మరియు మాటల లయను మెరుగుపరచండి', kn: 'AI ಪ್ರತಿಕ್ರಿಯೆಯೊಂದಿಗೆ ಧ್ವನಿ ಏರಿಳಿತ ಮತ್ತು ಮಾತಿನ ಲಯವನ್ನು ಉತ್ತಮಗೊಳಿಸಿ', hi: 'AI वॉइस फीडबैक से सुर, लय और उच्चारण का समय सुधारें', ml: 'AI സഹായത്തോടെ സംസാര ശൈലിയും ഒഴുക്കും മെച്ചപ്പെടുത്തുക' };
            return tr[lang] || tr['en'];
        }
        if (/describe past events|explain personal viewpoints/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Describe past events, explain personal viewpoints, and compare preferences', ta: 'கடந்த நிகழ்வுகளை விவரிக்கவும், கருத்துக்களை விளக்கவும், விருப்பங்களை ஒப்பிடவும்', te: 'గత సంఘటనలను వివరించండి, వ్యక్తిగత అభిప్రాయాలు చెప్పండి మరియు ప్రాధాన్యతలను పోల్చండి', kn: 'ಹಿಂದಿನ ಘಟನೆಗಳನ್ನು ವಿವರಿಸಿ, ವೈಯಕ್ತಿಕ ದೃಷ್ಟಿಕೋನಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಿ ಮತ್ತು ಹೋಲಿಸಿ', hi: 'पिछली घटनाओं का वर्णन करें, व्यक्तिगत दृष्टिकोण बताएं और तुलना करें', ml: 'കഴിഞ്ഞ കാര്യങ്ങൾ വിവരിക്കുകയും അഭിപ്രായങ്ങൾ പങ്കുവെക്കുകയും ചെയ്യുക' };
            return tr[lang] || tr['en'];
        }
        if (/narrate a 1-minute personal story/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Narrate a 1-minute personal story in the target language', ta: 'இலக்கு மொழியில் 1 நிமிட சுய கதையைக் கூறுங்கள்', te: 'లక్ష్య భాషలో 1 నిమిషం వ్యక్తిగత కథను వివరించండి', kn: 'ಗುರಿ ಭಾಷೆಯಲ್ಲಿ 1 ನಿಮಿಷದ ವೈಯಕ್ತಿಕ ಕಥೆಯನ್ನು ನಿರೂಪಿಸಿ', hi: 'लक्षित भाषा में 1 मिनट की व्यक्तिगत कहानी सुनाएं', ml: 'പഠിക്കുന്ന ഭാഷയിൽ 1 മിനിറ്റ് കഥ പറയുക' };
            return tr[lang] || tr['en'];
        }
        if (/nuanced adjectives, cultural metaphors|idiomatic phrases/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Nuanced adjectives, cultural metaphors, and idiomatic phrases', ta: 'நுட்பமான அடைமொழிகள், பண்பாட்டு உருவகங்கள் மற்றும் மரபுத்தொடர்கள்', te: 'సూక్ష్మ విశేషణాలు, సాంస్కృతిక రూపకాలు మరియు జాతీయాలు', kn: 'ಸೂಕ್ಷ್ಮ ಗುಣವಾಚಕಗಳು, ಸಾಂಸ್ಕೃತಿಕ ರೂಪಕಗಳು ಮತ್ತು ನುಡಿಗಟ್ಟುಗಳು', hi: 'गहन विशेषण, सांस्कृतिक रूपक और मुहावरेदार वाक्यांश', ml: 'സൂക്ഷ്മ വിശേഷണങ്ങളും സംസ്കാരിക രൂപകങ്ങളും ശൈലികളും' };
            return tr[lang] || tr['en'];
        }
        if (/master polite honorifics|workplace conventions/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Master polite honorifics, workplace conventions, and casual peer slang', ta: 'மரியாதைச் சொற்கள், பணியிட மரபுகள் மற்றும் சக நண்பர்களின் பேச்சு பாணியைத் தேருங்கள்', te: 'గౌరవవాచకాలు, కార్యాలయ సంప్రదాయాలు మరియు స్నేహితుల మాటల తీరుపై పట్టు సాధించండి', kn: 'ಮರ್ಯಾದೆಯ ಪದಗಳು, ಕಚೇರಿ ಶಿಷ್ಟಾಚಾರ ಮತ್ತು ಸ್ನೇಹಿತರ ಆಡುಮಾತನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ', hi: 'आदरसूचक शब्द, कार्यस्थल की औपचारिकताएं और बोलचाल की भाषा सीखें', ml: 'ബഹുമാന സൂചകങ്ങളും തൊഴിലിട ശൈലികളും മനസ്സിലാക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/articles, official announcements|professional correspondence/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Read articles, official announcements, and professional correspondence', ta: 'கட்டுரைகள், உத்தியோகபூர்வ அறிவிப்புகள் மற்றும் தொழில்சார் கடிதங்களைப் படியுங்கள்', te: 'వ్యాసాలు, అధికారిక ప్రకటనలు మరియు వృత్తిపరమైన ఉత్తరప్రత్యుత్తరాలు చదవండి', kn: 'ಲೇಖನಗಳು, ಅಧಿಕೃತ ಪ್ರಕಟಣೆಗಳು ಮತ್ತು ವೃತ್ತಿಪರ ಪತ್ರವ್ಯವಹಾರಗಳನ್ನು ಓದಿ', hi: 'लेख, आधिकारिक घोषणाएं और व्यावसायिक पत्र-व्यवहार पढ़ें', ml: 'ലേഖനങ്ങളും ഔദ്യോഗിക അറിയിപ്പുകളും വായിക്കുക' };
            return tr[lang] || tr['en'];
        }
        if (/capstone assessment demonstrating independent bilingual mastery/i.test(sub)) {
            const tr: Record<string, string> = { en: 'Comprehensive capstone assessment demonstrating independent bilingual mastery', ta: 'முழுமையான இருமொழி தேர்ச்சியை நிரூபிக்கும் இறுதி மதிப்பீடு', te: 'స్వతంత్ర ద్విభాషా ప్రావీణ్యాన్ని నిరూపించే సమగ్ర తుది పరీక్ష', kn: 'ಸ್ವತಂತ್ರ ದ್ವಿಭಾಷಾ ಪಾಂಡಿತ್ಯವನ್ನು ಪ್ರದರ್ಶಿಸುವ ಸಮಗ್ರ ಅಂತಿಮ ಮೌಲ್ಯಮಾಪನ', hi: 'स्वतंत्र द्विभाषी दक्षता प्रदर्शित करने वाला व्यापक अंतिम मूल्यांकन', ml: 'സ്വതന്ത്ര ദ്വിഭാഷാ വൈദഗ്ദ്ധ്യം തെളിയിക്കുന്ന സമഗ്ര പരീക്ഷ' };
            return tr[lang] || tr['en'];
        }

        return sub;
    };

    useEffect(() => {
        loadData();
    }, [supportLangCode]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const targetCode = profile?.target_language?.code || 'hi';
            const data = await learningPathService.getLearningPath(targetCode, supportLangCode);
            setUnits(data.units);
            setProgress(data.progress);
        } catch (err) {
            console.error('Error loading path', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNodeClick = (node: LessonNode, unit: LearningPathUnit) => {
        if (node.status === 'locked') {
            setPreviewUnit(unit);
            return;
        }
        setActiveNode(node);
        setLessonAnswer(null);
        setIsLessonSubmitted(false);
        setIsLessonModalOpen(true);
    };

    const handleCompleteLesson = async () => {
        if (!activeNode) return;
        setIsLessonSubmitted(true);
        try {
            const res = await learningPathService.completeLesson(activeNode.id);

            // Update local units state: mark active node as completed and calculate progression
            setUnits(prevUnits => {
                const updated = prevUnits.map(u => {
                    const newNodes = u.nodes.map(n => {
                        if (n.id === activeNode.id) return { ...n, status: 'completed' as const };
                        if (n.order === activeNode.order + 1 && n.status === 'locked') return { ...n, status: 'unlocked' as const };
                        return n;
                    });
                    const completedCount = newNodes.filter(n => n.status === 'completed').length;
                    const pct = Math.round((completedCount / newNodes.length) * 100);
                    const status = pct === 100 ? ('completed' as const) : u.status;
                    return { ...u, nodes: newNodes, completion_percentage: pct, status };
                });
                return updated;
            });

            setProgress(prev => prev ? {
                ...prev,
                xp_total: res.total_xp,
                streak_count: res.streak_count,
                completed_lessons: [...(prev.completed_lessons || []), activeNode.id]
            } : null);

            setTimeout(() => {
                setIsLessonModalOpen(false);
                setIsCompletedModalOpen(true);
            }, 800);
        } catch (err) {
            console.error('Error completing lesson', err);
        }
    };

    if (isLoading || !progress) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                <p className="text-sm font-medium text-slate-600">{t('lp_loading')}</p>
            </div>
        );
    }

    const targetLangName = profile?.target_language?.name || 'Hindi';
    const targetFlag = profile?.target_language?.flagEmoji || '🇮🇳';

    const currentActiveUnit = units.find(u => u.status === 'current') || units[0];

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-7 animate-fade-in pb-20 text-slate-900">
            {/* Header & Navigation */}
            <div className="space-y-2">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 bg-white hover:bg-brand-50 px-3.5 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> {t('lp_back_home')}
                </button>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                            <span>🌱</span> {t('lp_title')}
                        </h1>
                        <p className="text-xs md:text-sm text-slate-600 mt-1">
                            {t('lp_subtitle')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Top Sticky Gamification Header Bar */}
            <div className="sticky top-4 z-30 bg-white/95 backdrop-blur-md p-4 rounded-3xl border border-slate-200/90 shadow-md flex items-center justify-between">
                {/* Target Language Indicator */}
                <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{targetFlag}</span>
                    <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                            {t('target_language_label')}
                        </span>
                        <span className="text-sm font-black text-slate-900">{targetLangName}</span>
                    </div>
                </div>

                {/* Gamified Stats Badges */}
                <div className="flex items-center gap-2.5">
                    {/* Streak */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-amber-900 font-extrabold text-xs shadow-2xs">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{progress.streak_count} {t('day_streak')}</span>
                    </div>

                    {/* Total XP */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200/90 rounded-2xl text-brand-900 font-extrabold text-xs shadow-2xs">
                        <Star className="w-4 h-4 text-brand-600 fill-brand-600" />
                        <span>{progress.xp_total} XP</span>
                    </div>

                    {/* Active Section Tracker */}
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 border border-teal-200/90 rounded-2xl text-teal-900 font-extrabold text-xs">
                        <Target className="w-4 h-4 text-teal-600" />
                        <span>{t('lp_stage_of')} {currentActiveUnit?.unit_number || 1} / {units.length}</span>
                    </div>
                </div>
            </div>

            {/* 6-Section Visual Overview & Curriculum Roadmap */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-400">
                            <Brain className="w-4 h-4 text-teal-400" /> {t('lp_curriculum_roadmap')}
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5">
                            {t('lp_curriculum_desc')}
                        </p>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 bg-white/10 rounded-xl text-teal-300 self-start sm:self-auto">
                        {t('lp_current_badge')} {t('lp_section_label')} {currentActiveUnit?.unit_number || 1}
                    </span>
                </div>

                {/* Grid of 6 Progression Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {units.map((unit) => {
                        const isCompleted = unit.status === 'completed' || unit.completion_percentage === 100;
                        const isCurrent = unit.status === 'current';
                        const isLocked = unit.status === 'locked' && !isCompleted && !isCurrent;
                        const pct = unit.completion_percentage ?? 0;

                        return (
                            <div
                                key={unit.id}
                                className={`p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                                    isCompleted
                                        ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400/60'
                                        : isCurrent
                                            ? 'bg-brand-950/60 border-brand-400/80 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-brand-400/50'
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                }`}
                            >
                                    <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {t('lp_section_label')} {unit.unit_number}
                                        </span>
                                        {isCompleted ? (
                                            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {t('lp_completed_badge')}
                                            </span>
                                        ) : isCurrent ? (
                                            <span className="text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                                                <Play className="w-3 h-3 fill-amber-300" /> {t('lp_current_section_badge')}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Lock className="w-3 h-3" /> {t('lp_locked_badge')}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-sm font-black text-white leading-tight">
                                        {getLocalizedSectionTitle(unit.unit_number, unit.title)}
                                    </h4>

                                    {/* Progress Bar */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                                            <span>{t('lp_progress_label')}</span>
                                            <span className={isCompleted ? 'text-emerald-400' : isCurrent ? 'text-amber-300' : 'text-slate-400'}>
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isCompleted
                                                        ? 'bg-emerald-400'
                                                        : isCurrent
                                                            ? 'bg-gradient-to-r from-amber-400 to-brand-500'
                                                            : 'bg-slate-700'
                                                }`}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Measurable Skills */}
                                    {unit.skills && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {unit.skills.slice(0, 2).map((sk, idx) => (
                                                <span key={idx} className="text-[9px] font-semibold text-slate-300 bg-white/5 px-1.5 py-0.5 rounded">
                                                    • {getLocalizedSkill(sk)}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Preview Button for Locked Sections */}
                                {isLocked && (
                                    <button
                                        type="button"
                                        onClick={() => setPreviewUnit(unit)}
                                        className="mt-3 w-full py-1 px-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[10px] font-bold text-teal-300 flex items-center justify-center gap-1 transition cursor-pointer"
                                    >
                                        <Eye className="w-3 h-3" />
                                        <span>{t('lp_preview_section_btn')}</span>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vertical Gamified Path - All 6 Sections */}
            <div className="space-y-14 py-4">
                {units.map((unit) => {
                    const isCompleted = unit.status === 'completed' || unit.completion_percentage === 100;
                    const isCurrent = unit.status === 'current';
                    const isLocked = unit.status === 'locked' && !isCompleted && !isCurrent;

                    const themeGradient = unit.color_theme === 'teal'
                        ? 'bg-gradient-to-r from-teal-700 via-emerald-600 to-teal-800'
                        : unit.color_theme === 'purple'
                            ? 'bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-900'
                            : unit.color_theme === 'amber'
                                ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700'
                                : 'bg-gradient-to-r from-brand-700 via-indigo-600 to-purple-800';

                    return (
                        <div key={unit.id} className="space-y-8">
                            {/* Unit Section Header Banner */}
                            <div className={`p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden transition-all ${themeGradient} ${
                                isLocked ? 'opacity-90 saturate-75' : ''
                            }`}>
                                <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                                    <div className="space-y-2 max-w-xl">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-white">
                                                <Award className="w-3.5 h-3.5 text-amber-300" /> {t('lp_section_label')} {unit.unit_number}
                                            </span>
                                            {isCompleted ? (
                                                <span className="text-[10px] font-black uppercase text-emerald-200 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-400/40">
                                                    {t('lp_completed_100')}
                                                </span>
                                            ) : isCurrent ? (
                                                <span className="text-[10px] font-black uppercase text-amber-200 bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
                                                    → {t('lp_current_section_badge')} ({unit.completion_percentage ?? 0}%)
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold text-slate-200 bg-black/30 px-2.5 py-0.5 rounded-full border border-white/20">
                                                    🔒 {unit.unlock_requirement || `${t('lp_unlocks_after')} ${unit.unit_number - 1}`}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                                            {t('lp_section_label')} {unit.unit_number}: {getLocalizedSectionTitle(unit.unit_number, unit.title)}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed">
                                            {getLocalizedSectionDesc(unit.unit_number, unit.description)}
                                        </p>

                                        {/* Measurable Skills Badges */}
                                        {unit.skills && (
                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {unit.skills.map((skill, sIdx) => (
                                                    <span key={sIdx} className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded-md text-white">
                                                        ✓ {getLocalizedSkill(skill)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action on Header */}
                                    <div className="shrink-0 flex sm:flex-col items-center gap-2">
                                        {isLocked ? (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => setPreviewUnit(unit)}
                                                leftIcon={<Eye className="w-3.5 h-3.5" />}
                                                className="bg-white/20 hover:bg-white/30 text-white border-none text-xs font-bold"
                                            >
                                                {t('lp_preview_btn_label')}
                                            </Button>
                                        ) : (
                                            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md shadow-lg hidden sm:block">
                                                <Trophy className="w-8 h-8 text-amber-300" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Node Path Column */}
                            <div className="flex flex-col items-center space-y-8 relative py-6">
                                {unit.nodes.map((node, index) => {
                                    const isNodeCompleted = node.status === 'completed';
                                    const isNodeUnlocked = node.status === 'unlocked';
                                    const isNodeLocked = node.status === 'locked';

                                    const offsets = ['translate-x-0', '-translate-x-10 sm:-translate-x-16', 'translate-x-0', 'translate-x-10 sm:translate-x-16', 'translate-x-0'];
                                    const offsetClass = offsets[index % offsets.length];

                                    // Dynamic Activity Icon
                                    const getNodeIcon = () => {
                                        const text = (node.title + ' ' + (node.subtitle || '') + ' ' + (node.node_type || '')).toLowerCase();
                                        if (text.includes('alphabet') || text.includes('letter') || text.includes('swar')) return '🔤';
                                        if (text.includes('sound') || text.includes('phonetic')) return '🔊';
                                        if (text.includes('word') || text.includes('starter')) return '🧩';
                                        if (text.includes('vocab') || node.node_type === 'vocabulary') return '📚';
                                        if (text.includes('sentence') || text.includes('dialogue')) return '💬';
                                        if (text.includes('read') || node.node_type === 'reading') return '📖';
                                        if (text.includes('writ') || text.includes('script') || text.includes('spell')) return '✍️';
                                        if (text.includes('listen') || node.node_type === 'listening') return '🎧';
                                        if (text.includes('speak') || node.node_type === 'speaking') return '🎤';
                                        if (text.includes('transit') || text.includes('market') || text.includes('help')) return '🌍';
                                        if (node.node_type === 'milestone') return '🏆';
                                        return '🌱';
                                    };

                                    return (
                                        <div key={node.id} className={`flex flex-col items-center group transition-transform ${offsetClass} relative`}>
                                            {/* Connector Line */}
                                            {index > 0 && (
                                                <div className={`w-2.5 h-10 mb-2 rounded-full transition-all ${
                                                    isNodeCompleted ? 'bg-gradient-to-b from-teal-400 to-emerald-500 shadow-xs' : 'bg-slate-300/80'
                                                }`} />
                                            )}

                                            {/* Companion Mascot on Active Node */}
                                            {isNodeUnlocked && !isLocked && (
                                                <div className="hidden sm:flex items-center gap-2 absolute -left-36 top-2 z-20 animate-float-subtle-1">
                                                    <LingoBot size="sm" expression="encouraging" />
                                                    <div className="bg-white/95 px-2.5 py-1.5 rounded-xl border border-brand-200 shadow-md text-[10px] font-bold text-brand-900 whitespace-nowrap">
                                                        {t('lp_you_are_here')}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Companion Mascot on Milestone Node */}
                                            {node.node_type === 'milestone' && (
                                                <div className="hidden sm:flex items-center gap-2 absolute -right-36 top-2 z-20 animate-float-subtle-2">
                                                    <div className="bg-white/95 px-2.5 py-1.5 rounded-xl border border-amber-200 shadow-md text-[10px] font-bold text-amber-900 whitespace-nowrap">
                                                        {t('lp_section_goal')}
                                                    </div>
                                                    <AtlasTraveler size="sm" />
                                                </div>
                                            )}

                                            {/* Interactive Node Button */}
                                            <button
                                                onClick={() => handleNodeClick(node, unit)}
                                                className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                                                    isNodeCompleted
                                                        ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white ring-4 ring-emerald-300/80 hover:scale-105 shadow-teal-500/40'
                                                        : isNodeUnlocked
                                                            ? 'bg-gradient-to-br from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white ring-8 ring-brand-300/40 animate-pulse hover:scale-110 shadow-brand-500/50'
                                                            : 'bg-slate-200 text-slate-400 hover:bg-slate-300 border-4 border-slate-300 hover:scale-102'
                                                }`}
                                                title={isNodeLocked ? "Preview Section Information" : "Start Activity"}
                                            >
                                                {isNodeCompleted ? (
                                                    <div className="flex flex-col items-center">
                                                        <CheckCircle2 className="w-8 h-8 text-white" />
                                                        <span className="text-xs font-bold text-white/90">{getNodeIcon()}</span>
                                                    </div>
                                                ) : isNodeLocked ? (
                                                    <div className="flex flex-col items-center opacity-70">
                                                        <Lock className="w-6 h-6 text-slate-500 mb-0.5" />
                                                        <span className="text-xs grayscale">{getNodeIcon()}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-3xl sm:text-4xl filter drop-shadow">
                                                        {getNodeIcon()}
                                                    </span>
                                                )}

                                                {isNodeUnlocked && (
                                                    <span className="absolute -top-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-amber-300 whitespace-nowrap animate-bounce">
                                                        <Play className="w-3 h-3 fill-slate-950" /> {t('lp_start_label')}
                                                    </span>
                                                )}
                                            </button>

                                            {/* Node Title & Subtitle Card */}
                                            <div className="mt-2.5 text-center max-w-[220px] bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200/90 shadow-md">
                                                <div className="flex items-center justify-center gap-1 mb-0.5">
                                                    <span className="text-xs">{getNodeIcon()}</span>
                                                    <p className="text-xs sm:text-sm font-black text-slate-900 line-clamp-1">{getLocalizedNodeTitle(node.title)}</p>
                                                </div>
                                                <p className="text-[11px] font-medium text-slate-500 line-clamp-1">{getLocalizedNodeSubtitle(node.subtitle || '')}</p>
                                                <div className="flex items-center justify-center gap-1.5 mt-1.5">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
                                                        <Star className="w-3 h-3 fill-brand-600 text-brand-600" /> +{node.xp_reward} XP
                                                    </span>
                                                    {isNodeCompleted && (
                                                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                                            {t('lp_mastered_label')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Section Preview Modal (For Locked Sections) */}
            {previewUnit && (
                <Modal
                    isOpen={!!previewUnit}
                    onClose={() => setPreviewUnit(null)}
                    title={`${t('lp_preview_section_goal')}: ${getLocalizedSectionTitle(previewUnit.unit_number, previewUnit.title)}`}
                >
                    <div className="space-y-5 py-2">
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 space-y-2">
                            <div className="flex items-center gap-2 text-indigo-900 font-extrabold text-xs uppercase tracking-wider">
                                <Compass className="w-4 h-4 text-indigo-600" />
                                <span>{t('lp_section_label')} {previewUnit.unit_number} {t('lp_preview_section_goal')}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                {getLocalizedSectionDesc(previewUnit.unit_number, previewUnit.description)}
                            </p>
                        </div>

                        {/* What You Will Learn */}
                        {previewUnit.preview?.whatYouWillLearn && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 text-brand-600" /> {t('lp_what_you_will_learn')}
                                </h4>
                                <ul className="space-y-1.5">
                                    {previewUnit.preview.whatYouWillLearn.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Why It Matters */}
                        {previewUnit.preview?.whyItMatters && (
                            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-900 space-y-1">
                                <span className="font-bold flex items-center gap-1 text-amber-800">
                                    {t('lp_why_it_matters')}
                                </span>
                                <p className="leading-relaxed">{previewUnit.preview.whyItMatters}</p>
                            </div>
                        )}

                        {/* How To Unlock */}
                        <div className="p-3 bg-slate-100 rounded-2xl text-xs text-slate-700 flex items-center justify-between">
                            <div>
                                <span className="font-bold block text-slate-900">{t('lp_how_to_unlock')}</span>
                                <span>{previewUnit.preview?.howToUnlock || previewUnit.unlock_requirement}</span>
                            </div>
                            <LingoBot size="sm" expression="encouraging" />
                        </div>

                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => setPreviewUnit(null)}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-extrabold"
                        >
                            {t('lp_got_it_btn')}
                        </Button>
                    </div>
                </Modal>
            )}

            {/* Interactive Lesson Modal Player */}
            {isLessonModalOpen && activeNode && (
                <Modal
                    isOpen={isLessonModalOpen}
                    onClose={() => setIsLessonModalOpen(false)}
                    title={`${t('lp_ai_teacher_lesson')} ${getLocalizedNodeTitle(activeNode.title)}`}
                >
                    <div className="space-y-6 py-2">
                        <div className="flex items-center justify-between p-3 bg-brand-50 rounded-2xl text-xs font-bold text-brand-900 border border-brand-200">
                            <span>{t('lp_activity_label')} {getLocalizedNodeSubtitle(activeNode.subtitle || '')}</span>
                            <span className="flex items-center gap-1 text-amber-600">
                                <Star className="w-4 h-4 fill-amber-500" /> {t('lp_reward_label')} +{activeNode.xp_reward} XP
                            </span>
                        </div>

                        {(() => {
                            const targetCode = profile?.target_language?.code || 'hi';
                            const targetName = profile?.target_language?.name || 'Hindi';

                            if (activeNode.node_type === 'speaking') {
                                const targetPhrase = activeNode.payload?.targetPhrase || (targetCode === 'hi' ? 'नमस्ते' : 'Hello');
                                const phonetics = activeNode.payload?.phonetics || (targetCode === 'hi' ? 'Namaste' : 'Hello');

                                return (
                                    <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-5 text-center">
                                        <div className="p-2 bg-purple-50 border border-purple-200 rounded-xl text-xs font-semibold text-purple-900">
                                            🎙️ <span className="font-bold">{t('lp_speak_activity_hint')}</span> {targetName}!
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-brand-200 shadow-sm inline-flex items-center gap-3 px-8">
                                            <div>
                                                <div className="text-2xl font-extrabold text-brand-700">{targetPhrase}</div>
                                                <div className="text-xs text-slate-500 font-semibold">{phonetics}</div>
                                            </div>
                                            <button
                                                onClick={() => voiceService.speakText(targetPhrase, targetCode)}
                                                className="p-2 bg-brand-50 hover:bg-brand-100 rounded-xl text-brand-600 transition cursor-pointer"
                                                title="Listen to Teacher Pronunciation"
                                            >
                                                <Volume2 className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                                            <p className="text-xs font-bold text-slate-600">{t('lp_speak_click_mic')} {targetName}:</p>
                                            <button
                                                onClick={() => {
                                                    voiceService.startSpeechToText(
                                                        (transcript) => {
                                                            const res = voiceService.evaluatePronunciation(transcript, targetPhrase);
                                                            if (res.score >= 50) {
                                                                setLessonAnswer(1);
                                                            }
                                                        },
                                                        (err) => console.error(err),
                                                        targetCode
                                                    );
                                                }}
                                                className="p-5 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition animate-pulse cursor-pointer"
                                            >
                                                <Mic className="w-8 h-8" />
                                            </button>
                                            <p className="text-[11px] text-slate-400 font-medium">{t('lp_speak_stt_api')}</p>
                                        </div>
                                    </div>
                                );
                            }

                            const options = activeNode.payload?.options || [
                                { text: 'Correct Answer', isCorrect: true },
                                { text: 'Alternative Option', isCorrect: false },
                                { text: 'Other Choice', isCorrect: false }
                            ];

                            return (
                                <div className="space-y-4">
                                    <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-1">
                                        <p className="text-xs font-bold text-indigo-900">{t('lp_select_translation')}</p>
                                        <div className="text-2xl font-black text-slate-900">
                                            {activeNode.payload?.teachItem?.word || activeNode.payload?.teachItem?.symbol || activeNode.payload?.teachItem?.targetText || 'नमस्ते'}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {options.map((opt: any, idx: number) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => setLessonAnswer(idx)}
                                                className={`w-full text-left p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                                                    lessonAnswer === idx
                                                        ? 'bg-brand-50 border-brand-500 text-brand-900 shadow-sm'
                                                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                                                }`}
                                            >
                                                <span>{opt.text}</span>
                                                {lessonAnswer === idx && <CheckCircle2 className="w-4 h-4 text-brand-600" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="pt-2 flex items-center justify-end gap-3">
                            <Button variant="outline" size="sm" onClick={() => setIsLessonModalOpen(false)}>
                                {t('lp_cancel_btn')}
                            </Button>
                            <Button
                                variant="primary"
                                size="sm"
                                disabled={lessonAnswer === null || isLessonSubmitted}
                                onClick={handleCompleteLesson}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold"
                            >
                                {isLessonSubmitted ? t('lp_submitting') : t('lp_complete_activity_btn')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Lesson Completion Celebration Modal */}
            {isCompletedModalOpen && (
                <Modal
                    isOpen={isCompletedModalOpen}
                    onClose={() => setIsCompletedModalOpen(false)}
                    title={t('lp_lesson_mastered_title')}
                >
                    <div className="text-center space-y-4 py-4">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                            <Trophy className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">{t('lp_outstanding_progress')}</h3>
                        <p className="text-xs text-slate-600 max-w-sm mx-auto">
                            {t('lp_earned_xp')}
                        </p>
                        <div className="pt-2">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => setIsCompletedModalOpen(false)}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold w-full"
                            >
                                {t('lp_continue_path_btn')}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

        </div>
    );
};
