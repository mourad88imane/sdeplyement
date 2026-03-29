from django.shortcuts import render
from rest_framework import viewsets
from .models import Review
from .serializers import ReviewSerializer
from rest_framework.permissions import IsAdminUser, AllowAny

# Create your views here.

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAdminUser()]
