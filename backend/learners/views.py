from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.utils import timezone
from .models import (
    LearnerProfile,
    LearnerProficiency,
    Assessment,
    AssessmentQuestion,
    AssessmentAttempt,
    LearnerPerformance,
    AILearnerInsight,
    LearningPathUnit,
    LessonNode,
    LearnerProgress,
    LearnerGameProgress,
    GameAttempt
)
from .serializers import (
    LearnerProfileSerializer,
    LearnerProficiencySerializer,
    AssessmentQuestionSerializer,
    AILearnerInsightSerializer,
    LearningPathUnitSerializer,
    LearnerProgressSerializer,
    LearnerGameProgressSerializer,
    GameAttemptSerializer
)


class LearnerProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, _ = LearnerProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.full_name or request.user.email}
        )
        return Response(LearnerProfileSerializer(profile).data)

    def put(self, request):
        profile, _ = LearnerProfile.objects.get_or_create(user=request.user)
        from languages.models import Language

        comf_id = request.data.get('comfortable_language_id') or request.data.get('comfortable_language_code')
        if comf_id:
            lang = Language.objects.filter(code=comf_id).first()
            if not lang and str(comf_id).isdigit():
                lang = Language.objects.filter(id=int(comf_id)).first()
            if lang:
                profile.comfortable_language = lang

        target_id = request.data.get('target_language_id') or request.data.get('target_language_code')
        if target_id:
            lang = Language.objects.filter(code=target_id).first()
            if not lang and str(target_id).isdigit():
                lang = Language.objects.filter(id=int(target_id)).first()
            if lang:
                profile.target_language = lang

        if 'qualification' in request.data:
            profile.qualification = request.data['qualification']

        if 'age_group' in request.data:
            profile.age_group = request.data['age_group']

        profile.save()
        serializer = LearnerProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(LearnerProfileSerializer(profile).data)

class LearnerProficiencyView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        proficiency, _ = LearnerProficiency.objects.get_or_create(learner=profile)
        return Response(LearnerProficiencySerializer(proficiency).data)

    def put(self, request):
        profile = request.user.profile
        proficiency, _ = LearnerProficiency.objects.get_or_create(learner=profile)
        serializer = LearnerProficiencySerializer(proficiency, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(LearnerProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AssessmentQuestionsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        comfortable_lang_name = profile.comfortable_language.name if profile and profile.comfortable_language else "English"
        comfortable_code = profile.comfortable_language.code if profile and profile.comfortable_language else "en"
        target_lang_name = profile.target_language.name if profile and profile.target_language else "Hindi"
        target_code = profile.target_language.code if profile and profile.target_language else "hi"

        # Support bridges dictionary based on comfortable language
        instructions_dict = {
            "te": {
                "q1_bridge": f"క్రింది {target_lang_name} పాఠ్యాంశాన్ని చదివి ప్రశ్నకు సరియైన సమాధానాన్ని ఎంచుకోండి:",
                "q2_bridge": f"{target_lang_name} పదానికి సరైన అర్థాన్ని ఎంచుకోండి:",
                "q3_bridge": f"సరియైన {target_lang_name} వాక్యాన్ని రూపొందించడానికి పదాలను అమర్చండి:",
                "q4_bridge": f"ఖాళీని తగిన {target_lang_name} పదంతో భర్తీ చేయండి:",
                "q5_bridge": f"ఈ {target_lang_name} వాక్యాన్ని బిగ్గరగా చదివి మీ ఉచ్ఛారణను పరీక్షించుకోండి:",
                "q6_bridge": f"సరైన వ్యాకరణ రూపాన్ని ఎంచుకోండి:",
                "q7_bridge": f"సరియైన వాక్య నిర్మాణాన్ని ఎంచుకోండి:",
                "q8_bridge": f"పదానికి సరిపోయే అర్థాన్ని ఎంచుకోండి:",
                "q9_bridge": f"విషయాన్ని గ్రహించి సరైన సమాధానం చెప్పండి:",
                "q10_bridge": f"ఈ చివరి వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:"
            },
            "hi": {
                "q1_bridge": f"निम्नलिखित {target_lang_name} गद्यांश को पढ़ें और सही उत्तर चुनें:",
                "q2_bridge": f"{target_lang_name} शब्द के लिए सही अर्थ चुनें:",
                "q3_bridge": f"सही {target_lang_name} वाक्य बनाने के लिए शब्दों को क्रमबद्ध करें:",
                "q4_bridge": f"उपयुक्त {target_lang_name} शब्द से रिक्त स्थान भरें:",
                "q5_bridge": f"इस {target_lang_name} वाक्य को जोर से बोलें और अपना उच्चारण जांचें:",
                "q6_bridge": f"सही व्याकरण रूप चुनें:",
                "q7_bridge": f"सही वाक्य संरचना चुनें:",
                "q8_bridge": f"शब्द के लिए सही अर्थ चुनें:",
                "q9_bridge": f"गद्यांश पढ़कर सही उत्तर चुनें:",
                "q10_bridge": f"इस अंतिम वाक्य को स्पष्ट रूप से बोलें:"
            },
            "ta": {
                "q1_bridge": f"பின்வரும் {target_lang_name} பகுதியை படித்து சரியான பதிலை தேர்ந்தெடுக்கவும்:",
                "q2_bridge": f"{target_lang_name} சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:",
                "q3_bridge": f"சரியான {target_lang_name} வாக்கியத்தை அமைக்க வார்த்தைகளை வரிசைப்படுத்தவும்:",
                "q4_bridge": f"சரியான {target_lang_name} சொல்லால் நிரப்பவும்:",
                "q5_bridge": f"இந்த {target_lang_name} வாக்கியத்தை உரக்கப் படிக்கவும்:",
                "q6_bridge": f"சரியான இலக்கண வடிவத்தைத் தேர்ந்தெடுக்கவும்:",
                "q7_bridge": f"சரியான வாக்கிய அமைப்பைத் தேர்ந்தெடுக்கவும்:",
                "q8_bridge": f"சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:",
                "q9_bridge": f"பத்தியைப் படித்து சரியான பதிலைத் தேர்ந்தெடுக்கவும்:",
                "q10_bridge": f"இந்த வாக்கியத்தை உரக்கப் படிக்கவும்:"
            },
            "en": {
                "q1_bridge": f"Read the passage in {target_lang_name} and select the correct answer:",
                "q2_bridge": f"Select the correct meaning for the target word in {target_lang_name}:",
                "q3_bridge": f"Arrange the words to form a correct sentence in {target_lang_name}:",
                "q4_bridge": f"Fill in the blank with the appropriate word in {target_lang_name}:",
                "q5_bridge": f"Speak this {target_lang_name} phrase aloud to check your pronunciation:",
                "q6_bridge": f"Choose the correct grammatical form:",
                "q7_bridge": f"Arrange the words in correct order:",
                "q8_bridge": f"Select the closest meaning:",
                "q9_bridge": f"Read the passage and answer:",
                "q10_bridge": f"Speak this final sentence clearly:"
            }
        }
        bridges = instructions_dict.get(comfortable_code, instructions_dict["en"])

        # Target language dynamic content sets
        if target_code == 'hi' or target_lang_name == 'Hindi':
            questions = [
                {
                    "id": "q1",
                    "skill": "Alphabet & Reading",
                    "question_type": "reading_passage",
                    "prompt": "गद्यांश पढ़कर 'पानी' शब्द का सही अर्थ चुनें:",
                    "passage": "रवि हर सुबह पानी पीता है और पुस्तकालय जाता है। उसे पढ़ना बहुत पसंद है।",
                    "highlight_word": "पानी",
                    "comfortable_bridge": bridges["q1_bridge"],
                    "options": [
                        {"id": 1, "text": "जल (Water)", "is_correct": True},
                        {"id": 2, "text": "घर (Ghar)", "is_correct": False},
                        {"id": 3, "text": "किताब (Kitab)", "is_correct": False},
                        {"id": 4, "text": "खाना (Khana)", "is_correct": False}
                    ],
                    "explanation": "'पानी' का अर्थ जल होता है।"
                },
                {
                    "id": "q2",
                    "skill": "Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'अवसर' शब्द के लिए सही पर्याय चुनें:",
                    "passage": "",
                    "highlight_word": "अवसर",
                    "comfortable_bridge": bridges["q2_bridge"],
                    "options": [
                        {"id": 1, "text": "शुभ समय / अनुकूल मौका", "is_correct": True},
                        {"id": 2, "text": "कठिन बाधा या विलंब", "is_correct": False},
                        {"id": 3, "text": "लिखने की गलती", "is_correct": False},
                        {"id": 4, "text": "पुराना ग्रंथ", "is_correct": False}
                    ],
                    "explanation": "'अवसर' का अर्थ अनुकूल मौका होता है।"
                },
                {
                    "id": "q3",
                    "skill": "Sentence Structure",
                    "question_type": "arrange_words",
                    "prompt": "सही हिंदी वाक्य बनाने के लिए शब्दों को क्रमबद्ध करें:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q3_bridge"],
                    "options": [
                        {"id": 1, "text": "वह हर दिन हिंदी सीखता है।", "is_correct": True},
                        {"id": 2, "text": "हिंदी वह सीखता है हर दिन।", "is_correct": False},
                        {"id": 3, "text": "हर दिन सीखता हिंदी वह है।", "is_correct": False},
                        {"id": 4, "text": "सीखता है हर दिन वह हिंदी।", "is_correct": False}
                    ],
                    "explanation": "कर्ता + समय + कर्म + क्रिया।"
                },
                {
                    "id": "q4",
                    "skill": "Comprehension & Context",
                    "question_type": "fill_blank",
                    "prompt": "सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।",
                    "passage": "सफलता पाने के लिए प्रतिदिन _____ करना आवश्यक है।",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges["q4_bridge"],
                    "options": [
                        {"id": 1, "text": "अभ्यास", "is_correct": True},
                        {"id": 2, "text": "आलस्य", "is_correct": False},
                        {"id": 3, "text": "भूल", "is_correct": False},
                        {"id": 4, "text": "क्रोध", "is_correct": False}
                    ],
                    "explanation": "'अभ्यास' वाक्य को सही अर्थ देता है।"
                },
                {
                    "id": "q5",
                    "skill": "Voice & Pronunciation",
                    "question_type": "voice_speaking",
                    "prompt": "वाक्य को जोर से बोलें:",
                    "passage": "नमस्ते! मैं लिंगोपथ से हिंदी सीख रहा हूँ।",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q5_bridge"],
                    "options": [],
                    "target_phrase": "नमस्ते! मैं लिंगोपथ से हिंदी सीख रहा हूँ।",
                    "explanation": "स्पष्ट उच्चारण करें।"
                },
                {
                    "id": "q6",
                    "skill": "Grammar Basics",
                    "question_type": "fill_blank",
                    "prompt": "सही सर्वनाम चुनें:",
                    "passage": "_____ एक परिश्रमी छात्र है।",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges.get("q6_bridge", "सही सर्वनाम चुनें:"),
                    "options": [
                        {"id": 1, "text": "वह", "is_correct": True},
                        {"id": 2, "text": "हम", "is_correct": False},
                        {"id": 3, "text": "वे", "is_correct": False},
                        {"id": 4, "text": "आप", "is_correct": False}
                    ],
                    "explanation": "एकवचन के लिए 'वह' प्रयुक्त होता है।"
                },
                {
                    "id": "q7",
                    "skill": "Advanced Sentence Building",
                    "question_type": "arrange_words",
                    "prompt": "शब्दों को सही क्रम में रखें:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q7_bridge", "शब्दों का सही क्रम चुनें:"),
                    "options": [
                        {"id": 1, "text": "मैं हर सुबह ताजे फल खाता हूँ।", "is_correct": True},
                        {"id": 2, "text": "फल खाता मैं सुबह हर ताजे हूँ।", "is_correct": False},
                        {"id": 3, "text": "सुबह हर खाता मैं ताजे फल हूँ।", "is_correct": False},
                        {"id": 4, "text": "खाता हूँ ताजे फल हर सुबह मैं।", "is_correct": False}
                    ],
                    "explanation": "कर्ता + काल + विशेषण + कर्म + क्रिया।"
                },
                {
                    "id": "q8",
                    "skill": "Contextual Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'मित्र' शब्द का सही अर्थ चुनें:",
                    "passage": "",
                    "highlight_word": "मित्र",
                    "comfortable_bridge": bridges.get("q8_bridge", "सही अर्थ चुनें:"),
                    "options": [
                        {"id": 1, "text": "सखा / साथी", "is_correct": True},
                        {"id": 2, "text": "शत्रु / विरोधी", "is_correct": False},
                        {"id": 3, "text": "शिक्षक / गुरु", "is_correct": False},
                        {"id": 4, "text": "अजनबी / अनजान", "is_correct": False}
                    ],
                    "explanation": "'मित्र' का अर्थ सखा या साथी है।"
                },
                {
                    "id": "q9",
                    "skill": "Reading Comprehension",
                    "question_type": "reading_passage",
                    "prompt": "गद्यांश पढ़कर मीना की रुचि चुनें:",
                    "passage": "मीना को शाम को पार्क में घूमना और नई भाषाएँ सीखना पसंद है।",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q9_bridge", "पढ़कर सही उत्तर चुनें:"),
                    "options": [
                        {"id": 1, "text": "नई भाषाएँ सीखना और पार्क में घूमना", "is_correct": True},
                        {"id": 2, "text": "दिन भर बिस्तर पर सोना", "is_correct": False},
                        {"id": 3, "text": "डरावनी फ़िल्में देखना", "is_correct": False},
                        {"id": 4, "text": "खाना बनाना", "is_correct": False}
                    ],
                    "explanation": "गद्यांश में मीना की रुचि का वर्णन है।"
                },
                {
                    "id": "q10",
                    "skill": "Speaking Confidence",
                    "question_type": "voice_speaking",
                    "prompt": "वाक्य को स्पष्ट रूप से बोलें:",
                    "passage": "मुझे नई भाषाएँ सीखना और बोलना बहुत पसंद है।",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q10_bridge", "स्पष्ट रूप से बोलें:"),
                    "options": [],
                    "target_phrase": "मुझे नई भाषाएँ सीखना और बोलना बहुत पसंद है।",
                    "explanation": "स्पष्ट उच्चारण करें।"
                }
            ]
        elif target_code == 'te' or target_lang_name == 'Telugu':
            questions = [
                {
                    "id": "q1",
                    "skill": "Alphabet & Reading",
                    "question_type": "reading_passage",
                    "prompt": "పాఠ్యాంశాన్ని చదివి 'పుస్తకం' అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:",
                    "passage": "రవి పాఠశాలలో పుస్తకం చదువుతున్నాడు.",
                    "highlight_word": "పుస్తకం",
                    "comfortable_bridge": bridges["q1_bridge"],
                    "options": [
                        {"id": 1, "text": "గ్రంథం / పుస్తకము", "is_correct": True},
                        {"id": 2, "text": "నీరు / జలము", "is_correct": False},
                        {"id": 3, "text": "ఇల్లు / గృహము", "is_correct": False},
                        {"id": 4, "text": "అన్నం / ఆహారము", "is_correct": False}
                    ],
                    "explanation": "'పుస్తకం' అనగా చదివే గ్రంథము."
                },
                {
                    "id": "q2",
                    "skill": "Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'అవకాశం' అనే పదానికి సరైన అర్థాన్ని ఎంచుకోండి:",
                    "passage": "",
                    "highlight_word": "అవకాశం",
                    "comfortable_bridge": bridges["q2_bridge"],
                    "options": [
                        {"id": 1, "text": "మంచి తరుణం / శుభ సమయం", "is_correct": True},
                        {"id": 2, "text": "పెద్ద ఆటంకం లేదా ఆలస్యం", "is_correct": False},
                        {"id": 3, "text": "రాతలో దొర్లిన పొరపాటు", "is_correct": False},
                        {"id": 4, "text": "పాత కాలపు కథ", "is_correct": False}
                    ],
                    "explanation": "'అవకాశం' అంటే అనుకూలమైన సమయం."
                },
                {
                    "id": "q3",
                    "skill": "Sentence Structure",
                    "question_type": "arrange_words",
                    "prompt": "సరియైన తెలుగు వాక్యాన్ని అమర్చండి:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q3_bridge"],
                    "options": [
                        {"id": 1, "text": "నేను ప్రతీ రోజూ తెలుగు నేర్చుకుంటాను.", "is_correct": True},
                        {"id": 2, "text": "తెలుగు నేను నేర్చుకుంటాను రోజూ.", "is_correct": False},
                        {"id": 3, "text": "రోజూ నేర్చుకుంటాను తెలుగు నేను.", "is_correct": False},
                        {"id": 4, "text": "నేర్చుకుంటాను నేను తెలుగు రోజూ.", "is_correct": False}
                    ],
                    "explanation": "కర్త + కాలము + కర్మ + క్రియ."
                },
                {
                    "id": "q4",
                    "skill": "Comprehension & Context",
                    "question_type": "fill_blank",
                    "prompt": "విజయానికి నిరంతర _____ అవసరం.",
                    "passage": "విజయానికి నిరంతర _____ అవసరం.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges["q4_bridge"],
                    "options": [
                        {"id": 1, "text": "సాధన", "is_correct": True},
                        {"id": 2, "text": "నిద్ర", "is_correct": False},
                        {"id": 3, "text": "ఆలస్యం", "is_correct": False},
                        {"id": 4, "text": "కోపం", "is_correct": False}
                    ],
                    "explanation": "'సాధన' అనగా అభ్యాసము."
                },
                {
                    "id": "q5",
                    "skill": "Voice & Pronunciation",
                    "question_type": "voice_speaking",
                    "prompt": "ఈ వాక్యాన్ని బిగ్గరగా చదవండి:",
                    "passage": "నమస్కారం! నేను లింగోపాత్ తో తెలుగు చదవడం నేర్చుకుంటున్నాను.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q5_bridge"],
                    "options": [],
                    "target_phrase": "నమస్కారం! నేను లింగోపాత్ తో తెలుగు చదవడం నేర్చుకుంటున్నాను.",
                    "explanation": "స్పష్టమైన ఉచ్ఛారణతో చదవండి."
                },
                {
                    "id": "q6",
                    "skill": "Grammar Basics",
                    "question_type": "fill_blank",
                    "prompt": "సరైన పదాన్ని ఎంచుకోండి:",
                    "passage": "శుభ _____! మీ రోజు ప్రశాంతంగా ఉండాలి.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges.get("q6_bridge", "సరైన పదాన్ని ఎంచుకోండి:"),
                    "options": [
                        {"id": 1, "text": "ఉదయం", "is_correct": True},
                        {"id": 2, "text": "రాత్రి", "is_correct": False},
                        {"id": 3, "text": "కలం", "is_correct": False},
                        {"id": 4, "text": "దారి", "is_correct": False}
                    ],
                    "explanation": "'శుభ ఉదయం' అనగా వేకువ వేళల శుభాకాంక్ష."
                },
                {
                    "id": "q7",
                    "skill": "Advanced Sentence Building",
                    "question_type": "arrange_words",
                    "prompt": "పదాలను సక్రమమైన వరుసలో అమర్చండి:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q7_bridge", "సరియైన వాక్య వరుస:"),
                    "options": [
                        {"id": 1, "text": "మనం కలిసి కొత్త భాషలు నేర్చుకుందాం.", "is_correct": True},
                        {"id": 2, "text": "భాషలు మనం నేర్చుకుందాం కలిసి కొత్త.", "is_correct": False},
                        {"id": 3, "text": "కొత్త నేర్చుకుందాం కలిసి మనం భాషలు.", "is_correct": False},
                        {"id": 4, "text": "నేర్చుకుందాం కొత్త భాషలు మనం కలిసి.", "is_correct": False}
                    ],
                    "explanation": "సరియైన వాక్య నిర్మాణం."
                },
                {
                    "id": "q8",
                    "skill": "Contextual Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'స్నేహితుడు' అనే పదానికి అర్థాన్ని ఎంచుకోండి:",
                    "passage": "",
                    "highlight_word": "స్నేహితుడు",
                    "comfortable_bridge": bridges.get("q8_bridge", "సరియైన అర్థాన్ని ఎంచుకోండి:"),
                    "options": [
                        {"id": 1, "text": "మిత్రుడు / సహచరుడు", "is_correct": True},
                        {"id": 2, "text": "అపరిచితుడు", "is_correct": False},
                        {"id": 3, "text": "ఉపాధ్యాయుడు", "is_correct": False},
                        {"id": 4, "text": "శత్రువు", "is_correct": False}
                    ],
                    "explanation": "'స్నేహితుడు' అనగా మిత్రుడు."
                },
                {
                    "id": "q9",
                    "skill": "Reading Comprehension",
                    "question_type": "reading_passage",
                    "prompt": "పాఠ్యాంశాన్ని చదివి గీతకు ఏమి ఇష్టమో ఎంచుకోండి:",
                    "passage": "గీత ప్రతిరోజూ ఉదయాన్నే లేచి పుస్తకాలు చదువుతుంది.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q9_bridge", "చదివి సరియైన జవాబు ఎంచుకోండి:"),
                    "options": [
                        {"id": 1, "text": "ఉదయాన్నే పుస్తకాలు చదవడం", "is_correct": True},
                        {"id": 2, "text": "రోజంతా టీవీ చూడటం", "is_correct": False},
                        {"id": 3, "text": "ఫోన్ లో ఆటలు ఆడటం", "is_correct": False},
                        {"id": 4, "text": "మధ్యాహ్నం వరకు నిద్రపోవడం", "is_correct": False}
                    ],
                    "explanation": "గీత ఉదయాన్నే పుస్తకాలు చదువుతుంది."
                },
                {
                    "id": "q10",
                    "skill": "Speaking Practice",
                    "question_type": "voice_speaking",
                    "prompt": "ఈ వాక్యాన్ని స్పష్టంగా మాట్లాడండి:",
                    "passage": "నాకు చదవడం మరియు వ్రాయడం చాలా ఇష్టం.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q10_bridge", "స్పష్టంగా మాట్లాడండి:"),
                    "options": [],
                    "target_phrase": "నాకు చదవడం మరియు వ్రాయడం చాలా ఇష్టం.",
                    "explanation": "స్పష్టమైన ఉచ్ఛారణతో చెప్పండి."
                }
            ]
        elif target_code == 'ta' or target_lang_name == 'Tamil':
            questions = [
                {
                    "id": "q1",
                    "skill": "Alphabet & Reading",
                    "question_type": "reading_passage",
                    "prompt": "பத்தியைப் படித்து 'புத்தகம்' என்பதன் பொருளைத் தேர்ந்தெடுக்கவும்:",
                    "passage": "ரவி தினமும் காலையில் நூலகத்திற்குச் சென்று புத்தகம் படிக்கிறான்.",
                    "highlight_word": "புத்தகம்",
                    "comfortable_bridge": bridges["q1_bridge"],
                    "options": [
                        {"id": 1, "text": "நூல் / நூல் வடிவம்", "is_correct": True},
                        {"id": 2, "text": "நீர்", "is_correct": False},
                        {"id": 3, "text": "வீடு", "is_correct": False},
                        {"id": 4, "text": "உணவு", "is_correct": False}
                    ],
                    "explanation": "'புத்தகம்' என்பது படிக்கும் நூலைக் குறிக்கும்."
                },
                {
                    "id": "q2",
                    "skill": "Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'வாய்ப்பு' என்ற சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:",
                    "passage": "",
                    "highlight_word": "வாய்ப்பு",
                    "comfortable_bridge": bridges["q2_bridge"],
                    "options": [
                        {"id": 1, "text": "நல்ல தாரக / சந்தர்ப்பம்", "is_correct": True},
                        {"id": 2, "text": "தடை / தாமதம்", "is_correct": False},
                        {"id": 3, "text": "எழுது பிழை", "is_correct": False},
                        {"id": 4, "text": "பழைய கதை", "is_correct": False}
                    ],
                    "explanation": "'வாய்ப்பு' என்றால் நல் சந்தர்ப்பம்."
                },
                {
                    "id": "q3",
                    "skill": "Sentence Structure",
                    "question_type": "arrange_words",
                    "prompt": "சரியான தமிழ் வாக்கியத்தை அமைக்க வார்த்தைகளை வரிசைப்படுத்தவும்:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q3_bridge"],
                    "options": [
                        {"id": 1, "text": "நான் தினமும் தமிழ் கற்கிறேன்.", "is_correct": True},
                        {"id": 2, "text": "தமிழ் நான் கற்கிறேன் தினமும்.", "is_correct": False},
                        {"id": 3, "text": "தினமும் கற்கிறேன் தமிழ் நான்.", "is_correct": False},
                        {"id": 4, "text": "கற்கிறேன் நான் தமிழ் தினமும்.", "is_correct": False}
                    ],
                    "explanation": "எழுவாய் + காலம் + செயப்படுபொருள் + பயனிலை."
                },
                {
                    "id": "q4",
                    "skill": "Comprehension & Context",
                    "question_type": "fill_blank",
                    "prompt": "வெற்றியை அடைய தினமும் _____ தேவை.",
                    "passage": "வெற்றியை அடைய தினமும் _____ தேவை.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges["q4_bridge"],
                    "options": [
                        {"id": 1, "text": "பயிற்சி", "is_correct": True},
                        {"id": 2, "text": "தூக்கம்", "is_correct": False},
                        {"id": 3, "text": "தாமதம்", "is_correct": False},
                        {"id": 4, "text": "கோபம்", "is_correct": False}
                    ],
                    "explanation": "'பயிற்சி' வாக்கியத்தை நிறைவு செய்கிறது."
                },
                {
                    "id": "q5",
                    "skill": "Voice & Pronunciation",
                    "question_type": "voice_speaking",
                    "prompt": "வாக்கியத்தை உரக்கப் படிக்கவும்:",
                    "passage": "வணக்கம்! நான் லிங்கோபாத் மூலம் தமிழ் கற்கிறேன்.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q5_bridge"],
                    "options": [],
                    "target_phrase": "வணக்கம்! நான் லிங்கோபாத் மூலம் தமிழ் கற்கிறேன்.",
                    "explanation": "தெளிவான உச்சரிப்புடன் படிக்கவும்."
                },
                {
                    "id": "q6",
                    "skill": "Grammar Basics",
                    "question_type": "fill_blank",
                    "prompt": "சரியான வார்த்தையைத் தேர்ந்தெடுக்கவும்:",
                    "passage": "இனிய _____! உங்கள் நாள் நன்றாக அமையட்டும்.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges.get("q6_bridge", "சரியான வார்த்தையைத் தேர்ந்தெடுக்கவும்:"),
                    "options": [
                        {"id": 1, "text": "காலை", "is_correct": True},
                        {"id": 2, "text": "இரவு", "is_correct": False},
                        {"id": 3, "text": "பேனா", "is_correct": False},
                        {"id": 4, "text": "பாதை", "is_correct": False}
                    ],
                    "explanation": "'இனிய காலை' வாழ்த்து."
                },
                {
                    "id": "q7",
                    "skill": "Advanced Sentence Building",
                    "question_type": "arrange_words",
                    "prompt": "வார்த்தைகளை சரியான வரிசையில் அமைக்கவும்:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q7_bridge", "சரியான வரிசை:"),
                    "options": [
                        {"id": 1, "text": "நாம் அனைவரும் இணைந்து புதிய மொழிகளைக் கற்போம்.", "is_correct": True},
                        {"id": 2, "text": "மொழிகளை நாம் கற்போம் இணைந்து புதிய.", "is_correct": False},
                        {"id": 3, "text": "புதிய கற்போம் இணைந்து நாம் மொழிகளை.", "is_correct": False},
                        {"id": 4, "text": "கற்போம் புதிய மொழிகளை நாம் இணைந்து.", "is_correct": False}
                    ],
                    "explanation": "சரியான வாக்கிய அமைப்பு."
                },
                {
                    "id": "q8",
                    "skill": "Contextual Vocabulary",
                    "question_type": "match_words",
                    "prompt": "'நண்பன்' என்ற சொல்லின் பொருளைத் தேர்ந்தெடுக்கவும்:",
                    "passage": "",
                    "highlight_word": "நண்பன்",
                    "comfortable_bridge": bridges.get("q8_bridge", "பொருளைத் தேர்ந்தெடுக்கவும்:"),
                    "options": [
                        {"id": 1, "text": "தோழன் / தோழி", "is_correct": True},
                        {"id": 2, "text": "அறியாதவர்", "is_correct": False},
                        {"id": 3, "text": "ஆசிரியர்", "is_correct": False},
                        {"id": 4, "text": "எதிரி", "is_correct": False}
                    ],
                    "explanation": "'நண்பன்' என்றால் தோழன்."
                },
                {
                    "id": "q9",
                    "skill": "Reading Comprehension",
                    "question_type": "reading_passage",
                    "prompt": "பத்தியைப் படித்து கீதாவின் விருப்பத்தைத் தேர்ந்தெடுக்கவும்:",
                    "passage": "கீதா தினமும் காலையில் எழுந்து புத்தகங்களைப் படிக்கிறாள்.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q9_bridge", "படித்து விடையளிக்கவும்:"),
                    "options": [
                        {"id": 1, "text": "காலையில் புத்தகங்கள் படிப்பது", "is_correct": True},
                        {"id": 2, "text": "நாள் முழுவதும் தொலைக்காட்சி பார்ப்பது", "is_correct": False},
                        {"id": 3, "text": "கைப்பேசியில் விளையாடுவது", "is_correct": False},
                        {"id": 4, "text": "மதியம் வரை தூங்குவது", "is_correct": False}
                    ],
                    "explanation": "கீதா காலையில் புத்தகங்கள் படிக்கிறாள்."
                },
                {
                    "id": "q10",
                    "skill": "Speaking Practice",
                    "question_type": "voice_speaking",
                    "prompt": "வாக்கியத்தை தெளிவாகக் கூறவும்:",
                    "passage": "எனக்கு வாசிப்பதும் எழுதுவதும் மிகவும் பிடிக்கும்.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q10_bridge", "தெளிவாகக் கூறவும்:"),
                    "options": [],
                    "target_phrase": "எனக்கு வாசிப்பதும் எழுதுவதும் மிகவும் பிடிக்கும்.",
                    "explanation": "தெளிவாகப் பேசவும்."
                }
            ]
        else: # Default English Target
            questions = [
                {
                    "id": "q1",
                    "skill": "Reading Comprehension",
                    "question_type": "reading_passage",
                    "prompt": "Read the passage and select the correct meaning of 'excited':",
                    "passage": "Ravi was excited to visit the library every morning. He loved reading stories about different countries.",
                    "highlight_word": "excited",
                    "comfortable_bridge": bridges["q1_bridge"],
                    "options": [
                        {"id": 1, "text": "Eager and enthusiastic", "is_correct": True},
                        {"id": 2, "text": "Bored and sleepy", "is_correct": False},
                        {"id": 3, "text": "Scared and afraid", "is_correct": False},
                        {"id": 4, "text": "Angry and upset", "is_correct": False}
                    ],
                    "explanation": "'Excited' means feeling enthusiasm."
                },
                {
                    "id": "q2",
                    "skill": "Vocabulary",
                    "question_type": "match_words",
                    "prompt": "Match the word 'Opportunity' with its closest meaning:",
                    "passage": "",
                    "highlight_word": "Opportunity",
                    "comfortable_bridge": bridges["q2_bridge"],
                    "options": [
                        {"id": 1, "text": "A favorable chance for progress", "is_correct": True},
                        {"id": 2, "text": "A heavy obstacle or delay", "is_correct": False},
                        {"id": 3, "text": "A mistake made in writing", "is_correct": False},
                        {"id": 4, "text": "A type of ancient book", "is_correct": False}
                    ],
                    "explanation": "An opportunity is a favorable chance."
                },
                {
                    "id": "q3",
                    "skill": "Sentence Structure",
                    "question_type": "arrange_words",
                    "prompt": "Arrange the words to form a correct English sentence:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q3_bridge"],
                    "options": [
                        {"id": 1, "text": "She practices reading English every day.", "is_correct": True},
                        {"id": 2, "text": "Reading every day she English practices.", "is_correct": False},
                        {"id": 3, "text": "Every day practices she reading English.", "is_correct": False},
                        {"id": 4, "text": "English she practices day every reading.", "is_correct": False}
                    ],
                    "explanation": "Subject + Verb + Object + Time."
                },
                {
                    "id": "q4",
                    "skill": "Comprehension & Context",
                    "question_type": "fill_blank",
                    "prompt": "To build a strong habit, it is important to practice _____ every single day.",
                    "passage": "To build a strong habit, it is important to practice _____ every single day.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges["q4_bridge"],
                    "options": [
                        {"id": 1, "text": "consistently", "is_correct": True},
                        {"id": 2, "text": "rarely", "is_correct": False},
                        {"id": 3, "text": "never", "is_correct": False},
                        {"id": 4, "text": "accidentally", "is_correct": False}
                    ],
                    "explanation": "'Consistently' fits the sentence."
                },
                {
                    "id": "q5",
                    "skill": "Voice & Pronunciation",
                    "question_type": "voice_speaking",
                    "prompt": "Read the phrase aloud in English:",
                    "passage": "Welcome to LingoPath AI. I am excited to learn step by step.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges["q5_bridge"],
                    "options": [],
                    "target_phrase": "Welcome to LingoPath AI. I am excited to learn step by step.",
                    "explanation": "Focus on clear pronunciation."
                },
                {
                    "id": "q6",
                    "skill": "Grammar Basics",
                    "question_type": "fill_blank",
                    "prompt": "Choose the correct article for the blank:",
                    "passage": "She wants to buy _____ umbrella before it starts raining.",
                    "highlight_word": "_____",
                    "comfortable_bridge": bridges.get("q6_bridge", "Select correct article:"),
                    "options": [
                        {"id": 1, "text": "an", "is_correct": True},
                        {"id": 2, "text": "a", "is_correct": False},
                        {"id": 3, "text": "the", "is_correct": False},
                        {"id": 4, "text": "no article", "is_correct": False}
                    ],
                    "explanation": "Use 'an' before vowel sounds."
                },
                {
                    "id": "q7",
                    "skill": "Advanced Sentence Building",
                    "question_type": "arrange_words",
                    "prompt": "Arrange the words into a correct English sentence:",
                    "passage": "",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q7_bridge", "Arrange sentence:"),
                    "options": [
                        {"id": 1, "text": "We enjoy learning new languages together every morning.", "is_correct": True},
                        {"id": 2, "text": "Learning languages together we enjoy morning every.", "is_correct": False},
                        {"id": 3, "text": "Every morning together learning new languages we enjoy.", "is_correct": False},
                        {"id": 4, "text": "Languages new learning we enjoy together morning every.", "is_correct": False}
                    ],
                    "explanation": "Correct English word order."
                },
                {
                    "id": "q8",
                    "skill": "Contextual Vocabulary",
                    "question_type": "match_words",
                    "prompt": "Select the correct meaning for the word 'Abundant':",
                    "passage": "",
                    "highlight_word": "Abundant",
                    "comfortable_bridge": bridges.get("q8_bridge", "Match meaning:"),
                    "options": [
                        {"id": 1, "text": "Existing or available in large quantities", "is_correct": True},
                        {"id": 2, "text": "Extremely rare and difficult to locate", "is_correct": False},
                        {"id": 3, "text": "Damaged or broken beyond repair", "is_correct": False},
                        {"id": 4, "text": "Quiet and completely silent", "is_correct": False}
                    ],
                    "explanation": "'Abundant' means plentiful."
                },
                {
                    "id": "q9",
                    "skill": "Reading Comprehension",
                    "question_type": "reading_passage",
                    "prompt": "What was the main reason Ananya felt confident?",
                    "passage": "Ananya felt confident during her presentation because she practiced speaking aloud in front of the mirror every day.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q9_bridge", "Read & answer:"),
                    "options": [
                        {"id": 1, "text": "She practiced speaking aloud every day", "is_correct": True},
                        {"id": 2, "text": "She read a book right before speaking", "is_correct": False},
                        {"id": 3, "text": "The presentation was very short", "is_correct": False},
                        {"id": 4, "text": "She guessed all the answers", "is_correct": False}
                    ],
                    "explanation": "She practiced speaking aloud every day."
                },
                {
                    "id": "q10",
                    "skill": "Speaking Fluency",
                    "question_type": "voice_speaking",
                    "prompt": "Speak this sentence aloud into your microphone:",
                    "passage": "Consistency and daily practice lead to fluency and confidence.",
                    "highlight_word": "",
                    "comfortable_bridge": bridges.get("q10_bridge", "Speak aloud:"),
                    "options": [],
                    "target_phrase": "Consistency and daily practice lead to fluency and confidence.",
                    "explanation": "Speak with clear articulation."
                }
            ]

        return Response({"questions": questions, "comfortable_language": comfortable_lang_name, "target_language": target_lang_name})

class AssessmentSubmitView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, 'profile', None)
        answers = request.data.get('answers', {})

        total_q = max(len(answers), 1)
        correct_count = 0

        for q_id, val in answers.items():
            if isinstance(val, dict) and val.get('is_correct'):
                correct_count += 1

        accuracy = round((correct_count / total_q) * 100, 1)
        target_lang = profile.target_language.name if profile and profile.target_language else "Target Language"
        comfortable_lang = profile.comfortable_language.name if profile and profile.comfortable_language else "Support Language"

        # Determine level based on accuracy score
        if accuracy >= 80:
            level = 'Advanced'
            rec_start = f"Level 3 Sentences & Reading Comprehension in {target_lang}"
            headline = f"Strong Baseline in {target_lang}! Ready for Sentences & Conversation ✨"
            reading_sum = f"Excellent comprehension of {target_lang} words and passage contexts."
            vocab_sum = f"Strong core vocabulary in {target_lang}."
            writing_sum = f"Good grasp of {target_lang} sentence ordering."
            speaking_sum = f"High confidence in {target_lang} pronunciation."
            focus = f"Complex Sentences + Conversational Fluency in {target_lang}"
        elif accuracy >= 50:
            level = 'Intermediate'
            rec_start = f"Level 2 Words & Sentence Building in {target_lang}"
            headline = f"Solid Foundation Established in {target_lang}! ({accuracy}% baseline score)"
            reading_sum = f"You recognize basic everyday words in {target_lang}."
            vocab_sum = f"Good foundational vocabulary in {target_lang}."
            writing_sum = f"Basic sentence assembly is coming along nicely."
            speaking_sum = f"Speaking is your key area for growth."
            focus = f"Everyday Words + Sentence Assembly in {target_lang}"
        else:
            level = 'Beginner'
            rec_start = f"Level 1 Alphabet, Letters & Basic Sounds in {target_lang}"
            headline = f"Fresh Start in {target_lang}! Building from Alphabet Foundations 🌱"
            reading_sum = f"We will start with {target_lang} letters and character sounds."
            vocab_sum = f"Starting your {target_lang} vocabulary journey from step 1."
            writing_sum = f"Practice letter shapes and word spelling."
            speaking_sum = f"Guided audio practice will build your pronunciation confidence."
            focus = f"Alphabet / Letters → Sounds → Basic Words in {target_lang}"

        insight, _ = AILearnerInsight.objects.get_or_create(learner=profile)
        insight.summary_headline = headline
        insight.reading_summary = reading_sum
        insight.vocabulary_summary = vocab_sum
        insight.writing_summary = writing_sum
        insight.speaking_summary = speaking_sum
        insight.recommended_focus = focus
        insight.recommended_starting_point = rec_start
        insight.save()

        if profile:
            prof, _ = LearnerProficiency.objects.get_or_create(learner=profile)
            prof.reading_level = level
            prof.vocabulary_level = level
            prof.writing_level = level if level != 'Advanced' else 'Intermediate'
            prof.speaking_level = 'Beginner' if level == 'Beginner' else 'Basic'
            prof.overall_level = level
            prof.save()

            progress, _ = LearnerProgress.objects.get_or_create(learner=profile)
            progress.xp_total += 100
            progress.save()

        return Response({
            "message": "Assessment submitted successfully.",
            "accuracy": accuracy,
            "level": level,
            "insight": AILearnerInsightSerializer(insight).data
        })

class AILearnerInsightView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        target_lang = profile.target_language.name if profile and profile.target_language else "Target Language"

        insight, _ = AILearnerInsight.objects.get_or_create(
            learner=profile,
            defaults={
                "summary_headline": f"Personalized Literacy Baseline for {target_lang} Established ✨",
                "reading_summary": f"You are beginning your path with everyday {target_lang} reading.",
                "vocabulary_summary": f"Recognize essential high-frequency words in {target_lang}.",
                "writing_summary": f"Constructing short phrases in {target_lang}.",
                "speaking_summary": f"Pronunciation and audio practice will unlock speaking confidence.",
                "recommended_focus": f"Alphabet → Words → Everyday Conversations in {target_lang}",
                "recommended_starting_point": f"Level 1 Letters & Sounds in {target_lang}"
            }
        )
        return Response(AILearnerInsightSerializer(insight).data)

class LearningPathView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        target_lang = profile.target_language.name if profile and profile.target_language else "Hindi"
        comf_lang = profile.comfortable_language.name if profile and profile.comfortable_language else "English"
        
        prof = LearnerProficiency.objects.filter(learner=profile).first()
        level = prof.overall_level if prof else 'Beginner'

        progress, _ = LearnerProgress.objects.get_or_create(
            learner=profile,
            defaults={'xp_total': 150, 'streak_count': 3, 'completed_lessons': ['node_1_1'], 'unlocked_nodes': ['node_1_1', 'node_1_2']}
        )

        completed_set = set(progress.completed_lessons or [])

        # Progression baseline based on diagnostic level & completed lessons
        min_unlocked_section = 1
        if level == 'Intermediate':
            min_unlocked_section = 2
        elif level == 'Advanced':
            min_unlocked_section = 3

        # 6 Comprehensive Learning Path Sections
        raw_sections = [
            {
                "id": "unit_1",
                "unit_number": 1,
                "title": f"Section 1: Foundations & Script",
                "description": f"Master letter forms, vowel/consonant phonics, numbers 1-10, and starter greetings in {target_lang} (explained in {comf_lang})",
                "color_theme": "brand",
                "skills": ["Character recognition", "Basic pronunciation", "Greetings & etiquette", "Numbers & common starter words"],
                "unlock_requirement": "Unlocked by default as your starting step",
                "preview": {
                    "what_you_will_learn": [f"Script symbols and vowel signs of {target_lang}", "Distinguishing smooth vs. aspirated sounds", "Counting 1-10 and daily greetings"],
                    "why_it_matters": "Script recognition and accurate phonics are the foundation of reading and speaking independence.",
                    "how_to_unlock": "Always unlocked for all learners."
                },
                "nodes": [
                    {"id": "node_1_1", "title": "Letters & Vowels", "subtitle": f"Learn foundational letters in {target_lang}", "node_type": "reading", "order": 1, "xp_reward": 50},
                    {"id": "node_1_2", "title": "Letter Sounds & Phonics", "subtitle": f"Listen to native pronunciations in {target_lang}", "node_type": "listening", "order": 2, "xp_reward": 50},
                    {"id": "node_1_3", "title": "Pronunciation Basics & Greetings", "subtitle": f"Speak basic greetings in {target_lang} aloud", "node_type": "speaking", "order": 3, "xp_reward": 60},
                    {"id": "node_1_4", "title": "Numbers & Starter Words", "subtitle": "Master 1-10 counting and vital starter words", "node_type": "vocabulary", "order": 4, "xp_reward": 60},
                    {"id": "node_1_5", "title": "Foundations Milestone Check", "subtitle": f"Demonstrate mastery of {target_lang} letters and sounds", "node_type": "milestone", "order": 5, "xp_reward": 100},
                ]
            },
            {
                "id": "unit_2",
                "unit_number": 2,
                "title": f"Section 2: Core Vocabulary & Sentences",
                "description": f"Move from isolated words to constructing meaningful sentences, action verbs, and questions in {target_lang}",
                "color_theme": "teal",
                "skills": ["Everyday vocabulary depth", "Action verbs & conjugation", "SOV sentence formation", "Questions & answers"],
                "unlock_requirement": "Complete Section 1: Foundations & Script",
                "preview": {
                    "what_you_will_learn": [f"Household, family, food, and market words", f"Subject-Object-Verb rules and verb endings in {target_lang}", "Asking and answering daily questions"],
                    "why_it_matters": "Enables you to express complete thoughts and needs rather than just naming single objects.",
                    "how_to_unlock": "Complete Section 1 milestone or demonstrate basic proficiency in diagnostic."
                },
                "nodes": [
                    {"id": "node_2_1", "title": "Everyday Vocabulary", "subtitle": f"Home, family, and food terms in {target_lang}", "node_type": "vocabulary", "order": 1, "xp_reward": 60},
                    {"id": "node_2_2", "title": "Common Actions & Verbs", "subtitle": "Master frequent verbs like go, come, eat, and read", "node_type": "reading", "order": 2, "xp_reward": 70},
                    {"id": "node_2_3", "title": "Sentence Builder (SOV Pattern)", "subtitle": "Form short sentences with proper word order", "node_type": "reading", "order": 3, "xp_reward": 75},
                    {"id": "node_2_4", "title": "Questions & Answers", "subtitle": "Ask and answer what, where, who, and how much", "node_type": "speaking", "order": 4, "xp_reward": 80},
                    {"id": "node_2_5", "title": "Core Sentences Milestone", "subtitle": f"Form 5 sentences and answer simple everyday questions in {target_lang}", "node_type": "milestone", "order": 5, "xp_reward": 100},
                ]
            },
            {
                "id": "unit_3",
                "unit_number": 3,
                "title": f"Section 3: Reading, Writing & Comprehension",
                "description": f"Develop functional literacy with signboard reading, short passages, notices, and short sentence writing in {target_lang}",
                "color_theme": "purple",
                "skills": ["Word reading & signs", "Sentence comprehension", "Short cultural passages", "Spelling & short writing"],
                "unlock_requirement": "Complete Section 2: Core Vocabulary & Sentences",
                "preview": {
                    "what_you_will_learn": [f"Reading public signs, menus, and notices", f"Short stories and cultural passages in {target_lang}", "Writing simple notes and responses"],
                    "why_it_matters": "Functional literacy allows you to navigate public spaces, read notices, and understand everyday information independently.",
                    "how_to_unlock": "Complete Section 2 milestone or intermediate diagnostic placement."
                },
                "nodes": [
                    {"id": "node_3_1", "title": "Word & Sign Reading", "subtitle": "Read shop signs, bus boards, and notices", "node_type": "reading", "order": 1, "xp_reward": 70},
                    {"id": "node_3_2", "title": "Sentence Reading & Comprehension", "subtitle": "Read 3-4 sentence paragraphs and extract key information", "node_type": "reading", "order": 2, "xp_reward": 75},
                    {"id": "node_3_3", "title": "Short Cultural Stories", "subtitle": f"Read short folklore and cultural stories in {target_lang}", "node_type": "reading", "order": 3, "xp_reward": 85},
                    {"id": "node_3_4", "title": "Writing & Spelling Practice", "subtitle": "Write correct spellings and short written sentences", "node_type": "vocabulary", "order": 4, "xp_reward": 80},
                    {"id": "node_3_5", "title": "Functional Literacy Milestone", "subtitle": "Demonstrate functional comprehension of written text", "node_type": "milestone", "order": 5, "xp_reward": 120},
                ]
            },
            {
                "id": "unit_4",
                "unit_number": 4,
                "title": f"Section 4: Practical Communication",
                "description": f"Apply language in realistic situations like transit inquiries, market bargaining, and requesting assistance in {target_lang}",
                "color_theme": "amber",
                "skills": ["Real-world inquiry", "Transit navigation", "Market dialogues", "Requesting help politely"],
                "unlock_requirement": "Complete Section 3: Reading, Writing & Comprehension",
                "preview": {
                    "what_you_will_learn": [f"Directions, tickets, auto/taxi fare negotiations in {target_lang}", "Ordering food and asking ingredients", "Polite requests and cultural interaction nuances"],
                    "why_it_matters": "Prepares you for the Real-World Communication interactive feature.",
                    "how_to_unlock": "Complete Section 3 milestone."
                },
                "nodes": [
                    {"id": "node_4_1", "title": "Transit & Directions Inquiries", "subtitle": f"Ask for stations, buses, and street navigation in {target_lang}", "node_type": "speaking", "order": 1, "xp_reward": 80},
                    {"id": "node_4_2", "title": "Market, Shop & Price Bargaining", "subtitle": "Negotiate prices and purchase items", "node_type": "speaking", "order": 2, "xp_reward": 85},
                    {"id": "node_4_3", "title": "Asking for Help & Expressing Needs", "subtitle": "Politely ask for assistance in travel or medical situations", "node_type": "speaking", "order": 3, "xp_reward": 90},
                    {"id": "node_4_4", "title": "Practical Communication Milestone", "subtitle": "Capstone dialogue assessment bridging to Real-World Communication", "node_type": "milestone", "order": 4, "xp_reward": 130},
                ]
            },
            {
                "id": "unit_5",
                "unit_number": 5,
                "title": f"Section 5: Confidence & Fluency",
                "description": f"Move toward spontaneous, independent communication with multi-turn conversations and opinion expression in {target_lang}",
                "color_theme": "brand",
                "skills": ["Multi-turn conversation", "Native speech rhythm", "Expressing opinions", "Storytelling & narration"],
                "unlock_requirement": "Complete Section 4: Practical Communication",
                "preview": {
                    "what_you_will_learn": [f"Complex sentences with conjunctions like because, although, and if in {target_lang}", "Speaking naturally without translating in your head", "Narrating personal experiences and viewpoints"],
                    "why_it_matters": "Builds true conversational fluency and reduces hesitation when interacting with native speakers.",
                    "how_to_unlock": "Complete Section 4 milestone."
                },
                "nodes": [
                    {"id": "node_5_1", "title": "Extended Conversational Dialogues", "subtitle": "Multi-turn spoken conversations with follow-up questions", "node_type": "speaking", "order": 1, "xp_reward": 90},
                    {"id": "node_5_2", "title": "Speaking Fluency & Pronunciation Refinement", "subtitle": f"Refine natural speech rhythm and intonation in {target_lang}", "node_type": "speaking", "order": 2, "xp_reward": 95},
                    {"id": "node_5_3", "title": "Expressing Opinions & Experiences", "subtitle": "Share thoughts, compare preferences, and describe events", "node_type": "reading", "order": 3, "xp_reward": 95},
                    {"id": "node_5_4", "title": "Fluency & Storytelling Milestone", "subtitle": f"Deliver a 1-minute personal narration in {target_lang}", "node_type": "milestone", "order": 4, "xp_reward": 140},
                ]
            },
            {
                "id": "unit_6",
                "unit_number": 6,
                "title": f"Section 6: Independent Language Mastery",
                "description": f"Attain autonomous language ability capable of understanding complex media, formal registers, and professional discourse in {target_lang}",
                "color_theme": "teal",
                "skills": ["Autonomous comprehension", "Formal vs. informal registers", "Professional literacy", "Comprehensive bilingual mastery"],
                "unlock_requirement": "Complete Section 5: Confidence & Fluency",
                "preview": {
                    "what_you_will_learn": [f"Advanced cultural idioms, metaphors, and proverbs in {target_lang}", "Formal workplace and civic correspondence", "Unassisted reading of articles, news, and literature"],
                    "why_it_matters": "Achieving independent mastery allows you to live, work, and thrive comfortably in the target language environment.",
                    "how_to_unlock": "Complete Section 5 milestone."
                },
                "nodes": [
                    {"id": "node_6_1", "title": "Advanced Vocabulary & Idioms", "subtitle": f"Master nuanced adjectives and idiomatic expressions in {target_lang}", "node_type": "vocabulary", "order": 1, "xp_reward": 100},
                    {"id": "node_6_2", "title": "Formal vs. Colloquial Register Nuances", "subtitle": "Understand polite honorifics vs. casual peer conversation", "node_type": "reading", "order": 2, "xp_reward": 110},
                    {"id": "node_6_3", "title": "Real-World Documents & News", "subtitle": f"Read articles and professional documents in {target_lang}", "node_type": "reading", "order": 3, "xp_reward": 120},
                    {"id": "node_6_4", "title": "Summit of Fluency & Master Certification", "subtitle": "Capstone certification demonstrating independent bilingual mastery", "node_type": "milestone", "order": 4, "xp_reward": 200},
                ]
            }
        ]

        # Calculate dynamic status & unlock progression based on completed lessons
        units = []
        previous_unit_completed = True

        for sec_idx, sec in enumerate(raw_sections, 1):
            nodes = []
            prev_node_done = True if (sec_idx <= min_unlocked_section or previous_unit_completed) else False

            for n_idx, raw_node in enumerate(sec["nodes"]):
                n_id = raw_node["id"]
                is_completed = n_id in completed_set

                if is_completed:
                    n_status = "completed"
                    prev_node_done = True
                elif prev_node_done:
                    n_status = "unlocked"
                    prev_node_done = False
                else:
                    n_status = "locked"

                node_copy = dict(raw_node)
                node_copy["status"] = n_status
                nodes.append(node_copy)

            completed_count = sum(1 for n in nodes if n["status"] == "completed")
            pct = int(round((completed_count / len(nodes)) * 100)) if nodes else 0

            if pct == 100:
                sec_status = "completed"
                previous_unit_completed = True
            elif previous_unit_completed or sec_idx <= min_unlocked_section:
                sec_status = "current"
                previous_unit_completed = False
            else:
                sec_status = "locked"
                previous_unit_completed = False

            sec_copy = dict(sec)
            sec_copy["nodes"] = nodes
            sec_copy["status"] = sec_status
            sec_copy["completion_percentage"] = pct
            units.append(sec_copy)

        return Response({
            "units": units,
            "level": level,
            "progress": LearnerProgressSerializer(progress).data
        })

class LessonSubmitView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, 'profile', None)
        node_id = request.data.get('node_id')

        progress, _ = LearnerProgress.objects.get_or_create(learner=profile)
        progress.xp_total += 50
        progress.streak_count = max(progress.streak_count, 1)

        # Persist completed node ID to progress
        if node_id:
            completed = list(progress.completed_lessons or [])
            if node_id not in completed:
                completed.append(node_id)
                progress.completed_lessons = completed

            unlocked = list(progress.unlocked_nodes or [])
            if node_id not in unlocked:
                unlocked.append(node_id)
                progress.unlocked_nodes = unlocked

        progress.save()

        return Response({
            "message": "Lesson completed successfully!",
            "xp_earned": 50,
            "total_xp": progress.xp_total,
            "streak_count": progress.streak_count
        })

class VoiceAnalyzeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        target_phrase = request.data.get('target_phrase', 'Welcome to LingoPath AI')

        return Response({
            "transcription": target_phrase,
            "pronunciation_score": 92.5,
            "accuracy_rating": "Excellent",
            "feedback": f"Great pronunciation! Clear emphasis on key words in '{target_phrase}'.",
            "phonetic_breakdown": [
                {"word": "Welcome", "clarity": "100%"},
                {"word": "LingoPath", "clarity": "95%"},
                {"word": "AI", "clarity": "90%"}
            ]
        })

class LeaderboardView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_profile, _ = LearnerProfile.objects.get_or_create(
            user=request.user,
            defaults={'full_name': request.user.full_name or request.user.email}
        )
        user_progress, _ = LearnerProgress.objects.get_or_create(learner=user_profile)

        # Mock top community learners for dynamic leaderboard experience
        mock_learners = [
            {
                "id": "mock_1",
                "rank": 1,
                "full_name": "Priya Sharma",
                "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Telugu (తెలుగు)",
                "target_language": "English",
                "flag": "🇬🇧",
                "weekly_xp": 940,
                "total_xp": 3450,
                "streak_days": 18,
                "lessons_completed": 42,
                "accuracy_rate": 96,
                "league_tier": "Diamond 💎",
                "is_current_user": False
            },
            {
                "id": "mock_2",
                "rank": 2,
                "full_name": "Rahul Verma",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Hindi (हिन्दी)",
                "target_language": "English",
                "flag": "🇬🇧",
                "weekly_xp": 820,
                "total_xp": 2980,
                "streak_days": 14,
                "lessons_completed": 38,
                "accuracy_rate": 92,
                "league_tier": "Gold 🥇",
                "is_current_user": False
            },
            {
                "id": "mock_3",
                "rank": 3,
                "full_name": "Ananya Reddy",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Tamil (தமிழ்)",
                "target_language": "English",
                "flag": "🇬🇧",
                "weekly_xp": 760,
                "total_xp": 2600,
                "streak_days": 12,
                "lessons_completed": 31,
                "accuracy_rate": 94,
                "league_tier": "Silver 🥈",
                "is_current_user": False
            },
            {
                "id": "mock_4",
                "rank": 4,
                "full_name": "Kiran Kumar",
                "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Kannada (ಕನ್ನಡ)",
                "target_language": "English",
                "flag": "🇬🇧",
                "weekly_xp": 640,
                "total_xp": 2150,
                "streak_days": 9,
                "lessons_completed": 27,
                "accuracy_rate": 89,
                "league_tier": "Bronze 🥉",
                "is_current_user": False
            },
            {
                "id": "mock_5",
                "rank": 5,
                "full_name": "Sneha Patel",
                "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Hindi (हिन्दी)",
                "target_language": "Telugu",
                "flag": "🇮🇳",
                "weekly_xp": 580,
                "total_xp": 1890,
                "streak_days": 7,
                "lessons_completed": 22,
                "accuracy_rate": 88,
                "league_tier": "Emerald 💚",
                "is_current_user": False
            },
            {
                "id": "mock_6",
                "rank": 6,
                "full_name": "Arjun Das",
                "avatar": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80",
                "comfortable_language": "Malayalam (മലയാളം)",
                "target_language": "English",
                "flag": "🇬🇧",
                "weekly_xp": 490,
                "total_xp": 1640,
                "streak_days": 6,
                "lessons_completed": 19,
                "accuracy_rate": 85,
                "league_tier": "Emerald 💚",
                "is_current_user": False
            }
        ]

        # Current logged in user object
        user_entry = {
            "id": f"user_{user_profile.id}",
            "rank": 4, # inserted dynamically based on XP
            "full_name": user_profile.full_name or request.user.full_name or "You",
            "avatar": None,
            "comfortable_language": user_profile.comfortable_language.name if user_profile.comfortable_language else "Telugu",
            "target_language": user_profile.target_language.name if user_profile.target_language else "English",
            "flag": "🇬🇧" if (user_profile.target_language and user_profile.target_language.name == "English") else "🇮🇳",
            "weekly_xp": user_progress.xp_total,
            "total_xp": user_progress.xp_total + 150,
            "streak_days": user_progress.streak_count or 5,
            "lessons_completed": len(user_progress.unlocked_nodes or user_progress.completed_lessons or []) + 5,
            "accuracy_rate": 91,
            "league_tier": "Diamond 💎" if user_progress.xp_total > 500 else "Silver 🥈",
            "is_current_user": True
        }

        # Insert user and sort by weekly_xp descending
        all_entries = mock_learners + [user_entry]
        all_entries.sort(key=lambda x: x["weekly_xp"], reverse=True)

        for index, item in enumerate(all_entries):
            item["rank"] = index + 1

        return Response({
            "league_name": "Diamond League 💎",
            "reset_days_remaining": 3,
            "current_user_rank": user_entry["rank"],
            "total_participants": len(all_entries),
            "leaderboard": all_entries
        })


class GameProgressView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        progresses = LearnerGameProgress.objects.filter(learner=profile)
        serializer = LearnerGameProgressSerializer(progresses, many=True)
        
        stats = {}
        for item in serializer.data:
            stats[item['game_key']] = item
            
        recent = GameAttemptSerializer(GameAttempt.objects.filter(learner=profile).order_by('-created_at')[:10], many=True).data

        return Response({
            "game_progress": stats,
            "recent_attempts": recent
        })


class GameSubmitView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        profile = getattr(request.user, 'profile', None)
        if not profile:
            return Response({"detail": "Profile not found"}, status=status.HTTP_404_NOT_FOUND)

        game_key = request.data.get('game_key', 'language_train')
        level = int(request.data.get('level', 1))
        score = int(request.data.get('score', 0))
        xp_gained = int(request.data.get('xp_gained', 0))
        correct_attempts = int(request.data.get('correct_attempts', 0))
        wrong_attempts = int(request.data.get('wrong_attempts', 0))
        completed = bool(request.data.get('completed', True))
        skill = request.data.get('skill', 'General')

        attempt = GameAttempt.objects.create(
            learner=profile,
            game_key=game_key,
            target_language=profile.target_language,
            skill=skill,
            level=level,
            score=score,
            xp_gained=xp_gained,
            correct_attempts=correct_attempts,
            wrong_attempts=wrong_attempts,
            completed=completed
        )

        game_prog, _ = LearnerGameProgress.objects.get_or_create(
            learner=profile,
            game_key=game_key,
            defaults={'level_unlocked': 1, 'highest_score': 0, 'total_xp': 0, 'total_played': 0}
        )

        game_prog.total_played += 1
        game_prog.total_xp += xp_gained
        if score > game_prog.highest_score:
            game_prog.highest_score = score
        if completed and level >= game_prog.level_unlocked and game_prog.level_unlocked < 5:
            game_prog.level_unlocked = level + 1
        game_prog.save()

        learner_progress, _ = LearnerProgress.objects.get_or_create(learner=profile)
        learner_progress.xp_total += xp_gained
        learner_progress.save()

        return Response({
            "status": "success",
            "attempt": GameAttemptSerializer(attempt).data,
            "game_progress": LearnerGameProgressSerializer(game_prog).data,
            "total_learner_xp": learner_progress.xp_total
        })


class GameContentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = getattr(request.user, 'profile', None)
        target_lang = profile.target_language.name if profile and profile.target_language else "Hindi"
        target_code = profile.target_language.code if profile and profile.target_language else "hi"
        comf_lang = profile.comfortable_language.name if profile and profile.comfortable_language else "Telugu"
        comf_code = profile.comfortable_language.code if profile and profile.comfortable_language else "te"

        prof = LearnerProficiency.objects.filter(learner=profile).first()
        level_str = prof.overall_level if prof else 'Beginner'

        # Content dictionary for 5 games structured dynamically for target language & comfortable language
        if target_code == 'hi' or target_lang == 'Hindi':
            train_stations = [
                {
                    "id": 1,
                    "name": f"Station 1: {target_lang} Letters & Vowels",
                    "type": "letters",
                    "prompt": "Select the correct Hindi vowel sound for 'A':",
                    "target_text": "अ",
                    "options": ["अ", "आ", "इ", "ई"],
                    "correct": "अ",
                    "hint": f"In {comf_lang}, 'अ' makes the short 'a' sound like in America.",
                    "explanation": "'अ' is the first vowel of Devanagari Hindi alphabet."
                },
                {
                    "id": 2,
                    "name": f"Station 2: Everyday Vocabulary",
                    "type": "vocabulary",
                    "prompt": "What does 'पानी' (Paani) mean?",
                    "target_text": "पानी",
                    "options": ["Water", "Book", "House", "Tree"],
                    "correct": "Water",
                    "hint": f"Think of liquid essential for life! ({comf_lang} explanation)",
                    "explanation": "'पानी' is the Hindi word for Water."
                },
                {
                    "id": 3,
                    "name": f"Station 3: Sentence Formation",
                    "type": "sentences",
                    "prompt": "Select the correct Hindi sentence for 'I eat an apple':",
                    "target_text": "मैं सेब खाता हूँ।",
                    "options": ["मैं सेब खाता हूँ।", "सेब खाता मैं हूँ।", "खाता मैं सेब हूँ।", "हूँ मैं सेब खाता।"],
                    "correct": "मैं सेब खाता हूँ।",
                    "hint": "Hindi sentence order is Subject + Object + Verb.",
                    "explanation": "Subject (मैं) + Object (सेब) + Verb (खाता हूँ)."
                },
                {
                    "id": 4,
                    "name": f"Station 4: Listening Comprehension",
                    "type": "listening",
                    "prompt": "Listen to the word 'नमस्ते' and identify its meaning:",
                    "target_text": "नमस्ते (Namaste)",
                    "audio_text": "नमस्ते",
                    "options": ["Hello / Greetings", "Goodbye", "Thank You", "Sorry"],
                    "correct": "Hello / Greetings",
                    "hint": f"Common traditional greeting across India! ({comf_lang}: నమస్కారం / नमस्ते)",
                    "explanation": "'नमस्ते' is the traditional Hindi greeting."
                },
                {
                    "id": 5,
                    "name": f"Station 5: Communication Challenge",
                    "type": "communication",
                    "prompt": "How do you ask 'How are you?' politely in Hindi?",
                    "target_text": "आप कैसे हैं?",
                    "options": ["आप कैसे हैं?", "आपका नाम क्या है?", "मैं ठीक हूँ।", "शुभ रात्रि।"],
                    "correct": "आप कैसे हैं?",
                    "hint": "Polite inquiry about someone's wellbeing.",
                    "explanation": "'आप कैसे हैं?' means 'How are you?' in polite address."
                }
            ]

            runner_words = [
                {"id": 1, "target": "किताब", "meaning": "Book", "options": ["Book", "Pen", "Table", "Chair"], "correct": "Book", "icon": "📖"},
                {"id": 2, "target": "घर", "meaning": "House", "options": ["House", "Road", "School", "Car"], "correct": "House", "icon": "🏠"},
                {"id": 3, "target": "सूरज", "meaning": "Sun", "options": ["Sun", "Moon", "Star", "Cloud"], "correct": "Sun", "icon": "☀️"},
                {"id": 4, "target": "पेड़", "meaning": "Tree", "options": ["Tree", "Flower", "Grass", "Leaf"], "correct": "Tree", "icon": "🌳"},
                {"id": 5, "target": "मित्र", "meaning": "Friend", "options": ["Friend", "Teacher", "Enemy", "Doctor"], "correct": "Friend", "icon": "🤝"},
                {"id": 6, "target": "विद्यालय", "meaning": "School", "options": ["School", "Market", "Park", "Hospital"], "correct": "School", "icon": "🏫"}
            ]

            shooter_targets = [
                {"id": 1, "target_text": "फल", "type": "image_match", "prompt_text": "Select the target meaning 'Fruit' (🍎):", "options": ["फल", "सब्जी", "दूध", "पानी"], "correct": "फल"},
                {"id": 2, "target_text": "दूध", "type": "word_match", "prompt_text": "Shoot the word that means 'Milk':", "options": ["दूध", "चाय", "कॉफ़ी", "शर्बत"], "correct": "दूध"},
                {"id": 3, "target_text": "शुभ प्रभात", "type": "sentence_match", "prompt_text": "Target phrase for 'Good Morning':", "options": ["शुभ प्रभात", "शुभ रात्रि", "नमस्ते", "धन्यवाद"], "correct": "शुभ प्रभात"},
                {"id": 4, "target_text": "रोटी", "type": "audio_match", "prompt_text": "Target word for 'Bread/Roti':", "options": ["रोटी", "चावल", "दाल", "मक्खन"], "correct": "रोटी"}
            ]

            cooking_recipe = {
                "recipe_name": f"स्वादिष्ट चाय (Delicious Masala Tea)",
                "target_language": target_lang,
                "instructions_lang": comf_lang,
                "steps": [
                    {
                        "step_num": 1,
                        "instruction": f"Select 1 cup of Water in {target_lang}:",
                        "options": ["1 कप पानी (1 Cup Water)", "2 चम्मच चीनी (2 Spoons Sugar)", "दूध (Milk)", "चायपत्ती (Tea Leaves)"],
                        "correct": "1 कप पानी (1 Cup Water)",
                        "icon": "🥛",
                        "explanation": "'पानी' is Water."
                    },
                    {
                        "step_num": 2,
                        "instruction": f"Add Tea Leaves in {target_lang}:",
                        "options": ["चायपत्ती (Tea Leaves)", "नमक (Salt)", "तेल (Oil)", "मिर्च (Chilli)"],
                        "correct": "चायपत्ती (Tea Leaves)",
                        "icon": "🍃",
                        "explanation": "'चायपत्ती' is Tea leaves."
                    },
                    {
                        "step_num": 3,
                        "instruction": f"Add 1 glass of Milk in {target_lang}:",
                        "options": ["1 गिलास दूध (1 Glass Milk)", "शहद (Honey)", "पानी (Water)", "दही (Curd)"],
                        "correct": "1 गिलास दूध (1 Glass Milk)",
                        "icon": "🥛",
                        "explanation": "'दूध' is Milk."
                    },
                    {
                        "step_num": 4,
                        "instruction": f"Boil and Stir the tea in {target_lang}:",
                        "options": ["उबालें और चलाएं (Boil and Stir)", "काटें (Cut)", "तलें (Fry)", "धोएं (Wash)"],
                        "correct": "उबालें और चलाएं (Boil and Stir)",
                        "icon": "🔥",
                        "explanation": "'उबालें' means Boil!"
                    }
                ]
            }

            shop_data = {
                "shop_title": f"{target_lang} Supermarket 🛒",
                "instructions_lang": comf_lang,
                "task": f"Task: Buy 2 Apples (सेब) and 1 Litre Milk (दूध).",
                "required_items": [
                    {"name_target": "सेब (Apple)", "required_qty": 2, "unit_price": 30, "icon": "🍎"},
                    {"name_target": "दूध (Milk)", "required_qty": 1, "unit_price": 50, "icon": "🥛"}
                ],
                "shelf_items": [
                    {"id": "s1", "name_target": "सेब (Apple)", "price": 30, "category": "Fruits", "icon": "🍎"},
                    {"id": "s2", "name_target": "दूध (Milk)", "price": 50, "category": "Dairy", "icon": "🥛"},
                    {"id": "s3", "name_target": "केला (Banana)", "price": 20, "category": "Fruits", "icon": "🍌"},
                    {"id": "s4", "name_target": "डबलरोटी (Bread)", "price": 40, "category": "Bakery", "icon": "🍞"},
                    {"id": "s5", "name_target": "चावल (Rice)", "price": 60, "category": "Grains", "icon": "🌾"}
                ]
            }

        elif target_code == 'te' or target_lang == 'Telugu':
            train_stations = [
                {
                    "id": 1,
                    "name": f"Station 1: {target_lang} Alphabet & Vowels",
                    "type": "letters",
                    "prompt": "Select the correct Telugu vowel for 'A':",
                    "target_text": "అ",
                    "options": ["అ", "ఆ", "ఇ", "ఈ"],
                    "correct": "అ",
                    "hint": f"In {comf_lang}, 'అ' represents the vowel sound 'A'.",
                    "explanation": "'అ' is the first vowel of Telugu script."
                },
                {
                    "id": 2,
                    "name": f"Station 2: Everyday Vocabulary",
                    "type": "vocabulary",
                    "prompt": "What does 'నీరు' (Neeru) mean?",
                    "target_text": "నీరు",
                    "options": ["Water", "Food", "House", "Book"],
                    "correct": "Water",
                    "hint": "Liquid that quenches thirst!",
                    "explanation": "'నీరు' means Water."
                },
                {
                    "id": 3,
                    "name": f"Station 3: Sentence Formation",
                    "type": "sentences",
                    "prompt": "Select the correct Telugu sentence for 'I read a book':",
                    "target_text": "నేను ఒక పుస్తకం చదువుతున్నాను.",
                    "options": ["నేను ఒక పుస్తకం చదువుతున్నాను.", "పుస్తకం చదువుతున్నాను నేను.", "ఒక నేను చదువుతున్నాను పుస్తకం.", "చదువుతున్నాను నేను పుస్తకం."],
                    "correct": "నేను ఒక పుస్తకం చదువుతున్నాను.",
                    "hint": "Telugu sentence structure is Subject + Object + Verb.",
                    "explanation": "Subject (నేను) + Object (పుస్తకం) + Verb (చదువుతున్నాను)."
                },
                {
                    "id": 4,
                    "name": f"Station 4: Listening & Greetings",
                    "type": "listening",
                    "prompt": "Identify the meaning of 'నమస్కారం':",
                    "target_text": "నమస్కారం (Namaskaram)",
                    "options": ["Greetings / Hello", "Goodbye", "Thank You", "Welcome"],
                    "correct": "Greetings / Hello",
                    "hint": "Traditional polite greeting.",
                    "explanation": "'నమస్కారం' is the polite Telugu greeting."
                },
                {
                    "id": 5,
                    "name": f"Station 5: Communication",
                    "type": "communication",
                    "prompt": "How do you ask 'How are you?' in Telugu?",
                    "target_text": "మీరు ఎలా ఉన్నారు?",
                    "options": ["మీరు ఎలా ఉన్నారు?", "మీ పేరేమిటి?", "నా పేరు రవి.", "ధన్యవాదాలు."],
                    "correct": "మీరు ఎలా ఉన్నారు?",
                    "hint": "Polite question about health & state.",
                    "explanation": "'మీరు ఎలా ఉన్నారు?' means 'How are you?'"
                }
            ]

            runner_words = [
                {"id": 1, "target": "పుస్తకం", "meaning": "Book", "options": ["Book", "Pen", "Table", "House"], "correct": "Book", "icon": "📖"},
                {"id": 2, "target": "ఇల్లు", "meaning": "House", "options": ["House", "Road", "Tree", "School"], "correct": "House", "icon": "🏠"},
                {"id": 3, "target": "సూర్యుడు", "meaning": "Sun", "options": ["Sun", "Moon", "Star", "Cloud"], "correct": "Sun", "icon": "☀️"},
                {"id": 4, "target": "చెట్టు", "meaning": "Tree", "options": ["Tree", "Flower", "Grass", "Fruit"], "correct": "Tree", "icon": "🌳"},
                {"id": 5, "target": "స్నేహితుడు", "meaning": "Friend", "options": ["Friend", "Teacher", "Enemy", "Doctor"], "correct": "Friend", "icon": "🤝"}
            ]

            shooter_targets = [
                {"id": 1, "target_text": "పండు", "type": "image_match", "prompt_text": "Select the target meaning 'Fruit' (🍎):", "options": ["పండు", "కూరగాయ", "పాలు", "నీరు"], "correct": "పండు"},
                {"id": 2, "target_text": "పాలు", "type": "word_match", "prompt_text": "Shoot the word for 'Milk':", "options": ["పాలు", "టీ", "కాఫీ", "నీరు"], "correct": "పాలు"},
                {"id": 3, "target_text": "శుభోదయం", "type": "sentence_match", "prompt_text": "Target phrase for 'Good Morning':", "options": ["శుభోదయం", "శుభ రాత్రి", "నమస్కారం", "ధన్యవాదాలు"], "correct": "శుభోదయం"}
            ]

            cooking_recipe = {
                "recipe_name": f"రుచికరమైన ఉప్మా (Delicious Upma)",
                "target_language": target_lang,
                "instructions_lang": comf_lang,
                "steps": [
                    {
                        "step_num": 1,
                        "instruction": f"Select Rava (Semolina) in {target_lang}:",
                        "options": ["రవ్వ (Semolina)", "పంచదార (Sugar)", "ఉప్పు (Salt)", "పాలు (Milk)"],
                        "correct": "రవ్వ (Semolina)",
                        "icon": "🌾",
                        "explanation": "'రవ్వ' is Semolina."
                    },
                    {
                        "step_num": 2,
                        "instruction": f"Add 2 cups Water in {target_lang}:",
                        "options": ["2 కప్పుల నీరు (2 Cups Water)", "నూనె (Oil)", "నెయ్యి (Ghee)", "పెరుగు (Curd)"],
                        "correct": "2 కప్పుల నీరు (2 Cups Water)",
                        "icon": "🥛",
                        "explanation": "'నీరు' is Water."
                    },
                    {
                        "step_num": 3,
                        "instruction": f"Stir well until cooked in {target_lang}:",
                        "options": ["బాగా కలపండి (Stir Well)", "తొలగించండి (Remove)", "కలపవద్దు (Do Not Stir)", "కాల్చండి (Burn)"],
                        "correct": "బాగా కలపండి (Stir Well)",
                        "icon": "🥄",
                        "explanation": "'కలపండి' means Stir!"
                    }
                ]
            }

            shop_data = {
                "shop_title": f"{target_lang} Supermarket 🛒",
                "instructions_lang": comf_lang,
                "task": f"Task: Buy 2 Apples (యాపిల్స్) and 1 Litre Milk (పాలు).",
                "required_items": [
                    {"name_target": "యాపిల్స్ (Apples)", "required_qty": 2, "unit_price": 30, "icon": "🍎"},
                    {"name_target": "పాలు (Milk)", "required_qty": 1, "unit_price": 50, "icon": "🥛"}
                ],
                "shelf_items": [
                    {"id": "s1", "name_target": "యాపిల్స్ (Apples)", "price": 30, "category": "Fruits", "icon": "🍎"},
                    {"id": "s2", "name_target": "పాలు (Milk)", "price": 50, "category": "Dairy", "icon": "🥛"},
                    {"id": "s3", "name_target": "అరటిపండ్లు (Bananas)", "price": 20, "category": "Fruits", "icon": "🍌"},
                    {"id": "s4", "name_target": "రొట్టె (Bread)", "price": 40, "category": "Bakery", "icon": "🍞"}
                ]
            }

        else: # English target
            train_stations = [
                {
                    "id": 1,
                    "name": "Station 1: English Alphabet",
                    "type": "letters",
                    "prompt": "Select the capital letter for 'a':",
                    "target_text": "A",
                    "options": ["A", "B", "C", "D"],
                    "correct": "A",
                    "hint": "The first letter of the English alphabet.",
                    "explanation": "'A' is the capital letter of 'a'."
                },
                {
                    "id": 2,
                    "name": "Station 2: Everyday Words",
                    "type": "vocabulary",
                    "prompt": "Select the word for liquid we drink:",
                    "target_text": "Water",
                    "options": ["Water", "Book", "House", "Tree"],
                    "correct": "Water",
                    "hint": "Essential liquid for living beings.",
                    "explanation": "'Water' is the correct term."
                },
                {
                    "id": 3,
                    "name": "Station 3: Sentence Formation",
                    "type": "sentences",
                    "prompt": "Arrange into correct sentence: 'reads / She / book / a'",
                    "target_text": "She reads a book.",
                    "options": ["She reads a book.", "Book a reads She.", "Reads She book a.", "A book She reads."],
                    "correct": "She reads a book.",
                    "hint": "Subject + Verb + Object.",
                    "explanation": "Subject (She) + Verb (reads) + Object (a book)."
                },
                {
                    "id": 4,
                    "name": "Station 4: Listening & Greetings",
                    "type": "listening",
                    "prompt": "Select the correct greeting for the morning:",
                    "target_text": "Good Morning",
                    "options": ["Good Morning", "Good Night", "Goodbye", "Sorry"],
                    "correct": "Good Morning",
                    "hint": "Said early in the day.",
                    "explanation": "'Good Morning' is used early in the day."
                },
                {
                    "id": 5,
                    "name": "Station 5: Conversation",
                    "type": "communication",
                    "prompt": "How do you ask someone their name in English?",
                    "target_text": "What is your name?",
                    "options": ["What is your name?", "Where are you going?", "How old are you?", "What time is it?"],
                    "correct": "What is your name?",
                    "hint": "Polite question when meeting someone new.",
                    "explanation": "'What is your name?' asks for identification."
                }
            ]

            runner_words = [
                {"id": 1, "target": "Book", "meaning": "Book", "options": ["Book", "Pen", "Desk", "Chair"], "correct": "Book", "icon": "📖"},
                {"id": 2, "target": "House", "meaning": "House", "options": ["House", "Road", "School", "Car"], "correct": "House", "icon": "🏠"},
                {"id": 3, "target": "Sun", "meaning": "Sun", "options": ["Sun", "Moon", "Star", "Cloud"], "correct": "Sun", "icon": "☀️"},
                {"id": 4, "target": "Tree", "meaning": "Tree", "options": ["Tree", "Flower", "Grass", "Leaf"], "correct": "Tree", "icon": "🌳"},
                {"id": 5, "target": "Friend", "meaning": "Friend", "options": ["Friend", "Teacher", "Enemy", "Doctor"], "correct": "Friend", "icon": "🤝"}
            ]

            shooter_targets = [
                {"id": 1, "target_text": "Fruit", "type": "image_match", "prompt_text": "Select the word for '🍎':", "options": ["Fruit", "Vegetable", "Milk", "Water"], "correct": "Fruit"},
                {"id": 2, "target_text": "Milk", "type": "word_match", "prompt_text": "Shoot the word for 'Milk':", "options": ["Milk", "Tea", "Coffee", "Juice"], "correct": "Milk"},
                {"id": 3, "target_text": "Good Morning", "type": "sentence_match", "prompt_text": "Target phrase for morning greeting:", "options": ["Good Morning", "Good Night", "Hello", "Thanks"], "correct": "Good Morning"}
            ]

            cooking_recipe = {
                "recipe_name": "Fresh Fruit Salad",
                "target_language": target_lang,
                "instructions_lang": comf_lang,
                "steps": [
                    {
                        "step_num": 1,
                        "instruction": "Select 2 fresh Apples:",
                        "options": ["2 Fresh Apples", "Salt", "Oil", "Curd"],
                        "correct": "2 Fresh Apples",
                        "icon": "🍎",
                        "explanation": "Apples are sweet fruits."
                    },
                    {
                        "step_num": 2,
                        "instruction": "Add 1 Banana sliced:",
                        "options": ["1 Sliced Banana", "Tea leaves", "Milk", "Chilli"],
                        "correct": "1 Sliced Banana",
                        "icon": "🍌",
                        "explanation": "Bananas add sweetness."
                    },
                    {
                        "step_num": 3,
                        "instruction": "Mix gently in a bowl:",
                        "options": ["Mix gently", "Boil hot", "Fry deep", "Wash away"],
                        "correct": "Mix gently",
                        "icon": "🥣",
                        "explanation": "Combine fruits in a bowl."
                    }
                ]
            }

            shop_data = {
                "shop_title": "Supermarket Shop 🛒",
                "instructions_lang": comf_lang,
                "task": "Task: Buy 2 Apples and 1 Litre Milk.",
                "required_items": [
                    {"name_target": "Apples", "required_qty": 2, "unit_price": 30, "icon": "🍎"},
                    {"name_target": "Milk", "required_qty": 1, "unit_price": 50, "icon": "🥛"}
                ],
                "shelf_items": [
                    {"id": "s1", "name_target": "Apples", "price": 30, "category": "Fruits", "icon": "🍎"},
                    {"id": "s2", "name_target": "Milk", "price": 50, "category": "Dairy", "icon": "🥛"},
                    {"id": "s3", "name_target": "Bananas", "price": 20, "category": "Fruits", "icon": "🍌"},
                    {"id": "s4", "name_target": "Bread", "price": 40, "category": "Bakery", "icon": "🍞"}
                ]
            }

        return Response({
            "target_language": target_lang,
            "target_code": target_code,
            "comfortable_language": comf_lang,
            "comfortable_code": comf_code,
            "level": level_str,
            "games": {
                "language_train": train_stations,
                "word_runner": runner_words,
                "word_shooter": shooter_targets,
                "cooking_challenge": cooking_recipe,
                "virtual_shop": shop_data
            }
        })


