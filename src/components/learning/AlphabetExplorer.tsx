import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, Sparkles, BookOpen, Camera } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useAuth } from '../../context/AuthContext';
import { getTranslation } from '../../utils/translations';

interface AlphabetExplorerProps {
    targetLangCode?: string;
    targetLangName?: string;
}

interface LetterItem {
    symbol: string;
    phonetic: string;
    example: string;
    category: 'vowel' | 'consonant' | 'letter';
}

export const AlphabetExplorer: React.FC<AlphabetExplorerProps> = ({
    targetLangCode = 'hi',
    targetLangName = 'Hindi'
}) => {
    const { profile } = useAuth();
    const supportLangCode = profile?.comfortable_language?.code || 'en';
    const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(supportLangCode, key);

    const [selectedCategory, setSelectedCategory] = useState<'all' | 'vowel' | 'consonant'>('all');

    // Complete character database for target languages
    const characterData: Record<string, LetterItem[]> = {
        hi: [
            // Swar (Vowels)
            { symbol: 'अ', phonetic: 'a', example: 'अनार (Anar - Pomegranate)', category: 'vowel' },
            { symbol: 'आ', phonetic: 'aa', example: 'आम (Aam - Mango)', category: 'vowel' },
            { symbol: 'इ', phonetic: 'i', example: 'इमली (Imli - Tamarind)', category: 'vowel' },
            { symbol: 'ई', phonetic: 'ee', example: 'ईख (Eekh - Sugarcane)', category: 'vowel' },
            { symbol: 'उ', phonetic: 'u', example: 'उल्लु (Ullu - Owl)', category: 'vowel' },
            { symbol: 'ऊ', phonetic: 'oo', example: 'ऊंट (Oont - Camel)', category: 'vowel' },
            { symbol: 'ऋ', phonetic: 'ri', example: 'ऋषि (Rishi - Sage)', category: 'vowel' },
            { symbol: 'ए', phonetic: 'e', example: 'एक (Ek - One)', category: 'vowel' },
            { symbol: 'ऐ', phonetic: 'ai', example: 'ऐनक (Ainak - Spectacles)', category: 'vowel' },
            { symbol: 'ओ', phonetic: 'o', example: 'ओखली (Okhli - Mortar)', category: 'vowel' },
            { symbol: 'औ', phonetic: 'au', example: 'औरत (Aurat - Woman)', category: 'vowel' },
            { symbol: 'अं', phonetic: 'am', example: 'अंगूर (Angoor - Grapes)', category: 'vowel' },
            { symbol: 'अः', phonetic: 'ah', example: 'अतः (Atah - Therefore)', category: 'vowel' },
            // Vyanjan (Consonants)
            { symbol: 'क', phonetic: 'ka', example: 'कमल (Kamal - Lotus)', category: 'consonant' },
            { symbol: 'ख', phonetic: 'kha', example: 'खरगोश (Khargosh - Rabbit)', category: 'consonant' },
            { symbol: 'ग', phonetic: 'ga', example: 'गमला (Gamla - Pot)', category: 'consonant' },
            { symbol: 'घ', phonetic: 'gha', example: 'घर (Ghar - House)', category: 'consonant' },
            { symbol: 'च', phonetic: 'cha', example: 'चम्मच (Chammach - Spoon)', category: 'consonant' },
            { symbol: 'छ', phonetic: 'chha', example: 'छतरी (Chhatri - Umbrella)', category: 'consonant' },
            { symbol: 'ज', phonetic: 'ja', example: 'जहाज (Jahaj - Ship)', category: 'consonant' },
            { symbol: 'झ', phonetic: 'jha', example: 'झंडा (Jhanda - Flag)', category: 'consonant' },
            { symbol: 'ट', phonetic: 'ta', example: 'टमाटर (Tamatar - Tomato)', category: 'consonant' },
            { symbol: 'ठ', phonetic: 'tha', example: 'ठठेरा (Thathera - Tinker)', category: 'consonant' },
            { symbol: 'ड', phonetic: 'da', example: 'डमरू (Damru - Drum)', category: 'consonant' },
            { symbol: 'ढ', phonetic: 'dha', example: 'ढोलक (Dholak - Dhol)', category: 'consonant' },
            { symbol: 'त', phonetic: 'ta', example: 'तरबूज (Tarbooj - Watermelon)', category: 'consonant' },
            { symbol: 'थ', phonetic: 'tha', example: 'थर्मस (Thermos)', category: 'consonant' },
            { symbol: 'द', phonetic: 'da', example: 'दवात (Dawat - Inkpot)', category: 'consonant' },
            { symbol: 'ध', phonetic: 'dha', example: 'धनुष (Dhanush - Bow)', category: 'consonant' },
            { symbol: 'न', phonetic: 'na', example: 'नल (Nal - Tap)', category: 'consonant' },
            { symbol: 'प', phonetic: 'pa', example: 'पतंग (Patang - Kite)', category: 'consonant' },
            { symbol: 'फ', phonetic: 'pha', example: 'फल (Phal - Fruit)', category: 'consonant' },
            { symbol: 'ब', phonetic: 'ba', example: 'बस (Bus)', category: 'consonant' },
            { symbol: 'భ', phonetic: 'bha', example: 'भालू (Bhalu - Bear)', category: 'consonant' },
            { symbol: 'म', phonetic: 'ma', example: 'मछली (Machhli - Fish)', category: 'consonant' },
            { symbol: 'य', phonetic: 'ya', example: 'यज्ञ (Yajna)', category: 'consonant' },
            { symbol: 'र', phonetic: 'ra', example: 'रथ (Rath - Chariot)', category: 'consonant' },
            { symbol: 'ल', phonetic: 'la', example: 'लट्टू (Lattu - Top)', category: 'consonant' },
            { symbol: 'व', phonetic: 'va', example: 'वक (Vak - Crane)', category: 'consonant' },
            { symbol: 'श', phonetic: 'sha', example: 'शलजम (Shaljam - Turnip)', category: 'consonant' },
            { symbol: 'स', phonetic: 'sa', example: 'सपेरा (Sapera)', category: 'consonant' },
            { symbol: 'ह', phonetic: 'ha', example: 'हाथी (Hathi - Elephant)', category: 'consonant' }
        ],
        te: [
            // Achulu (Vowels)
            { symbol: 'అ', phonetic: 'a', example: 'అమ్మ (Amma - Mother)', category: 'vowel' },
            { symbol: 'ఆ', phonetic: 'aa', example: 'ఆవు (Aavu - Cow)', category: 'vowel' },
            { symbol: 'ఇ', phonetic: 'i', example: 'ఇల్లు (Illu - House)', category: 'vowel' },
            { symbol: 'ఈ', phonetic: 'ee', example: 'ఈగ (Eega - Fly)', category: 'vowel' },
            { symbol: 'ఉ', phonetic: 'u', example: 'ఉడుత (Uduta - Squirrel)', category: 'vowel' },
            { symbol: 'ఊ', phonetic: 'oo', example: 'ఊయల (Ooyala - Cradle)', category: 'vowel' },
            { symbol: 'ఋ', phonetic: 'ri', example: 'ఋషి (Rishi - Sage)', category: 'vowel' },
            { symbol: 'ఎ', phonetic: 'e', example: 'ఎలుక (Eluka - Rat)', category: 'vowel' },
            { symbol: 'ఏ', phonetic: 'ee', example: 'ఏనుగు (Eenugu - Elephant)', category: 'vowel' },
            { symbol: 'ఐ', phonetic: 'ai', example: 'ఐదు (Aidu - Five)', category: 'vowel' },
            { symbol: 'ఒ', phonetic: 'o', example: 'ఒంటె (Onte - Camel)', category: 'vowel' },
            { symbol: 'ఓ', phonetic: 'oo', example: 'ఓడ (Oda - Ship)', category: 'vowel' },
            { symbol: 'ఔ', phonetic: 'au', example: 'ఔషధం (Aushadham - Medicine)', category: 'vowel' },
            // Hallulu (Consonants)
            { symbol: 'క', phonetic: 'ka', example: 'కమలం (Kamalam - Lotus)', category: 'consonant' },
            { symbol: 'ఖ', phonetic: 'kha', example: 'ఖడ్గం (Khadgam - Sword)', category: 'consonant' },
            { symbol: 'గ', phonetic: 'ga', example: 'గడియారం (Gadiyaram - Clock)', category: 'consonant' },
            { symbol: 'ఘ', phonetic: 'gha', example: 'ఘటం (Ghatam - Pot)', category: 'consonant' },
            { symbol: 'చ', phonetic: 'cha', example: 'చందమామ (Chandamama - Moon)', category: 'consonant' },
            { symbol: 'ఛ', phonetic: 'chha', example: 'ఛత్రం (Chhatram - Umbrella)', category: 'consonant' },
            { symbol: 'జ', phonetic: 'ja', example: 'జడ (Jada - Braid)', category: 'consonant' },
            { symbol: 'ఝ', phonetic: 'jha', example: 'ఝషం (Jhasham - Fish)', category: 'consonant' },
            { symbol: 'ట', phonetic: 'ta', example: 'టపాకాయ (Tapakaya - Firecracker)', category: 'consonant' },
            { symbol: 'డ', phonetic: 'da', example: 'డప్పు (Dappu - Drum)', category: 'consonant' },
            { symbol: 'త', phonetic: 'ta', example: 'తల (Tala - Head)', category: 'consonant' },
            { symbol: 'ద', phonetic: 'da', example: 'దండ (Danda - Garland)', category: 'consonant' },
            { symbol: 'న', phonetic: 'na', example: 'నరి (Nari - Fox)', category: 'consonant' },
            { symbol: 'ప', phonetic: 'pa', example: 'పలక (Palaka - Slate)', category: 'consonant' },
            { symbol: 'ఫ', phonetic: 'pha', example: 'ఫలం (Phalam - Fruit)', category: 'consonant' },
            { symbol: 'బ', phonetic: 'ba', example: 'బంతి (Banti - Ball)', category: 'consonant' },
            { symbol: 'భ', phonetic: 'bha', example: 'భవనం (Bhavanam - Building)', category: 'consonant' },
            { symbol: 'మ', phonetic: 'ma', example: 'మంచం (Mancham - Bed)', category: 'consonant' },
            { symbol: 'య', phonetic: 'ya', example: 'యంత్రం (Yantram - Machine)', category: 'consonant' },
            { symbol: 'ర', phonetic: 'ra', example: 'రథం (Ratham - Chariot)', category: 'consonant' },
            { symbol: 'ల', phonetic: 'la', example: 'లత (Lata - Creeper)', category: 'consonant' },
            { symbol: 'వ', phonetic: 'va', example: 'వల (Vala - Net)', category: 'consonant' },
            { symbol: 'శ', phonetic: 'sha', example: 'శంఖం (Shankham - Conch)', category: 'consonant' },
            { symbol: 'ష', phonetic: 'sha', example: 'షట్కోణం (Shatkonam - Hexagon)', category: 'consonant' },
            { symbol: 'స', phonetic: 'sa', example: 'సబ్బు (Sabbu - Soap)', category: 'consonant' },
            { symbol: 'హ', phonetic: 'ha', example: 'హంస (Hamsa - Swan)', category: 'consonant' }
        ],
        ta: [
            // Uyirezhuthukal (Vowels)
            { symbol: 'அ', phonetic: 'a', example: 'அம்மா (Amma - Mother)', category: 'vowel' },
            { symbol: 'ஆ', phonetic: 'aa', example: 'ஆடு (Aadu - Goat)', category: 'vowel' },
            { symbol: 'இ', phonetic: 'i', example: 'இலை (Ilai - Leaf)', category: 'vowel' },
            { symbol: 'ஈ', phonetic: 'ee', example: 'ஈட்டி (Eetti - Spear)', category: 'vowel' },
            { symbol: 'உ', phonetic: 'u', example: 'உரல் (Ural - Mortar)', category: 'vowel' },
            { symbol: 'ஊ', phonetic: 'oo', example: 'ஊஞ்சல் (Oonjal - Swing)', category: 'vowel' },
            { symbol: 'எ', phonetic: 'e', example: 'எலி (Eli - Rat)', category: 'vowel' },
            { symbol: 'ஏ', phonetic: 'ee', example: 'ஏணி (Eani - Ladder)', category: 'vowel' },
            { symbol: 'ஐ', phonetic: 'ai', example: 'ஐந்து (Ainthu - Five)', category: 'vowel' },
            { symbol: 'ஒ', phonetic: 'o', example: 'ஒட்டகம் (Ottagam - Camel)', category: 'vowel' },
            { symbol: 'ஓ', phonetic: 'oo', example: 'ஓடம் (Odam - Boat)', category: 'vowel' },
            { symbol: 'ஔ', phonetic: 'au', example: 'ஔவையார் (Avvaiyar - Poet)', category: 'vowel' },
            { symbol: 'ஃ', phonetic: 'ak', example: 'எஃகு (Ehgu - Steel)', category: 'vowel' },
            // Meiyezhuthukal (Consonants)
            { symbol: 'க', phonetic: 'ka', example: 'கண் (Kan - Eye)', category: 'consonant' },
            { symbol: 'ங', phonetic: 'nga', example: 'சிங்கம் (Singam - Lion)', category: 'consonant' },
            { symbol: 'ச', phonetic: 'sa/cha', example: 'சக்கரம் (Sakkaram - Wheel)', category: 'consonant' },
            { symbol: 'ஞ', phonetic: 'nya', example: 'ஞாயிறு (Gnayiru - Sun)', category: 'consonant' },
            { symbol: 'ட', phonetic: 'ta/da', example: 'படம் (Padam - Picture)', category: 'consonant' },
            { symbol: 'ண', phonetic: 'na', example: 'வண்ணம் (Vannam - Color)', category: 'consonant' },
            { symbol: 'த', phonetic: 'tha', example: 'தவளை (Thavalai - Frog)', category: 'consonant' },
            { symbol: 'ந', phonetic: 'na', example: 'நரி (Nari - Fox)', category: 'consonant' },
            { symbol: 'ப', phonetic: 'pa', example: 'பந்து (Panthu - Ball)', category: 'consonant' },
            { symbol: 'ம', phonetic: 'ma', example: 'மயில் (Mayil - Peacock)', category: 'consonant' },
            { symbol: 'ய', phonetic: 'ya', example: 'யானை (Yanai - Elephant)', category: 'consonant' },
            { symbol: 'ர', phonetic: 'ra', example: 'ரயில் (Rayil - Train)', category: 'consonant' },
            { symbol: 'ல', phonetic: 'la', example: 'லட்டு (Laddu - Sweet)', category: 'consonant' },
            { symbol: 'வ', phonetic: 'va', example: 'வண்டு (Vandu - Beetle)', category: 'consonant' },
            { symbol: 'ழ', phonetic: 'zha', example: 'வாழை (Vazhai - Banana)', category: 'consonant' },
            { symbol: 'ள', phonetic: 'la', example: 'விளக்கு (Vilakku - Lamp)', category: 'consonant' },
            { symbol: 'ற', phonetic: 'ra', example: 'பறவை (Paravai - Bird)', category: 'consonant' },
            { symbol: 'ன', phonetic: 'na', example: 'மான் (Maan - Deer)', category: 'consonant' }
        ],
        kn: [
            // Svaragalu (Vowels)
            { symbol: 'ಅ', phonetic: 'a', example: 'ಅರಸ (Arasa - King)', category: 'vowel' },
            { symbol: 'ಆ', phonetic: 'aa', example: 'ಆನೆ (Aane - Elephant)', category: 'vowel' },
            { symbol: 'ಇ', phonetic: 'i', example: 'ಇಲಿ (Ili - Rat)', category: 'vowel' },
            { symbol: 'ಈ', phonetic: 'ee', example: 'ಈಜು (Eezhu - Swim)', category: 'vowel' },
            { symbol: 'ಉ', phonetic: 'u', example: 'ಉಡುಪು (Udupu - Dress)', category: 'vowel' },
            { symbol: 'ಊ', phonetic: 'oo', example: 'ಊಟ (Oota - Meal)', category: 'vowel' },
            { symbol: 'ಋ', phonetic: 'ri', example: 'ಋಷಿ (Rishi - Sage)', category: 'vowel' },
            { symbol: 'ಎ', phonetic: 'e', example: 'ಎಲೆ (Ele - Leaf)', category: 'vowel' },
            { symbol: 'ಏ', phonetic: 'ee', example: 'ಏಣಿ (Eani - Ladder)', category: 'vowel' },
            { symbol: 'ಐ', phonetic: 'ai', example: 'ಐದು (Aidu - Five)', category: 'vowel' },
            { symbol: 'ಒ', phonetic: 'o', example: 'ಒಂಟೆ (Onte - Camel)', category: 'vowel' },
            { symbol: 'ಓ', phonetic: 'oo', example: 'ಓಟ (Oota - Race)', category: 'vowel' },
            { symbol: 'ಔ', phonetic: 'au', example: 'ಔಷಧ (Aushadha - Medicine)', category: 'vowel' },
            { symbol: 'ಅಂ', phonetic: 'am', example: 'ಅಂಗಿ (Angi - Shirt)', category: 'vowel' },
            // Vyanjanagalu (Consonants)
            { symbol: 'ಕ', phonetic: 'ka', example: 'ಕಮಲ (Kamala - Lotus)', category: 'consonant' },
            { symbol: 'ಖ', phonetic: 'kha', example: 'ಖಡ್ಗ (Khadga - Sword)', category: 'consonant' },
            { symbol: 'ಗ', phonetic: 'ga', example: 'ಗಡಿಯಾರ (Gadiyara - Clock)', category: 'consonant' },
            { symbol: 'ಘ', phonetic: 'gha', example: 'ಘಂಟೆ (Ghante - Bell)', category: 'consonant' },
            { symbol: 'ಚ', phonetic: 'cha', example: 'ಚಮಚ (Chamacha - Spoon)', category: 'consonant' },
            { symbol: 'ಛ', phonetic: 'chha', example: 'ಛತ್ರಿ (Chhatri - Umbrella)', category: 'consonant' },
            { symbol: 'ಜ', phonetic: 'ja', example: 'ಜೇನು (Jenu - Honey)', category: 'consonant' },
            { symbol: 'ಝ', phonetic: 'jha', example: 'ಝರಿ (Jhari - Stream)', category: 'consonant' },
            { symbol: 'ಟ', phonetic: 'ta', example: 'ಟೊಪ್ಪಿಗೆ (Toppige - Hat)', category: 'consonant' },
            { symbol: 'ಡ', phonetic: 'da', example: 'ಡಮರು (Damaru - Drum)', category: 'consonant' },
            { symbol: 'ತ', phonetic: 'ta', example: 'ತಟ್ಟೆ (Tatte - Plate)', category: 'consonant' },
            { symbol: 'ದ', phonetic: 'da', example: 'ದೀಪ (Deepa - Lamp)', category: 'consonant' },
            { symbol: 'ನ', phonetic: 'na', example: 'ನವಿಲು (Navilu - Peacock)', category: 'consonant' },
            { symbol: 'ಪ', phonetic: 'pa', example: 'ಪಟ (Pata - Kite)', category: 'consonant' },
            { symbol: 'ಫ', phonetic: 'pha', example: 'ಫಲ (Phala - Fruit)', category: 'consonant' },
            { symbol: 'ಬ', phonetic: 'ba', example: 'ಬಾಳೆ (Baale - Banana)', category: 'consonant' },
            { symbol: 'ಭ', phonetic: 'bha', example: 'ಭಾರತ (Bharata - India)', category: 'consonant' },
            { symbol: 'ಮ', phonetic: 'ma', example: 'ಮನೆ (Mane - House)', category: 'consonant' },
            { symbol: 'ಯ', phonetic: 'ya', example: 'ಯಂತ್ರ (Yantra - Machine)', category: 'consonant' },
            { symbol: 'ರ', phonetic: 'ra', example: 'ರಥ (Ratha - Chariot)', category: 'consonant' },
            { symbol: 'ಲ', phonetic: 'la', example: 'ಲತೆ (Late - Vine)', category: 'consonant' },
            { symbol: 'ವ', phonetic: 'va', example: 'ವನ (Vana - Forest)', category: 'consonant' },
            { symbol: 'ಸ', phonetic: 'sa', example: 'ಸೂರ್ಯ (Surya - Sun)', category: 'consonant' },
            { symbol: 'ಹ', phonetic: 'ha', example: 'ಹಸು (Hasu - Cow)', category: 'consonant' },
            { symbol: 'ಳ', phonetic: 'la', example: 'ಬೆಟ್ಟ (Betta - Hill)', category: 'consonant' }
        ],
        ml: [
            // Svarangal (Vowels)
            { symbol: 'അ', phonetic: 'a', example: 'അമ്മ (Amma - Mother)', category: 'vowel' },
            { symbol: 'ആ', phonetic: 'aa', example: 'ആന (Aana - Elephant)', category: 'vowel' },
            { symbol: 'ഇ', phonetic: 'i', example: 'ഇല (Ila - Leaf)', category: 'vowel' },
            { symbol: 'ഈ', phonetic: 'ee', example: 'ഈച്ച (Eecha - Fly)', category: 'vowel' },
            { symbol: 'ഉ', phonetic: 'u', example: 'ഉറുമ്പ് (Urumbu - Ant)', category: 'vowel' },
            { symbol: 'ഊ', phonetic: 'oo', example: 'ഊഞ്ഞാൽ (Oonjal - Swing)', category: 'vowel' },
            { symbol: 'ഋ', phonetic: 'ri', example: 'ഋഷി (Rishi - Sage)', category: 'vowel' },
            { symbol: 'എ', phonetic: 'e', example: 'എലി (Eli - Rat)', category: 'vowel' },
            { symbol: 'ഏ', phonetic: 'ee', example: 'ഏണി (Eani - Ladder)', category: 'vowel' },
            { symbol: 'ഐ', phonetic: 'ai', example: 'ഐസ് (Ice)', category: 'vowel' },
            { symbol: 'ഒ', phonetic: 'o', example: 'ഒട്ടകം (Ottakam - Camel)', category: 'vowel' },
            { symbol: 'ഓ', phonetic: 'oo', example: 'ഓടം (Odam - Boat)', category: 'vowel' },
            { symbol: 'ഔ', phonetic: 'au', example: 'ഔഷധം (Aushadham - Medicine)', category: 'vowel' },
            // Vyanjanangal (Consonants)
            { symbol: 'ക', phonetic: 'ka', example: 'കണ്ണ് (Kannu - Eye)', category: 'consonant' },
            { symbol: 'ഖ', phonetic: 'kha', example: 'ഖഡ്ഗം (Khadgam - Sword)', category: 'consonant' },
            { symbol: 'ഗ', phonetic: 'ga', example: 'ഗജം (Gajam - Elephant)', category: 'consonant' },
            { symbol: 'ഘ', phonetic: 'gha', example: 'ഘടികാരം (Ghadikaram - Clock)', category: 'consonant' },
            { symbol: 'ങ', phonetic: 'nga', example: 'മാങ്ങ (Manga - Mango)', category: 'consonant' },
            { symbol: 'ച', phonetic: 'cha', example: 'ചക്രം (Chakram - Wheel)', category: 'consonant' },
            { symbol: 'ഛ', phonetic: 'chha', example: 'ഛത്രം (Chhatram - Umbrella)', category: 'consonant' },
            { symbol: 'ജ', phonetic: 'ja', example: 'ജലം (Jalam - Water)', category: 'consonant' },
            { symbol: 'ഝ', phonetic: 'jha', example: 'ഝഷം (Jhasham - Fish)', category: 'consonant' },
            { symbol: 'ഞ', phonetic: 'nya', example: 'ഞണ്ട് (Njandu - Crab)', category: 'consonant' },
            { symbol: 'ട', phonetic: 'ta', example: 'തത്ത (Thatha - Parrot)', category: 'consonant' },
            { symbol: 'ഡ', phonetic: 'da', example: 'ഡപ്പ (Dappa - Tin)', category: 'consonant' },
            { symbol: 'ത', phonetic: 'tha', example: 'തല (Thala - Head)', category: 'consonant' },
            { symbol: 'ദ', phonetic: 'da', example: 'ദീപം (Deepam - Lamp)', category: 'consonant' },
            { symbol: 'ന', phonetic: 'na', example: 'നരി (Nari - Fox)', category: 'consonant' },
            { symbol: 'പ', phonetic: 'pa', example: 'പന്ത് (Panthu - Ball)', category: 'consonant' },
            { symbol: 'ഫ', phonetic: 'pha', example: 'ഫലം (Phalam - Fruit)', category: 'consonant' },
            { symbol: 'ബ', phonetic: 'ba', example: 'ബസ് (Bus)', category: 'consonant' },
            { symbol: 'ഭ', phonetic: 'bha', example: 'ഭാരതം (Bharatham - India)', category: 'consonant' },
            { symbol: 'മ', phonetic: 'ma', example: 'മയിൽ (Mayil - Peacock)', category: 'consonant' },
            { symbol: 'യ', phonetic: 'ya', example: 'യാത്ര (Yathra - Journey)', category: 'consonant' },
            { symbol: 'ര', phonetic: 'ra', example: 'രഥം (Ratham - Chariot)', category: 'consonant' },
            { symbol: 'ല', phonetic: 'la', example: 'ലത (Latha - Vine)', category: 'consonant' },
            { symbol: 'വ', phonetic: 'va', example: 'വള്ളം (Vallam - Boat)', category: 'consonant' },
            { symbol: 'ശ', phonetic: 'sha', example: 'ശംഖ് (Shankh - Conch)', category: 'consonant' },
            { symbol: 'സ', phonetic: 'sa', example: 'സൂര്യൻ (Sooryan - Sun)', category: 'consonant' },
            { symbol: 'ഹ', phonetic: 'ha', example: 'ഹംസം (Hamsam - Swan)', category: 'consonant' },
            { symbol: 'ള', phonetic: 'la', example: 'മഴ (Mazha - Rain)', category: 'consonant' }
        ],
        en: Array.from({ length: 26 }, (_, i) => {
            const char = String.fromCharCode(65 + i);
            const lower = char.toLowerCase();
            const examples: Record<string, string> = {
                A: 'Apple', B: 'Ball', C: 'Cat', D: 'Dog', E: 'Elephant',
                F: 'Fish', G: 'Giraffe', H: 'House', I: 'Ice Cream', J: 'Jug',
                K: 'Kite', L: 'Lion', M: 'Monkey', N: 'Nest', O: 'Owl',
                P: 'Peacock', Q: 'Queen', R: 'Rabbit', S: 'Sun', T: 'Tiger',
                U: 'Umbrella', V: 'Van', W: 'Watch', X: 'Xylophone', Y: 'Yak', Z: 'Zebra'
            };
            const isVowel = ['A', 'E', 'I', 'O', 'U'].includes(char);
            return {
                symbol: `${char} ${lower}`,
                phonetic: char.toLowerCase(),
                example: `${examples[char]}`,
                category: isVowel ? 'vowel' : 'consonant'
            };
        })
    };

    const letters = characterData[targetLangCode] || characterData['hi'];
    const filteredLetters = letters.filter(item => {
        if (selectedCategory === 'all') return true;
        return item.category === selectedCategory;
    });

    return (
        <div className="bg-white rounded-3xl border border-indigo-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.06),0_2px_8px_rgba(79,70,229,0.04)] p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full mb-1">
                        <Sparkles className="w-3.5 h-3.5" /> {t('alphabet_explorer_title')}
                    </div>
                    <h2 className="text-xl font-black text-slate-900">
                        {targetLangName} {t('alphabet_explorer_title')}
                    </h2>
                    <p className="text-xs text-slate-600 font-semibold">
                        {t('alphabet_explorer_subtitle')}
                    </p>
                </div>

                {/* Filter Tabs & Image OCR Action */}
                <div className="flex flex-wrap items-center gap-2 self-start">
                    <div className="flex items-center bg-indigo-50/80 border border-indigo-100 p-1 rounded-xl gap-1">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${selectedCategory === 'all' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            {t('tab_all')} ({letters.length})
                        </button>
                        <button
                            onClick={() => setSelectedCategory('vowel')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${selectedCategory === 'vowel' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            {t('tab_vowels')}
                        </button>
                        <button
                            onClick={() => setSelectedCategory('consonant')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${selectedCategory === 'consonant' ? 'bg-white text-purple-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                        >
                            {t('tab_consonants')}
                        </button>
                    </div>

                    <Link
                        to="/learn-from-image"
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200 transition shrink-0"
                    >
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{t('camera_ocr_btn').replace(/^📸\s*/, '')}</span>
                    </Link>
                </div>
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {filteredLetters.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => voiceService.speakText(item.symbol.split(' ')[0], targetLangCode)}
                        className="group relative p-4 bg-white hover:bg-brand-50/80 border border-indigo-100/90 hover:border-brand-400 rounded-2xl flex flex-col items-center transition-all duration-200 shadow-2xs hover:shadow-md hover:-translate-y-0.5 text-center cursor-pointer"
                    >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                        </div>
                        <span className="text-3xl font-extrabold text-slate-900 group-hover:text-purple-700 transition">
                            {item.symbol}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400 group-hover:text-purple-600 mt-1">
                            [{item.phonetic}]
                        </span>
                        <span className="text-[10px] text-slate-500 line-clamp-1 mt-1 font-semibold">
                            {item.example}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
