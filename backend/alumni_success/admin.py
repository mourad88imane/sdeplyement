from django.contrib import admin
from django.utils.html import format_html
from .models import AlumniSuccess, AlumniPhoto


class AlumniPhotoInline(admin.TabularInline):
    model = AlumniPhoto
    extra = 1
    fields = ('image', 'legend_fr', 'legend_ar', 'legend_en', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(AlumniSuccess)
class AlumniSuccessAdmin(admin.ModelAdmin):
    list_display = ('name_fr', 'title_fr', 'created_at', 'photo_tag')
    search_fields = (
        'name_fr', 'name_ar', 'name_en',
        'title_fr', 'title_ar', 'title_en',
        'story_fr', 'story_ar', 'story_en',
    )
    readonly_fields = ('photo_tag', 'created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': (
                'photo', 'photo_tag',
                ('name_fr', 'name_ar', 'name_en'),
                ('title_fr', 'title_ar', 'title_en'),
                ('story_fr', 'story_ar', 'story_en'),
            )
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )
    inlines = [AlumniPhotoInline]

    @admin.display(description='Photo')
    def photo_tag(self, obj):
        if obj.photo:
            return format_html(
                '<img src="{}" width="60" height="60" '
                'style="object-fit:cover;border-radius:50%" />',
                obj.photo.url,
            )
        return "—"


@admin.register(AlumniPhoto)
class AlumniPhotoAdmin(admin.ModelAdmin):
    list_display = ('alumni', 'legend_fr', 'uploaded_at', 'image_tag')
    search_fields = ('legend_fr', 'legend_ar', 'legend_en', 'alumni__name_fr')
    readonly_fields = ('uploaded_at', 'image_tag')
    fields = ('alumni', 'image', 'image_tag', 'legend_fr', 'legend_ar', 'legend_en', 'uploaded_at')

    @admin.display(description='Aperçu')
    def image_tag(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="80" height="60" '
                'style="object-fit:cover;border-radius:4px" />',
                obj.image.url,
            )
        return "—"
