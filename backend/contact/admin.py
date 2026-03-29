from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Admin configuration for ContactMessage model."""
    
    list_display = ['name', 'email', 'subject', 'created_at', 'is_read', 'is_replied']
    list_filter = ['is_read', 'is_replied', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Informations du visiteur', {
            'fields': ('name', 'email', 'phone')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Statut', {
            'fields': ('is_read', 'is_replied')
        }),
        ('Métadonnées', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_replied']
    
    def mark_as_read(self, request, queryset):
        queryset.update(is_read=True)
    mark_as_read.short_description = "Marquer comme lu"
    
    def mark_as_replied(self, request, queryset):
        queryset.update(is_replied=True)
    mark_as_replied.short_description = "Marquer comme répondu"
