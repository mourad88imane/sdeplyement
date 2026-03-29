from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from django.utils.html import format_html
from django.utils import timezone
from .models import UserProfile, UserActivity, UserNotification, UserSession, AdminUserMessage, EmailTemplate, EmailLog, TeamMember

User = get_user_model()



# Inline pour le profil utilisateur
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profil'
    fields = [
        'user_type', 'student_id', 'employee_id',
        'phone', 'address', 'city', 'postal_code', 'country',
        'birth_date', 'gender', 'nationality',
        'department', 'specialization', 'academic_year', 'enrollment_date',
        'avatar', 'preferred_language', 'receive_notifications', 'receive_newsletter',
        'is_verified', 'is_active_student'
    ]


# Étendre l'admin User existant
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = [
        'username', 'email', 'first_name', 'last_name',
        'get_user_type', 'get_phone', 'is_active', 'date_joined'
    ]
    list_filter = BaseUserAdmin.list_filter + ('user_profile_extended__user_type', 'user_profile_extended__is_verified')
    
    def get_user_type(self, obj):
        try:
            return obj.user_profile_extended.get_user_type_display()
        except UserProfile.DoesNotExist:
            return 'Non défini'
    get_user_type.short_description = 'Type d\'utilisateur'
    
    def get_phone(self, obj):
        try:
            return obj.user_profile_extended.phone or '-'
        except UserProfile.DoesNotExist:
            return '-'
    get_phone.short_description = 'Téléphone'

    def get_inlines(self, request, obj=None):
        if not obj:
            return []
        return self.inlines



# Réenregistrer UserAdmin
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass  # Le modèle User par défaut n'est pas enregistré
admin.site.register(User, UserAdmin)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'user_type', 'student_id', 'employee_id',
        'phone', 'department', 'is_verified', 'created_at'
    ]
    list_filter = [
        'user_type', 'is_verified', 'is_active_student',
        'preferred_language', 'gender', 'department', 'created_at'
    ]
    search_fields = [
        'user__username', 'user__first_name', 'user__last_name',
        'user__email', 'student_id', 'employee_id', 'phone'
    ]
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Utilisateur', {
            'fields': ('user', 'user_type', 'student_id', 'employee_id')
        }),
        ('Contact', {
            'fields': ('phone', 'address', 'city', 'postal_code', 'country')
        }),
        ('Informations personnelles', {
            'fields': ('birth_date', 'gender', 'nationality', 'avatar')
        }),
        ('Académique/Professionnel', {
            'fields': ('department', 'specialization', 'academic_year', 'enrollment_date')
        }),
        ('Préférences', {
            'fields': ('preferred_language', 'receive_notifications', 'receive_newsletter')
        }),
        ('Statut', {
            'fields': ('is_verified', 'is_active_student')
        }),
        ('Audit', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['verify_users', 'unverify_users', 'activate_students', 'deactivate_students']
    
    def verify_users(self, request, queryset):
        updated = queryset.update(is_verified=True)
        self.message_user(request, f'{updated} utilisateurs vérifiés.')
    verify_users.short_description = "Vérifier les utilisateurs sélectionnés"
    
    def unverify_users(self, request, queryset):
        updated = queryset.update(is_verified=False)
        self.message_user(request, f'{updated} utilisateurs non vérifiés.')
    unverify_users.short_description = "Annuler la vérification"
    
    def activate_students(self, request, queryset):
        updated = queryset.filter(user_type='student').update(is_active_student=True)
        self.message_user(request, f'{updated} étudiants activés.')
    activate_students.short_description = "Activer les étudiants"
    
    def deactivate_students(self, request, queryset):
        updated = queryset.filter(user_type='student').update(is_active_student=False)
        self.message_user(request, f'{updated} étudiants désactivés.')
    deactivate_students.short_description = "Désactiver les étudiants"


@admin.register(UserActivity)
class UserActivityAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'action', 'description_short', 'ip_address', 'created_at'
    ]
    list_filter = ['action', 'created_at']
    search_fields = ['user__username', 'user__email', 'description', 'ip_address']
    readonly_fields = ['created_at']
    date_hierarchy = 'created_at'
    
    def description_short(self, obj):
        if len(obj.description) > 50:
            return obj.description[:50] + '...'
        return obj.description
    description_short.short_description = 'Description'
    
    def has_add_permission(self, request):
        return False  # Les activités sont créées automatiquement
    
    def has_change_permission(self, request, obj=None):
        return False  # Les activités ne peuvent pas être modifiées


@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'title', 'notification_type', 'is_read',
        'is_important', 'created_at', 'expires_at'
    ]
    list_filter = [
        'notification_type', 'is_read', 'is_important',
        'created_at', 'expires_at'
    ]
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at', 'read_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Notification', {
            'fields': ('user', 'title', 'message', 'notification_type')
        }),
        ('Lien', {
            'fields': ('link_url', 'link_text')
        }),
        ('Statut', {
            'fields': ('is_read', 'is_important', 'read_at', 'expires_at')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread', 'mark_as_important']
    
    def mark_as_read(self, request, queryset):
        from django.utils import timezone
        updated = queryset.update(is_read=True, read_at=timezone.now())
        self.message_user(request, f'{updated} notifications marquées comme lues.')
    mark_as_read.short_description = "Marquer comme lu"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False, read_at=None)
        self.message_user(request, f'{updated} notifications marquées comme non lues.')
    mark_as_unread.short_description = "Marquer comme non lu"
    
    def mark_as_important(self, request, queryset):
        updated = queryset.update(is_important=True)
        self.message_user(request, f'{updated} notifications marquées comme importantes.')
    mark_as_important.short_description = "Marquer comme important"


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'ip_address', 'device_info_short', 'location',
        'is_active', 'last_activity', 'created_at'
    ]
    list_filter = ['is_active', 'last_activity', 'created_at']
    search_fields = ['user__username', 'ip_address', 'device_info', 'location']
    readonly_fields = ['session_key', 'created_at', 'last_activity']
    
    def device_info_short(self, obj):
        if len(obj.device_info) > 30:
            return obj.device_info[:30] + '...'
        return obj.device_info
    device_info_short.short_description = 'Appareil'
    
    actions = ['deactivate_sessions']
    
    def deactivate_sessions(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} sessions désactivées.')
    deactivate_sessions.short_description = "Désactiver les sessions"
    
    def has_add_permission(self, request):
        return False  # Les sessions sont créées automatiquement


@admin.register(AdminUserMessage)
class AdminUserMessageAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'subject', 'message_type', 'status',
        'is_urgent', 'admin', 'created_at', 'responded_at'
    ]
    list_filter = [
        'message_type', 'status', 'is_urgent',
        'created_at', 'responded_at'
    ]
    search_fields = ['user__username', 'user__email', 'subject', 'message']
    readonly_fields = ['created_at', 'updated_at', 'login_ip', 'login_device', 'login_location']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Message', {
            'fields': ('user', 'message_type', 'subject', 'message', 'status', 'is_urgent')
        }),
        ('Réponse Administrateur', {
            'fields': ('admin', 'admin_response', 'responded_at'),
            'classes': ('collapse',)
        }),
        ('Informations de Connexion', {
            'fields': ('login_ip', 'login_device', 'login_location'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_as_urgent', 'mark_as_closed']

    def mark_as_urgent(self, request, queryset):
        updated = queryset.update(is_urgent=True)
        self.message_user(request, f'{updated} messages marqués comme urgents.')
    mark_as_urgent.short_description = "Marquer comme urgent"

    def mark_as_closed(self, request, queryset):
        updated = queryset.update(status='closed')
        self.message_user(request, f'{updated} messages fermés.')
    mark_as_closed.short_description = "Fermer les messages"

    def save_model(self, request, obj, form, change):
        """Sauvegarder le modèle et gérer les réponses"""
        if change and obj.admin_response and not obj.responded_at:
            # Si une réponse est ajoutée, utiliser la méthode respond
            obj.respond(request.user, obj.admin_response)
        else:
            super().save_model(request, obj, form, change)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'admin')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "admin":
            kwargs["queryset"] = User.objects.filter(is_staff=True)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(EmailTemplate)
class EmailTemplateAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'template_type', 'subject', 'is_active',
        'created_at', 'updated_at'
    ]
    list_filter = ['template_type', 'is_active', 'created_at']
    search_fields = ['name', 'subject', 'html_content', 'text_content']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Informations générales', {
            'fields': ('name', 'template_type', 'is_active')
        }),
        ('Contenu', {
            'fields': ('subject', 'html_content', 'text_content')
        }),
        ('Variables', {
            'fields': ('available_variables',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['activate_templates', 'deactivate_templates']

    def activate_templates(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} templates activés.')
    activate_templates.short_description = "Activer les templates"

    def deactivate_templates(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} templates désactivés.')
    deactivate_templates.short_description = "Désactiver les templates"


@admin.register(EmailLog)
class EmailLogAdmin(admin.ModelAdmin):
    list_display = [
        'recipient_email', 'subject', 'status', 'template',
        'sent_at', 'opened_at', 'created_at'
    ]
    list_filter = [
        'status', 'template__template_type', 'sent_at',
        'opened_at', 'created_at'
    ]
    search_fields = [
        'recipient_email', 'subject', 'html_content',
        'text_content', 'error_message'
    ]
    readonly_fields = [
        'created_at', 'sent_at', 'opened_at', 'clicked_at'
    ]
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Destinataire', {
            'fields': ('recipient_email', 'recipient_user')
        }),
        ('Contenu', {
            'fields': ('template', 'subject', 'html_content', 'text_content')
        }),
        ('Statut', {
            'fields': ('status', 'error_message')
        }),
        ('Tracking', {
            'fields': ('sent_at', 'opened_at', 'clicked_at'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    actions = ['retry_failed_emails']

    def retry_failed_emails(self, request, queryset):
        failed_emails = queryset.filter(status='failed')
        # Ici on pourrait implémenter la logique de renvoi
        count = failed_emails.count()
        self.message_user(request, f'{count} emails marqués pour renvoi.')
    retry_failed_emails.short_description = "Réessayer les emails échoués"

    def has_add_permission(self, request):
        return False  # Les logs sont créés automatiquement


class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'role_fr', 'is_director', 'email', 'order']
    list_filter = ['is_director', 'created_at']
    search_fields = ['full_name', 'email', 'role_fr', 'description_fr']
    list_editable = ['order', 'is_director']
    exclude = ('user',)

# Register with protection against double-registration during tests/reloads
try:
    admin.site.register(TeamMember, TeamMemberAdmin)
except admin.sites.AlreadyRegistered:
    pass


