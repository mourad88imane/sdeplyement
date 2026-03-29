from django.contrib import admin
from .models import TeamMember, Director

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name_fr", "role_fr", "order")
    search_fields = ("name_fr", "role_fr")
    ordering = ("order",)


@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ("name_fr", "start_year", "end_year", "is_current", "order")
    list_filter = ("is_current",)
    search_fields = ("name_fr", "message_fr")
    ordering = ("-is_current", "-start_year")
    list_editable = ("is_current", "order")
