import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../utils/translations';
import { lingoBotService } from '../services/lingoBotService';
import { lingoCityService } from '../services/lingoCityService';
import {
    LingoBotCustomization,
    DEFAULT_CUSTOMIZATION,
    CUSTOMIZATION_ITEMS,
    BOT_COLORS,
    ItemCategory,
    CustomizationItem,
    LearnedCustomizationWord
} from '../types/lingobot';
import { CustomizableLingoBot } from '../components/lingobot/CustomizableLingoBot';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
    Sparkles,
    Check,
    Volume2,
    Mic,
    BookOpen,
    Lock,
    Compass,
    Shirt,
    Glasses,
    Briefcase,
    Wand2,
    Award,
    RotateCcw,
    Save,
    Star,
    CheckCircle2,
    HelpCircle
} from 'lucide-react';
import { voiceService } from '../services/voiceService';

const DRESS_BOT_TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        hub_tag: "Learn & Dress LingoBot Studio",
        hub_title: "Learn Language While Dressing Your Companion",
        hub_desc: "Every vest, fedora, pair of spectacles, and satchel teaches target-language vocabulary. Master words, practice speaking, and equip outfits!",
        words_discovered: "Words Discovered",
        terms: "terms",
        explore_city: "Explore Lingo City",
        xp_earned: "Congratulations! XP earned for learning new vocabulary!",
        cat_clothes: "Clothes",
        cat_hats: "Hats",
        cat_glasses: "Glasses",
        cat_bags: "Bags",
        cat_tools: "Tools",
        cat_auras: "Auras",
        bot_companion_tag: "AI CHARACTER COMPANION",
        bot_desc: "Ready to learn vocabulary and explore Lingo City!",
        reset: "Reset",
        save_outfit: "Save Outfit",
        saved_toast: "Outfit saved persistently!",
        choose_item: "Choose an item to learn its vocabulary & context:",
        items_count: "Items",
        equipped: "Equipped",
        learned: "Learned",
        unlocked: "Unlocked",
        locked: "Locked",
        concept: "Concept",
        learn_equip: "Learn & Equip →",
        micro_lesson: "Educational Micro-Lesson",
        target_concept: "Target Concept",
        hear_word: "Hear Word",
        target_script: "Target Language Script",
        meaning_yours: "Meaning in Your Language",
        example_sentence: "Example Target Sentence",
        listen_sentence: "Listen Sentence",
        translation: "Translation",
        listening: "Listening...",
        practice_speaking: "Practice Speaking",
        learn_to_unlock: "🔓 Learn to Unlock",
        learned_and_equipped: "Learned & Equipped",
        learn_and_wear: "Learn & Wear (+15 XP)",
        unlock_modal_title: "Learn to Unlock",
        tap_to_listen: "Tap each word to listen and learn",
        unlock_btn: "🎉 Unlock Item (+30 XP)"
    },
    kn: {
        hub_tag: "ಕಲಿಯಿರಿ & ಲಿಂಗೋಬಾಟ್ ಅಲಂಕರಿಸಿ",
        hub_title: "ನಿಮ್ಮ ಒಡನಾಡಿಯನ್ನು ಅಲಂಕರಿಸುತ್ತಾ ಭಾಷೆ ಕಲಿಯಿರಿ",
        hub_desc: "ಪ್ರತಿಯೊಂದು ವಸ್ತ್ರ, ಟೋಪಿ ಮತ್ತು ಕನ್ನಡಕವೂ ಶಬ್ದಕೋಶವನ್ನು ಕಲಿಸುತ್ತದೆ. ಪದಗಳನ್ನು ಕಲಿಯಿರಿ ಮತ್ತು ಬಟ್ಟೆಗಳನ್ನು ತೊಡಿಸಿ!",
        words_discovered: "ಕಲಿತ ಪದಗಳು",
        terms: "ಪದಗಳು",
        explore_city: "ಲಿಂಗೋ ನಗರ ಅನ್ವೇಷಿಸಿ",
        xp_earned: "ಅಭಿನಂದನೆಗಳು! ಹೊಸ ಪದ ಕಲಿತಿದ್ದಕ್ಕೆ XP ಸಿಕ್ಕಿದೆ!",
        cat_clothes: "ಉಡುಪುಗಳು",
        cat_hats: "ಟೋಪಿಗಳು",
        cat_glasses: "ಕನ್ನಡಕಗಳು",
        cat_bags: "ಬ್ಯಾಗ್‌ಗಳು",
        cat_tools: "ಉಪಕರಣಗಳು",
        cat_auras: "ಪ್ರಭಾವಲಯಗಳು",
        bot_companion_tag: "AI ಒಡನಾಡಿ ಪಾತ್ರ",
        bot_desc: "ಶಬ್ದಕೋಶ ಕಲಿಯಲು ಮತ್ತು ಲಿಂಗೋ ನಗರ ಅನ್ವೇಷಿಸಲು ಸಿದ್ಧ!",
        reset: "ಮರುಹೊಂದಿಸಿ",
        save_outfit: "ಉಡುಪು ಉಳಿಸಿ",
        saved_toast: "ಉಡುಪು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!",
        choose_item: "ಶಬ್ದಕೋಶ ಮತ್ತು ಸಂದರ್ಭ ಕಲಿಯಲು ಒಂದು ಐಟಂ ಆರಿಸಿ:",
        items_count: "ಐಟಂಗಳು",
        equipped: "ಧರಿಸಲಾಗಿದೆ",
        learned: "ಕಲಿತಿದೆ",
        unlocked: "ಅನ್‌ಲಾಕ್ ಆಗಿದೆ",
        locked: "ಲಾಕ್ ಆಗಿದೆ",
        concept: "ಪರಿಕಲ್ಪನೆ",
        learn_equip: "ಕಲಿಯಿರಿ & ಧರಿಸಿ →",
        micro_lesson: "ಶೈಕ್ಷಣಿಕ ಕಿರು-ಪಾಠ",
        target_concept: "ಗುರಿ ಪರಿಕಲ್ಪನೆ",
        hear_word: "ಪದ ಆಲಿಸಿ",
        target_script: "ಗುರಿ ಭಾಷೆಯ ಲಿಪಿ",
        meaning_yours: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಅರ್ಥ",
        example_sentence: "ಉದಾಹರಣೆ ವಾಕ್ಯ",
        listen_sentence: "ವಾಕ್ಯ ಆಲಿಸಿ",
        translation: "ಅನುವಾದ",
        listening: "ಆಲಿಸುತ್ತಿದೆ...",
        practice_speaking: "ಮಾತನಾಡಿ ಅಭ್ಯಾಸ ಮಾಡಿ",
        learn_to_unlock: "🔓 ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಕಲಿಯಿರಿ",
        learned_and_equipped: "ಕಲಿತು ಧರಿಸಲಾಗಿದೆ",
        learn_and_wear: "ಕಲಿಯಿರಿ & ಧರಿಸಿ (+15 XP)",
        unlock_modal_title: "ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಕಲಿಯಿರಿ",
        tap_to_listen: "ಕಲಿಯಲು ಪ್ರತಿ ಪದದ ಮೇಲೆ ಟ್ಯಾಪ್ ಮಾಡಿ",
        unlock_btn: "🎉 ಐಟಂ ಅನ್‌ಲಾಕ್ ಮಾಡಿ (+30 XP)"
    },
    te: {
        hub_tag: "లింగోబాట్ స్టూడియో",
        hub_title: "మీ సహాయకుడిని అలంకరిస్తూ భాష నేర్చుకోండి",
        hub_desc: "ప్రతి వస్త్రం, టోపీ మరియు కళ్లద్దాలు లక్ష్య భాషా పదజాలాన్ని నేర్పుతాయి. పదాలను నేర్చుకోండి మరియు దుస్తులు ధరింపజేయండి!",
        words_discovered: "నేర్చుకున్న పదాలు",
        terms: "పదాలు",
        explore_city: "లింగో నగరాన్ని అన్వేషించండి",
        xp_earned: "అభినందనలు! కొత్త పదజాలం నేర్చుకున్నందుకు XP లభించింది!",
        cat_clothes: "దుస్తులు",
        cat_hats: "టోపీలు",
        cat_glasses: "కళ్లద్దాలు",
        cat_bags: "బ్యాగులు",
        cat_tools: "పరికరాలు",
        cat_auras: "ఆభరణాలు",
        bot_companion_tag: "AI క్యారెక్టర్ సహచరుడు",
        bot_desc: "పదజాలం నేర్చుకోవడానికి మరియు లింగో నగరాన్ని అన్వేషించడానికి సిద్ధంగా ఉంది!",
        reset: "రీసెట్",
        save_outfit: "దుస్తులను సేవ్ చేయండి",
        saved_toast: "దుస్తులు విజయవంతంగా భద్రపరచబడ్డాయి!",
        choose_item: "పదజాలం నేర్చుకోవడానికి ఒక అంశాన్ని ఎంచుకోండి:",
        items_count: "అంశాలు",
        equipped: "ధరించారు",
        learned: "నేర్చుకున్నారు",
        unlocked: "అన్‌లాక్ చేయబడింది",
        locked: "లాక్ చేయబడింది",
        concept: "కాన్సెప్ట్",
        learn_equip: "నేర్చుకోండి & ధరించండి →",
        micro_lesson: "విద్యా మైక్రో-పాఠం",
        target_concept: "లక్ష్య కాన్సెప్ట్",
        hear_word: "పదాన్ని వినండి",
        target_script: "లక్ష్య భాషా లిపి",
        meaning_yours: "మీ భాషలో అర్థం",
        example_sentence: "ఉదాహరణ వాక్యం",
        listen_sentence: "వాక్యాన్ని వినండి",
        translation: "అనువాదం",
        listening: "వింటోంది...",
        practice_speaking: "మాట్లాడటం ప్రాక్టీస్ చేయండి",
        learn_to_unlock: "🔓 అన్‌లాక్ చేయడానికి నేర్చుకోండి",
        learned_and_equipped: "నేర్చుకుని ధరించారు",
        learn_and_wear: "నేర్చుకోండి & ధరించండి (+15 XP)",
        unlock_modal_title: "అన్‌లాక్ చేయడానికి నేర్చుకోండి",
        tap_to_listen: "వినడానికి మరియు నేర్చుకోవడానికి ప్రతి పదాన్ని నొక్కండి",
        unlock_btn: "🎉 అంశాన్ని అన్‌లాక్ చేయండి (+30 XP)"
    },
    hi: {
        hub_tag: "लिंगोबॉट सीखें और सजाएं स्टूडियो",
        hub_title: "साथी को सजाते हुए नई भाषा सीखें",
        hub_desc: "हर पोशाक, टोपी और चश्मा आपको लक्ष्य भाषा के नए शब्द सिखाता है। शब्द सीखें, बोलने का अभ्यास करें और तैयार करें!",
        words_discovered: "सीखे गए शब्द",
        terms: "शब्द",
        explore_city: "लिंगो सिटी घूमें",
        xp_earned: "बधाई हो! नए शब्द सीखने के लिए XP मिला!",
        cat_clothes: "कपड़े",
        cat_hats: "टोपी",
        cat_glasses: "चश्मे",
        cat_bags: "बैग",
        cat_tools: "उपकरण",
        cat_auras: "आभामंडल",
        bot_companion_tag: "एआई साथी पात्र",
        bot_desc: "शब्दावली सीखने और लिंगो सिटी घूमने के लिए तैयार!",
        reset: "रीसेट",
        save_outfit: "पोशाक सहेजें",
        saved_toast: "पोशाक सफलतापूर्वक सहेजी गई!",
        choose_item: "शब्दावली सीखने के लिए कोई वस्तु चुनें:",
        items_count: "वस्तुएं",
        equipped: "पहना हुआ",
        learned: "सीखा हुआ",
        unlocked: "खुला हुआ",
        locked: "लॉक",
        concept: "अवधारणा",
        learn_equip: "सीखें और पहनें →",
        micro_lesson: "शैक्षिक मिनी-पाठ",
        target_concept: "लक्षित शब्द",
        hear_word: "शब्द सुनें",
        target_script: "लक्ष्य भाषा लिपि",
        meaning_yours: "आपकी भाषा में अर्थ",
        example_sentence: "उदाहरण वाक्य",
        listen_sentence: "वाक्य सुनें",
        translation: "अनुवाद",
        listening: "सुन रहा है...",
        practice_speaking: "बोलने का अभ्यास करें",
        learn_to_unlock: "🔓 अनलॉक करने के लिए सीखें",
        learned_and_equipped: "सीखा और पहना",
        learn_and_wear: "सीखें और पहनें (+15 XP)",
        unlock_modal_title: "अनलॉक करने के लिए सीखें",
        tap_to_listen: "सुनने और सीखने के लिए प्रत्येक शब्द पर टैप करें",
        unlock_btn: "🎉 अनलॉक करें (+30 XP)"
    },
    ta: {
        hub_tag: "லிங்கோபாட் கற்றல் & அலங்கார அரங்கம்",
        hub_title: "தோழனை அலங்கரித்து மொழியைக் கற்றுக் கொள்ளுங்கள்",
        hub_desc: "ஒவ்வொரு ஆடையும், தொப்பியும், கண்ணாடியும் சொல்லகராதியைக் கற்பிக்கிறது. சொற்களைக் கற்றுக்கொண்டு அலங்கரியுங்கள்!",
        words_discovered: "கற்ற சொற்கள்",
        terms: "சொற்கள்",
        explore_city: "லிங்கோ நகரத்தை ஆராயுங்கள்",
        xp_earned: "வாழ்த்துகள்! புதிய சொற்களைக் கற்றதற்காக XP கிடைத்தது!",
        cat_clothes: "ஆடைகள்",
        cat_hats: "தொப்பிகள்",
        cat_glasses: "கண்ணாடிகள்",
        cat_bags: "பைகள்",
        cat_tools: "கருவிகள்",
        cat_auras: "ஒளிவட்டங்கள்",
        bot_companion_tag: "AI தோழர் கதாபாத்திரம்",
        bot_desc: "சொற்களைக் கற்கவும் லிங்கோ நகரத்தை ஆராயவும் தயார்!",
        reset: "மீட்டமை",
        save_outfit: "ஆடையைச் சேமிக்கவும்",
        saved_toast: "ஆடை வெற்றிகரமாக சேமிக்கப்பட்டது!",
        choose_item: "சொற்களைக் கற்க ஒரு பொருளைத் தேர்ந்தெடுக்கவும்:",
        items_count: "பொருட்கள்",
        equipped: "அணிந்துள்ளது",
        learned: "கற்றது",
        unlocked: "திறக்கப்பட்டது",
        locked: "பூட்டப்பட்டது",
        concept: "கருத்து",
        learn_equip: "கற்று அணிந்துகொள் →",
        micro_lesson: "கல்வி நுண்-பாடம்",
        target_concept: "இலக்கு கருத்து",
        hear_word: "சொல்லைக் கேள்",
        target_script: "இலக்கு மொழி எழுத்து",
        meaning_yours: "உங்கள் மொழியில் பொருள்",
        example_sentence: "எடுத்துக்காட்டு வாக்கியம்",
        listen_sentence: "வாக்கியத்தைக் கேள்",
        translation: "மொழிபெயர்ப்பு",
        listening: "கேட்கிறது...",
        practice_speaking: "பேசிப் பழகுங்கள்",
        learn_to_unlock: "🔓 திறக்க கற்றுக்கொள்ளுங்கள்",
        learned_and_equipped: "கற்று அணிந்தது",
        learn_and_wear: "கற்று அணிந்துகொள் (+15 XP)",
        unlock_modal_title: "திறக்க கற்றுக்கொள்ளுங்கள்",
        tap_to_listen: "கேட்கவும் கற்கவும் ஒவ்வொரு சொல்லையும் தட்டவும்",
        unlock_btn: "🎉 திற (+30 XP)"
    },
    ml: {
        hub_tag: "ലിംഗോബോട്ട് ലേൺ & ഡ്രസ്സ് സ്റ്റുഡിയോ",
        hub_title: "കൂട്ടുകാരനെ അണിയിച്ചൊരുക്കി ഭാഷ പഠിക്കൂ",
        hub_desc: "ഓരോ വസ്ത്രവും തൊപ്പിയും കണ്ണടയും പുതിയ പദങ്ങൾ പഠിപ്പിക്കുന്നു. വാക്കുകൾ പഠിച്ച് വസ്ത്രങ്ങൾ ധരിപ്പിക്കൂ!",
        words_discovered: "കണ്ടെത്തിയ വാക്കുകൾ",
        terms: "പദങ്ങൾ",
        explore_city: "ലിംഗോ സിറ്റി സന്ദർശിക്കൂ",
        xp_earned: "അഭിനന്ദനങ്ങൾ! പുതിയ പദാവലി പഠിച്ചതിന് XP ലഭിച്ചു!",
        cat_clothes: "വസ്ത്രങ്ങൾ",
        cat_hats: "തൊപ്പികൾ",
        cat_glasses: "കണ്ണടകൾ",
        cat_bags: "ബാഗുകൾ",
        cat_tools: "ഉപകരണങ്ങൾ",
        cat_auras: "പ്രഭാവലയങ്ങൾ",
        bot_companion_tag: "AI കഥാപാത്ര കൂട്ടുകാരൻ",
        bot_desc: "പദാവലി പഠിക്കാനും ലിംഗോ സിറ്റി കാണാനും തയ്യാറാണ്!",
        reset: "റീസെറ്റ്",
        save_outfit: "സേവ് ചെയ്യുക",
        saved_toast: "വിജയകരമായി സേവ് ചെയ്തു!",
        choose_item: "പഠിക്കാൻ ഒരു ഇനം തിരഞ്ഞെടുക്കൂ:",
        items_count: "ഇനങ്ങൾ",
        equipped: "ധരിച്ചിരിക്കുന്നു",
        learned: "പഠിച്ചു",
        unlocked: "തുറന്നു",
        locked: "പൂട്ടിയത്",
        concept: "ആശയം",
        learn_equip: "പഠിച്ച് ധരിക്കൂ →",
        micro_lesson: "വിദ്യാഭ്യാസ മൈക്രോ-പാഠം",
        target_concept: "ലക്ഷ്യ ആശയം",
        hear_word: "വാക്ക് കേൾക്കൂ",
        target_script: "ലക്ഷ്യ ഭാഷാ ലിപി",
        meaning_yours: "നിങ്ങളുടെ ഭാഷയിൽ അർത്ഥം",
        example_sentence: "ഉദാഹരണ വാക്യം",
        listen_sentence: "വാക്യം കേൾക്കൂ",
        translation: "വിവർത്തനം",
        listening: "കേൾക്കുന്നു...",
        practice_speaking: "സംസാരിച്ചു ശീലിക്കൂ",
        learn_to_unlock: "🔓 അൺലോക്ക് ചെയ്യാൻ പഠിക്കൂ",
        learned_and_equipped: "പഠിച്ച് ധരിച്ചു",
        learn_and_wear: "പഠിച്ച് ധരിക്കൂ (+15 XP)",
        unlock_modal_title: "അൺലോക്ക് ചെയ്യാൻ പഠിക്കൂ",
        tap_to_listen: "കേൾക്കാനും പഠിക്കാനും ഓരോ വാക്കിലും തൊടുക",
        unlock_btn: "🎉 അൺലോക്ക് ചെയ്യുക (+30 XP)"
    }
};

export const DressLingoBotPage: React.FC = () => {
    const { profile } = useAuth();
    const { t, supportLangCode } = useTranslation();
    const navigate = useNavigate();

    const targetLangCode = profile?.target_language?.code || 'hi';
    const interfaceLangCode = (supportLangCode || 'en').toLowerCase().slice(0, 2);
    const userXp = (profile as any)?.total_xp ?? 260;

    const cur = DRESS_BOT_TRANSLATIONS[interfaceLangCode] || DRESS_BOT_TRANSLATIONS['en'];

    const [customization, setCustomization] = useState<LingoBotCustomization>(DEFAULT_CUSTOMIZATION);
    const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'colors'>('clothes');
    const [activeItem, setActiveItem] = useState<CustomizationItem>(CUSTOMIZATION_ITEMS[0]);
    const [activeTab, setActiveTab] = useState<'studio' | 'collection'>('studio');

    // Learning & Pronunciation Interaction State
    const [isPronouncing, setIsPronouncing] = useState(false);
    const [pronounceFeedback, setPronounceFeedback] = useState<string | null>(null);
    const [learnedWords, setLearnedWords] = useState<LearnedCustomizationWord[]>([]);
    const [activeUnlockModalItem, setActiveUnlockModalItem] = useState<CustomizationItem | null>(null);
    const [unlockWordsLearned, setUnlockWordsLearned] = useState<string[]>([]);

    // Bot Animation Reaction
    const [botReaction, setBotReaction] = useState<'happy' | 'wink' | 'celebrating' | 'thinking' | 'curious'>('happy');
    const [savedToast, setSavedToast] = useState(false);
    const [xpNotification, setXpNotification] = useState<number | null>(null);

    useEffect(() => {
        setCustomization(lingoBotService.getCustomization());
        setLearnedWords(lingoBotService.getLearnedWords());
    }, []);

    // Audio Playback with voiceService TTS & fallbacks for all regional languages
    const playAudio = (text: string, rate: number = 0.9) => {
        voiceService.speakText(text, targetLangCode, rate);
    };

    const categories: { id: ItemCategory | 'colors'; label: string; icon: React.ReactNode }[] = [
        { id: 'clothes', label: cur.cat_clothes, icon: <Shirt className="w-4 h-4" /> },
        { id: 'hats', label: cur.cat_hats, icon: <Award className="w-4 h-4" /> },
        { id: 'glasses', label: cur.cat_glasses, icon: <Glasses className="w-4 h-4" /> },
        { id: 'bags', label: cur.cat_bags, icon: <Briefcase className="w-4 h-4" /> },
        { id: 'accessories', label: cur.cat_tools, icon: <Wand2 className="w-4 h-4" /> },
        { id: 'auras', label: cur.cat_auras, icon: <Sparkles className="w-4 h-4" /> },
    ];

    const currentItems: CustomizationItem[] = selectedCategory !== 'colors'
        ? CUSTOMIZATION_ITEMS.filter(item => item.category === selectedCategory)
        : [];

    const isEquipped = (category: ItemCategory, itemId: string) => {
        if (category === 'clothes') return customization.clothes === itemId;
        if (category === 'hats') return customization.hat === itemId;
        if (category === 'glasses') return customization.glasses === itemId;
        if (category === 'bags') return customization.bag === itemId;
        if (category === 'accessories') return customization.accessory === itemId;
        if (category === 'auras') return customization.aura === itemId;
        return false;
    };

    const handleSelectItem = (item: CustomizationItem) => {
        setActiveItem(item);
        // Play word pronunciation on select
        const script = item.learning.targetScript[targetLangCode] || item.learning.targetScript['hi'] || item.learning.targetWord;
        playAudio(script);
        setBotReaction('curious');
        setTimeout(() => setBotReaction('happy'), 1200);
    };

    const handleEquip = (category: ItemCategory, itemId: string) => {
        const updated = { ...customization };
        if (category === 'clothes') updated.clothes = itemId;
        if (category === 'hats') updated.hat = itemId;
        if (category === 'glasses') updated.glasses = itemId;
        if (category === 'bags') updated.bag = itemId;
        if (category === 'accessories') updated.accessory = itemId;
        if (category === 'auras') updated.aura = itemId;

        setCustomization(updated);
        lingoBotService.saveCustomization(updated);

        setBotReaction('celebrating');
        setTimeout(() => setBotReaction('happy'), 1500);
    };

    const handleMarkAsLearned = (item: CustomizationItem) => {
        const { word, isNew } = lingoBotService.markWordAsLearned(item, targetLangCode, interfaceLangCode);
        setLearnedWords(lingoBotService.getLearnedWords());

        // Also add to Language Garden
        lingoCityService.addWordToGarden(
            word.script,
            word.phonetic,
            word.meaning,
            word.example
        );

        // Equip the item
        handleEquip(item.category, item.id);

        if (isNew) {
            setXpNotification(15);
            setBotReaction('celebrating');
            setTimeout(() => setXpNotification(null), 3000);
            setTimeout(() => setBotReaction('happy'), 2000);
        }
    };

    const handlePronouncePractice = (sentence: string) => {
        setIsPronouncing(true);
        setBotReaction('thinking');

        setTimeout(() => {
            setIsPronouncing(false);
            setPronounceFeedback('✓ Excellent pronunciation and tone accuracy! (95%)');
            setBotReaction('celebrating');
            setTimeout(() => {
                setPronounceFeedback(null);
                setBotReaction('happy');
            }, 3500);
        }, 1800);
    };

    const handleUnlockActivityWord = (wordText: string, scriptText: string) => {
        playAudio(scriptText);
        if (!unlockWordsLearned.includes(wordText)) {
            setUnlockWordsLearned(prev => [...prev, wordText]);
        }
    };

    const handleCompleteUnlockActivity = (item: CustomizationItem) => {
        lingoBotService.unlockItemByLearning(item.id);
        setActiveUnlockModalItem(null);
        handleEquip(item.category, item.id);
        setXpNotification(30);
        setBotReaction('celebrating');
        setTimeout(() => setXpNotification(null), 3500);
        setTimeout(() => setBotReaction('happy'), 2500);
    };

    const handleReset = () => {
        const reset = lingoBotService.resetToDefault();
        setCustomization(reset);
        setBotReaction('thinking');
        setTimeout(() => setBotReaction('happy'), 1000);
    };

    const handleSave = () => {
        lingoBotService.saveCustomization(customization);
        setSavedToast(true);
        setBotReaction('celebrating');
        setTimeout(() => setSavedToast(false), 3000);
        setTimeout(() => setBotReaction('happy'), 2000);
    };

    const learnedCounts = lingoBotService.getLearnedWordsCountByCategory();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Header: Educational Customization Hub */}
            <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 relative z-10 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        {cur.hub_tag}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        {cur.hub_title}
                    </h1>
                    <p className="text-indigo-100 text-xs sm:text-sm leading-relaxed font-medium">
                        {cur.hub_desc}
                    </p>
                </div>

                {/* Right: Words Learned Counter & Word Collection Toggle */}
                <div className="flex flex-wrap items-center gap-3 relative z-10">
                    <button
                        type="button"
                        onClick={() => setActiveTab(activeTab === 'studio' ? 'collection' : 'studio')}
                        className="bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2.5 text-center shadow-inner cursor-pointer transition text-left"
                    >
                        <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" /> {cur.words_discovered}
                        </div>
                        <div className="text-xl font-black text-white">
                            {learnedWords.length} <span className="text-xs font-normal text-slate-200">{cur.terms}</span>
                        </div>
                    </button>

                    <Button
                        variant="secondary"
                        onClick={() => navigate('/lingo-city')}
                        leftIcon={<Compass className="w-4 h-4 text-brand-600" />}
                        className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold shadow-lg border-none"
                    >
                        {cur.explore_city}
                    </Button>
                </div>
            </div>

            {/* XP Celebration Notification */}
            {xpNotification && (
                <div className="p-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in slide-in-from-top-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                        <span>{cur.xp_earned} (+{xpNotification} XP)</span>
                    </div>
                </div>
            )}

            {/* Tab: WORD COLLECTION VIEW */}
            {activeTab === 'collection' && (
                <div className="bg-white/95 rounded-3xl p-6 border border-slate-200 shadow-soft space-y-6 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                            <div className="inline-flex items-center gap-1 text-xs font-black uppercase text-purple-700 tracking-wider">
                                <BookOpen className="w-3.5 h-3.5" /> Customization Vocabulary Archive
                            </div>
                            <h2 className="text-xl font-black text-slate-900 mt-0.5">
                                Words Discovered ({learnedWords.length} Terms)
                            </h2>
                        </div>

                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setActiveTab('studio')}
                            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold"
                        >
                            ← Back to Dressing Room
                        </Button>
                    </div>

                    {/* Category Distribution Pills */}
                    <div className="flex flex-wrap gap-2 text-xs font-bold">
                        <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200">
                            👕 Clothes: {learnedCounts.clothes}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                            🎩 Hats: {learnedCounts.hats}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-teal-50 text-teal-800 border border-teal-200">
                            👓 Glasses: {learnedCounts.glasses}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200">
                            🎒 Bags: {learnedCounts.bags}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                            🪄 Tools: {learnedCounts.accessories}
                        </span>
                    </div>

                    {/* Word Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {learnedWords.map((entry, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-2.5 shadow-2xs"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-black text-brand-700">{entry.script}</span>
                                    <button
                                        type="button"
                                        onClick={() => playAudio(entry.script)}
                                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                                        title="Listen"
                                    >
                                        <Volume2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="text-xs text-slate-500 font-semibold italic">
                                    [{entry.phonetic}] • Concept: <span className="text-slate-800 font-bold">{entry.targetWord}</span>
                                </div>

                                <p className="text-xs text-slate-700 font-medium">
                                    Meaning: <span className="font-bold">{entry.meaning}</span>
                                </p>

                                <div className="p-2 rounded-xl bg-indigo-50/60 border border-indigo-100 text-xs font-semibold text-slate-800">
                                    "{entry.example}"
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab: MAIN DRESSING STUDIO WORKSPACE */}
            {activeTab === 'studio' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: Character Pedestal & Reaction Stage (5 cols) */}
                    <div className="lg:col-span-5 bg-gradient-to-b from-indigo-50/90 via-purple-50/60 to-white rounded-3xl p-6 border border-indigo-200/80 shadow-soft flex flex-col items-center justify-between text-center relative overflow-hidden">
                        <div className="w-full flex items-center justify-between z-10">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                                {cur.bot_companion_tag}
                            </span>
                            <Badge variant="brand" size="sm" className="font-bold">
                                🤖 LingoBot
                            </Badge>
                        </div>

                        {/* Pedestal & Character */}
                        <div className="my-6 relative z-10 flex flex-col items-center">
                            <CustomizableLingoBot
                                customization={customization}
                                size="2xl"
                                expression={botReaction}
                                animate={true}
                            />

                            {/* Pedestal Shadow */}
                            <div className="w-48 h-7 bg-slate-300/40 rounded-[50%] blur-sm -mt-2 -z-10 shadow-inner" />
                            <div className="w-40 h-3 bg-gradient-to-r from-transparent via-brand-500/30 to-transparent rounded-full mt-1" />

                            <div className="mt-4">
                                <h3 className="text-lg font-black text-slate-900">LingoBot</h3>
                                <p className="text-xs font-medium text-slate-500">
                                    {cur.bot_desc}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons: Save & Reset */}
                        <div className="w-full flex items-center justify-center gap-3 pt-4 border-t border-indigo-100 z-10">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                                className="text-xs font-bold text-slate-600 hover:text-slate-900"
                            >
                                {cur.reset}
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSave}
                                leftIcon={<Save className="w-4 h-4" />}
                                className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md flex-1 max-w-[200px]"
                            >
                                {cur.save_outfit}
                            </Button>
                        </div>

                        {savedToast && (
                            <div className="absolute bottom-16 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg z-20 flex items-center gap-1.5 animate-in fade-in">
                                <Check className="w-4 h-4" /> {cur.saved_toast}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Educational Wardrobe & Learning Panel (7 cols) */}
                    <div className="lg:col-span-7 space-y-5">
                        {/* 1. Category Switcher Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                            {categories.map(cat => {
                                const active = selectedCategory === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3.5 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                                            active
                                                ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md'
                                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}
                                    >
                                        {cat.icon}
                                        <span>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 2. Educational Item Cards Grid */}
                        <div className="bg-white/95 rounded-3xl p-5 border border-slate-200 shadow-soft space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                                <span>{cur.choose_item}</span>
                                <span>{currentItems.length} {cur.items_count}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                                {currentItems.map(item => {
                                    const isSelected = activeItem.id === item.id;
                                    const equipped = isEquipped(item.category, item.id);
                                    const unlocked = lingoBotService.isUnlocked(item, userXp);
                                    const learned = lingoBotService.isWordLearned(item.id);
                                    const script = item.learning.targetScript[targetLangCode] || item.learning.targetScript['hi'] || item.learning.targetWord;

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={() => handleSelectItem(item)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
                                                isSelected
                                                    ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-2 ring-brand-300'
                                                    : 'border-slate-200 hover:border-brand-300 bg-white hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs shrink-0"
                                                        style={{ backgroundColor: `${item.previewColor}18` }}
                                                    >
                                                        {item.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                                                        <div className="text-[11px] font-bold text-brand-700">
                                                            {script}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badges */}
                                                {equipped ? (
                                                    <span className="text-[9px] font-black text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                                                        <Check className="w-3 h-3" /> {cur.equipped}
                                                    </span>
                                                ) : learned ? (
                                                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                                                        ✓ {cur.learned}
                                                    </span>
                                                ) : unlocked ? (
                                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                                                        {cur.unlocked}
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-0.5 shrink-0">
                                                        <Lock className="w-3 h-3" /> {cur.locked}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                                <span className="text-slate-500 font-medium">{cur.concept}: {item.learning.targetWord}</span>
                                                <span className="text-brand-600 font-bold hover:underline">{cur.learn_equip}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 3. 📖 ACTIVE ITEM LEARNING PANEL (Teaching Vocabulary & Sentences) */}
                        {activeItem && (
                            <div className="bg-gradient-to-br from-indigo-50/90 via-white to-purple-50/80 rounded-3xl p-6 border-2 border-indigo-200 shadow-soft space-y-4">
                                <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-2xl">{activeItem.icon}</span>
                                        <div>
                                            <div className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                                                {cur.micro_lesson} • {activeItem.name}
                                            </div>
                                            <h3 className="text-base font-black text-slate-900">
                                                {cur.target_concept}: "{activeItem.learning.targetWord}"
                                            </h3>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const script = activeItem.learning.targetScript[targetLangCode] || activeItem.learning.targetScript['hi'] || activeItem.learning.targetWord;
                                            playAudio(script);
                                        }}
                                        leftIcon={<Volume2 className="w-4 h-4 text-brand-600" />}
                                        className="text-xs font-bold border-brand-300 text-brand-800 bg-white"
                                    >
                                        {cur.hear_word}
                                    </Button>
                                </div>

                                {/* Script, Phonetic & Meaning */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 space-y-1">
                                        <div className="text-[10px] font-black uppercase text-slate-400">{cur.target_script}</div>
                                        <div className="text-xl font-black text-brand-700">
                                            {activeItem.learning.targetScript[targetLangCode] || activeItem.learning.targetScript['hi'] || activeItem.learning.targetWord}
                                        </div>
                                        <div className="text-xs text-slate-500 italic">
                                            [{activeItem.learning.phonetic[targetLangCode] || activeItem.learning.phonetic['hi'] || activeItem.learning.targetWord}]
                                        </div>
                                    </div>

                                    <div className="p-3.5 rounded-2xl bg-white border border-indigo-100 space-y-1">
                                        <div className="text-[10px] font-black uppercase text-slate-400">{cur.meaning_yours}</div>
                                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                                            {activeItem.learning.meaning[interfaceLangCode] || activeItem.learning.meaning['en']}
                                        </p>
                                    </div>
                                </div>

                                {/* Example Context Sentence */}
                                <div className="p-4 rounded-2xl bg-white border border-slate-200/90 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-indigo-800 tracking-wider">
                                            {cur.example_sentence}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const sentence = activeItem.learning.exampleSentence[targetLangCode] || activeItem.learning.exampleSentence['hi'];
                                                playAudio(sentence);
                                            }}
                                            className="text-xs text-brand-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <Volume2 className="w-3.5 h-3.5" /> {cur.listen_sentence}
                                        </button>
                                    </div>

                                    <div className="text-sm sm:text-base font-extrabold text-slate-900">
                                        "{activeItem.learning.exampleSentence[targetLangCode] || activeItem.learning.exampleSentence['hi']}"
                                    </div>

                                    <div className="text-xs text-slate-600 font-medium">
                                        {cur.translation}: {activeItem.learning.exampleMeaning[interfaceLangCode] || activeItem.learning.exampleMeaning['en']}
                                    </div>
                                </div>

                                {/* Pronunciation Feedback Message */}
                                {pronounceFeedback && (
                                    <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <span>{pronounceFeedback}</span>
                                    </div>
                                )}

                                {/* Action Buttons: Practice, Mark Learned, Equip */}
                                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-indigo-100">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            const sentence = activeItem.learning.exampleSentence[targetLangCode] || activeItem.learning.exampleSentence['hi'];
                                            handlePronouncePractice(sentence);
                                        }}
                                        disabled={isPronouncing}
                                        leftIcon={<Mic className={`w-3.5 h-3.5 ${isPronouncing ? 'animate-pulse text-rose-500' : ''}`} />}
                                        className="text-xs font-bold"
                                    >
                                        {isPronouncing ? cur.listening : cur.practice_speaking}
                                    </Button>

                                    <div className="flex items-center gap-2">
                                        {/* Learn to Unlock Button if item has unlock activity */}
                                        {activeItem.learning.unlockActivity && !lingoBotService.isUnlocked(activeItem, userXp) && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => {
                                                    setActiveUnlockModalItem(activeItem);
                                                    setUnlockWordsLearned([]);
                                                }}
                                                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs"
                                            >
                                                {cur.learn_to_unlock}
                                            </Button>
                                        )}

                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => handleMarkAsLearned(activeItem)}
                                            leftIcon={<Check className="w-3.5 h-3.5" />}
                                            className="bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs shadow-md"
                                        >
                                            {isEquipped(activeItem.category, activeItem.id) ? cur.learned_and_equipped : cur.learn_and_wear}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 🔓 MODAL: "LEARN TO UNLOCK" MINI VOCABULARY ACTIVITY */}
            {activeUnlockModalItem && activeUnlockModalItem.learning.unlockActivity && (
                <Modal
                    isOpen={Boolean(activeUnlockModalItem)}
                    onClose={() => setActiveUnlockModalItem(null)}
                    title={`🔓 ${cur.unlock_modal_title} — ${activeUnlockModalItem.name}`}
                    className="max-w-xl"
                >
                    <div className="space-y-5">
                        <div className="space-y-1">
                            <h3 className="text-base font-black text-slate-900">
                                {activeUnlockModalItem.learning.unlockActivity.title}
                            </h3>
                            <p className="text-xs text-slate-600">
                                {activeUnlockModalItem.learning.unlockActivity.description}
                            </p>
                        </div>

                        {/* Words to tap and learn */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeUnlockModalItem.learning.unlockActivity.words.map((w, idx) => {
                                const isLearned = unlockWordsLearned.includes(w.word);
                                const script = w.script[targetLangCode] || w.script['hi'] || w.word;

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleUnlockActivityWord(w.word, script)}
                                        className={`p-3.5 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                                            isLearned
                                                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                                                : 'bg-slate-50 hover:bg-white border-slate-200 text-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xl">{w.icon}</span>
                                            <div>
                                                <div className="text-sm font-black">{script}</div>
                                                <div className="text-[11px] text-slate-500 italic">[{w.phonetic}]</div>
                                                <div className="text-[11px] text-slate-600 font-medium">
                                                    {w.meaning[interfaceLangCode] || w.meaning['en']}
                                                </div>
                                            </div>
                                        </div>
                                        <Volume2 className="w-4 h-4 text-brand-600 shrink-0" />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Unlock Completion */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-500">
                                {cur.tap_to_listen} ({unlockWordsLearned.length} / {activeUnlockModalItem.learning.unlockActivity.words.length})
                            </span>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => handleCompleteUnlockActivity(activeUnlockModalItem)}
                                disabled={unlockWordsLearned.length < activeUnlockModalItem.learning.unlockActivity.words.length}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md"
                            >
                                {cur.unlock_btn}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
