from django.contrib import admin
from .models import Partnership

# @admin.register(Partnership)
class PartnershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
