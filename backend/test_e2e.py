import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(backend_dir)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

import django
django.setup()

from django.contrib.auth import get_user_model
from learners.models import Language, LearnerProfile, LearnerProficiency, AILearnerInsight, LearningPathUnit, LessonNode
from rest_framework.test import APIClient

User = get_user_model()

def run_tests():
    print("🚀 Running E2E Verification Tests for LingoPath AI...")
    client = APIClient()

    # 1. Test Learner 1: Telugu support, learning Hindi (Beginner)
    print("\n--- Testing Learner 1: Telugu support language -> Hindi target language (Beginner) ---")
    reg_data_1 = {
        "full_name": "Ravi Kumar (Telugu-Hindi Learner)",
        "email": "ravi.telugu@example.com",
        "password": "Password123!",
        "age_group": "26–40",
        "qualification": "High School",
        "comfortable_language_id": "lang_te",
        "target_language_id": "lang_hi",
        "learning_goals": ["Reading", "Speaking"],
        "proficiency": {
            "reading_level": "Beginner",
            "writing_level": "Beginner",
            "vocabulary_level": "Beginner",
            "speaking_level": "Beginner"
        }
    }

    res_reg1 = client.post('/api/auth/register/', reg_data_1, format='json')
    print("Registration Response Code:", res_reg1.status_code)
    assert res_reg1.status_code == 201, f"Failed registration: {res_reg1.data}"
    token1 = res_reg1.data['token']
    client.credentials(HTTP_AUTHORIZATION='Token ' + token1)

    # Fetch assessment questions
    res_q1 = client.get('/api/assessment/questions/')
    print("Assessment Questions Count:", len(res_q1.data['questions']))
    print("First Question Prompt:", res_q1.data['questions'][0]['prompt'])
    print("First Question Support Bridge:", res_q1.data['questions'][0].get('comfortable_bridge'))
    assert len(res_q1.data['questions']) > 0

    # Submit assessment answers
    submit_data_1 = {
        "answers": {
            res_q1.data['questions'][0]['id']: {"option_id": 1, "is_correct": True}
        }
    }
    res_sub1 = client.post('/api/assessment/submit/', submit_data_1, format='json')
    print("Submit Assessment Response:", res_sub1.data['accuracy'], "% accuracy")
    print("AI Insight Summary:", res_sub1.data['insight']['summary_headline'])

    # Fetch personalized learning path
    res_path1 = client.get('/api/learning-path/')
    print("Personalized Learning Path Units:", len(res_path1.data['units']))
    print("Unit 1 Title:", res_path1.data['units'][0]['title'])
    print("Unit 1 First Node:", res_path1.data['units'][0]['nodes'][0]['title'])

    # 2. Test Learner 2: Hindi support, learning English (Advanced)
    print("\n--- Testing Learner 2: Hindi support language -> English target language (Advanced) ---")
    client.credentials() # clear credentials
    reg_data_2 = {
        "full_name": "Priya Sharma (Hindi-English Learner)",
        "email": "priya.hindi@example.com",
        "password": "Password123!",
        "age_group": "18–25",
        "qualification": "College / Graduate",
        "comfortable_language_id": "lang_hi",
        "target_language_id": "lang_en",
        "learning_goals": ["Speaking", "Vocabulary"],
        "proficiency": {
            "reading_level": "Advanced",
            "writing_level": "Advanced",
            "vocabulary_level": "Advanced",
            "speaking_level": "Intermediate"
        }
    }

    res_reg2 = client.post('/api/auth/register/', reg_data_2, format='json')
    print("Registration Response Code:", res_reg2.status_code)
    assert res_reg2.status_code == 201, f"Failed registration: {res_reg2.data}"
    token2 = res_reg2.data['token']
    client.credentials(HTTP_AUTHORIZATION='Token ' + token2)

    # Fetch assessment questions
    res_q2 = client.get('/api/assessment/questions/')
    print("Assessment Questions Count:", len(res_q2.data['questions']))
    print("First Question Prompt:", res_q2.data['questions'][0]['prompt'])
    print("First Question Support Bridge:", res_q2.data['questions'][0].get('comfortable_bridge'))

    # Fetch personalized learning path for Learner 2
    res_path2 = client.get('/api/learning-path/')
    print("Personalized Learning Path Units:", len(res_path2.data['units']))
    print("Unit 1 Title:", res_path2.data['units'][0]['title'])

    print("\n🎉 ALL END-TO-END TESTS PASSED SUCCESSFULLY!")

if __name__ == '__main__':
    run_tests()
