from rest_framework import generics, permissions
from django.shortcuts import get_object_or_404
from .models import Page
from .serializers import PageSerializer


class MissionView(generics.RetrieveUpdateAPIView):
    """Retrieve or update the 'mission' page. GET is public; updates require admin/staff."""
    serializer_class = PageSerializer

    def get_object(self):
        return get_object_or_404(Page, slug='mission')

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
