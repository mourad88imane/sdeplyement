from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html
from .models import User, UserProfile


class UserProfileInline(admin.StackedInline):
    """Inline pour le profil utilisateur"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = [
        'phone', 'address', 'birth_date', 'gender', 'bio',
        'avatar', 'website', 'occupation', 'organization',
        'student_id', 'employee_id', 'language_preference',
        'timezone', 'receive_notifications', 'receive_newsletter'
    ]


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Administration des utilisateurs"""
    inlines = [UserProfileInline]
    
    list_display = [
        'username', 'email', 'full_name', 'is_active', 
        'is_staff', 'is_verified', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'is_superuser', 'is_verified',
        'date_joined', 'last_login'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {
            'fields': ('username', 'password')
        }),
        (_('Personal info'), {
            'fields': ('first_name', 'last_name', 'email')
        }),
        (_('Permissions'), {
            'fields': (
                'is_active', 'is_staff', 'is_superuser', 'is_verified',
                'groups', 'user_permissions'
            ),
        }),
        (_('Important dates'), {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username', 'email', 'first_name', 'last_name',
                'password1', 'password2'
            ),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Nom complet'


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Administration des profils utilisateur"""
    
    list_display = [
        'user', 'phone', 'organization', 'language_preference',
        'receive_notifications', 'created_at'
    ]
    list_filter = [
        'gender', 'language_preference', 'receive_notifications',
        'receive_newsletter', 'created_at'
    ]
    search_fields = [
        'user__username', 'user__email', 'user__first_name', 
        'user__last_name', 'phone', 'organization'
    ]
    ordering = ['-created_at']
    
    fieldsets = (
        (_('User'), {
            'fields': ('user',)
        }),
        (_('Contact Information'), {
            'fields': ('phone', 'address', 'website')
        }),
        (_('Personal Information'), {
            'fields': ('birth_date', 'gender', 'bio', 'avatar')
        }),
        (_('Professional Information'), {
            'fields': ('occupation', 'organization', 'student_id', 'employee_id')
        }),
        (_('Preferences'), {
            'fields': (
                'language_preference', 'timezone',
                'receive_notifications', 'receive_newsletter'
            )
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def avatar_preview(self, obj):
        """Aperçu de l'avatar dans l'admin"""
        if obj.avatar:
            return format_html(
                '<img src="{}" width="50" height="50" style="border-radius: 50%;" />',
                obj.avatar.url
            )
        return "Pas d'avatar"
    avatar_preview.short_description = 'Avatar'
    
    # Ajouter l'aperçu de l'avatar à la liste d'affichage
    list_display.insert(1, 'avatar_preview')


# Configuration de l'admin site
admin.site.site_header = "Administration ENT"
admin.site.site_title = "ENT Admin"
admin.site.index_title = "Bienvenue dans l'administration ENT"
