from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

from .models import MuseumEquipmentCategory, MuseumEquipment, MuseumPersonality
from .serializers import (
    MuseumEquipmentCategorySerializer,
    MuseumEquipmentListSerializer,
    MuseumEquipmentDetailSerializer,
    MuseumEquipmentCreateSerializer,
    MuseumPersonalityListSerializer,
    MuseumPersonalityDetailSerializer,
    MuseumPersonalityCreateSerializer,
)


# ==================== Equipment Category Views ====================

class MuseumEquipmentCategoryListView(generics.ListAPIView):
    """Liste des catégories d'équipements"""
    queryset = MuseumEquipmentCategory.objects.all()
    serializer_class = MuseumEquipmentCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class MuseumEquipmentCategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'une catégorie d'équipement"""
    queryset = MuseumEquipmentCategory.objects.all()
    serializer_class = MuseumEquipmentCategorySerializer
    permission_classes = [IsAuthenticated]


# ==================== Equipment Views ====================

class MuseumEquipmentListView(generics.ListCreateAPIView):
    """Liste et création des équipements du musée"""
    queryset = MuseumEquipment.objects.all().select_related('category', 'author')
    serializer_class = MuseumEquipmentListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name_fr', 'name_ar', 'inventory_number', 'origin', 'period']
    ordering_fields = ['created_at', 'name_fr', 'inventory_number', 'condition', 'status']
    ordering = ['-featured', '-created_at']
    pagination_class = None  # Disable pagination to show all equipment

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MuseumEquipmentCreateSerializer
        return MuseumEquipmentListSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MuseumEquipmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'un équipement"""
    queryset = MuseumEquipment.objects.all()
    serializer_class = MuseumEquipmentDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]


class FeaturedEquipmentView(generics.ListAPIView):
    """Équipements mis en avant"""
    queryset = MuseumEquipment.objects.filter(featured=True).select_related('category', 'author')
    serializer_class = MuseumEquipmentListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class EquipmentByCategoryView(generics.ListAPIView):
    """Équipements par catégorie"""
    serializer_class = MuseumEquipmentListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return MuseumEquipment.objects.filter(
            category_id=category_id
        ).select_related('category', 'author')


class EquipmentByStatusView(generics.ListAPIView):
    """Équipements par statut"""
    serializer_class = MuseumEquipmentListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        status_value = self.kwargs['status']
        return MuseumEquipment.objects.filter(
            status=status_value
        ).select_related('category', 'author')


# ==================== Personality Views ====================

class MuseumPersonalityListView(generics.ListCreateAPIView):
    """Liste et création des personnalités du musée"""
    queryset = MuseumPersonality.objects.all().select_related('author').prefetch_related('equipment')
    serializer_class = MuseumPersonalityListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'full_name', 'nationality', 'biography_fr', 'biography_ar']
    ordering_fields = ['created_at', 'last_name', 'first_name', 'birth_date']
    ordering = ['-featured', 'last_name', 'first_name']
    pagination_class = None  # Disable pagination to show all personalities

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MuseumPersonalityCreateSerializer
        return MuseumPersonalityListSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class MuseumPersonalityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'une personnalité"""
    queryset = MuseumPersonality.objects.all()
    serializer_class = MuseumPersonalityDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]


class FeaturedPersonalityView(generics.ListAPIView):
    """Personnalités mises en avant"""
    queryset = MuseumPersonality.objects.filter(featured=True).select_related('author').prefetch_related('equipment')
    serializer_class = MuseumPersonalityListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PersonalityByRoleView(generics.ListAPIView):
    """Personnalités par rôle"""
    serializer_class = MuseumPersonalityListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        role = self.kwargs['role']
        return MuseumPersonality.objects.filter(
            role=role
        ).select_related('author').prefetch_related('equipment')


# ==================== Statistics Views ====================

@api_view(['GET'])
def museum_stats(request):
    """Statistiques du musée"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    stats = {
        'total_equipment': MuseumEquipment.objects.count(),
        'available_equipment': MuseumEquipment.objects.filter(status='available').count(),
        'on_display_equipment': MuseumEquipment.objects.filter(status='on_display').count(),
        'on_loan_equipment': MuseumEquipment.objects.filter(status='on_loan').count(),
        'stored_equipment': MuseumEquipment.objects.filter(status='stored').count(),
        'featured_equipment': MuseumEquipment.objects.filter(featured=True).count(),
        'total_personalities': MuseumPersonality.objects.count(),
        'featured_personalities': MuseumPersonality.objects.filter(featured=True).count(),
        'total_categories': MuseumEquipmentCategory.objects.count(),
    }

    return Response(stats)


@api_view(['GET'])
def search_equipment(request):
    """Recherche d'équipements"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})

    from django.db import models

    equipment = MuseumEquipment.objects.filter(
        models.Q(name_fr__icontains=query) |
        models.Q_fr__icont(name_ar__icontains=query) |
        models.Q(description_fr__icontains=query) |
        models.Q(description_ar__icontains=query) |
        models.Q(inventory_number__icontains=query) |
        models.Q(origin__icontains=query)
    ).select_related('category', 'author')[:20]

    serializer = MuseumEquipmentListSerializer(equipment, many=True)
    return Response({'results': serializer.data})


@api_view(['GET'])
def search_personalities(request):
    """Recherche de personnalités"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})

    from django.db import models

    personalities = MuseumPersonality.objects.filter(
        models.Q(first_name__icontains=query) |
        models.Q(last_name__icontains=query) |
        models.Q(full_name__icontains=query) |
        models.Q(biography_fr__icontains=query) |
        models.Q(biography_ar__icontains=query) |
        models.Q(nationality__icontains=query)
    ).select_related('author')[:20]

    serializer = MuseumPersonalityListSerializer(personalities, many=True)
    return Response({'results': serializer.data})
