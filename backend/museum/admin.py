from django.contrib import admin
from .models import MuseumEquipmentCategory, MuseumEquipment, MuseumPersonality


@admin.register(MuseumEquipmentCategory)
class MuseumEquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_ar', 'color', 'created_at']
    list_editable = ['color']
    search_fields = ['name_fr', 'name_ar']
    ordering = ['name_fr']


@admin.register(MuseumEquipment)
class MuseumEquipmentAdmin(admin.ModelAdmin):
    list_display = [
        'name_fr', 'inventory_number', 'category', 'condition', 'status', 'featured', 'created_at'
    ]
    list_filter = ['condition', 'status', 'featured', 'category', 'created_at']
    search_fields = ['name_fr', 'name_ar', 'inventory_number', 'origin', 'period']
    list_editable = ['featured', 'condition', 'status']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('name_fr', 'name_ar', 'slug', 'inventory_number', 'category')
        }),
        ('Description', {
            'fields': ('description_fr', 'description_ar', 'historical_context_fr', 'historical_context_ar')
        }),
        ('État et statut', {
            'fields': ('condition', 'status')
        }),
        ('Informations détaillées', {
            'fields': ('acquisition_date', 'acquisition_method', 'origin', 'period', 'production_date')
        }),
        ('Dimensions', {
            'fields': ('dimensions', 'weight')
        }),
        ('Médias', {
            'fields': ('image', 'image_alt_fr', 'image_alt_ar')
        }),
        ('Métadonnées', {
            'fields': ('featured', 'featured_image')
        }),
        ('Audit', {
            'fields': ('author', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MuseumPersonality)
class MuseumPersonalityAdmin(admin.ModelAdmin):
    list_display = [
        'full_name', 'role', 'nationality', 'birth_date', 'death_date', 'featured', 'created_at'
    ]
    list_filter = ['role', 'featured', 'nationality', 'created_at']
    search_fields = ['first_name', 'last_name', 'full_name', 'biography_fr', 'biography_ar', 'nationality']
    list_editable = ['featured']
    readonly_fields = ['slug', 'created_at', 'updated_at', 'full_name']
    date_hierarchy = 'created_at'
    filter_horizontal = ['equipment']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('first_name', 'last_name', 'full_name', 'slug')
        }),
        ('Rôle', {
            'fields': ('role', 'role_custom_fr', 'role_custom_ar')
        }),
        ('Biographie', {
            'fields': ('biography_fr', 'biography_ar', 'achievements_fr', 'achievements_ar')
        }),
        ('Dates et lieu', {
            'fields': ('birth_date', 'death_date', 'birth_place', 'death_place', 'nationality')
        }),
        ('Médias', {
            'fields': ('photo', 'photo_alt_fr', 'photo_alt_ar')
        }),
        ('Équipements associés', {
            'fields': ('equipment',)
        }),
        ('Métadonnées', {
            'fields': ('featured',)
        }),
        ('Audit', {
            'fields': ('author', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
