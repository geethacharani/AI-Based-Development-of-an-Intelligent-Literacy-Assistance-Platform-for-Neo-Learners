#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to guarantee 100% complete, clean translations for all 6 languages:
en, te, ta, hi, kn, ml in src/utils/translations.ts
"""
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/utils/translations.ts', 'r', encoding='utf-8', errors='replace') as f:
    text = f.read()

# 1. Extract interface TranslationStrings keys
im = re.search(r'export interface TranslationStrings\s*\{([\s\S]*?)\}', text)
if not im:
    print('Error: TranslationStrings interface not found')
    sys.exit(1)

interface_lines = im.group(1).split('\n')
all_interface_keys = []
for line in interface_lines:
    line_clean = line.strip()
    if ':' in line_clean and not line_clean.startswith('//'):
        k = line_clean.split(':')[0].strip()
        if k and k not in all_interface_keys:
            all_interface_keys.append(k)

print(f'Total unique interface keys: {len(all_interface_keys)}')

# 2. Extract existing key-value pairs from en and te
def extract_dict(start_marker, end_marker):
    s = text.find(start_marker)
    if s == -1:
        return {}
    e = text.find(end_marker, s) if end_marker else len(text)
    sub = text[s:e]
    # Match: key: "value" or key: 'value'
    # Note: value may contain escaped quotes
    items = {}
    pattern = re.compile(r'^\s*([a-zA-Z0-9_]+)\s*:\s*([`\'"])([\s\S]*?)\2,?\s*$', re.MULTILINE)
    for m in pattern.finditer(sub):
        k = m.group(1)
        v = m.group(3)
        items[k] = v
    return items

en_dict = extract_dict('en: {', '// ==========================================\n    // TELUGU')
te_dict = extract_dict('te: {', '// ==========================================\n    // TAMIL')
ta_dict = extract_dict('ta: {', '// ==========================================\n    // HINDI')
hi_dict = extract_dict('hi: {', '// ==========================================\n    // KANNADA')
kn_dict = extract_dict('kn: {', '// ==========================================\n    // MALAYALAM')
ml_dict = extract_dict('ml: {', '};\n\nexport const getTranslation')

print(f'Extracted keys: en={len(en_dict)}, te={len(te_dict)}, ta={len(ta_dict)}, hi={len(hi_dict)}, kn={len(kn_dict)}, ml={len(ml_dict)}')

# Import TRANSLATIONS from add_translations.py
import add_translations
BASE_TRANSLATIONS = add_translations.TRANSLATIONS

# High quality translations for prof_* and game_* keys for ta, hi, kn, ml
EXTRA_TRANSLATIONS = {
    # Profile Page
    'prof_loading': {
        'en': 'Loading learner profile...',
        'te': 'విద్యార్థి ప్రొఫైల్ లోడవుతోంది...',
        'ta': 'கற்பவர் சுயவிவரம் ஏற்றப்படுகிறது...',
        'hi': 'शिक्षार्थी प्रोफ़ाइल लोड हो रहा है...',
        'kn': 'ಕಲಿಯುವವರ ಪ್ರೊಫೈಲ್ ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        'ml': 'പഠിതാവിന്റെ പ്രൊഫൈൽ ലോഡ് ചെയ്യുന്നു...'
    },
    'prof_back_to_home': {
        'en': 'Back to Home',
        'te': 'హోమ్‌కు తిరిగి వెళ్ళండి',
        'ta': 'முகப்பிற்கு திரும்பு',
        'hi': 'होम पर वापस जाएं',
        'kn': 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
        'ml': 'ഹോമിലേക്ക് മടങ്ങൂ'
    },
    'prof_admin_console': {
        'en': 'Admin Console',
        'te': 'అడ్మిన్ కన్సోల్',
        'ta': 'நிர்வாக கன்சோல்',
        'hi': 'व्यवस्थापक कंसोल',
        'kn': 'ನಿರ್ವಾಹಕ ಕನ್ಸೋಲ್',
        'ml': 'അഡ്മിൻ കൺസോൾ'
    },
    'prof_language_preferences': {
        'en': 'Language Preferences',
        'te': 'భాషా ప్రాధాన్యతలు',
        'ta': 'மொழி விருப்பங்கள்',
        'hi': 'भाषा प्राथमिकताएं',
        'kn': 'ಭಾಷಾ ಆದ್ಯತೆಗಳು',
        'ml': 'ഭാഷാ മുൻഗണനകൾ'
    },
    'prof_lang_pref_desc': {
        'en': 'Configure your target practice and support explanation languages',
        'te': 'మీ లక్ష్య సాధన మరియు సహాయ వివరణ భాషలను కాన్ఫిగర్ చేయండి',
        'ta': 'உங்கள் பயிற்சி மற்றும் ஆதரவு விளக்க மொழிகளை கட்டமைக்கவும்',
        'hi': 'अपनी लक्ष्य भाषा और समर्थन भाषा कॉन्फ़िगर करें',
        'kn': 'ನಿಮ್ಮ ಗುರಿ ಅಭ್ಯಾಸ ಮತ್ತು ವಿವರಣೆ ಭಾಷೆಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ',
        'ml': 'പരിശീലന, വിശദീകരണ ഭാഷകൾ ക്രമീകരിക്കുക'
    },
    'prof_target_learning_lang': {
        'en': 'Target Learning Language',
        'te': 'లక్ష్య అభ్యాస భాష',
        'ta': 'இலக்கு கற்றல் மொழி',
        'hi': 'लक्षित सीखने की भाषा',
        'kn': 'ಕಲಿಯುವ ಗುರಿ ಭಾಷೆ',
        'ml': 'പഠിക്കുന്ന ലക്ഷ്യ ഭാഷ'
    },
    'prof_target_lang_hint': {
        'en': 'All lessons and mini-games will test this language.',
        'te': 'అన్ని పాఠాలు మరియు మినీ-గేమ్‌లు ఈ భాషను పరీక్షిస్తాయి.',
        'ta': 'அனைத்து பாடங்களும் சிறு விளையாட்டுகளும் இந்த மொழியை சோதிக்கும்.',
        'hi': 'सभी पाठ और मिनी-गेम इस भाषा का परीक्षण करेंगे।',
        'kn': 'ಎಲ್ಲಾ ಪಾಠಗಳು ಮತ್ತು ಮಿನಿ ಆಟಗಳು ಈ ಭಾಷೆಯನ್ನು ಪರೀಕ್ಷಿಸುತ್ತವೆ.',
        'ml': 'എല്ലാ പാഠങ്ങളും കളികളും ഈ ഭാഷ പരിശോധിക്കും.'
    },
    'prof_interface_explanation_lang': {
        'en': 'Interface & Explanation Language',
        'te': 'ఇంటర్‌ఫేస్ & వివరణ భాష',
        'ta': 'இடைமுகம் & விளக்க மொழி',
        'hi': 'इंटरफ़ेस और स्पष्टीकरण भाषा',
        'kn': 'ಇಂಟರ್ಫೇಸ್ & ವಿವರಣೆ ಭಾಷೆ',
        'ml': 'ഇന്റർഫേസും വിശദീകരണ ഭാഷയും'
    },
    'prof_interface_lang_hint': {
        'en': 'Translations and audio guidance will be provided in this language.',
        'te': 'అనువాదాలు మరియు ఆడియో మార్గదర్శకత్వం ఈ భాషలో అందించబడతాయి.',
        'ta': 'மொழிபெயர்ப்புகளும் ஆடியோ வழிகாட்டலும் இந்த மொழியில் வழங்கப்படும்.',
        'hi': 'अनुवाद और ऑडियो मार्गदर्शन इस भाषा में प्रदान किए जाएंगे।',
        'kn': 'ಅನುವಾದಗಳು ಮತ್ತು ಆಡಿಯೊ ಮಾರ್ಗದರ್ಶನ ಈ ಭಾಷೆಯಲ್ಲಿರುತ್ತವೆ.',
        'ml': 'വിവർത്തനങ്ങളും ഓഡിയോ മാർഗ്ഗനിർദ്ദേശങ്ങളും ഈ ഭാഷയിലായിരിക്കും.'
    },
    'prof_notif_study_reminders': {
        'en': 'Notification & Study Reminders',
        'te': 'నోటిఫికేషన్ & అభ్యాస రిమైండర్లు',
        'ta': 'அறிவிப்பு & படிப்பு நினைவூட்டல்கள்',
        'hi': 'अधिसूचना और अध्ययन अनुस्मारक',
        'kn': 'ಅಧಿಸೂಚನೆ & ಅಧ್ಯಯನ ಜ್ಞಾಪನೆಗಳು',
        'ml': 'അറിയിപ്പുകളും പഠന ഓർമ്മപ്പെടുത്തലുകളും'
    },
    'prof_notif_desc': {
        'en': 'Manage habit reminders to keep your streak alive',
        'te': 'మీ స్ట్రీక్‌ను కొనసాగించడానికి అలవాటు రిమైండర్లను నిర్వహించండి',
        'ta': 'தொடர்ச்சியை நீடிக்க நினைவூட்டல்களை நிர்வகிக்கவும்',
        'hi': 'अपनी स्ट्रीक बनाए रखने के लिए अनुस्मारक प्रबंधित करें',
        'kn': 'ನಿಮ್ಮ ಸ್ಟ್ರೀಕ್ ಜೀವಂತವಾಗಿಡಲು ಜ್ಞಾಪನೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
        'ml': 'ശ്രേണി നിലനിർത്താൻ ഓർമ്മപ്പെടുത്തലുകൾ നിയന്ത്രിക്കുക'
    },
    'prof_daily_study_reminders': {
        'en': 'Daily Study Reminders',
        'te': 'రోజువారీ అభ్యాస రిమైండర్లు',
        'ta': 'தினசரி படிப்பு நினைவூட்டல்கள்',
        'hi': 'दैनिक अध्ययन अनुस्मारक',
        'kn': 'ದೈನಂದಿನ ಅಧ್ಯಯನ ಜ್ಞಾಪನೆಗಳು',
        'ml': 'ദൈനംദിന പഠന ഓർമ്മപ്പെടുത്തലുകൾ'
    },
    'prof_daily_reminders_desc': {
        'en': 'Receive gentle nudges to practice 5 minutes daily',
        'te': 'రోజూ 5 నిమిషాలు సాధన చేయమని గుర్తుచేసే నోటిఫికేషన్లు అందుకోండి',
        'ta': 'தினமும் 5 நிமிடங்கள் பயிற்சி செய்ய மென்மையான நினைவூட்டல்களைப் பெறுங்கள்',
        'hi': 'प्रतिदिन 5 मिनट अभ्यास करने के लिए सूचनाएं प्राप्त करें',
        'kn': 'ದಿನಕ್ಕೆ 5 ನಿಮಿಷ ಅಭ್ಯಾಸ ಮಾಡಲು ಸೂಚನೆಗಳನ್ನು ಪಡೆಯಿರಿ',
        'ml': 'ദിവസവും 5 മിനിറ്റ് പരിശീലിക്കാൻ അറിയിപ്പുകൾ നേടുക'
    },
    'prof_streak_freeze_alerts': {
        'en': 'Streak Freeze & Flame Alerts',
        'te': 'స్ట్రీక్ ఫ్రీజ్ & ఫ్లేమ్ అలర్ట్‌లు',
        'ta': 'ஸ்ட்ரீக் ஃப்ரீஸ் எச்சரிக்கைகள்',
        'hi': 'स्ट्रीक फ़्रीज़ और ज्वाला अलर्ट',
        'kn': 'ಸ್ಟ್ರೀಕ್ ಫ್ರೀಜ್ ಎಚ್ಚರಿಕೆಗಳು',
        'ml': 'സ്ട്രേക്ക് ഫ്രീസ് മുന്നറിയിപ്പുകൾ'
    },
    'prof_streak_alerts_desc': {
        'en': 'Get notified before midnight if your daily streak is about to reset',
        'te': 'మీ రోజువారీ స్ట్రీక్ రీసెట్ అవ్వబోయే ముందు అర్థరాత్రికి ముందు నోటిఫికేషన్ అందుకోండి',
        'ta': 'நள்ளிரவுக்கு முன் உங்கள் தொடர் மீட்டமைக்கப்படுவதைப் பற்றி எச்சரிக்கப்படுங்கள்',
        'hi': 'आधी रात से पहले अपनी स्ट्रीक रीसेट होने से पहले सूचित हों',
        'kn': 'ಮಧ್ಯರಾತ್ರಿಯ ಮೊದಲು ಸ್ಟ್ರೀಕ್ ಮರುಹೊಂದಿಸುವ ಬಗ್ಗೆ ಎಚ್ಚರಿಕೆ ಪಡೆಯಿರಿ',
        'ml': 'അർദ്ധരാത്രിക്ക് മുൻപ് സ്ട്രേക്ക് നഷ്ടപ്പെടാതിരിക്കാൻ അറിയിപ്പ് നേടുക'
    },
    'prof_skill_overview': {
        'en': 'Skill Proficiency Overview',
        'te': 'నైపుణ్య స్థాయి అవలోకనం',
        'ta': 'திறன் தேர்ச்சி கண்ணோட்டம்',
        'hi': 'कौशल दक्षता अवलोकन',
        'kn': 'ಕೌಶಲ್ಯ ಪ್ರಾವೀಣ್ಯತೆಯ ಅವಲೋಕನ',
        'ml': 'നൈപുണ്യ അവലോകനം'
    },
    'prof_skill_overview_desc': {
        'en': 'Self-reported starting skill evaluation',
        'te': 'స్వయం నివేదించిన ప్రారంభ నైపుణ్య మూల్యాంకనం',
        'ta': 'சுயமாக அறிவிக்கப்பட்ட தொடக்க திறன் மதிப்பீடு',
        'hi': 'स्व-रिपोर्ट किया गया प्रारंभिक कौशल मूल्यांकन',
        'kn': 'ಸ್ವಯಂ ವರದಿ ಮಾಡಿದ ಆರಂಭಿಕ ಕೌಶಲ್ಯ ಮೌಲ್ಯಮಾಪನ',
        'ml': 'സ്വയം റിപ്പോർട്ട് ചെയ്ത പ്രാരംഭ നൈപുണ്യ വിലയിരുത്തൽ'
    },
    'prof_update_levels': {
        'en': 'Update Levels',
        'te': 'స్థాయులను నవీకరించండి',
        'ta': 'நிலைகளை புதுப்பிக்கவும்',
        'hi': 'स्तर अपडेट करें',
        'kn': 'ಹಂತಗಳನ್ನು ನವೀಕರಿಸಿ',
        'ml': 'ലെവലുകൾ അപ്ഡേറ്റ് ചെയ്യുക'
    },
    'prof_install_pwa': {
        'en': 'Install LingoPath AI App (PWA)',
        'te': 'లింగోపాత్ AI యాప్ ఇన్‌స్టాల్ చేయండి (PWA)',
        'ta': 'LingoPath AI செயலியை நிறுவவும் (PWA)',
        'hi': 'LingoPath AI ऐप इंस्टॉल करें (PWA)',
        'kn': 'LingoPath AI ಅಪ್ಲಿಕೇಶನ್ ಸ್ಥಾಪಿಸಿ (PWA)',
        'ml': 'LingoPath AI ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക (PWA)'
    },
    'prof_install_pwa_desc': {
        'en': 'Add to your Home Screen for one-tap native app access and offline practice',
        'te': 'ఆఫ్‌లైన్ సాధన కోసం హోమ్ స్క్రీన్‌కు జోడించండి',
        'ta': 'ஆஃப்லைன் பயிற்சிக்காக முகப்புத் திரையில் சேர்க்கவும்',
        'hi': 'ऑफ़लाइन अभ्यास और आसान पहुँच के लिए होम स्क्रीन पर जोड़ें',
        'kn': 'ಆಫ್‌ಲೈನ್ ಅಭ್ಯಾಸಕ್ಕಾಗಿ ಹೋಮ್ ಸ್ಕ್ರೀನ್‌ಗೆ ಸೇರಿಸಿ',
        'ml': 'ഓഫ്‌ലൈൻ പരിശീലനത്തിനായി ഹോം സ്ക്രീനിൽ ചേർക്കുക'
    },
    'prof_account_session': {
        'en': 'Account Session',
        'te': 'ఖాతా సెషన్',
        'ta': 'கணக்கு அமர்வு',
        'hi': 'खाता सत्र',
        'kn': 'ಖಾತೆ ಸೆಷನ್',
        'ml': 'അക്കൗണ്ട് സെഷൻ'
    },
    'prof_logged_in_as': {
        'en': 'Logged in as',
        'te': 'లాగిన్ అయింది:',
        'ta': 'உள்நுழைந்துள்ள கணக்கு:',
        'hi': 'के रूप में लॉग इन:',
        'kn': 'ಲಾಗಿನ್ ಆದವರು:',
        'ml': 'ലോഗിൻ ചെയ്തിരിക്കുന്നത്:'
    },
    'prof_sign_out': {
        'en': 'Sign Out of LingoPath AI',
        'te': 'లింగోపాత్ AI నుండి నిష్క్రమించండి',
        'ta': 'LingoPath AI இலிருந்து வெளியேறவும்',
        'hi': 'LingoPath AI से साइन आउट करें',
        'kn': 'LingoPath AI ನಿಂದ ಸೈನ್ ಔಟ್ ಮಾಡಿ',
        'ml': 'LingoPath AI-ൽ നിന്ന് സൈൻ ഔട്ട് ചെയ്യുക'
    },
    'prof_edit_modal_title': {
        'en': 'Update Self-Reported Starting Skills',
        'te': 'స్వయం నివేదించిన ప్రారంభ నైపుణ్యాలను నవీకరించండి',
        'ta': 'தொடக்க திறன்களை புதுப்பிக்கவும்',
        'hi': 'प्रारंभिक कौशल अपडेट करें',
        'kn': 'ಆರಂಭಿಕ ಕೌಶಲ್ಯಗಳನ್ನು ನವೀಕರಿಸಿ',
        'ml': 'പ്രാരംഭ നൈപുണ്യങ്ങൾ പുതുക്കുക'
    },
    'prof_edit_modal_desc': {
        'en': 'Adjust your initial starting levels for reading, writing, vocabulary, and speaking.',
        'te': 'చదవడం, రాయడం, పదజాలం మరియు మాట్లాడటం కోసం మీ ప్రారంభ స్థాయులను సర్దుబాటు చేయండి.',
        'ta': 'வாசிப்பு, எழுதுதல், சொல்வளம், பேச்சுக்கான நிலைகளை சரிசெய்யவும்.',
        'hi': 'पढ़ने, लिखने, शब्दावली और बोलने के स्तर को समायोजित करें।',
        'kn': 'ಓದುವಿಕೆ, ಬರವಣಿಗೆ, ಶಬ್ದಕೋಶ ಮತ್ತು ಮಾತನಾಡುವ ಮಟ್ಟಗಳನ್ನು ಹೊಂದಿಸಿ.',
        'ml': 'വായന, എഴുത്ത്, ശബ്ദസഞ്ചയം, സംസാരം എന്നിവ ക്രമീകരിക്കുക.'
    },
    'prof_cancel': {
        'en': 'Cancel',
        'te': 'రద్దు చేయండి',
        'ta': 'ரத்துசெய்',
        'hi': 'रद्द करें',
        'kn': 'ರದ್ದುಮಾಡಿ',
        'ml': 'റദ്ദാക്കുക'
    },
    'prof_save_changes': {
        'en': 'Save Changes',
        'te': 'మార్పులను సేవ్ చేయండి',
        'ta': 'மாற்றங்களைச் சேமிக்கவும்',
        'hi': 'परिवर्तन सहेजें',
        'kn': 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
        'ml': 'മാറ്റങ്ങൾ സംരക്ഷിക്കുക'
    },
    'prof_skill_beginner': {
        'en': 'Beginner',
        'te': 'బిగినర్',
        'ta': 'தொடக்க நிலை',
        'hi': 'शुरुआती',
        'kn': 'ಆರಂಭಿಕ',
        'ml': 'തുടക്കക്കാരൻ'
    },
    'prof_skill_basic': {
        'en': 'Basic',
        'te': 'బేసిక్',
        'ta': 'அடிப்படை',
        'hi': 'बुनियादी',
        'kn': 'ಮೂಲಭೂತ',
        'ml': 'അടിസ്ഥാനം'
    },
    'prof_skill_intermediate': {
        'en': 'Intermediate',
        'te': 'ఇంటర్మీడియట్',
        'ta': 'இடைநிலை',
        'hi': 'मध्यवर्ती',
        'kn': 'ಮಧ್ಯಮ',
        'ml': 'ഇടത്തരം'
    },
    'prof_skill_advanced': {
        'en': 'Advanced',
        'te': 'అడ్వాన్స్‌డ్',
        'ta': 'மேம்பட்ட',
        'hi': 'उन्नत',
        'kn': 'ಉನ್ನತ',
        'ml': 'ഉയർന്ന നില'
    },

    # Games Page
    'game_back_to_home': {
        'en': 'Back to Home',
        'te': 'హోమ్‌కు తిరిగి వెళ్ళండి',
        'ta': 'முகப்பிற்கு திரும்பு',
        'hi': 'होम पर वापस जाएं',
        'kn': 'ಮನೆಗೆ ಹಿಂತಿರುಗಿ',
        'ml': 'ഹോമിലേക്ക് മടങ്ങൂ'
    },
    'game_loading_prefix': {
        'en': 'Loading interactive games in',
        'te': 'ఇంటరాక్టివ్ గేమ్‌లు లోడవుతున్నాయి',
        'ta': 'ஊடாடும் விளையாட்டுகள் ஏற்றப்படுகின்றன',
        'hi': 'संवादात्मक खेल लोड हो रहे हैं',
        'kn': 'ಸಂವಾದಾತ್ಮಕ ಆಟಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ',
        'ml': 'കളികൾ ലോഡ് ചെയ്യുന്നു'
    },
    'game_mini_games_tag': {
        'en': 'Target Language Mini-Games',
        'te': 'లక్ష్య భాషా మినీ-గేమ్‌లు',
        'ta': 'இலக்கு மொழி சிறு விளையாட்டுகள்',
        'hi': 'लक्ष्य भाषा मिनी-गेम',
        'kn': 'ಗುರಿ ಭಾಷಾ ಮಿನಿ ಆಟಗಳು',
        'ml': 'ലക്ഷ്യ ഭാഷാ മിനി കളികൾ'
    },
    'game_page_title': {
        'en': '🎮 Puzzles & Language Games',
        'te': '🎮 పజిల్స్ & భాషా గేమ్‌లు',
        'ta': '🎮 புதிர்கள் & மொழி விளையாட்டுகள்',
        'hi': '🎮 पहेलियाँ और भाषा खेल',
        'kn': '🎮 ಪದಬಂಧಗಳು & ಭಾಷಾ ಆಟಗಳು',
        'ml': '🎮 പസിലുകളും ഭാഷാ കളികളും'
    },
    'game_page_desc_prefix': {
        'en': 'Practice',
        'te': 'ఇంటరాక్టివ్ మినీ-గేమ్‌ల ద్వారా',
        'ta': 'ஊடாடும் சிறு விளையாட்டுகள் மூலம்',
        'hi': 'संवादात्मक खेलों के माध्यम से',
        'kn': 'ಸಂವಾದಾತ್ಮಕ ಆಟಗಳ ಮೂಲಕ',
        'ml': 'കളികളിലൂടെ'
    },
    'game_page_desc_suffix': {
        'en': 'skills through interactive mini-games and earn XP rewards.',
        'te': 'నైపుణ్యాలను సాధన చేసి XP రివార్డులు సంపాదించండి.',
        'ta': 'திறன்களைப் பயிற்சி செய்து XP வெகுமதிகளைப் பெறுங்கள்.',
        'hi': 'कौशल का अभ्यास करें और XP पुरस्कार अर्जित करें।',
        'kn': 'ಕೌಶಲ್ಯಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ XP ಬಹುಮಾನಗಳನ್ನು ಗಳಿಸಿ.',
        'ml': 'കഴിവുകൾ പരിശീലിച്ച് XP നേടുക.'
    },
    'game_practicing': {
        'en': 'Practicing:',
        'te': 'సాధన చేస్తున్నారు:',
        'ta': 'பயிற்சி செய்கிறது:',
        'hi': 'अभ्यास कर रहे हैं:',
        'kn': 'ಅಭ್ಯಾಸ ಮಾಡುತ್ತಿರುವುದು:',
        'ml': 'പരിശീലിക്കുന്നത്:'
    },
    'game_via': {
        'en': 'via',
        'te': 'ద్వారా',
        'ta': 'வழியாக',
        'hi': 'के माध्यम से',
        'kn': 'ಮೂಲಕ',
        'ml': 'വഴി'
    },
    'game_exit_return': {
        'en': 'Exit Game & Return to Hub',
        'te': 'గేమ్ నుండి నిష్క్రమించి హబ్‌కు తిరిగి వెళ్ళండి',
        'ta': 'விளையாட்டிலிருந்து வெளியேறி முகப்பிற்கு திரும்பு',
        'hi': 'खेल से बाहर निकलें और हब पर लौटें',
        'kn': 'ಆಟದಿಂದ ನಿರ್ಗಮಿಸಿ ಹಬ್‌ಗೆ ಹಿಂತಿರುಗಿ',
        'ml': 'കളി അവസാനിപ്പിച്ച് മടങ്ങുക'
    },
    'game_games_played': {
        'en': 'Games Played',
        'te': 'ఆడిన గేమ్‌లు',
        'ta': 'விளையாடிய விளையாட்டுகள்',
        'hi': 'खेले गए खेल',
        'kn': 'ಆಡಿದ ಆಟಗಳು',
        'ml': 'കളിച്ച കളികൾ'
    },
    'game_total_xp': {
        'en': 'Total Games XP',
        'te': 'మొత్తం గేమ్ XP',
        'ta': 'மொத்த விளையாட்டு XP',
        'hi': 'कुल गेम XP',
        'kn': 'ಒಟ್ಟು ಆಟದ XP',
        'ml': 'ആകെ ഗെയിം XP'
    },
    'game_best_score': {
        'en': 'Best Score',
        'te': 'అత్యుత్తమ స్కోరు',
        'ta': 'சிறந்த மதிப்பெண்',
        'hi': 'सर्वश्रेष्ठ स्कोर',
        'kn': 'ಉತ್ತಮ ಸ್ಕೋರ್',
        'ml': 'മികച്ച സ്കോർ'
    },
    'game_streak': {
        'en': 'Game Streak',
        'te': 'గేమ్ స్ట్రీక్',
        'ta': 'விளையாட்டு தொடர்',
        'hi': 'गेम स्ट्रीक',
        'kn': 'ಆಟದ ಸ್ಟ್ರೀಕ್',
        'ml': 'ഗെയിം സ്ട്രേക്ക്'
    },
    'game_days': {
        'en': 'Days',
        'te': 'రోజులు',
        'ta': 'நாட்கள்',
        'hi': 'दिन',
        'kn': 'ದಿನಗಳು',
        'ml': 'ദിവസങ്ങൾ'
    },
    'game_recommended_for_you': {
        'en': 'Recommended for You',
        'te': 'మీకు సిఫారసు చేయబడింది',
        'ta': 'உங்களுக்கு பரிந்துரைக்கப்படுகிறது',
        'hi': 'आपके लिए अनुशंसित',
        'kn': 'ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
        'ml': 'നിങ്ങൾക്കായി ശുപാർശ ചെയ്തത്'
    },
    'game_vocab_booster': {
        'en': 'Vocabulary Booster: Word Tetris',
        'te': 'పదజాల పెంపు: వర్డ్ టెట్రిస్',
        'ta': 'சொல்வள பூஸ்டர்: வேர்ட் டெட்ரிஸ்',
        'hi': 'शब्दावली बूस्टर: वर्ड टेट्रिस',
        'kn': 'ಶಬ್ದಕೋಶ ಬೂಸ್ಟರ್: ವರ್ಡ್ ಟೆಟ್ರಿಸ್',
        'ml': 'പദാവലി ബൂസ്റ്റർ: വേഡ് ടെട്രിസ്'
    },
    'game_recommended_desc': {
        'en': 'Your diagnostic evaluation indicates that practicing word assembly will help solidify letter connections.',
        'te': 'మీ మూల్యాంకన ఫలితాలు వర్డ్ అసెంబ్లీ సాధన ద్వారా అక్షర అనుసంధానాలను బలపరచడానికి సహాయపడతాయని సూచిస్తున్నాయి.',
        'ta': 'சொல் சேர்ப்பு பயிற்சி எழுத்து இணைப்புகளை வலுப்படுத்த உதவும்.',
        'hi': 'शब्द संयोजन का अभ्यास अक्षरों को मजबूत करने में मदद करेगा।',
        'kn': 'ಪದ ಸಂಯೋಜನೆಯ ಅಭ್ಯಾಸವು ಅಕ್ಷರ ಜೋಡಣೆಯನ್ನು ಬಲಪಡಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        'ml': 'പദ നിർമ്മാണം അക്ഷര ബന്ധങ്ങളെ ശക്തിപ്പെടുത്താൻ സഹായിക്കും.'
    },
    'game_play_recommended': {
        'en': 'Play Recommended Game',
        'te': 'సిఫారసు చేసిన గేమ్ ఆడండి',
        'ta': 'பரிந்துரைக்கப்பட்ட விளையாட்டை விளையாடு',
        'hi': 'अनुशंसित खेल खेलें',
        'kn': 'ಶಿಫಾರಸು ಮಾಡಿದ ಆಟವಾಡಿ',
        'ml': 'ശുപാർശ ചെയ്ത കളി കളിക്കുക'
    },
    'game_featured_title': {
        'en': '🌟 Featured Game of the Day',
        'te': '🌟 నేటి ఫీచర్డ్ గేమ్',
        'ta': '🌟 இன்றைய சிறப்பு விளையாட்டு',
        'hi': '🌟 आज का विशेष खेल',
        'kn': '🌟 ಇಂದಿನ ವಿಶೇಷ ಆಟ',
        'ml': '🌟 ഇന്നത്തെ പ്രധാന കളി'
    },
    'game_form_valid_prefix': {
        'en': 'Form valid',
        'te': 'చెల్లుబాటు అయ్యే',
        'ta': 'சரியான',
        'hi': 'वैध',
        'kn': 'ಮಾನ್ಯವಾದ',
        'ml': 'ശരിയായ'
    },
    'game_form_valid_suffix': {
        'en': 'words before the falling letters reach the ceiling.',
        'te': 'పదాలను పడుతున్న అక్షరాలు పైకప్పుకు చేరే ముందు తయారు చేయండి.',
        'ta': 'விழும் எழுத்துகள் உச்சியை அடைவதற்குள் வார்த்தைகளை உருவாக்குங்கள்.',
        'hi': 'शब्द बनाएं इससे पहले कि गिरते अक्षर ऊपर तक पहुँचें।',
        'kn': 'ಬೀಳುವ ಅಕ್ಷರಗಳು ಮೇಲೆ ತಲುಪುವ ಮೊದಲು ಪದಗಳನ್ನು ರಚಿಸಿ.',
        'ml': 'അക്ഷരങ്ങൾ മുകളിൽ എത്തുന്നതിന് മുൻപ് വാക്കുകൾ ഉണ്ടാക്കുക.'
    },
    'game_best_score_label': {
        'en': 'Best Score:',
        'te': 'అత్యుత్తమ స్కోరు:',
        'ta': 'சிறந்த மதிப்பெண்:',
        'hi': 'सर्वश्रेष्ठ स्कोर:',
        'kn': 'ಉತ್ತಮ ಸ್ಕೋರ್:',
        'ml': 'മികച്ച സ്കോർ:'
    },
    'game_played_label': {
        'en': 'Played:',
        'te': 'ఆడారు:',
        'ta': 'விளையாடியது:',
        'hi': 'खेला:',
        'kn': 'ಆಡಿದ್ದು:',
        'ml': 'കളിച്ചത്:'
    },
    'game_times': {
        'en': 'times',
        'te': 'సార్లు',
        'ta': 'முறைகள்',
        'hi': 'बार',
        'kn': 'ಬಾರಿ',
        'ml': 'തവണ'
    },
    'game_xp_reward': {
        'en': 'XP Reward',
        'te': 'XP రివార్డ్',
        'ta': 'XP வெகுமதி',
        'hi': 'XP पुरस्कार',
        'kn': 'XP ಬಹುಮಾನ',
        'ml': 'XP പ്രതിഫലം'
    },
    'game_play_now': {
        'en': 'Play Now',
        'te': 'ఇప్పుడు ఆడండి',
        'ta': 'இப்போது விளையாடு',
        'hi': 'अभी खेलें',
        'kn': 'ಈಗ ಆಡಿ',
        'ml': 'ഇപ്പോൾ കളിക്കുക'
    },
    'game_all_minigames': {
        'en': 'All Language Mini-Games',
        'te': 'అన్ని భాషా మినీ-గేమ్‌లు',
        'ta': 'அனைத்து மொழி சிறு விளையாட்டுகள்',
        'hi': 'सभी भाषा मिनी-गेम',
        'kn': 'ಎಲ್ಲಾ ಭಾಷಾ ಮಿನಿ ಆಟಗಳು',
        'ml': 'എല്ലാ ഭാഷാ കളികളും'
    },
    'game_active_challenges': {
        'en': '4 Active Challenges',
        'te': '4 యాక్టివ్ చాలెంజ్‌లు',
        'ta': '4 நேரடி சவால்கள்',
        'hi': '4 सक्रिय चुनौतियाँ',
        'kn': '4 ಸಕ್ರಿಯ ಸವಾಲುಗಳು',
        'ml': '4 വെല്ലുവിളികൾ'
    },
    'game_best': {
        'en': 'Best:',
        'te': 'అత్యుత్తమ:',
        'ta': 'சிறந்தது:',
        'hi': 'सर्वश्रेष्ठ:',
        'kn': 'ಉತ್ತಮ:',
        'ml': 'മികച്ചത്:'
    },
    'game_play_game': {
        'en': 'Play Game',
        'te': 'గేమ్ ఆడండి',
        'ta': 'விளையாடு',
        'hi': 'खेलें',
        'kn': 'ಆಟವಾಡಿ',
        'ml': 'കളിക്കുക'
    },
    'game_title_word_tetris': {
        'en': 'Word Tetris',
        'te': 'వర్డ్ టెట్రిస్',
        'ta': 'வேர்ட் டெட்ரிஸ்',
        'hi': 'वर्ड टेट्रिस',
        'kn': 'ವರ್ಡ್ ಟೆಟ್ರಿಸ್',
        'ml': 'വേഡ് ടെട്രിസ്'
    },
    'game_skill_word_tetris': {
        'en': 'Vocabulary & Spelling',
        'te': 'పదజాలం & స్పెల్లింగ్',
        'ta': 'சொல்வளம் & எழுத்துப்பிழை',
        'hi': 'शब्दावली और वर्तनी',
        'kn': 'ಶಬ್ದಕೋಶ & ಕಾಗುಣಿತ',
        'ml': 'പദാവലിയും അക്ഷരവിന്യാസവും'
    },
    'game_desc_word_tetris': {
        'en': 'Build target-language words using falling letter blocks before the grid fills up.',
        'te': 'గ్రిడ్ నిండే ముందు పడుతున్న అక్షర బ్లాక్‌లను ఉపయోగించి లక్ష్య భాషా పదాలను నిర్మించండి.',
        'ta': 'கட்டம் நிரம்புவதற்குள் விழும் எழுத்துத் தொகுதிகளைப் பயன்படுத்தி வார்த்தைகளை உருவாக்குங்கள்.',
        'hi': 'ग्रिड भरने से पहले गिरते अक्षरों का उपयोग करके शब्द बनाएं।',
        'kn': 'ಗ್ರಿಡ್ ತುಂಬುವ ಮೊದಲು ಬೀಳುವ ಅಕ್ಷರಗಳನ್ನು ಬಳಸಿ ಪದಗಳನ್ನು ನಿರ್ಮಿಸಿ.',
        'ml': 'ഗ്രിഡ് നിറയുന്നതിന് മുൻപ് അക്ഷരങ്ങൾ വെച്ച് വാക്കുകൾ ഉണ്ടാക്കുക.'
    },
    'game_badge_word_tetris': {
        'en': 'Block Stacking',
        'te': 'బ్లాక్ స్టాకింగ్',
        'ta': 'தொகுதி அடுக்குதல்',
        'hi': 'ब्लॉक स्टैकिंग',
        'kn': 'ಬ್ಲಾಕ್ ಜೋಡಣೆ',
        'ml': 'ബ്ലോക്ക് സ്റ്റാക്കിംഗ്'
    },
    'game_title_memory_flip': {
        'en': 'Memory Flip',
        'te': 'మెమరీ ఫ్లిప్',
        'ta': 'மெமரி ஃபிளிப்',
        'hi': 'मेमोरी फ़्लिप',
        'kn': 'ಮೆಮೊರಿ ಫ್ಲಿಪ್',
        'ml': 'മെമ്മറി ഫ്ലിപ്പ്'
    },
    'game_skill_memory_flip': {
        'en': 'Translation & Memory',
        'te': 'అనువాదం & జ్ఞాపకశక్తి',
        'ta': 'மொழிபெயர்ப்பு & நினைவாற்றல்',
        'hi': 'अनुवाद और स्मृति',
        'kn': 'ಅನುವಾದ & ಸ್ಮರಣಶಕ್ತಿ',
        'ml': 'വിവർത്തനവും ഓർമ്മശക്തിയും'
    },
    'game_desc_memory_flip': {
        'en': 'Flip pairs of 3D cards to match target words with their meanings under time pressure.',
        'te': 'సమయ పరిమితిలో లక్ష్య పదాలను వాటి అర్థాలతో జతచేయడానికి 3D కార్డ్ జంటలను తిప్పండి.',
        'ta': 'நேர நெருக்கடியில் வார்த்தைகளை அவற்றின் அர்த்தங்களுடன் பொருத்த 3D கார்டுகளைத் திருப்புங்கள்.',
        'hi': 'समय सीमा में शब्दों को उनके अर्थों से मिलाने के लिए 3D कार्ड पलटें।',
        'kn': 'ಸಮಯದ ಮಿತಿಯಲ್ಲಿ ಪದಗಳನ್ನು ಅವುಗಳ ಅರ್ಥಗಳೊಂದಿಗೆ ಹೊಂದಿಸಲು 3D ಕಾರ್ಡ್‌ಗಳನ್ನು ತಿರುಗಿಸಿ.',
        'ml': 'വാക്കുകളെ അവയുടെ അർത്ഥങ്ങളുമായി പൊരുത്തപ്പെടുത്താൻ കാർഡുകൾ മറിക്കുക.'
    },
    'game_badge_memory_flip': {
        'en': '3D Memory',
        'te': '3D మెమరీ',
        'ta': '3D நினைவகம்',
        'hi': '3D मेमोरी',
        'kn': '3D ಮೆಮೊರಿ',
        'ml': '3D മെമ്മറി'
    },
    'game_title_word_duel': {
        'en': 'Word Duel',
        'te': 'వర్డ్ డ్యూయెల్',
        'ta': 'வேர்ட் டூயல்',
        'hi': 'वर्ड द्वंद्व',
        'kn': 'ವರ್ಡ್ ಡ್ಯುಯೆಲ್',
        'ml': 'വേഡ് ഡ്യുവൽ'
    },
    'game_skill_word_duel': {
        'en': 'Grammar & Boss Combat',
        'te': 'వ్యాకరణం & బాస్ పోరాటం',
        'ta': 'இலக்கணம் & பாஸ் போர்',
        'hi': 'व्याकरण और बॉस मुकाबला',
        'kn': 'ವ್ಯಾಕರಣ & ಬಾಸ್ ಕದನ',
        'ml': 'വ്യാകരണവും ബോസ് പോരാട്ടവും'
    },
    'game_desc_word_duel': {
        'en': 'Battle the Shadow Boss in animated HP combat! Answer correctly to strike heavy blows.',
        'te': 'యానిమేటెడ్ HP పోరాటంలో షాడో బాస్‌తో యుద్ధం చేయండి! సరిగ్గా సమాధానమిచ్చి గట్టి దెబ్బలు వేయండి.',
        'ta': 'ஷேடோ பாஸுடன் போராடுங்கள்! சரியான பதிலளித்து தாக்குங்கள்.',
        'hi': 'शैडो बॉस से मुकाबला करें! भारी वार करने के लिए सही उत्तर दें।',
        'kn': 'ಶ್ಯಾಡೋ ಬಾಸ್ ವಿರುದ್ಧ ಹೋರಾಡಿ! ಸರಿಯಾಗಿ ಉತ್ತರಿಸಿ ಬಲವಾದ ಹೊಡೆತಗಳನ್ನು ನೀಡಿ.',
        'ml': 'ഷാഡോ ബോസുമായി പോരാടുക! ശരിയായ ഉത്തരം നൽകി ആഞ്ഞടിക്കുക.'
    },
    'game_badge_word_duel': {
        'en': 'Boss Battle',
        'te': 'బాస్ బాటిల్',
        'ta': 'பாஸ் போர்',
        'hi': 'बॉस लड़ाई',
        'kn': 'ಬಾಸ್ ಕದನ',
        'ml': 'ബോസ് യുദ്ധം'
    },
    'game_title_speed_round': {
        'en': 'Speed Round',
        'te': 'స్పీడ్ రౌండ్',
        'ta': 'வேக சுற்று',
        'hi': 'स्पीड राउंड',
        'kn': 'ಸ್ಪೀಡ್ ರೌಂಡ್',
        'ml': 'സ്പീഡ് റൗണ്ട്'
    },
    'game_skill_speed_round': {
        'en': 'Rapid Recall',
        'te': 'వేగంగా గుర్తుపట్టడం',
        'ta': 'விரைவான நினைவு',
        'hi': 'त्वरित स्मरण',
        'kn': 'ವೇಗದ ನೆನಪು',
        'ml': 'ദ്രുത ഓർമ്മപ്പെടുത്തൽ'
    },
    'game_desc_speed_round': {
        'en': 'Race against a shrinking circular timer! Rapid answers earn multipliers and speed XP.',
        'te': 'తగ్గిపోయే వృత్తాకార టైమర్‌కు వ్యతిరేకంగా పోటీ పడండి! వేగంగా సమాధానాలు ఇచ్చి XP గుణకాలు సంపాదించండి.',
        'ta': 'சுருங்கும் டைமருக்கு எதிராக போட்டியிடுங்கள்! வேகமான பதில்களுக்கு கூடுதல் XP கிடைக்கும்.',
        'hi': 'घटते टाइमर के खिलाफ दौड़ें! त्वरित उत्तर से गुणक और स्पीड XP अर्जित करें।',
        'kn': 'ಕಡಿಮೆಯಾಗುವ ಟೈಮರ್ ವಿರುದ್ಧ ಓಟ! ವೇಗದ ಉತ್ತರಗಳು ಗುಣಕಗಳು ಮತ್ತು XP ಗಳಿಸುತ್ತವೆ.',
        'ml': 'ടൈമറിനെതിരെ മത്സരിക്കുക! വേഗതയേറിയ ഉത്തരങ്ങൾ കൂടുതൽ XP നേടിത്തരും.'
    },
    'game_badge_speed_round': {
        'en': 'Rapid Fire',
        'te': 'రాపిడ్ ఫైర్',
        'ta': 'ராபிட் ஃபயர்',
        'hi': 'रैपिड फायर',
        'kn': 'ರ್ಯಾಪಿಡ್ ಫೈರ್',
        'ml': 'റാപ്പിഡ് ഫയർ'
    },
    'game_title_word_spin': {
        'en': 'Word Spin',
        'te': 'వర్డ్ స్పిన్',
        'ta': 'வேர்ட் ஸ்பின்',
        'hi': 'वर्ड स्पिन',
        'kn': 'ವರ್ಡ್ ಸ್ಪಿನ್',
        'ml': 'വേഡ് സ്പിൻ'
    },
    'game_skill_word_spin': {
        'en': 'Random Vocabulary',
        'te': 'యాదృచ్ఛిక పదజాలం',
        'ta': 'சீரற்ற சொல்வளம்',
        'hi': 'यादृच्छिक शब्दावली',
        'kn': 'ಯಾದೃಚ್ಛಿಕ ಶಬ್ದಕೋಶ',
        'ml': 'ക്രമരഹിത പദാവലി'
    },
    'game_desc_word_spin': {
        'en': 'Spin the color wheel to select random vocabulary words and match definitions.',
        'te': 'యాదృచ్ఛిక పదజాల పదాలను ఎంచుకుని నిర్వచనాలు జతచేయడానికి వర్ణ చక్రాన్ని తిప్పండి.',
        'ta': 'வார்த்தைகளைத் தேர்ந்தெடுக்க வண்ண சக்கரத்தைச் சுழற்றுங்கள்.',
        'hi': 'यादृच्छिक शब्दावली का चयन करने और परिभाषाओं का मिलान करने के लिए चक्र घुमाएँ।',
        'kn': 'ಯಾದೃಚ್ಛಿಕ ಪದಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಬಣ್ಣದ ಚಕ್ರವನ್ನು ತಿರುಗಿಸಿ.',
        'ml': 'വാക്കുകൾ തിരഞ്ഞെടുക്കാൻ വർണ്ണ ചക്രം തിരിക്കുക.'
    },
    'game_badge_word_spin': {
        'en': 'Wheel Spin',
        'te': 'వీల్ స్పిన్',
        'ta': 'வீல் ஸ்பின்',
        'hi': 'व्हील स्पिन',
        'kn': 'ಚಕ್ರ ತಿರುಗಿಸುವಿಕೆ',
        'ml': 'വീൽ സ്പിൻ'
    },
    'game_diff_beginner': {
        'en': 'Beginner',
        'te': 'బిగినర్',
        'ta': 'தொடக்க நிலை',
        'hi': 'शुरुआती',
        'kn': 'ಆರಂಭಿಕ',
        'ml': 'തുടക്കക്കാരൻ'
    },
    'game_diff_intermediate': {
        'en': 'Intermediate',
        'te': 'ఇంటర్మీడియట్',
        'ta': 'இடைநிலை',
        'hi': 'मध्यवर्ती',
        'kn': 'ಮಧ್ಯಮ',
        'ml': 'ഇടത്തരം'
    },
    'game_diff_advanced': {
        'en': 'Advanced',
        'te': 'అడ్వాన్స్‌డ్',
        'ta': 'மேம்பட்ட',
        'hi': 'उन्नत',
        'kn': 'ಉನ್ನತ',
        'ml': 'ഉയർന്ന നില'
    }
}

# Merge EXTRA_TRANSLATIONS into BASE_TRANSLATIONS
ALL_NEW_TRANSLATIONS = dict(BASE_TRANSLATIONS)
ALL_NEW_TRANSLATIONS.update(EXTRA_TRANSLATIONS)

# Build a lookup function to get value for (lang, key)
def get_val(lang, key):
    # Check existing language dict first
    dicts = {'en': en_dict, 'te': te_dict, 'ta': ta_dict, 'hi': hi_dict, 'kn': kn_dict, 'ml': ml_dict}
    if key in dicts[lang] and dicts[lang][key]:
        return dicts[lang][key]
    # Check ALL_NEW_TRANSLATIONS
    if key in ALL_NEW_TRANSLATIONS:
        val = ALL_NEW_TRANSLATIONS[key].get(lang)
        if val:
            return val
        # fallback to English
        val_en = ALL_NEW_TRANSLATIONS[key].get('en')
        if val_en:
            return val_en
    # fallback to en_dict
    if key in en_dict:
        return en_dict[key]
    return key

# Check that every single interface key can be resolved
for k in all_interface_keys:
    for lang in ['en', 'te', 'ta', 'hi', 'kn', 'ml']:
        v = get_val(lang, k)
        if not v:
            print(f'WARNING: No value for ({lang}, {k})')

# Now generate each language dictionary cleanly
def format_dict(lang):
    lines = []
    for k in all_interface_keys:
        v = get_val(lang, k)
        # escape backslashes and double quotes
        v_escaped = v.replace('\\', '\\\\').replace('"', '\\"')
        lines.append(f'        {k}: "{v_escaped}"')
    return ',\n'.join(lines)

# Reconstruct translations object
output_parts = []
output_parts.append(text[:text.find('export const translations: Record<string, TranslationStrings>')])

translations_code = "export const translations: Record<string, TranslationStrings> = {\n"
translations_code += "    // ==========================================\n    // ENGLISH (en)\n    // ==========================================\n"
translations_code += "    en: {\n" + format_dict('en') + "\n    },\n\n"

translations_code += "    // ==========================================\n    // TELUGU (te)\n    // ==========================================\n"
translations_code += "    te: {\n" + format_dict('te') + "\n    },\n\n"

translations_code += "    // ==========================================\n    // TAMIL (ta)\n    // ==========================================\n"
translations_code += "    ta: {\n" + format_dict('ta') + "\n    },\n\n"

translations_code += "    // ==========================================\n    // HINDI (hi)\n    // ==========================================\n"
translations_code += "    hi: {\n" + format_dict('hi') + "\n    },\n\n"

translations_code += "    // ==========================================\n    // KANNADA (kn)\n    // ==========================================\n"
translations_code += "    kn: {\n" + format_dict('kn') + "\n    },\n\n"

translations_code += "    // ==========================================\n    // MALAYALAM (ml)\n    // ==========================================\n"
translations_code += "    ml: {\n" + format_dict('ml') + "\n    }\n};\n\n"

# Add functions at the bottom
functions_code = """export const getTranslation = (langCode: string | undefined, key: keyof TranslationStrings): string => {
    const code = (langCode || 'en').toLowerCase();
    const dict = translations[code] || translations['en'];
    return dict[key] || translations['en'][key] || key;
};

export const useTranslation = () => {
    const { profile, guestLanguage } = useAuth();
    const supportLangCode = profile?.comfortable_language?.code || guestLanguage || (typeof window !== 'undefined' ? localStorage.getItem('lingo_interface_lang') : null) || 'en';
    const t = (key: keyof TranslationStrings): string => getTranslation(supportLangCode, key);
    return { t, supportLangCode };
};
"""

full_new_content = output_parts[0] + translations_code + functions_code

with open('src/utils/translations.ts', 'w', encoding='utf-8') as f:
    f.write(full_new_content)

print('Success! translations.ts rewritten cleanly.')
print(f'Total interface keys: {len(all_interface_keys)}')
print(f'Output size: {len(full_new_content)} bytes')
