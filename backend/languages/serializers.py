from rest_framework import serializers
from .models import Language

class LanguageSerializer(serializers.ModelSerializer):
    nativeName = serializers.CharField(source='native_name')
    flagEmoji = serializers.CharField(source='flag_emoji')

    class Meta:
        model = Language
        fields = ['id', 'code', 'name', 'nativeName', 'flagEmoji', 'is_supported_native', 'is_supported_target']
