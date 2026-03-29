from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from django.db.models import Q, Count
from django.core.mail import send_mail
from django.conf import settings

from .models import FormationCategory, Formation, FormationEnrollment
from .serializers import (
    FormationCategorySerializer,
    FormationListSerializer,
    FormationDetailSerializer,
    FormationEnrollmentSerializer,
    FormationEnrollmentCreateSerializer
)


class FormationCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les catégories de formations OHB (lecture seule)"""
    queryset = FormationCategory.objects.all()
    serializer_class = FormationCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class FormationViewSet(viewsets.ModelViewSet):
    """ViewSet pour les formations OHB"""
    queryset = Formation.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_permissions(self):
        """Allow anyone to enroll in a formation"""
        if self.action == 'enroll':
            return [AllowAny()]
        return super().get_permissions()
    
    def get_serializer_class(self):
        if self.action == 'list':
            return FormationListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return FormationDetailSerializer
        return FormationDetailSerializer
    
    def get_queryset(self):
        queryset = Formation.objects.all()
        
        # Filtrer par statut
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            # Par défaut, ne montrer que les formations publiées
            queryset = queryset.filter(status='published')
        
        # Filtrer par catégorie
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filtrer par niveau
        level = self.request.query_params.get('level', None)
        if level:
            queryset = queryset.filter(level=level)
        
        # Rechercher
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title_fr__icontains=search) |
                Q(title_ar__icontains=search) |
                Q(description_fr__icontains=search) |
                Q(description_ar__icontains=search)
            )
        
        # Tri
        ordering = self.request.query_params.get('ordering', '-created_at')
        queryset = queryset.order_by(ordering)
        
        return queryset.select_related('category')
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Incrémenter le nombre de vues
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def enroll(self, request, slug=None):
        """S'inscrire à une formation"""
        try:
            formation = self.get_object()
        except Exception as e:
            return Response(
                {'error': f'Formation non trouvée: {str(e)}'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        if not formation.registration_open:
            return Response(
                {'error': 'Les inscriptions sont fermées pour cette formation'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = FormationEnrollmentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'Données invalides', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            enrollment = serializer.save(formation=formation)
            
            # Send confirmation email to the student
            try:
                student_email = enrollment.student_email
                subject = f"Confirmation d'inscription - {formation.title_fr}"
                message = f"""
Bonjour {enrollment.student_name},

Nous avons bien reçu votre demande d'inscription à la formation "{formation.title_fr}".

Détails de votre inscription :
- Formation : {formation.title_fr}
- Date d'inscription : {enrollment.enrolled_at.strftime('%d/%m/%Y à %H:%M')}
- Statut : En attente de confirmation

Nous vous contacterons bientôt pour finaliser votre inscription.

Cordialement,
L'équipe OHB Formation
"""
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    [student_email],
                    fail_silently=False,
                )
            except Exception as email_error:
                print(f"Erreur lors de l'envoi de l'email: {email_error}")
            
            # Get enrollment count for this formation
            enrollment_count = formation.enrollments.count()
            
            return Response(
                {
                    **FormationEnrollmentSerializer(enrollment).data,
                    'enrollment_count': enrollment_count,
                    'message': 'Inscription créée avec succès. Un email de confirmation a été envoyé.'
                },
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la création de l\'inscription: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupérer les formations mises en avant"""
        formations = self.get_queryset().filter(featured=True)[:6]
        serializer = FormationListSerializer(formations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Récupérer les formations populaires"""
        formations = self.get_queryset().order_by('-views_count')[:6]
        serializer = FormationListSerializer(formations, many=True)
        return Response(serializer.data)


class FormationEnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet pour les inscriptions aux formations"""
    queryset = FormationEnrollment.objects.all()
    serializer_class = FormationEnrollmentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        return FormationEnrollment.objects.filter(
            formation_id=self.kwargs.get('formation_pk')
        )
    
    def perform_create(self, serializer):
        from .models import Formation
        formation = Formation.objects.get(pk=self.kwargs.get('formation_pk'))
        serializer.save(formation=formation)
