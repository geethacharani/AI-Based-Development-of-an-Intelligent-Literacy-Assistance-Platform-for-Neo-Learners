import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from languages.models import Language

LANGUAGES = [
    {'code': 'en', 'name': 'English', 'native_name': 'English', 'flag_emoji': '🇬🇧'},
    {'code': 'te', 'name': 'Telugu', 'native_name': 'తెలుగు', 'flag_emoji': '🇮🇳'},
    {'code': 'hi', 'name': 'Hindi', 'native_name': 'हिन्दी', 'flag_emoji': '🇮🇳'},
    {'code': 'ta', 'name': 'Tamil', 'native_name': 'தமிழ்', 'flag_emoji': '🇮🇳'},
    {'code': 'kn', 'name': 'Kannada', 'native_name': 'കന്നഡ / ಕನ್ನಡ', 'flag_emoji': '🇮🇳'},
    {'code': 'ml', 'name': 'Malayalam', 'native_name': 'മലയാളം', 'flag_emoji': '🇮🇳'},
]

def seed():
    for item in LANGUAGES:
        lang, created = Language.objects.get_or_create(
            code=item['code'],
            defaults={
                'name': item['name'],
                'native_name': item['native_name'],
                'flag_emoji': item['flag_emoji'],
            }
        )
        if created:
            print(f"Created language: {lang}")
        else:
            print(f"Language already exists: {lang}")

if __name__ == '__main__':
    seed()
