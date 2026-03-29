from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from .models import CourseCategory, Course, CourseEnrollment
from .serializers import (
    CourseCategorySerializer, CourseListSerializer, CourseDetailSerializer,
    CourseEnrollmentSerializer, CourseCreateSerializer
)


class CourseCategoryListView(generics.ListAPIView):
    """Liste des catégories de cours"""
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CourseListView(generics.ListCreateAPIView):
    """Liste et création des cours"""
    queryset = Course.objects.filter(status='published').select_related('category')
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title_fr', 'title_ar', 'description_fr', 'description_ar']
    ordering_fields = ['created_at', 'start_date', 'title_fr', 'views_count']
    ordering = ['-featured', '-created_at']

    def get_queryset(self):
        queryset = Course.objects.filter(status='published').select_related('category')
        course_type = self.request.query_params.get('type')
        if course_type:
            queryset = queryset.filter(course_type=course_type)
        return queryset

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CourseCreateSerializer
        return CourseListSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'un cours (par slug)"""
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # Incrémenter le compteur de vues pour les requêtes GET
        if self.request.method == 'GET':
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj


class CourseDetailByIdView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'un cours (par ID)"""
    queryset = Course.objects.all()
    serializer_class = CourseDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # Incrémenter le compteur de vues pour les requêtes GET
        if self.request.method == 'GET':
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj


class FeaturedCoursesView(generics.ListAPIView):
    """Cours mis en avant"""
    queryset = Course.objects.filter(status='published', featured=True).select_related('category')
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CourseEnrollmentListView(generics.ListCreateAPIView):
    """Liste et création des inscriptions"""
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_staff:
            return CourseEnrollment.objects.all().select_related('course')
        return CourseEnrollment.objects.none()


class CourseEnrollmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'une inscription"""
    queryset = CourseEnrollment.objects.all()
    serializer_class = CourseEnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return CourseEnrollment.objects.all().select_related('course')
        return CourseEnrollment.objects.none()


@api_view(['POST'])
@permission_classes([])
def enroll_in_course(request, course_slug):
    """Inscription à un cours"""
    course = get_object_or_404(Course, slug=course_slug, status='published')

    data = request.data.copy()
    data['course'] = course.id

    serializer = CourseEnrollmentSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Inscription réussie! Vous recevrez une confirmation par email.',
            'enrollment': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def course_stats(request):
    """Statistiques des cours"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    stats = {
        'total_courses': Course.objects.count(),
        'published_courses': Course.objects.filter(status='published').count(),
        'draft_courses': Course.objects.filter(status='draft').count(),
        'featured_courses': Course.objects.filter(featured=True).count(),
        'total_enrollments': CourseEnrollment.objects.count(),
        'pending_enrollments': CourseEnrollment.objects.filter(status='pending').count(),
        'approved_enrollments': CourseEnrollment.objects.filter(status='approved').count(),
        'total_categories': CourseCategory.objects.count(),
    }

    return Response(stats)


@api_view(['GET'])
def popular_courses(request):
    """Cours populaires (basés sur les vues et inscriptions)"""
    # Par défaut, on retourne les cours de l'école, sauf si spécifié autrement
    course_type = request.query_params.get('type', 'school')
    courses = Course.objects.filter(status='published', course_type=course_type).select_related('category').order_by('-views_count')[:6]
    serializer = CourseListSerializer(courses, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def download_course_pdf(request, course_slug):
    """Télécharger le PDF d'un cours"""
    course = get_object_or_404(Course, slug=course_slug, status='published')

    if not course.pdf_file:
        return Response(
            {'error': 'Aucun fichier PDF disponible pour ce cours.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Incrémenter le compteur de vues
    course.views_count += 1
    course.save(update_fields=['views_count'])

    # Retourner le fichier
    try:
        response = HttpResponse(course.pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{course.title_fr}.pdf"'
        return response
    except Exception:
        raise Http404("Fichier non trouvé")


@api_view(['GET'])
def download_course_brochure(request, course_slug):
    """Télécharger la brochure PDF d'un cours"""
    course = get_object_or_404(Course, slug=course_slug, status='published')

    if not course.brochure_pdf:
        return Response(
            {'error': 'Aucune brochure PDF disponible pour ce cours.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Retourner le fichier
    try:
        response = HttpResponse(course.brochure_pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="brochure_{course.title_fr}.pdf"'
        return response
    except Exception:
        raise Http404("Fichier non trouvé")


@api_view(['GET'])
def download_course_brochure_by_id(request, course_id):
    """Télécharger la brochure PDF d'un cours par ID"""
    course = get_object_or_404(Course, id=course_id, status='published')

    if not course.brochure_pdf:
        return Response(
            {'error': 'Aucune brochure PDF disponible pour ce cours.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Retourner le fichier
    try:
        response = HttpResponse(course.brochure_pdf.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="brochure_{course.title_fr}.pdf"'
        return response
    except Exception:
        raise Http404("Fichier non trouvé")
