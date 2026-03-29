from django.contrib import admin
from .models import Banner

@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('text1_fr', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('text1_fr', 'text1_en', 'text1_ar', 'text2_fr', 'text2_en', 'text2_ar')
