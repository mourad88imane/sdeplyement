from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Q
from django.http import HttpResponseRedirect
from .models import EventCategory, Event, EventRegistration, EventReminder


def categories_dashboard_view(request):
    """Vue du tableau de bord des catégories"""
    categories = EventCategory.objects.annotate(
        total_events=Count('event_set'),
        published_events=Count('event_set', filter=Q(event_set__status='published')),
        upcoming_events=Count('event_set', filter=Q(
            event_set__status='published',
            event_set__start_date__gt=timezone.now()
        ))
    ).order_by('name_fr')

    context = {
        'title': 'Tableau de bord des catégories',
        'categories': categories,
        'total_categories': EventCategory.objects.count(),
        'active_categories': EventCategory.objects.filter(is_active=True).count(),
        'total_events': Event.objects.count(),
        'published_events': Event.objects.filter(status='published').count(),
    }

    return render(request, 'dashboard/events/categories_dashboard.html', context)


@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name_fr', 'name_ar', 'color_display', 'icon_display',
        'events_count', 'is_active', 'created_at'
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['name_fr', 'name_ar', 'description_fr', 'description_ar']
    list_editable = ['is_active']
    ordering = ['name_fr']

    fieldsets = (
        ('Informations générales', {
            'fields': ('name_fr', 'name_ar')
        }),
        ('Description', {
            'fields': ('description_fr', 'description_ar'),
            'classes': ('collapse',)
        }),
        ('Apparence', {
            'fields': ('color', 'icon')
        }),
        ('Statut', {
            'fields': ('is_active',)
        }),
    )

    def color_display(self, obj):
        return format_html(
            '<span style="background-color: {}; padding: 5px 10px; border-radius: 3px; color: white; font-weight: bold;">{}</span>',
            obj.color, obj.color
        )
    color_display.short_description = 'Couleur'

    def icon_display(self, obj):
        return format_html(
            '<i class="{}" style="font-size: 16px; color: {};"></i>',
            obj.icon, obj.color
        )
    icon_display.short_description = 'Icône'

    def events_count(self, obj):
        count = obj.event_set.count()
        active_count = obj.event_set.filter(status='published').count()
        if count > 0:
            return format_html(
                '<a href="/admin/events/event/?category__id__exact={}" title="Total: {} | Publiés: {}">{} événements</a>',
                obj.id, count, active_count, count
            )
        else:
            return format_html('<span style="color: #999;">Aucun événement</span>')
    events_count.short_description = 'Événements'

    # Actions personnalisées
    actions = ['activate_categories', 'deactivate_categories', 'duplicate_category']

    def activate_categories(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} catégorie(s) activée(s).')
    activate_categories.short_description = "Activer les catégories sélectionnées"

    def deactivate_categories(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} catégorie(s) désactivée(s).')
    deactivate_categories.short_description = "Désactiver les catégories sélectionnées"

    def duplicate_category(self, request, queryset):
        for category in queryset:
            category.pk = None
            category.name_fr = f"{category.name_fr} (Copie)"
            category.name_ar = f"{category.name_ar} (نسخة)" if category.name_ar else ""
            category.save()
        count = queryset.count()
        self.message_user(request, f'{count} catégorie(s) dupliquée(s).')
    duplicate_category.short_description = "Dupliquer les catégories sélectionnées"

    def changelist_view(self, request, extra_context=None):
        """Ajouter un lien vers le tableau de bord"""
        extra_context = extra_context or {}
        extra_context['dashboard_url'] = '/admin/events/categories-dashboard/'
        return super().changelist_view(request, extra_context)


class EventRegistrationInline(admin.TabularInline):
    model = EventRegistration
    extra = 0
    readonly_fields = ['registered_at', 'updated_at']
    fields = ['user', 'status', 'payment_status', 'notes', 'registered_at']


class EventReminderInline(admin.TabularInline):
    model = EventReminder
    extra = 0
    fields = ['reminder_type', 'send_before_hours', 'subject', 'is_active', 'sent_at']
    readonly_fields = ['sent_at']


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = [
        'title_fr', 'category_display', 'start_date', 'end_date', 'status_display',
        'priority_display', 'registration_required', 'participants_count', 'is_featured'
    ]
    list_filter = [
        'status', 'priority', 'category', 'registration_required',
        'is_featured', 'is_public', 'start_date', 'created_at'
    ]
    search_fields = ['title_fr', 'title_ar', 'description_fr', 'location']
    prepopulated_fields = {'slug': ('title_fr',)}
    date_hierarchy = 'start_date'

    fieldsets = (
        ('Informations générales', {
            'fields': ('title_fr', 'title_ar', 'slug', 'category', 'status', 'priority')
        }),
        ('Description', {
            'fields': ('description_fr', 'description_ar')
        }),
        ('Dates et heures', {
            'fields': ('start_date', 'end_date', 'registration_deadline')
        }),
        ('Lieu', {
            'fields': ('location', 'address', 'room')
        }),
        ('Inscription', {
            'fields': ('registration_required', 'max_participants', 'registration_fee')
        }),
        ('Médias', {
            'fields': ('image', 'attachment')
        }),
        ('Organisation', {
            'fields': ('organizer', 'created_by')
        }),
        ('Visibilité', {
            'fields': ('is_featured', 'is_public')
        }),
        ('Statistiques', {
            'fields': ('views_count',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['views_count', 'created_at', 'updated_at', 'published_at']
    inlines = [EventRegistrationInline, EventReminderInline]

    def category_display(self, obj):
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px;">'
            '<i class="{}"></i> {}</span>',
            obj.category.color, obj.category.icon, obj.category.name_fr
        )
    category_display.short_description = 'Catégorie'

    def status_display(self, obj):
        colors = {
            'draft': '#6c757d',
            'published': '#28a745',
            'cancelled': '#dc3545',
            'completed': '#17a2b8'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            colors.get(obj.status, '#6c757d'), obj.get_status_display()
        )
    status_display.short_description = 'Statut'

    def priority_display(self, obj):
        colors = {
            'low': '#28a745',
            'normal': '#17a2b8',
            'high': '#ffc107',
            'urgent': '#dc3545'
        }
        return format_html(
            '<span style="background-color: {}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px;">{}</span>',
            colors.get(obj.priority, '#17a2b8'), obj.get_priority_display()
        )
    priority_display.short_description = 'Priorité'

    def participants_count(self, obj):
        count = obj.registrations.filter(status='confirmed').count()
        if obj.max_participants:
            percentage = (count / obj.max_participants) * 100
            color = '#dc3545' if percentage > 90 else '#ffc107' if percentage > 70 else '#28a745'
            return format_html(
                '<span style="color: {}; font-weight: bold;">{}/{}</span>',
                color, count, obj.max_participants
            )
        return str(count)
    participants_count.short_description = 'Participants'

    def save_model(self, request, obj, form, change):
        if not change:  # Nouvel objet
            obj.created_by = request.user
            if not obj.organizer:
                obj.organizer = request.user
        super().save_model(request, obj, form, change)


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'event', 'status', 'payment_status',
        'registered_at', 'payment_date'
    ]
    list_filter = [
        'status', 'payment_status', 'event__category',
        'registered_at', 'payment_date'
    ]
    search_fields = [
        'user__username', 'user__first_name', 'user__last_name',
        'event__title_fr', 'notes'
    ]
    date_hierarchy = 'registered_at'

    fieldsets = (
        ('Inscription', {
            'fields': ('event', 'user', 'status')
        }),
        ('Informations supplémentaires', {
            'fields': ('notes', 'special_requirements')
        }),
        ('Paiement', {
            'fields': ('payment_status', 'payment_date')
        }),
    )

    readonly_fields = ['registered_at', 'updated_at']


@admin.register(EventReminder)
class EventReminderAdmin(admin.ModelAdmin):
    list_display = [
        'event', 'reminder_type', 'send_before_hours',
        'subject', 'is_active', 'sent_at'
    ]
    list_filter = [
        'reminder_type', 'is_active', 'event__category', 'sent_at'
    ]
    search_fields = ['event__title_fr', 'subject', 'message']

    fieldsets = (
        ('Événement', {
            'fields': ('event', 'reminder_type')
        }),
        ('Timing', {
            'fields': ('send_before_hours',)
        }),
        ('Contenu', {
            'fields': ('subject', 'message')
        }),
        ('Statut', {
            'fields': ('is_active', 'sent_at')
        }),
    )

    readonly_fields = ['sent_at', 'created_at']
