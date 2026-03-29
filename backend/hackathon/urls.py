from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HackathonEventViewSet, PrizeViewSet, TimelineItemViewSet,
    WinnerViewSet, GalleryItemViewSet, ThemeViewSet
)

router = DefaultRouter()
router.register(r'events', HackathonEventViewSet)
router.register(r'prizes', PrizeViewSet)
router.register(r'timeline', TimelineItemViewSet)
router.register(r'winners', WinnerViewSet)
router.register(r'gallery', GalleryItemViewSet)
router.register(r'themes', ThemeViewSet)

urlpatterns = [
    path('', include(router.urls)),
]