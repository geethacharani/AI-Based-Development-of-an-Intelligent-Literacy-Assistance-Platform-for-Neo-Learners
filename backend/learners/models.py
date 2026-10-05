from django.db import models
from django.conf import settings
from languages.models import Language

class LearnerProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    full_name = models.CharField(max_length=255)
    age_group = models.CharField(max_length=50, default='26–40')
    qualification = models.CharField(max_length=100, blank=True, default='')
    comfortable_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='comfortable_learners'
    )
    target_language = models.ForeignKey(
        Language, on_delete=models.SET_NULL, null=True, related_name='target_learners'
    )
    learning_goals = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.full_name} ({self.user.email})"

class LearnerProficiency(models.Model):
    LEVEL_CHOICES = [
        ('Beginner', 'Beginner'),
        ('Basic', 'Basic'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    learner = models.OneToOneField(LearnerProfile, on_delete=models.CASCADE, related_name='proficiency')
    reading_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Intermediate')
    writing_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Beginner')
    vocabulary_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Advanced')
    speaking_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Basic')
    overall_level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='Basic')
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Proficiency: {self.learner.full_name}"

# Future Assessment & AI Performance Models
class Assessment(models.Model):
    learner = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name='assessments')
    skill = models.CharField(max_length=50)
    score = models.FloatField(default=0.0)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Assessment for {self.learner.full_name} ({self.skill})"

class AssessmentQuestion(models.Model):
    QUESTION_TYPES = [
        ('multiple_choice', 'Multiple Choice'),
        ('match_words', 'Match Words'),
        ('fill_blank', 'Fill in Blank'),
        ('arrange_words', 'Arrange Words'),
        ('reading_passage', 'Reading Passage Comprehension'),
        ('writing_response', 'Writing Response'),
        ('voice_speaking', 'Voice & Speaking Pronunciation'),
    ]

    skill = models.CharField(max_length=50) # Reading, Writing, Vocabulary, Speaking, Comprehension
    question_type = models.CharField(max_length=50, choices=QUESTION_TYPES, default='multiple_choice')
    prompt = models.CharField(max_length=255)
    passage = models.TextField(blank=True, default='')
    highlight_word = models.CharField(max_length=100, blank=True, default='')
    target_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, related_name='questions')
    comfortable_bridges = models.JSONField(default=dict, blank=True) # e.g. {"Telugu": "క్రింది పదానికి...", "Hindi": "..."}
    options = models.JSONField(default=list, blank=True)
    correct_answer = models.CharField(max_length=255)
    explanation = models.TextField(blank=True, default='')

    def __str__(self):
        return f"[{self.skill}] {self.prompt[:40]}"

class AssessmentAttempt(models.Model):
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='attempts')
    question = models.ForeignKey(AssessmentQuestion, on_delete=models.SET_NULL, null=True, related_name='attempts')
    answer = models.TextField()
    is_correct = models.BooleanField(default=False)
    time_taken = models.IntegerField(default=0) # in seconds
    attempt_number = models.IntegerField(default=1)

class LearnerPerformance(models.Model):
    learner = models.OneToOneField(LearnerProfile, on_delete=models.CASCADE, related_name='performance')
    accuracy = models.FloatField(default=0.0)
    repeated_mistakes = models.JSONField(default=list, blank=True)
    attempt_count = models.IntegerField(default=0)
    average_time = models.FloatField(default=0.0)
    reading_performance = models.FloatField(default=0.0)
    pronunciation_score = models.FloatField(default=0.0)
    vocabulary_performance = models.FloatField(default=0.0)
    writing_performance = models.FloatField(default=0.0)
    updated_at = models.DateTimeField(auto_now=True)

class AILearnerInsight(models.Model):
    learner = models.OneToOneField(LearnerProfile, on_delete=models.CASCADE, related_name='ai_insight')
    summary_headline = models.CharField(max_length=255, default="Personalized Literacy Diagnostic Complete")
    reading_summary = models.TextField(default="You recognize basic everyday words and simple sentences.")
    vocabulary_summary = models.TextField(default="Good understanding of common terms.")
    writing_summary = models.TextField(default="Capable of typing simple words, need practice with full sentences.")
    speaking_summary = models.TextField(default="Speaking is your main area of growth opportunity.")
    recommended_focus = models.CharField(max_length=255, default="Everyday conversations + sentence building")
    recommended_starting_point = models.CharField(max_length=255, default="Level 2 Reading & Level 1 Speaking")
    generated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"AI Insight for {self.learner.full_name}"

class LearningPathUnit(models.Model):
    unit_number = models.IntegerField(default=1)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    color_theme = models.CharField(max_length=50, default='brand') # brand, teal, purple, amber

    def __str__(self):
        return f"Unit {self.unit_number}: {self.title}"

class LessonNode(models.Model):
    NODE_TYPES = [
        ('reading', 'Reading Practice'),
        ('vocabulary', 'Vocabulary Match'),
        ('listening', 'Listening Practice'),
        ('speaking', 'Speaking Practice'),
        ('quiz', 'Knowledge Quiz'),
        ('milestone', 'Unit Milestone'),
    ]

    unit = models.ForeignKey(LearningPathUnit, on_delete=models.CASCADE, related_name='nodes')
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True, default='')
    node_type = models.CharField(max_length=50, choices=NODE_TYPES, default='reading')
    order = models.IntegerField(default=1)
    xp_reward = models.IntegerField(default=50)

    def __str__(self):
        return f"Node {self.order}: {self.title} ({self.node_type})"

class LearnerProgress(models.Model):
    learner = models.OneToOneField(LearnerProfile, on_delete=models.CASCADE, related_name='progress')
    xp_total = models.IntegerField(default=120)
    streak_count = models.IntegerField(default=3)
    completed_lessons = models.JSONField(default=list, blank=True) # list of node IDs
    unlocked_nodes = models.JSONField(default=list, blank=True)
    last_activity_date = models.DateField(auto_now=True)

    def __str__(self):
        return f"Progress: {self.learner.full_name} ({self.xp_total} XP, {self.streak_count} day streak)"

class LearnerGameProgress(models.Model):
    learner = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name='game_progresses')
    game_key = models.CharField(max_length=50) # language_train, word_runner, word_shooter, cooking_challenge, virtual_shop
    highest_score = models.IntegerField(default=0)
    level_unlocked = models.IntegerField(default=1)
    total_xp = models.IntegerField(default=0)
    total_played = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('learner', 'game_key')

    def __str__(self):
        return f"{self.learner.full_name} - {self.game_key} (Lvl {self.level_unlocked}, {self.highest_score} pts)"

class GameAttempt(models.Model):
    learner = models.ForeignKey(LearnerProfile, on_delete=models.CASCADE, related_name='game_attempts')
    game_key = models.CharField(max_length=50)
    target_language = models.ForeignKey(Language, on_delete=models.SET_NULL, null=True, blank=True)
    skill = models.CharField(max_length=100, default='General')
    level = models.IntegerField(default=1)
    score = models.IntegerField(default=0)
    xp_gained = models.IntegerField(default=0)
    correct_attempts = models.IntegerField(default=0)
    wrong_attempts = models.IntegerField(default=0)
    completed = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attempt: {self.learner.full_name} on {self.game_key} - Score: {self.score}"

