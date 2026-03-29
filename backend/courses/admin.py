from django.contrib import admin
from django.utils.html import format_html
from .models import CourseCategory, Course, CourseModule, CourseInstructor, CourseEnrollment


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'icon', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name_fr', 'name_ar']
    fields = ['name_fr', 'name_ar', 'description_fr', 'description_ar', 'icon']


class CourseModuleInline(admin.TabularInline):
    model = CourseModule
    extra = 1
    fields = ['title_fr', 'title_ar', 'duration_hours', 'order']


class CourseInstructorInline(admin.TabularInline):
    model = CourseInstructor
    extra = 1
    fields = ['name', 'title_fr', 'title_ar', 'email']
    ordering = ['name']



@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'title_fr', 
        'course_type',
        'category', 
        'level', 
        'duration_weeks', 
        'status', 
        'featured',
        'registration_open',
        'views_count',
        'created_at'
    ]
    list_filter = [
        'course_type',
        'status', 
        'level', 
        'category', 
        'featured', 
        'registration_open',
        'is_free',
        'created_at'
    ]
    search_fields = ['title_fr', 'title_ar', 'description_fr', 'description_ar']
    prepopulated_fields = {'slug': ('title_fr',)}
    readonly_fields = ['views_count', 'created_at', 'updated_at', 'created_by']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title_fr', 'title_ar', 'title_en', 'label', 'course_type', 'slug', 'category', 'status', 'featured')
        }),
        ('Descriptions', {
            'fields': ('description_fr', 'description_ar', 'description_en', 'content_fr', 'content_ar')
        }),
        ('Métadonnées du cours', {
            'fields': ('level', 'duration_weeks', 'duration_hours', 'max_students')
        }),
        ('Médias', {
            'fields': ('image', 'video_url')
        }),
        ('Prérequis et objectifs', {
            'fields': ('prerequisites_fr', 'prerequisites_ar', 'objectives_fr', 'objectives_ar'),
            'classes': ('collapse',)
        }),
        ('Inscription et prix', {
            'fields': ('is_free', 'price', 'registration_open', 'registration_deadline')
        }),
        ('Dates du cours', {
            'fields': ('start_date', 'end_date')
        }),
        ('Statistiques', {
            'fields': ('views_count', 'created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [CourseModuleInline, CourseInstructorInline]
    
    def save_model(self, request, obj, form, change):
        if not change:  # Si c'est un nouveau cours
            obj.created_by = request.user
        obj.save()

@admin.register(CourseModule)
class CourseModuleAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'course', 'duration_hours', 'order', 'created_at'
]
    list_filter = ['course', 'created_at']
    search_fields = ['title_fr', 'title_ar', 'course__title_fr']
    ordering = ['course', 'order']


@admin.register(CourseInstructor)
class CourseInstructorAdmin(admin.ModelAdmin):
    list_display = ['name', 'course', 'title_fr', 'email', 'created_at']
    list_filter = ['course', 'created_at']
    search_fields = ['name', 'title_fr', 'title_ar', 'email']
    
    def get_queryset(self, request):
        qs = self.model._default_manager.get_queryset()
        ordering = self.get_ordering(request)
        if ordering:
            qs = qs.order_by(*ordering)
        return qs.select_related('course')


@admin.register(CourseEnrollment)
class CourseEnrollmentAdmin(admin.ModelAdmin):
    list_display = [
        'student_name', 
        'student_email', 
        'course', 
        'status', 
        'enrolled_at'
    ]
    list_filter = ['status', 'course', 'enrolled_at']
    search_fields = ['student_name', 'student_email', 'course__title_fr']
    readonly_fields = ['enrolled_at', 'updated_at']

    fieldsets = (
        ('Informations de l\'étudiant', {
            'fields': ('student_name', 'student_email', 'student_phone')
        }),
        ('Cours et statut', {
            'fields': ('course', 'status')
        }),
        ('Motivation', {
            'fields': ('motivation',)
        }),
        ('Dates', {
            'fields': ('enrolled_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['approve_enrollments', 'reject_enrollments']

    def approve_enrollments(self, request, queryset):
        updated = queryset.update(status='approved')
        self.message_user(request, f'{updated} inscriptions approuvées.')
    approve_enrollments.short_description = "Approuver les inscriptions sélectionnées"
    
    def reject_enrollments(self, request, queryset):
        updated = queryset.update(status='rejected')
        self.message_user(request, f'{updated} inscriptions rejetées.')
    reject_enrollments.short_description = "Rejeter les inscriptions sélectionnées"
    
    def get_queryset(self, request):
        qs = self.model._default_manager.get_queryset()
        ordering = self.get_ordering(request)
        if ordering:
            qs = qs.order_by(*ordering)
        return qs.select_related('course')
