from rest_framework import serializers
from languages.serializers import LanguageSerializer
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

class LearnerProficiencySerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProficiency
        fields = ['reading_level', 'writing_level', 'vocabulary_level', 'speaking_level', 'overall_level', 'updated_at']

class LearnerProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    comfortable_language = LanguageSerializer(read_only=True)
    target_language = LanguageSerializer(read_only=True)
    proficiency = LearnerProficiencySerializer(read_only=True)

    class Meta:
        model = LearnerProfile
        fields = [
            'id',
            'full_name',
            'email',
            'age_group',
            'qualification',
            'comfortable_language',
            'target_language',
            'learning_goals',
            'proficiency',
            'created_at',
            'updated_at',
        ]

class AssessmentQuestionSerializer(serializers.ModelSerializer):
    target_language = LanguageSerializer(read_only=True)

    class Meta:
        model = AssessmentQuestion
        fields = [
            'id',
            'skill',
            'question_type',
            'prompt',
            'passage',
            'highlight_word',
            'target_language',
            'comfortable_bridges',
            'options',
            'correct_answer',
            'explanation',
        ]

class AssessmentAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentAttempt
        fields = ['id', 'assessment', 'question', 'answer', 'is_correct', 'time_taken', 'attempt_number']

class AILearnerInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AILearnerInsight
        fields = [
            'summary_headline',
            'reading_summary',
            'vocabulary_summary',
            'writing_summary',
            'speaking_summary',
            'recommended_focus',
            'recommended_starting_point',
            'generated_at',
        ]

class LessonNodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonNode
        fields = ['id', 'title', 'subtitle', 'node_type', 'order', 'xp_reward']

class LearningPathUnitSerializer(serializers.ModelSerializer):
    nodes = LessonNodeSerializer(many=True, read_only=True)

    class Meta:
        model = LearningPathUnit
        fields = ['id', 'unit_number', 'title', 'description', 'color_theme', 'nodes']

class LearnerProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProgress
        fields = ['xp_total', 'streak_count', 'completed_lessons', 'unlocked_nodes', 'last_activity_date']

class LearnerGameProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerGameProgress
        fields = ['game_key', 'highest_score', 'level_unlocked', 'total_xp', 'total_played', 'updated_at']

class GameAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameAttempt
        fields = ['id', 'game_key', 'target_language', 'skill', 'level', 'score', 'xp_gained', 'correct_attempts', 'wrong_attempts', 'completed', 'created_at']

