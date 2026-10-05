from django.db import models

class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    native_name = models.CharField(max_length=100)
    flag_emoji = models.CharField(max_length=10)
    is_supported_native = models.BooleanField(default=True)
    is_supported_target = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return f"{self.flag_emoji} {self.name} ({self.native_name})"
