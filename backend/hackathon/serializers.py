from rest_framework import serializers
from .models import HackathonEvent, Prize, TimelineItem, Winner, GalleryItem, Theme


class HackathonEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = HackathonEvent
        fields = '__all__'


class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = '__all__'


class TimelineItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimelineItem
        fields = '__all__'


class WinnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Winner
        fields = '__all__'


class GalleryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = '__all__'


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'