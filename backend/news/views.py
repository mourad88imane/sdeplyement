from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.utils import timezone
from .models import NewsCategory, News, NewsComment, NewsTag, Newsletter, AlumniSuccess, AlumniPhoto
from .serializers import (
    NewsCategorySerializer, NewsListSerializer, NewsDetailSerializer,
    NewsCommentCreateSerializer, NewsTagSerializer, NewsletterSerializer,
    NewsCreateSerializer, AlumniSuccessListSerializer, AlumniSuccessDetailSerializer, AlumniSuccessCreateSerializer, AlumniPhotoSerializer
)


class NewsCategoryListView(generics.ListAPIView):
    """Liste des catégories d'actualités"""
    queryset = NewsCategory.objects.all()
    serializer_class = NewsCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class NewsListView(generics.ListCreateAPIView):
    """Liste et création des actualités"""
    queryset = News.objects.filter(status='published').select_related('category', 'author')
    serializer_class = NewsListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title_fr', 'title_ar', 'summary_fr', 'summary_ar']
    ordering_fields = ['published_at', 'created_at', 'views_count', 'title_fr']
    ordering = ['-featured', '-published_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NewsCreateSerializer
        return NewsListSerializer

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NewsDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'une actualité"""
    queryset = News.objects.all()
    serializer_class = NewsDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # Incrémenter le compteur de vues pour les requêtes GET
        if self.request.method == 'GET':
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj


class FeaturedNewsView(generics.ListAPIView):
    """Actualités mises en avant"""
    queryset = News.objects.filter(
        status='published',
        featured=True
    ).select_related('category', 'author')
    serializer_class = NewsListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class LatestNewsView(generics.ListAPIView):
    """Dernières actualités"""
    queryset = News.objects.filter(status='published').select_related('category', 'author')[:10]
    serializer_class = NewsListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class NewsByCategoryView(generics.ListAPIView):
    """Actualités par catégorie"""
    serializer_class = NewsListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return News.objects.filter(
            status='published',
            category_id=category_id
        ).select_related('category', 'author')


class NewsTagListView(generics.ListAPIView):
    """Liste des tags"""
    queryset = NewsTag.objects.all()
    serializer_class = NewsTagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


@api_view(['POST'])
@permission_classes([])
def add_comment(request, news_slug):
    """Ajouter un commentaire à une actualité"""
    news = get_object_or_404(News, slug=news_slug, status='published')

    if not news.allow_comments:
        return Response(
            {'error': 'Les commentaires ne sont pas autorisés pour cet article.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    data = request.data.copy()
    data['news'] = news.id

    serializer = NewsCommentCreateSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Commentaire ajouté avec succès! Il sera visible après modération.',
            'comment': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def subscribe_newsletter(request):
    """S'abonner à la newsletter"""
    serializer = NewsletterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Abonnement à la newsletter réussi!'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def unsubscribe_newsletter(request):
    """Se désabonner de la newsletter"""
    email = request.data.get('email')
    if not email:
        return Response(
            {'error': 'Email requis'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        subscription = Newsletter.objects.get(email=email, is_active=True)
        subscription.is_active = False
        subscription.unsubscribed_at = timezone.now()
        subscription.save()
        return Response({'message': 'Désabonnement réussi!'})
    except Newsletter.DoesNotExist:
        return Response(
            {'error': 'Aucun abonnement actif trouvé pour cette adresse email.'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def news_stats(request):
    """Statistiques des actualités"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    stats = {
        'total_news': News.objects.count(),
        'published_news': News.objects.filter(status='published').count(),
        'draft_news': News.objects.filter(status='draft').count(),
        'featured_news': News.objects.filter(featured=True).count(),
        'total_comments': NewsComment.objects.count(),
        'pending_comments': NewsComment.objects.filter(status='pending').count(),
        'approved_comments': NewsComment.objects.filter(status='approved').count(),
        'newsletter_subscribers': Newsletter.objects.filter(is_active=True).count(),
        'total_categories': NewsCategory.objects.count(),
        'total_tags': NewsTag.objects.count(),
    }

    return Response(stats)


@api_view(['GET'])
def popular_news(request):
    """Actualités populaires (basées sur les vues)"""
    news = News.objects.filter(status='published').select_related('category', 'author').order_by('-views_count')[:6]
    serializer = NewsListSerializer(news, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def search_news(request):
    """Recherche d'actualités"""
    from django.db import models

    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})

    news = News.objects.filter(
        status='published'
    ).filter(
        models.Q(title_fr__icontains=query) |
        models.Q(title_ar__icontains=query) |
        models.Q(summary_fr__icontains=query) |
        models.Q(summary_ar__icontains=query)
    ).select_related('category', 'author')[:20]

    serializer = NewsListSerializer(news, many=True)
    return Response({'results': serializer.data})


class AlumniListView(generics.ListCreateAPIView):
    """Liste et création des succès des anciens.

    Supports an optional `?admin=1` query param which will return ALL items when
    requested by a staff user. Regular users still only see published items.
    """
    serializer_class = AlumniSuccessListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        admin_flag = self.request.query_params.get('admin') == '1'
        if admin_flag and self.request.user.is_staff:
            return AlumniSuccess.objects.all().select_related('author')
        return AlumniSuccess.objects.filter(published_at__isnull=False).select_related('author')

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AlumniSuccessCreateSerializer
        return AlumniSuccessListSerializer

    def perform_create(self, serializer):
        # Only staff users can create alumni successes via the API
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only staff users can create alumni successes.')
        serializer.save(author=self.request.user)


class AlumniDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'un succès d'ancien"""
    queryset = AlumniSuccess.objects.all()
    serializer_class = AlumniSuccessDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_update(self, serializer):
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only staff users can modify alumni successes.')
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only staff users can delete alumni successes.')
        instance.delete()


# --- Photo detail (delete) view ---
class AlumniPhotoDetailView(generics.RetrieveDestroyAPIView):
    """Retrieve or delete an AlumniPhoto (delete only for staff users)."""
    queryset = AlumniPhoto.objects.all()
    serializer_class = AlumniPhotoSerializer
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if not self.request.user.is_staff:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only staff users can delete alumni photos.')
        # Delete the image file if needed and then the instance
        instance.delete()

# --- Upload photos for an AlumniSuccess ---
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView

class AlumniPhotoUploadView(APIView):
    """Upload a photo for a given AlumniSuccess (staff only)."""
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, slug):
        if not request.user.is_staff:
            raise PermissionDenied('Only staff users can upload photos.')
        alumni = get_object_or_404(AlumniSuccess, slug=slug)
        # enforce maximum photos per alumni at API level too
        if alumni.photos.count() >= AlumniPhoto.MAX_PER_ALUMNI:
            return Response({'non_field_errors': [f'Maximum {AlumniPhoto.MAX_PER_ALUMNI} photos are allowed for this alumni success.']}, status=status.HTTP_400_BAD_REQUEST)
        serializer = AlumniPhotoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save(alumni=alumni)
            except Exception as e:
                # pass through any model validation errors
                return Response({'non_field_errors': [str(e)]}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
