from django.shortcuts import render
from rest_framework import viewsets
from .models import AlumniSuccess
from .serializers import AlumniSuccessSerializer
from rest_framework.permissions import AllowAny, IsAdminUser

# Create your views here.

class AlumniSuccessViewSet(viewsets.ModelViewSet):
    queryset = AlumniSuccess.objects.all().prefetch_related('gallery').order_by('-created_at')
    serializer_class = AlumniSuccessSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
