from django.contrib import admin
from .models import HackathonEvent, Prize, TimelineItem, Winner, GalleryItem, Theme


@admin.register(HackathonEvent)
class HackathonEventAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'year', 'is_active', 'date_start', 'date_end')
    list_filter = ('is_active', 'year')


@admin.register(Prize)
class PrizeAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'event', 'place', 'amount', 'is_special')
    list_filter = ('event', 'is_special')


@admin.register(TimelineItem)
class TimelineItemAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'event', 'day', 'time', 'is_highlight')
    list_filter = ('event', 'day')


@admin.register(Winner)
class WinnerAdmin(admin.ModelAdmin):
    list_display = ('team_name', 'event', 'place')
    list_filter = ('event',)


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('caption_fr', 'event')
    list_filter = ('event',)


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ('title_fr', 'event')
    list_filter = ('event',)