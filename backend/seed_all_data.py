import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from languages.models import Language
from learners.models import (
    AssessmentQuestion,
    LearningPathUnit,
    LessonNode
)

User = get_user_model()

def seed_database():
    print("🌱 Starting LingoPath AI database seeding...")

    # 1. Create Superuser for Django Admin
    admin_email = "admin@lingopath.ai"
    if not User.objects.filter(email=admin_email).exists():
        admin_user = User.objects.create_superuser(
            username=admin_email,
            email=admin_email,
            password="adminpassword123",
            full_name="LingoPath Admin"
        )
        print(f"✅ Created Superuser: {admin_email} (Password: adminpassword123)")
    else:
        print(f"ℹ️ Superuser {admin_email} already exists.")

    # 2. Seed Languages
    languages_data = [
        {"name": "English", "code": "en", "native_name": "English", "flag_emoji": "🇬🇧", "is_supported_native": True, "is_supported_target": True},
        {"name": "Telugu", "code": "te", "native_name": "తెలుగు", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": True},
        {"name": "Hindi", "code": "hi", "native_name": "हिन्दी", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": True},
        {"name": "Tamil", "code": "ta", "native_name": "தமிழ்", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": True},
        {"name": "Kannada", "code": "kn", "native_name": "కన్నడ", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": False},
        {"name": "Malayalam", "code": "ml", "native_name": "മലയാളം", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": False},
        {"name": "Bengali", "code": "bn", "native_name": "বাংলা", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": False},
        {"name": "Marathi", "code": "mr", "native_name": "मराठी", "flag_emoji": "🇮🇳", "is_supported_native": True, "is_supported_target": False},
    ]

    for lang in languages_data:
        Language.objects.get_or_create(code=lang["code"], defaults=lang)
    print(f"✅ Seeded {len(languages_data)} Languages.")

    # 3. Seed Assessment Questions
    questions_data = [
        {
            "skill": "Reading Passage",
            "question_type": "reading_passage",
            "prompt": "Read the passage and select the word that best describes how Ravi felt.",
            "passage": "Ravi was eager to visit the community library every morning. He loved discovering new books about science and nature.",
            "highlight_word": "eager",
            "comfortable_bridges": {"Telugu": "క్రింది వాక్యాన్ని చదివి 'eager' అనే పదానికి సరిపోయే అర్థాన్ని ఎంచుకోండి:"},
            "options": [
                {"id": 1, "text": "Enthusiastic and keen", "is_correct": True},
                {"id": 2, "text": "Uninterested and bored", "is_correct": False},
                {"id": 3, "text": "Fearful and hesitant", "is_correct": False},
                {"id": 4, "text": "Tired and sleepy", "is_correct": False}
            ],
            "correct_answer": "Enthusiastic and keen",
            "explanation": "'Eager' means having or showing keen interest or intense desire."
        },
        {
            "skill": "Vocabulary Matching",
            "question_type": "match_words",
            "prompt": "Select the option that best matches the meaning of the target word.",
            "passage": "",
            "highlight_word": "Opportunity",
            "comfortable_bridges": {"Telugu": "అవకాశం / మంచి తరుణం (Meaning Bridge)"},
            "options": [
                {"id": 1, "text": "A favorable time or chance for progress", "is_correct": True},
                {"id": 2, "text": "A sudden obstacle or error", "is_correct": False},
                {"id": 3, "text": "A heavy tool used in building", "is_correct": False},
                {"id": 4, "text": "An old story or fable", "is_correct": False}
            ],
            "correct_answer": "A favorable time or chance for progress",
            "explanation": "Opportunity refers to a set of circumstances making it possible to do something."
        },
        {
            "skill": "Sentence Construction",
            "question_type": "arrange_words",
            "prompt": "Arrange the words into a complete, correct sentence.",
            "passage": "",
            "highlight_word": "",
            "comfortable_bridges": {"Telugu": "సరియైన వాక్య నిర్మాణాన్ని ఎంచుకోండి:"},
            "options": [
                {"id": 1, "text": "I practice reading English every single morning.", "is_correct": True},
                {"id": 2, "text": "Reading morning every single English practice I.", "is_correct": False},
                {"id": 3, "text": "Every morning English practice reading I single.", "is_correct": False},
                {"id": 4, "text": "Practice I English single morning reading every.", "is_correct": False}
            ],
            "correct_answer": "I practice reading English every single morning.",
            "explanation": "Subject (I) + Verb (practice) + Direct Object (reading English) + Time modifier."
        },
        {
            "skill": "Comprehension & Context",
            "question_type": "fill_blank",
            "prompt": "Choose the correct word to fill in the blank.",
            "passage": "Learning a new language opens up exciting _____ for work and communication.",
            "highlight_word": "_____",
            "comfortable_bridges": {"Telugu": "సరిపోయే పదంతో ఖాళీని భర్తీ చేయండి:"},
            "options": [
                {"id": 1, "text": "possibilities", "is_correct": True},
                {"id": 2, "text": "drawbacks", "is_correct": False},
                {"id": 3, "text": "confusions", "is_correct": False},
                {"id": 4, "text": "silences", "is_correct": False}
            ],
            "correct_answer": "possibilities",
            "explanation": "'Possibilities' fits the positive context of learning a new language."
        },
        {
            "skill": "Voice & Pronunciation",
            "question_type": "voice_speaking",
            "prompt": "Speak the target sentence clearly into your microphone.",
            "passage": "Welcome to LingoPath AI. I am excited to practice speaking!",
            "highlight_word": "",
            "comfortable_bridges": {"Telugu": "ఈ వాక్యాన్ని బిగ్గరగా చదివి రికార్డ్ చేయండి:"},
            "options": [],
            "correct_answer": "Welcome to LingoPath AI. I am excited to practice speaking!",
            "explanation": "Focus on clear pronunciation and confident tone."
        },
        {
            "skill": "Grammar Basics",
            "question_type": "fill_blank",
            "prompt": "Choose the correct article for the sentence.",
            "passage": "He bought _____ apple from the market.",
            "highlight_word": "_____",
            "comfortable_bridges": {"Telugu": "సరైన ఆర్టికల్ ఎంచుకోండి:"},
            "options": [
                {"id": 1, "text": "a", "is_correct": False},
                {"id": 2, "text": "an", "is_correct": True},
                {"id": 3, "text": "the", "is_correct": False},
                {"id": 4, "text": "no article", "is_correct": False}
            ],
            "correct_answer": "an",
            "explanation": "Use 'an' before words starting with a vowel sound."
        },
        {
            "skill": "Sentence Structure",
            "question_type": "arrange_words",
            "prompt": "Arrange the following words to form a valid sentence.",
            "passage": "",
            "highlight_word": "",
            "comfortable_bridges": {"Telugu": "సక్రమమైన వాక్యం గా అమర్చండి:"},
            "options": [
                {"id": 1, "text": "She beautiful a is girl.", "is_correct": False},
                {"id": 2, "text": "A beautiful girl is she.", "is_correct": False},
                {"id": 3, "text": "She is a beautiful girl.", "is_correct": True},
                {"id": 4, "text": "Is she a beautiful girl.", "is_correct": False}
            ],
            "correct_answer": "She is a beautiful girl.",
            "explanation": "Subject + Verb + Article + Adjective + Noun is the correct pattern."
        },
        {
            "skill": "Vocabulary Understanding",
            "question_type": "match_words",
            "prompt": "Select the correct meaning for the word 'abundant'.",
            "passage": "",
            "highlight_word": "abundant",
            "comfortable_bridges": {"Telugu": "సరైన అర్థాన్ని ఎంచుకోండి:"},
            "options": [
                {"id": 1, "text": "Present in great quantity", "is_correct": True},
                {"id": 2, "text": "Extremely rare", "is_correct": False},
                {"id": 3, "text": "Hard to find", "is_correct": False},
                {"id": 4, "text": "Lacking completely", "is_correct": False}
            ],
            "correct_answer": "Present in great quantity",
            "explanation": "'Abundant' means existing or available in large quantities."
        },
        {
            "skill": "Reading Comprehension",
            "question_type": "reading_passage",
            "prompt": "What did the protagonist do after waking up?",
            "passage": "After he woke up, he brushed his teeth, drank some water, and went for a run in the park.",
            "highlight_word": "",
            "comfortable_bridges": {"Telugu": "అతను నిద్రలేచిన తరువాత ఏమి చేసాడు?"},
            "options": [
                {"id": 1, "text": "Ate breakfast", "is_correct": False},
                {"id": 2, "text": "Watched TV", "is_correct": False},
                {"id": 3, "text": "Brushed his teeth", "is_correct": True},
                {"id": 4, "text": "Went to work", "is_correct": False}
            ],
            "correct_answer": "Brushed his teeth",
            "explanation": "The passage clearly states 'brushed his teeth' as the first action after waking up."
        },
        {
            "skill": "Listening Comprehension",
            "question_type": "listening",
            "prompt": "Listen to the audio and select the appropriate response.",
            "passage": "Audio: How are you doing today?",
            "highlight_word": "",
            "comfortable_bridges": {"Telugu": "ఆడియో విని సరైన సమాధానం ఇవ్వండి:"},
            "options": [
                {"id": 1, "text": "I am doing well, thank you.", "is_correct": True},
                {"id": 2, "text": "My name is John.", "is_correct": False},
                {"id": 3, "text": "I live in London.", "is_correct": False},
                {"id": 4, "text": "It is raining outside.", "is_correct": False}
            ],
            "correct_answer": "I am doing well, thank you.",
            "explanation": "When asked 'How are you doing today?', a polite and typical answer is 'I am doing well'."
        }
    ]

    for q in questions_data:
        AssessmentQuestion.objects.get_or_create(prompt=q["prompt"], defaults=q)
    print(f"✅ Seeded {len(questions_data)} Assessment Questions.")

    # 4. Seed Learning Path Units & Nodes
    unit1, _ = LearningPathUnit.objects.get_or_create(
        unit_number=1,
        defaults={
            "title": "Unit 1: Foundation & Everyday Words",
            "description": "Master essential greetings, daily objects, and simple sentence structures",
            "color_theme": "brand"
        }
    )

    nodes_unit1 = [
        {"title": "Everyday Greetings", "subtitle": "Learn how to greet people naturally", "node_type": "reading", "order": 1, "xp_reward": 50},
        {"title": "Essential Vocabulary", "subtitle": "Match key words with visual contexts", "node_type": "vocabulary", "order": 2, "xp_reward": 50},
        {"title": "Audio Pronunciation", "subtitle": "Listen and recognize spoken phrases", "node_type": "listening", "order": 3, "xp_reward": 60},
        {"title": "First Speaking Steps", "subtitle": "Speak short greeting phrases aloud", "node_type": "speaking", "order": 4, "xp_reward": 75},
        {"title": "Unit 1 Milestone", "subtitle": "Comprehensive literacy progress check", "node_type": "milestone", "order": 5, "xp_reward": 100},
    ]

    for node in nodes_unit1:
        LessonNode.objects.get_or_create(unit=unit1, order=node["order"], defaults=node)

    unit2, _ = LearningPathUnit.objects.get_or_create(
        unit_number=2,
        defaults={
            "title": "Unit 2: Simple Sentence Building",
            "description": "Express needs, ask questions, and describe daily routines",
            "color_theme": "teal"
        }
    )

    nodes_unit2 = [
        {"title": "Describing Objects", "subtitle": "Form short descriptive phrases", "node_type": "reading", "order": 1, "xp_reward": 60},
        {"title": "Voice Practice", "subtitle": "Pronounce sentences clearly", "node_type": "speaking", "order": 2, "xp_reward": 70},
    ]

    for node in nodes_unit2:
        LessonNode.objects.get_or_create(unit=unit2, order=node["order"], defaults=node)

    print("✅ Seeded Learning Path Units & Lesson Nodes.")
    print("🎉 All LingoPath AI database tables seeded successfully!")

if __name__ == "__main__":
    seed_database()
