from django.urls import path
from .views import (
    LearnerProfileView,
    LearnerProficiencyView,
    AssessmentQuestionsView,
    AssessmentSubmitView,
    AILearnerInsightView,
    LearningPathView,
    LessonSubmitView,
    VoiceAnalyzeView,
    LeaderboardView,
    GameProgressView,
    GameSubmitView,
    GameContentView
)

from .admin_views import (
    AdminOverviewView,
    AdminLearnerListView,
    AdminLearnerDetailView,
    AdminLearnerActionView,
    AdminAssessmentQuestionsView,
    AdminAssessmentQuestionDetailView,
    AdminAssessmentResultsView,
    AdminLanguagesView,
    AdminLanguageDetailView,
    AdminLearningPathsView,
    AdminLearningPathDetailView,
    AdminLessonsView,
    AdminLessonDetailView,
    AdminGamesView,
    AdminGameActionView,
    AdminProgressMonitoringView,
    AdminReportsView,
)

from .new_features_views import (
    AITeacherChatView,
    RealLifeMissionsView,
    RealLifeMissionSubmitView,
    ImageLearnOCRView,
    ReadingLibraryView,
    DailyAIChallengeView,
    DailyAIChallengeSubmitView,
    SmartMistakeReviewView,
    SmartMistakeRetryView,
    RealLifeLiveTranslateView,
    RealLifeLiveExplainView
)

urlpatterns = [
    path('profile/', LearnerProfileView.as_view(), name='learner-profile'),
    path('proficiency/', LearnerProficiencyView.as_view(), name='learner-proficiency'),
    path('assessment/questions/', AssessmentQuestionsView.as_view(), name='assessment-questions'),
    path('assessment/submit/', AssessmentSubmitView.as_view(), name='assessment-submit'),
    path('insights/', AILearnerInsightView.as_view(), name='ai-insights'),
    path('learning-path/', LearningPathView.as_view(), name='learning-path'),
    path('lessons/submit/', LessonSubmitView.as_view(), name='lesson-submit'),
    path('voice/analyze/', VoiceAnalyzeView.as_view(), name='voice-analyze'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard'),
    path('games/content/', GameContentView.as_view(), name='game-content'),
    path('games/submit/', GameSubmitView.as_view(), name='game-submit'),
    path('games/progress/', GameProgressView.as_view(), name='game-progress'),

    # Admin Endpoints
    path('admin/overview/', AdminOverviewView.as_view(), name='admin-overview'),
    path('admin/learners/', AdminLearnerListView.as_view(), name='admin-learners-list'),
    path('admin/learners/<int:pk>/', AdminLearnerDetailView.as_view(), name='admin-learner-detail'),
    path('admin/learners/<int:pk>/<str:action>/', AdminLearnerActionView.as_view(), name='admin-learner-action'),
    path('admin/assessments/questions/', AdminAssessmentQuestionsView.as_view(), name='admin-assessment-questions'),
    path('admin/assessments/questions/<int:pk>/', AdminAssessmentQuestionDetailView.as_view(), name='admin-assessment-question-detail'),
    path('admin/assessments/results/', AdminAssessmentResultsView.as_view(), name='admin-assessment-results'),
    path('admin/assessments/results/<int:pk>/', AdminAssessmentResultsView.as_view(), name='admin-assessment-results-detail'),
    path('admin/languages/', AdminLanguagesView.as_view(), name='admin-languages'),
    path('admin/languages/<int:pk>/', AdminLanguageDetailView.as_view(), name='admin-language-detail'),
    path('admin/learning-paths/', AdminLearningPathsView.as_view(), name='admin-learning-paths'),
    path('admin/learning-paths/<int:learner_id>/', AdminLearningPathDetailView.as_view(), name='admin-learning-path-detail'),
    path('admin/learning-paths/<int:learner_id>/<str:action>/', AdminLearningPathDetailView.as_view(), name='admin-learning-path-action'),
    path('admin/lessons/', AdminLessonsView.as_view(), name='admin-lessons'),
    path('admin/lessons/<int:pk>/', AdminLessonDetailView.as_view(), name='admin-lesson-detail'),
    path('admin/games/', AdminGamesView.as_view(), name='admin-games'),
    path('admin/games/<str:game_key>/<str:action>/', AdminGameActionView.as_view(), name='admin-game-action'),
    path('admin/progress-monitoring/', AdminProgressMonitoringView.as_view(), name='admin-progress-monitoring'),
    path('admin/reports/', AdminReportsView.as_view(), name='admin-reports'),

    # 6 New Feature Endpoints
    path('ai-teacher/chat/', AITeacherChatView.as_view(), name='ai-teacher-chat'),
    path('ai/chat/', AITeacherChatView.as_view(), name='ai-chat'),
    path('missions/', RealLifeMissionsView.as_view(), name='missions-list'),
    path('missions/submit/', RealLifeMissionSubmitView.as_view(), name='missions-submit'),
    path('missions/translate-live/', RealLifeLiveTranslateView.as_view(), name='missions-translate-live'),
    path('missions/explain-live/', RealLifeLiveExplainView.as_view(), name='missions-explain-live'),
    path('ocr/analyze/', ImageLearnOCRView.as_view(), name='ocr-analyze'),
    path('reading-library/', ReadingLibraryView.as_view(), name='reading-library'),
    path('daily-challenge/', DailyAIChallengeView.as_view(), name='daily-challenge'),
    path('daily-challenge/submit/', DailyAIChallengeSubmitView.as_view(), name='daily-challenge-submit'),
    path('mistake-review/', SmartMistakeReviewView.as_view(), name='mistake-review'),
    path('mistake-review/retry/', SmartMistakeRetryView.as_view(), name='mistake-review-retry'),
]


