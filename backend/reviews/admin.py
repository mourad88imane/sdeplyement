from django.contrib import admin
from django.utils.html import format_html
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('reviewer_name_fr', 'reviewer_type', 'rating', 'created_at', 'photo_tag')
    search_fields = ('reviewer_name_fr', 'reviewer_name_ar', 'reviewer_name_en', 'content_fr', 'content_ar', 'content_en')
    list_filter = ('reviewer_type', 'rating', 'created_at')
    readonly_fields = ('photo_tag', 'created_at', 'updated_at')

    fieldsets = (
        (None, {
            'fields': (
                'reviewer_type', 'rating', 'photo', 'photo_tag',
                ('reviewer_name_fr', 'reviewer_name_ar', 'reviewer_name_en'),
                ('content_fr', 'content_ar', 'content_en'),
            )
        }),
        ('Dates', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )

    def photo_tag(self, obj):
        if obj.photo:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover;border-radius:50%" />', obj.photo.url)
        return ""
    photo_tag.short_description = 'Photo'
