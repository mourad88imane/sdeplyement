from rest_framework import viewsets
from .models import HackathonEvent, Prize, TimelineItem, Winner, GalleryItem, Theme
from .serializers import (
    HackathonEventSerializer, PrizeSerializer, TimelineItemSerializer,
    WinnerSerializer, GalleryItemSerializer, ThemeSerializer
)


class HackathonEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HackathonEvent.objects.all()
    serializer_class = HackathonEventSerializer
    pagination_class = None


class PrizeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Prize.objects.all()
    serializer_class = PrizeSerializer
    pagination_class = None


class TimelineItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TimelineItem.objects.all()
    serializer_class = TimelineItemSerializer
    pagination_class = None


class WinnerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Winner.objects.all()
    serializer_class = WinnerSerializer
    pagination_class = None


class GalleryItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    pagination_class = None


class ThemeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    pagination_class = None