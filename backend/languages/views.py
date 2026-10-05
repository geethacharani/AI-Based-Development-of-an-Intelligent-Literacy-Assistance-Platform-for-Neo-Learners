from rest_framework import generics, permissions
from .models import Language
from .serializers import LanguageSerializer

class LanguageListView(generics.ListAPIView):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer
    permission_classes = [permissions.AllowAny]
