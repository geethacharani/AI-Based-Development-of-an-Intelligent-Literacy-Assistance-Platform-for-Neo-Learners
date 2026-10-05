from django.contrib import admin
from .models import Language

@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'native_name', 'flag_emoji', 'is_supported_native', 'is_supported_target')
    list_filter = ('is_supported_native', 'is_supported_target')
    search_fields = ('name', 'code', 'native_name')
