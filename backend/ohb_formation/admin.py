from django.contrib import admin
from .models import FormationCategory, Formation, FormationEnrollment


@admin.register(FormationCategory)
class FormationCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'icon', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name_fr', 'name_ar']
    ordering = ['name_fr']


@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'level', 'status', 'featured', 'created_at']
    list_filter = ['status', 'level', 'featured', 'category', 'created_at']
    search_fields = ['title_fr', 'title_ar', 'description_fr', 'description_ar']
    prepopulated_fields = {'slug': ('title_fr',)}
    list_editable = ['status', 'featured']
    ordering = ['-created_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title_fr', 'title_ar', 'slug', 'label', 'category')
        }),
        ('Descriptions', {
            'fields': ('description_fr', 'description_ar', 'content_fr', 'content_ar')
        }),
        ('Objectifs et prérequis', {
            'fields': ('objectives_fr', 'objectives_ar', 'prerequisites_fr', 'prerequisites_ar', 'target_audience_fr', 'target_audience_ar')
        }),
        ('Lieu et organisation', {
            'fields': ('location_fr', 'location_ar', 'teaching_methods_fr', 'teaching_methods_ar', 'daily_organization_fr', 'daily_organization_ar', 'daily_program_fr', 'daily_program_ar')
        }),
        ('Détails', {
            'fields': ('level', 'duration_weeks', 'duration_hours', 'max_students')
        }),
        ('Médias', {
            'fields': ('image', 'pdf_file', 'brochure_pdf')
        }),
        ('Inscriptions', {
            'fields': ('registration_open', 'start_date', 'end_date')
        }),
        ('Statut', {
            'fields': ('status', 'featured', 'views_count')
        }),
    )


@admin.register(FormationEnrollment)
class FormationEnrollmentAdmin(admin.ModelAdmin):
    list_display = ['student_name', 'formation', 'student_email', 'status', 'enrolled_at']
    list_filter = ['status', 'enrolled_at']
    search_fields = ['student_name', 'student_email', 'formation__title_fr']
    ordering = ['-enrolled_at']
