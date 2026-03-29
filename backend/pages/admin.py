from django.contrib import admin
from .models import Page


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title_fr', 'title_en', 'title_ar', 'updated_at')
    prepopulated_fields = {'slug': ('title_fr',)}
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('slug', 'title_fr', 'title_en', 'title_ar', 'featured_image')}),
        ('Content', {'fields': ('content_fr', 'content_en', 'content_ar')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')})
    )
