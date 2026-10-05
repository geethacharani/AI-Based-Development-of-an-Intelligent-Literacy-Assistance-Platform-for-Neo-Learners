from django.test import TestCase
from rest_framework.test import APIClient
from learners.models import Language, LearnerProfile, LearnerProficiency, AILearnerInsight, LearningPathUnit, LessonNode

class LearnerE2ETestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Seed test languages
        self.lang_te = Language.objects.create(id='lang_te', code='te', name='Telugu', native_name='తెలుగు', flag_emoji='🇮🇳')
        self.lang_hi = Language.objects.create(id='lang_hi', code='hi', name='Hindi', native_name='हिंदी', flag_emoji='🇮🇳')
        self.lang_en = Language.objects.create(id='lang_en', code='en', name='English', native_name='English', flag_emoji='🇬🇧')

        # Seed sample unit
        self.unit = LearningPathUnit.objects.create(
            id='u1', unit_number=1, title='Foundation Unit', description='Basics', color_theme='brand', target_language=self.lang_hi
        )
        self.node = LessonNode.objects.create(
            id='n1', unit=self.unit, title='Greetings', subtitle='Hello', node_type='reading', order=1, xp_reward=50, status='unlocked'
        )

    def test_learner_registration_and_assessment_flow(self):
        # 1. Register Learner 1 (Telugu support, learning Hindi)
        reg_payload = {
            "full_name": "Ravi Kumar",
            "email": "ravi@example.com",
            "password": "Password123!",
            "age_group": "26–40",
            "qualification": "Secondary School",
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

        res_reg = self.client.post('/api/auth/register/', reg_payload, format='json')
        self.assertEqual(res_reg.status_code, 201)
        self.assertIn('token', res_reg.data)
        token = res_reg.data['token']
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)

        # 2. Check profile qualification
        profile = LearnerProfile.objects.get(user__email="ravi@example.com")
        self.assertEqual(profile.qualification, "Secondary School")
        self.assertEqual(profile.comfortable_language.code, "te")
        self.assertEqual(profile.target_language.code, "hi")

        # 3. Get Diagnostic Assessment Questions
        res_q = self.client.get('/api/assessment/questions/')
        self.assertEqual(res_q.status_code, 200)
        self.assertTrue(len(res_q.data['questions']) > 0)
        # Verify comfortable language bridge support
        first_q = res_q.data['questions'][0]
        self.assertIsNotNone(first_q.get('comfortable_bridge'))

        # 4. Submit Assessment
        res_sub = self.client.post('/api/assessment/submit/', {"answers": {first_q['id']: {"option_id": 1, "is_correct": True}}}, format='json')
        self.assertEqual(res_sub.status_code, 200)
        self.assertIn('insight', res_sub.data)

        # 5. Get Learning Path
        res_lp = self.client.get('/api/learning-path/')
        self.assertEqual(res_lp.status_code, 200)
        self.assertTrue(len(res_lp.data['units']) > 0)
