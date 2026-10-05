import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { lingoBotService } from '../services/lingoBotService';
import { lingoCityService } from '../services/lingoCityService';
import { LingoBotCustomization, DEFAULT_CUSTOMIZATION } from '../types/lingobot';
import { CityStory, DetectiveCase, LingoCityState } from '../types/lingoCity';
import { CustomizableLingoBot } from '../components/lingobot/CustomizableLingoBot';
import { AtlasTraveler, LexiReader } from '../components/common/LingoCharacters';
import { StoryTheaterModal } from '../components/city/StoryTheaterModal';
import { DetectiveBureauModal } from '../components/city/DetectiveBureauModal';
import { LanguageMuseumModal } from '../components/city/LanguageMuseumModal';
import { LanguageGardenModal } from '../components/city/LanguageGardenModal';
import { Badge } from '../components/ui/Badge';
import {
    Sparkles,
    Compass,
    Film,
    Search,
    Landmark,
    Sprout
} from 'lucide-react';

export const LingoCityPage: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useTranslation();

    const [lingoBotConfig, setLingoBotConfig] = useState<LingoBotCustomization>(DEFAULT_CUSTOMIZATION);
    const [cityState, setCityState] = useState<LingoCityState>(lingoCityService.getCityState());

    // Modals
    const [activeStory, setActiveStory] = useState<CityStory | null>(null);
    const [activeDetectiveCase, setActiveDetectiveCase] = useState<DetectiveCase | null>(null);
    const [isMuseumOpen, setIsMuseumOpen] = useState(false);
    const [isGardenOpen, setIsGardenOpen] = useState(false);
    const [xpNotification, setXpNotification] = useState<number | null>(null);

    const targetLangCode = profile?.target_language?.code || 'hi';
    const stories = lingoCityService.getStories(targetLangCode);
    const detectiveCases = lingoCityService.getDetectiveCases(targetLangCode);

    useEffect(() => {
        setLingoBotConfig(lingoBotService.getCustomization());
        const unsubscribe = lingoBotService.subscribe(cfg => setLingoBotConfig(cfg));
        return () => unsubscribe();
    }, []);

    const triggerXpEarned = (amount: number) => {
        setXpNotification(amount);
        setCityState(lingoCityService.getCityState());
        setTimeout(() => setXpNotification(null), 3500);
    };

    const { supportLangCode } = useTranslation();
    const langKey = (supportLangCode || 'en').toLowerCase().slice(0, 2);

    const LINGO_CITY_TRANSLATIONS: Record<string, Record<string, string>> = {
        en: {
            welcome: "Welcome to Lingo City",
            title: "An Immersive Cartoon Language World",
            desc: "Explore animated stories, investigate language mysteries, cultivate your living vocabulary garden, and curate discoveries in your language museum.",
            tier: "City Tier",
            stories: "Stories",
            mysteries: "Mysteries Solved",
            xp_added: "Congratulations! XP added to your learning journey!",
            map_tag: "Interactive City Map",
            map_title: "Choose Your Destination",
            map_badge: "4 Unique Learning Quarters",
            theater_title: "Story Theater",
            theater_marquee: "MARQUEE THEATER",
            theater_stories: "Visual Stories",
            theater_desc: "Watch short interactive animated episodes, tap words for meanings, practice speech pronunciation, and make story choices.",
            theater_btn: "Enter Theater →",
            detective_title: "Detective Bureau",
            detective_marquee: "MYSTERY HEADQUARTERS",
            detective_cases: "Active Cases",
            detective_desc: "Solve language mysteries! Inspect audio recordings, tickets, messages, and handwritten clues on the investigation corkboard.",
            detective_btn: "Open Clue Board →",
            museum_title: "Language Museum",
            museum_marquee: "HERITAGE ARCHIVES",
            museum_gallery: "Discovery Gallery",
            museum_desc: "A curated gallery of letters mastered, stories completed, mystery cases archived, and audio recordings collected on your journey.",
            museum_btn: "Explore Exhibits →",
            garden_title: "Language Garden",
            garden_marquee: "VOCABULARY BLOOM",
            garden_blooming: "Trees Blooming",
            garden_desc: "Watch your vocabulary grow visually! New words start as seeds, sprout into plants, and blossom into fruit trees with practice.",
            garden_btn: "Tend Vocabulary Plots →"
        },
        kn: {
            welcome: "ಲಿಂಗೋ ನಗರಕ್ಕೆ ಸುಸ್ವಾಗತ",
            title: "ರೋಮಾಂಚಕ ಕಾರ್ಟೂನ್ ಭಾಷಾ ಪ್ರಪಂಚ",
            desc: "ಅನಿಮೇಟೆಡ್ ಕಥೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ಭಾಷಾ ರಹಸ್ಯಗಳನ್ನು ಪರಿಹರಿಸಿ, ಶಬ್ದಕೋಶದ ಉದ್ಯಾನವನ್ನು ಬೆಳೆಸಿ ಮತ್ತು ವಸ್ತುಸಂಗ್ರಹಾಲಯವನ್ನು ವೀಕ್ಷಿಸಿ.",
            tier: "ನಗರ ಹಂತ",
            stories: "ಕಥೆಗಳು",
            mysteries: "ಪರಿಹರಿಸಲಾದ ರಹಸ್ಯಗಳು",
            xp_added: "ಅಭಿನಂದನೆಗಳು! ಕಲಿಕೆಯ ಪ್ರಯಾಣಕ್ಕೆ XP ಸೇರಿಸಲಾಗಿದೆ!",
            map_tag: "ಸಂವಾದಾತ್ಮಕ ನಗರ ನಕ್ಷೆ",
            map_title: "ನಿಮ್ಮ ಗಮ್ಯಸ್ಥಾನವನ್ನು ಆರಿಸಿ",
            map_badge: "4 ವಿಶಿಷ್ಟ ಕಲಿಕಾ ವಿಭಾಗಗಳು",
            theater_title: "ಕಥಾ ಚಿತ್ರಮಂದಿರ",
            theater_marquee: "ಚಿತ್ರಮಂದಿರ",
            theater_stories: "ದೃಶ್ಯ ಕಥೆಗಳು",
            theater_desc: "ಸಂವಾದಾತ್ಮಕ ಅನಿಮೇಟೆಡ್ ಕಥೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ, ಪದಗಳ ಅರ್ಥ ತಿಳಿಯಿರಿ, ಉಚ್ಚಾರಣೆ ಅಭ್ಯಾಸ ಮಾಡಿ ಮತ್ತು ಆಯ್ಕೆಗಳನ್ನು ಮಾಡಿ.",
            theater_btn: "ಚಿತ್ರಮಂದಿರ ಪ್ರವೇಶಿಸಿ →",
            detective_title: "ಪತ್ತೇದಾರಿ ಕಚೇರಿ",
            detective_marquee: "ರಹಸ್ಯ ತನಿಖಾ ಕೇಂದ್ರ",
            detective_cases: "ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು",
            detective_desc: "ಭಾಷಾ ರಹಸ್ಯಗಳನ್ನು ಪರಿಹರಿಸಿ! ಆಡಿಯೊ ರೆಕಾರ್ಡಿಂಗ್‌ಗಳು, ಟಿಕೆಟ್‌ಗಳು ಮತ್ತು ಸುಳಿವುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
            detective_btn: "ಸುಳಿವು ಬೋರ್ಡ್ ತೆರೆಯಿರಿ →",
            museum_title: "ಭಾಷಾ ವಸ್ತುಸಂಗ್ರಹಾಲಯ",
            museum_marquee: "ಪಾರಂಪರಿಕ ದಾಖಲೆಗಳು",
            museum_gallery: "ಶೋಧನಾ ಗ್ಯಾಲರಿ",
            museum_desc: "ಕಲಿತ ಅಕ್ಷರಗಳು, ಪೂರ್ಣಗೊಂಡ ಕಥೆಗಳು, ರಹಸ್ಯ ಪ್ರಕರಣಗಳು ಮತ್ತು ಸಂಗ್ರಹಿಸಿದ ಆಡಿಯೊಗಳ ಗ್ಯಾಲರಿ.",
            museum_btn: "ಪ್ರದರ್ಶನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ →",
            garden_title: "ಭಾಷಾ ಉದ್ಯಾನ",
            garden_marquee: "ಶಬ್ದಕೋಶ ವಿಕಸನ",
            garden_blooming: "ಹೂಬಿಡುವ ಮರಗಳು",
            garden_desc: "ನಿಮ್ಮ ಶಬ್ದಕೋಶ ಬೆಳೆಯುವುದನ್ನು ಕಣ್ಣಾರೆ ನೋಡಿ! ಹೊಸ ಪದಗಳು ಬೀಜಗಳಾಗಿ ಮೊಳಕೆಯೊಡೆದು ಮರಗಳಾಗಿ ಬೆಳೆಯುತ್ತವೆ.",
            garden_btn: "ಶಬ್ದಕೋಶ ಬೆಳೆಸಿ →"
        },
        te: {
            welcome: "లింగో నగరానికి స్వాగతం",
            title: "ఆకర్షణీయమైన కార్టూన్ భాషా ప్రపంచం",
            desc: "యానిమేటెడ్ కథలను అన్వేషించండి, భాషా రహస్యాలను ఛేదించండి, మీ పదజాల ఉద్యానవనాన్ని పెంచండి మరియు మ్యూజియాన్ని సందర్శించండి.",
            tier: "నగర శ్రేణి",
            stories: "కథలు",
            mysteries: "పరిష్కరించబడిన రహస్యాలు",
            xp_added: "అభినందనలు! మీ అభ్యాస ప్రయాణానికి XP జోడించబడింది!",
            map_tag: "ఇంటరాక్టివ్ సిటీ మ్యాప్",
            map_title: "మీ గమ్యస్థానాన్ని ఎంచుకోండి",
            map_badge: "4 ప్రత్యేక అభ్యాస కేంద్రాలు",
            theater_title: "కథా థియేటర్",
            theater_marquee: "థియేటర్",
            theater_stories: "దృశ్య కథలు",
            theater_desc: "యానిమేటెడ్ ఎపిసోడ్‌లను చూడండి, అర్థాల కోసం పదాలను నొక్కండి, ఉచ్చారణ సాధన చేయండి.",
            theater_btn: "థియేటర్‌లోకి ప్రవేశించండి →",
            detective_title: "డిటెక్టివ్ బ్యూరో",
            detective_marquee: "మిస్టరీ ప్రధాన కార్యాలయం",
            detective_cases: "యాక్టివ్ కేసులు",
            detective_desc: "భాషా రహస్యాలను ఛేదించండి! ఆడియో రికార్డింగ్‌లు, టిక్కెట్లు మరియు క్లూలను పరిశీలించండి.",
            detective_btn: "క్లూ బోర్డు తెరవండి →",
            museum_title: "భాషా మ్యూజియం",
            museum_marquee: "వారసత్వ ఆర్కైవ్స్",
            museum_gallery: "డిస్కవరీ గ్యాలరీ",
            museum_desc: "నేర్చుకున్న అక్షరాలు, పూర్తయిన కథలు, ఆర్కైవ్ చేయబడిన కేసులు మరియు ఆడియోల గ్యాలరీ.",
            museum_btn: "ప్రదర్శనలను అన్వేషించండి →",
            garden_title: "భాషా ఉద్యానవనం",
            garden_marquee: "పదజాల వికాసం",
            garden_blooming: "వికసించే చెట్లు",
            garden_desc: "మీ పదజాలం దృశ్యమానంగా పెరగడం చూడండి! కొత్త పదాలు విత్తనాలుగా మొదలై మొక్కలుగా వికసిస్తాయి.",
            garden_btn: "పదజాల ప్లాట్లను సాగు చేయండి →"
        },
        hi: {
            welcome: "लिंगो सिटी में आपका स्वागत है",
            title: "एक आकर्षक कार्टून भाषा संसार",
            desc: "एनिमेटेड कहानियों का अन्वेषण करें, भाषा के रहस्यों को सुलझाएं, अपनी शब्दावली वाटिका सजाएं और संग्रहालय देखें।",
            tier: "नगर स्तर",
            stories: "कहानियां",
            mysteries: "सुलझाए गए रहस्य",
            xp_added: "बधाई हो! आपकी सीखने की यात्रा में XP जोड़ा गया!",
            map_tag: "इंटरैक्टिव सिटी मैप",
            map_title: "अपना गंतव्य चुनें",
            map_badge: "4 अनूठे शिक्षण प्रभाग",
            theater_title: "कहानी थिएटर",
            theater_marquee: "थिएटर",
            theater_stories: "सचित्र कहानियां",
            theater_desc: "छोटे एनिमेटेड एपिसोड देखें, अर्थ जानने के लिए शब्दों पर टैप करें, उच्चारण का अभ्यास करें।",
            theater_btn: "थिएटर में प्रवेश करें →",
            detective_title: "डिटेक्टिव ब्यूरो",
            detective_marquee: "रहस्य जांच मुख्यालय",
            detective_cases: "सक्रिय मामले",
            detective_desc: "भाषा के रहस्यों को सुलझाएं! ऑडियो रिकॉर्डिंग, टिकट और सुरागों की जांच करें।",
            detective_btn: "सुराग बोर्ड खोलें →",
            museum_title: "भाषा संग्रहालय",
            museum_marquee: "धरोहर संग्रह",
            museum_gallery: "खोज दीर्घा",
            museum_desc: "सीखे गए अक्षरों, पूरी की गई कहानियों, हल किए गए मामलों और ऑडियो रिकॉर्डिंग की गैलरी।",
            museum_btn: "प्रदर्शनियों का अन्वेषण करें →",
            garden_title: "भाषा वाटिका",
            garden_marquee: "शब्दावली विकास",
            garden_blooming: "खिलते पेड़",
            garden_desc: "अपनी शब्दावली को बढ़ते हुए देखें! नए शब्द अंकुरित होकर फलों के पेड़ों के रूप में खिलते हैं।",
            garden_btn: "शब्दावली क्यारियों की देखभाल करें →"
        },
        ta: {
            welcome: "லிங்கோ நகரத்திற்கு நல்வரவு",
            title: "ஈர்க்கக்கூடிய கார்ட்டூன் மொழி உலகம்",
            desc: "அனிமேஷன் கதைகளை ஆராயுங்கள், மொழி புதிர்களைத் தீர்க்கவும், சொல்லகராதி தோட்டத்தை வளர்க்கவும், அருங்காட்சியகத்தைப் பார்வையிடவும்.",
            tier: "நகர அடுக்கு",
            stories: "கதைகள்",
            mysteries: "தீர்க்கப்பட்ட புதிர்கள்",
            xp_added: "வாழ்த்துகள்! உங்கள் கற்றல் பயணத்தில் XP சேர்க்கப்பட்டது!",
            map_tag: "ஊடாடும் நகர வரைபடம்",
            map_title: "உங்கள் இலக்கைத் தேர்ந்தெடுக்கவும்",
            map_badge: "4 தனித்துவமான கற்றல் பகுதிகள்",
            theater_title: "கதை அரங்கம்",
            theater_marquee: "திரையரங்கம்",
            theater_stories: "காட்சிக் கதைகள்",
            theater_desc: "அனிமேஷன் காட்சிகளைப் பாருங்கள், அர்த்தங்களுக்கு சொற்களைத் தட்டவும், உச்சரிப்பைப் பயிற்சி செய்யவும்.",
            theater_btn: "அரங்கில் நுழையுங்கள் →",
            detective_title: "துப்பறியும் பணியகம்",
            detective_marquee: "புதிர் தலைமையகம்",
            detective_cases: "செயலில் உள்ள வழக்குகள்",
            detective_desc: "மொழி புதிர்களைத் தீர்க்கவும்! ஆடியோ பதிவுகள், டிக்கெட்டுகள் மற்றும் துப்புகளை ஆராயுங்கள்.",
            detective_btn: "துப்பு பலகையைத் திற →",
            museum_title: "மொழி அருங்காட்சியகம்",
            museum_marquee: "பாரம்பரிய காப்பகம்",
            museum_gallery: "கண்டுபிடிப்பு கூடம்",
            museum_desc: "கற்ற எழுத்துக்கள், முடித்த கதைகள், சேகரித்த ஆடியோ பதிவுகளின் பிரத்யேக தொகுப்பு.",
            museum_btn: "காட்சிகளை ஆராயுங்கள் →",
            garden_title: "மொழி தோட்டம்",
            garden_marquee: "சொல் மலர்ச்சி",
            garden_blooming: "பூக்கும் மரங்கள்",
            garden_desc: "உங்கள் சொல்லகராதி வளர்வதைப் பாருங்கள்! புதிய சொற்கள் விதைகளாகத் தொடங்கி மரங்களாக வளர்கின்றன.",
            garden_btn: "சொல் தோட்டத்தைப் பராமரி →"
        },
        ml: {
            welcome: "ലിംഗോ സിറ്റിയിലേക്ക് സ്വാഗതം",
            title: "ആകർഷകമായ കാർട്ടൂൺ ഭാഷാ ലോകം",
            desc: "ആനിമേഷൻ കഥകൾ പര്യവേക്ഷണം ചെയ്യുക, ഭാഷാ രഹസ്യങ്ങൾ പരിഹരിക്കുക, പദാവലി തോട്ടം വളർത്തുക, മ്യൂസിയം കാണുക.",
            tier: "നഗര തലം",
            stories: "കഥകൾ",
            mysteries: "പരിഹരിച്ച രഹസ്യങ്ങൾ",
            xp_added: "അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ പഠനത്തിലേക്ക് XP ചേർത്തു!",
            map_tag: "ഇന്ററാക്ടീവ് സിറ്റി മാപ്പ്",
            map_title: "നിങ്ങളുടെ ലക്ഷ്യസ്ഥാനം തിരഞ്ഞെടുക്കുക",
            map_badge: "4 സവിശേഷ പഠന മേഖലകൾ",
            theater_title: "കഥാ തീയേറ്റർ",
            theater_marquee: "തീയേറ്റർ",
            theater_stories: "ദൃശ്യ കഥകൾ",
            theater_desc: "ആനിമേറ്റഡ് എപ്പിസോഡുകൾ കാണുക, അർത്ഥത്തിനായി വാക്കുകൾ ടാപ്പ് ചെയ്യുക, ഉച്ചാരണം പരിശീലിക്കുക.",
            theater_btn: "തീയേറ്ററിൽ പ്രവേശിക്കുക →",
            detective_title: "ഡിറ്റക്റ്റീവ് ബ്യൂറോ",
            detective_marquee: "രഹസ്യാന്വേഷണ കേന്ദ്രം",
            detective_cases: "സജീവ കേസുകൾ",
            detective_desc: "ഭാഷാ രഹസ്യങ്ങൾ കണ്ടെത്തുക! ഓഡിയോ റെക്കോർഡിംഗുകൾ, സന്ദേശങ്ങൾ, സൂചനകൾ എന്നിവ പരിശോധിക്കുക.",
            detective_btn: "ക്ലൂ ബോർഡ് തുറക്കുക →",
            museum_title: "ഭാഷാ മ്യൂസിയം",
            museum_marquee: "പൈതൃക ആർക്കൈവ്സ്",
            museum_gallery: "കണ്ടെത്തൽ ഗാലറി",
            museum_desc: "പഠിച്ച അക്ഷരങ്ങൾ, പൂർത്തിയാക്കിയ കഥകൾ, ശേഖരിച്ച ഓഡിയോകൾ എന്നിവയുടെ ഗാലറി.",
            museum_btn: "പ്രദർശനങ്ങൾ കാണുക →",
            garden_title: "ഭാഷാ തോട്ടം",
            garden_marquee: "പദാവലി വികാസം",
            garden_blooming: "പൂക്കുന്ന മരങ്ങൾ",
            garden_desc: "നിങ്ങളുടെ പദാവലി വളരുന്നത് കാണുക! പുതിയ വാക്കുകൾ വിത്തുകളായി മുളച്ചു ഫലവൃക്ഷങ്ങളായി വളരുന്നു.",
            garden_btn: "പദാവലി വളർത്തുക →"
        }
    };

    const cur = LINGO_CITY_TRANSLATIONS[langKey] || LINGO_CITY_TRANSLATIONS['en'];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* 🌆 LINGO CITY BANNER */}
            <div className="bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Ambient clouds & stars */}
                <div className="absolute top-2 right-12 text-white/30 text-3xl animate-float-slow pointer-events-none">☁️</div>
                <div className="absolute bottom-2 left-1/3 text-white/20 text-2xl animate-float-delayed pointer-events-none">✨</div>

                <div className="space-y-2 relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                        {cur.welcome}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {cur.title}
                    </h1>
                    <p className="text-sky-100 text-xs sm:text-sm leading-relaxed font-medium">
                        {cur.desc}
                    </p>
                </div>

                {/* City Level & Companion Avatar (Display Only) */}
                <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-3.5 shadow-inner relative z-10">
                    <CustomizableLingoBot
                        customization={lingoBotConfig}
                        size="md"
                        expression="happy"
                        animate={true}
                    />

                    <div className="text-left space-y-0.5">
                        <div className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                            {cur.tier} {cityState.level}
                        </div>
                        <div className="text-sm font-black text-white">
                            {cityState.cityName}
                        </div>
                        <div className="text-[11px] text-sky-100 font-medium">
                            {cityState.storiesCompleted.length} {cur.stories} • {cityState.casesSolved.length} {cur.mysteries}
                        </div>
                    </div>
                </div>
            </div>

            {/* XP Celebration Notification */}
            {xpNotification && (
                <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        <span>Congratulations! +{xpNotification} XP added to your learning journey!</span>
                    </div>
                </div>
            )}

            {/* 🗺️ ILLUSTRATED CARTOON CITY ENVIRONMENT */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-indigo-200/90 shadow-2xl bg-gradient-to-b from-sky-200 via-indigo-100 to-purple-100 p-4 sm:p-8">
                {/* Floating Ambient Elements in City Panorama */}
                <div className="absolute top-4 left-6 text-sky-400/40 text-4xl animate-float-slow pointer-events-none">☁️</div>
                <div className="absolute top-10 right-16 text-sky-400/40 text-5xl animate-float-delayed pointer-events-none">☁️</div>
                <div className="absolute top-6 left-1/2 -translate-x-1/2 text-amber-400 text-3xl animate-pulse pointer-events-none">☀️</div>

                {/* Floating Educational Glyphs & Objects */}
                <div className="absolute top-14 left-16 text-indigo-400/35 text-xl font-bold animate-float-slow pointer-events-none">क</div>
                <div className="absolute top-24 left-1/3 text-purple-400/30 text-lg font-bold animate-float-delayed pointer-events-none">📖</div>
                <div className="absolute top-16 right-1/4 text-teal-400/35 text-xl font-bold animate-float-slow pointer-events-none">జ్ఞా</div>
                <div className="absolute top-28 right-12 text-amber-400/30 text-base animate-float-delayed pointer-events-none">⭐</div>
                <div className="absolute bottom-20 left-10 text-emerald-500/25 text-lg animate-float-slow pointer-events-none">🌿</div>
                <div className="absolute bottom-24 right-16 text-pink-400/30 text-base animate-float-delayed pointer-events-none">🦋</div>

                {/* City Heading */}
                <div className="relative z-10 flex items-center justify-between gap-2 mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-indigo-900 tracking-wider bg-white/70 backdrop-blur-md px-3 py-1 rounded-full shadow-2xs">
                            <Compass className="w-3.5 h-3.5 text-brand-600" />
                            {cur.map_tag}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                            {cur.map_title}
                        </h2>
                    </div>

                    <span className="hidden sm:inline-block text-xs font-bold text-indigo-950/70 bg-white/60 px-3 py-1.5 rounded-xl border border-indigo-200/60 shadow-2xs">
                        {cur.map_badge}
                    </span>
                </div>

                {/* 🏛️ 4 BALANCED CARTOON BUILDINGS (2x2 on tablet/desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-5 relative z-10">
                    {/* 1. 🎬 STORY THEATER */}
                    <div
                        onClick={() => setActiveStory(stories[0])}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 rounded-3xl p-5 border-2 border-amber-300 hover:border-amber-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Cinema Marquee Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-red-600 via-amber-500 to-red-600 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-1 flex justify-around w-full px-2">
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-ping" />
                                <span className="w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                            </div>
                            <span className="text-4xl drop-shadow-md">🎬</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 mt-1">
                                {cur.theater_marquee}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="amber" size="sm" className="font-bold text-[10px]">
                                    {stories.length} {cur.theater_stories}
                                </Badge>
                                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                    ⭐ +60 XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-amber-800 transition-colors">
                                {cur.theater_title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {cur.theater_desc}
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-amber-800">
                            <span>{cur.theater_btn}</span>
                            <Film className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                        </div>
                    </div>

                    {/* 2. 🕵️ DETECTIVE BUREAU */}
                    <div
                        onClick={() => setActiveDetectiveCase(detectiveCases[0])}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-indigo-50 hover:to-slate-100 rounded-3xl p-5 border-2 border-indigo-300 hover:border-indigo-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Bureau Headquarters Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-slate-800 via-indigo-950 to-slate-900 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 right-3 text-amber-400 text-xs">💡 Street Lamp</div>
                            <span className="text-4xl drop-shadow-md">🕵️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mt-1">
                                {cur.detective_marquee}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="brand" size="sm" className="font-bold text-[10px]">
                                    {detectiveCases.length} {cur.detective_cases}
                                </Badge>
                                <span className="text-xs font-bold text-brand-600 flex items-center gap-1">
                                    ⭐ +80 XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-brand-700 transition-colors">
                                {cur.detective_title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {cur.detective_desc}
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-brand-700">
                            <span>{cur.detective_btn}</span>
                            <Search className="w-4 h-4 text-brand-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* 3. 🏛️ LANGUAGE MUSEUM */}
                    <div
                        onClick={() => setIsMuseumOpen(true)}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 rounded-3xl p-5 border-2 border-purple-300 hover:border-purple-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Greek Pillars Museum Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 right-3 text-purple-200 text-xs font-bold">HERITAGE</div>
                            <span className="text-4xl drop-shadow-md">🏛️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-purple-200 mt-1">
                                {cur.museum_marquee}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="brand" size="sm" className="font-bold text-[10px]">
                                    {cur.museum_gallery}
                                </Badge>
                                <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                                    ⭐ Milestones
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-purple-800 transition-colors">
                                {cur.museum_title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {cur.museum_desc}
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-purple-800">
                            <span>{cur.museum_btn}</span>
                            <Landmark className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>

                    {/* 4. 🌱 LANGUAGE GARDEN */}
                    <div
                        onClick={() => setIsGardenOpen(true)}
                        className="group relative bg-white/95 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 rounded-3xl p-5 border-2 border-emerald-300 hover:border-emerald-500 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                        {/* Greenhouse Graphic */}
                        <div className="h-28 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 flex flex-col items-center justify-center text-white relative shadow-md overflow-hidden">
                            <div className="absolute top-2 left-3 text-emerald-200 text-xs">🌿 Conservatory</div>
                            <span className="text-4xl drop-shadow-md">🌱</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-1">
                                {cur.garden_marquee}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <Badge variant="teal" size="sm" className="font-bold text-[10px]">
                                    {cityState.gardenMasteredCount} {cur.garden_blooming}
                                </Badge>
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                    ⭐ Growth XP
                                </span>
                            </div>
                            <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                                {cur.garden_title}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                                {cur.garden_desc}
                            </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-emerald-800">
                            <span>{cur.garden_btn}</span>
                            <Sprout className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* 🛣️ CARTOON STREET & INHABITANTS STRIP (Walking Characters) */}
                <div className="mt-8 pt-4 border-t-2 border-indigo-200/60 relative">
                    {/* Road surface */}
                    <div className="h-10 bg-slate-700/80 rounded-2xl flex items-center justify-around px-4 shadow-inner relative overflow-hidden">
                        <div className="flex justify-around w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <span key={i} className="w-8 h-1.5 bg-amber-400 rounded-full" />
                            ))}
                        </div>
                    </div>

                    {/* Walking Characters on the sidewalk */}
                    <div className="flex items-center justify-between px-6 -mt-16 pointer-events-none">
                        <div className="animate-float-slow">
                            <CustomizableLingoBot
                                customization={lingoBotConfig}
                                size="sm"
                                expression="happy"
                                animate={true}
                            />
                        </div>
                        <div className="animate-float-delayed">
                            <AtlasTraveler size="sm" />
                        </div>
                        <div className="animate-float-slow">
                            <LexiReader size="sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {activeStory && (
                <StoryTheaterModal
                    story={activeStory}
                    isOpen={Boolean(activeStory)}
                    onClose={() => setActiveStory(null)}
                    onCompleted={(storyId, xp) => {
                        triggerXpEarned(xp);
                    }}
                />
            )}

            {activeDetectiveCase && (
                <DetectiveBureauModal
                    caseItem={activeDetectiveCase}
                    isOpen={Boolean(activeDetectiveCase)}
                    onClose={() => setActiveDetectiveCase(null)}
                    onCaseSolved={(caseId, xp) => {
                        triggerXpEarned(xp);
                    }}
                />
            )}

            {isMuseumOpen && (
                <LanguageMuseumModal
                    isOpen={isMuseumOpen}
                    onClose={() => setIsMuseumOpen(false)}
                />
            )}

            {isGardenOpen && (
                <LanguageGardenModal
                    isOpen={isGardenOpen}
                    onClose={() => setIsGardenOpen(false)}
                    onPlantWatered={(xp) => triggerXpEarned(xp)}
                />
            )}
        </div>
    );
};

export default LingoCityPage;
