from rest_framework import serializers, status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'is_staff', 'is_superuser', 'is_active', 'date_joined']
        read_only_fields = ['id', 'date_joined']

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    age_group = serializers.CharField(max_length=50, required=False, default='26–40', allow_blank=True, allow_null=True)
    qualification = serializers.CharField(max_length=100, required=False, default='High School / Bachelor', allow_blank=True, allow_null=True)
    comfortable_language_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    target_language_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    learning_goals = serializers.ListField(child=serializers.CharField(), required=False)
    proficiency = serializers.DictField(required=False)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        user = User.objects.create_user(
            email=data['email'],
            username=data['email'],
            password=data['password'],
            full_name=data['full_name'],
        )

        token, _ = Token.objects.get_or_create(user=user)

        from learners.models import LearnerProfile, LearnerProficiency
        from languages.models import Language

        def get_language(lang_val):
            if not lang_val:
                return None
            val_str = str(lang_val)
            if val_str.isdigit():
                lang = Language.objects.filter(id=int(val_str)).first()
                if lang:
                    return lang
            clean_code = val_str.replace('lang_', '')
            return (
                Language.objects.filter(code__iexact=clean_code).first() or
                Language.objects.filter(name__iexact=val_str).first()
            )

        comf_lang = get_language(data.get('comfortable_language_id'))
        if not comf_lang:
            comf_lang, _ = Language.objects.get_or_create(code='te', defaults={'name': 'Telugu', 'native_name': 'తెలుగు', 'flag_emoji': '🇮🇳'})

        target_lang = get_language(data.get('target_language_id'))
        if not target_lang:
            target_lang, _ = Language.objects.get_or_create(code='en', defaults={'name': 'English', 'native_name': 'English', 'flag_emoji': '🇬🇧'})

        profile = LearnerProfile.objects.create(
            user=user,
            full_name=user.full_name,
            age_group=data.get('age_group', '26–40'),
            qualification=data.get('qualification', 'Bachelor\'s'),
            comfortable_language=comf_lang,
            target_language=target_lang,
            learning_goals=data.get('learning_goals', ['Reading', 'Speaking']),
        )

        prof_data = data.get('proficiency', {})
        LearnerProficiency.objects.create(
            learner=profile,
            reading_level=prof_data.get('reading_level', 'Intermediate'),
            writing_level=prof_data.get('writing_level', 'Beginner'),
            vocabulary_level=prof_data.get('vocabulary_level', 'Advanced'),
            speaking_level=prof_data.get('speaking_level', 'Basic'),
        )

        from learners.serializers import LearnerProfileSerializer
        profile_serialized = LearnerProfileSerializer(profile).data

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'profile': profile_serialized,
        }, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({'detail': 'Invalid email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)

        from learners.models import LearnerProfile
        from learners.serializers import LearnerProfileSerializer
        profile = LearnerProfile.objects.filter(user=user).first()
        profile_data = LearnerProfileSerializer(profile).data if profile else None

        return Response({
            'token': token.key,
            'user': UserSerializer(user).data,
            'profile': profile_data,
        })

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            request.user.auth_token.delete()
        except Exception:
            pass
        return Response({'message': 'Logged out successfully.'})

class UserMeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
