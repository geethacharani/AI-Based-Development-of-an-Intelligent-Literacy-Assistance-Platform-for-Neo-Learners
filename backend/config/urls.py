from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "status": "online",
        "service": "LingoPath AI REST API",
        "version": "1.0.0",
        "endpoints": {
            "auth_register": "/api/auth/register/",
            "auth_login": "/api/auth/login/",
            "languages": "/api/languages/",
            "profile": "/api/profile/",
            "proficiency": "/api/proficiency/",
            "assessment_questions": "/api/assessment/questions/",
            "assessment_submit": "/api/assessment/submit/",
            "insights": "/api/insights/",
            "learning_path": "/api/learning-path/",
            "lesson_submit": "/api/lessons/submit/",
            "voice_analyze": "/api/voice/analyze/",
            "leaderboard": "/api/leaderboard/",
            "admin": "/admin/"
        },
        "frontend_url": "http://localhost:5173"
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('learners.urls')),
    path('api/languages/', include('languages.urls')),
]
