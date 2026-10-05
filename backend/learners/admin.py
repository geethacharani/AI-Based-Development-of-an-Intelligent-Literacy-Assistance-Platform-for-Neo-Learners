from django.contrib import admin
from .models import (
    LearnerProfile,
    LearnerProficiency,
    Assessment,
    AssessmentQuestion,
    AssessmentAttempt,
    AILearnerInsight,
    LearningPathUnit,
    LessonNode,
    LearnerProgress,
    LearnerGameProgress,
    GameAttempt
)

@admin.register(LearnerProfile)
class LearnerProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'full_name', 'user', 'age_group', 'comfortable_language', 'target_language', 'created_at')
    list_filter = ('age_group', 'comfortable_language', 'target_language')
    search_fields = ('full_name', 'user__email')

@admin.register(LearnerProficiency)
class LearnerProficiencyAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'reading_level', 'writing_level', 'vocabulary_level', 'speaking_level', 'overall_level')
    list_filter = ('reading_level', 'writing_level', 'overall_level')
    search_fields = ('learner__full_name',)

@admin.register(Assessment)
class AssessmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'skill', 'score', 'started_at', 'completed_at')
    list_filter = ('skill', 'started_at')
    search_fields = ('learner__full_name', 'skill')

@admin.register(AssessmentQuestion)
class AssessmentQuestionAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill', 'question_type', 'prompt', 'correct_answer')
    list_filter = ('skill', 'question_type')
    search_fields = ('prompt', 'passage', 'highlight_word', 'correct_answer')

@admin.register(AssessmentAttempt)
class AssessmentAttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'assessment', 'question', 'is_correct', 'time_taken', 'attempt_number')
    list_filter = ('is_correct', 'attempt_number')

@admin.register(AILearnerInsight)
class AILearnerInsightAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'summary_headline', 'recommended_focus', 'generated_at')
    search_fields = ('learner__full_name', 'summary_headline')

class LessonNodeInline(admin.TabularInline):
    model = LessonNode
    extra = 1

@admin.register(LearningPathUnit)
class LearningPathUnitAdmin(admin.ModelAdmin):
    list_display = ('id', 'unit_number', 'title', 'color_theme')
    inlines = [LessonNodeInline]

@admin.register(LessonNode)
class LessonNodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'unit', 'title', 'node_type', 'order', 'xp_reward')
    list_filter = ('unit', 'node_type')
    search_fields = ('title', 'subtitle')

@admin.register(LearnerProgress)
class LearnerProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'xp_total', 'streak_count', 'last_activity_date')
    search_fields = ('learner__full_name',)

@admin.register(LearnerGameProgress)
class LearnerGameProgressAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'game_key', 'highest_score', 'level_unlocked', 'total_xp', 'total_played', 'updated_at')
    list_filter = ('game_key', 'level_unlocked')
    search_fields = ('learner__full_name', 'game_key')

@admin.register(GameAttempt)
class GameAttemptAdmin(admin.ModelAdmin):
    list_display = ('id', 'learner', 'game_key', 'level', 'score', 'xp_gained', 'correct_attempts', 'wrong_attempts', 'completed', 'created_at')
    list_filter = ('game_key', 'completed', 'target_language')
    search_fields = ('learner__full_name', 'game_key')

