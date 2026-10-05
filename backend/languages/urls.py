from django.urls import path
from .views import LanguageListView

urlpatterns = [
    path('', LanguageListView.as_view(), name='language-list'),
]
