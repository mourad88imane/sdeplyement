from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, Http404
from django.db import models
from .models import BookCategory, Author, Publisher, Book, BookReview, BookBorrow, BookReservation
from .serializers import (
    BookCategorySerializer, AuthorSerializer, PublisherSerializer,
    BookListSerializer, BookDetailSerializer, BookReviewCreateSerializer,
    BookBorrowCreateSerializer, BookReservationCreateSerializer, BookCreateSerializer
)


class BookCategoryListView(generics.ListAPIView):
    """Liste des catégories de livres"""
    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AuthorListView(generics.ListAPIView):
    """Liste des auteurs"""
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['first_name', 'last_name', 'nationality']
    ordering_fields = ['last_name', 'first_name', 'created_at']
    ordering = ['last_name', 'first_name']


class PublisherListView(generics.ListAPIView):
    """Liste des éditeurs"""
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name']
    ordering = ['name']


class BookListView(generics.ListCreateAPIView):
    """Liste et création des livres"""
    queryset = Book.objects.all().select_related('category', 'publisher').prefetch_related('authors')
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'subtitle', 'description_fr', 'description_ar', 'isbn']
    ordering_fields = ['title', 'publication_date', 'created_at', 'views_count', 'rating']
    ordering = ['-is_featured', '-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookCreateSerializer
        return BookListSerializer

    def perform_create(self, serializer):
        serializer.save(added_by=self.request.user)


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Détails, modification et suppression d'un livre"""
    queryset = Book.objects.all()
    serializer_class = BookDetailSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj = super().get_object()
        # Incrémenter le compteur de vues pour les requêtes GET
        if self.request.method == 'GET':
            obj.views_count += 1
            obj.save(update_fields=['views_count'])
        return obj


class FeaturedBooksView(generics.ListAPIView):
    """Livres mis en avant"""
    queryset = Book.objects.filter(is_featured=True).select_related('category', 'publisher').prefetch_related('authors')
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class NewArrivalsView(generics.ListAPIView):
    """Nouvelles acquisitions"""
    queryset = Book.objects.filter(is_new_arrival=True).select_related('category', 'publisher').prefetch_related('authors')
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class PopularBooksView(generics.ListAPIView):
    """Livres populaires (basés sur les vues)"""
    queryset = Book.objects.all().select_related('category', 'publisher').prefetch_related('authors').order_by('-views_count')[:20]
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class BooksByCategoryView(generics.ListAPIView):
    """Livres par catégorie"""
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return Book.objects.filter(category_id=category_id).select_related('category', 'publisher').prefetch_related('authors')


class BooksByAuthorView(generics.ListAPIView):
    """Livres par auteur"""
    serializer_class = BookListSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        author_id = self.kwargs['author_id']
        return Book.objects.filter(authors__id=author_id).select_related('category', 'publisher').prefetch_related('authors')


@api_view(['POST'])
@permission_classes([])
def add_book_review(request, book_id):
    """Ajouter un avis sur un livre"""
    book = get_object_or_404(Book, id=book_id)

    data = request.data.copy()
    data['book'] = book.id

    serializer = BookReviewCreateSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Avis ajouté avec succès! Il sera visible après modération.',
            'review': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request, book_id):
    """Emprunter un livre"""
    book = get_object_or_404(Book, id=book_id)

    data = request.data.copy()
    data['book'] = book.id

    serializer = BookBorrowCreateSerializer(data=data)
    if serializer.is_valid():
        borrow = serializer.save(processed_by=request.user)

        # Décrémenter le nombre d'exemplaires disponibles
        book.copies_available -= 1
        if book.copies_available == 0:
            book.status = 'borrowed'
        book.save()

        return Response({
            'message': 'Emprunt enregistré avec succès!',
            'borrow': serializer.data
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def reserve_book(request, book_id):
    """Réserver un livre"""
    book = get_object_or_404(Book, id=book_id)

    data = request.data.copy()
    data['book'] = book.id

    serializer = BookReservationCreateSerializer(data=data)
    if serializer.is_valid():
        reservation = serializer.save()

        # Créer une notification pour l'utilisateur
        from users.models import UserNotification
        from django.contrib.auth.models import User

        # Essayer de trouver l'utilisateur par email
        try:
            user = User.objects.get(email=data.get('reserver_email'))
            UserNotification.objects.create(
                user=user,
                title=f"📚 Réservation confirmée: {book.title}",
                message=f"""
Votre réservation a été enregistrée avec succès !

📖 Livre: {book.title}
👤 Réservé par: {data.get('reserver_name')}
📅 Date de réservation: {reservation.reservation_date.strftime('%d/%m/%Y à %H:%M')}
⏰ Expire le: {reservation.expiry_date.strftime('%d/%m/%Y à %H:%M')}

Vous serez notifié(e) dès que le livre sera disponible pour le retrait.
                """.strip(),
                notification_type='success',
                is_important=True,
                link_url=f"/library/reservations/",
                link_text="Voir mes réservations"
            )
        except User.DoesNotExist:
            pass  # L'utilisateur n'est pas enregistré, pas de notification

        # Créer une notification pour les bibliothécaires
        from users.signals import create_admin_notification
        create_admin_notification(
            title=f"📚 Nouvelle réservation: {book.title}",
            message=f"""
Nouvelle réservation de livre:

📖 Livre: {book.title}
👤 Réservé par: {data.get('reserver_name')} ({data.get('reserver_email')})
📅 Date: {reservation.reservation_date.strftime('%d/%m/%Y à %H:%M')}
⏰ Expire le: {reservation.expiry_date.strftime('%d/%m/%Y à %H:%M')}

Statut: {reservation.get_status_display()}
            """.strip(),
            notification_type='info',
            is_important=False,
            link_url=f"/admin/library/bookreservation/{reservation.id}/change/",
            link_text="Gérer la réservation"
        )

        return Response({
            'success': True,
            'message': 'Réservation enregistrée avec succès!',
            'reservation': serializer.data,
            'book_title': book.title,
            'reservation_id': reservation.id
        }, status=status.HTTP_201_CREATED)

    return Response({
        'success': False,
        'message': 'Erreur lors de la réservation',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([])
def check_reservation_status(request, book_id):
    """Vérifier le statut de réservation d'un livre pour un utilisateur"""
    book = get_object_or_404(Book, id=book_id)
    email = request.query_params.get('email')

    if not email:
        return Response({
            'error': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier s'il y a une réservation active
    reservation = BookReservation.objects.filter(
        book=book,
        reserver_email=email,
        status__in=['pending', 'ready']
    ).first()

    if reservation:
        return Response({
            'has_reservation': True,
            'reservation': {
                'id': reservation.id,
                'status': reservation.status,
                'status_display': reservation.get_status_display(),
                'reservation_date': reservation.reservation_date,
                'expiry_date': reservation.expiry_date,
                'pickup_date': reservation.pickup_date,
            }
        })

    return Response({
        'has_reservation': False,
        'can_reserve': book.status in ['borrowed', 'reserved'] or book.copies_available == 0
    })


@api_view(['GET'])
@permission_classes([])
def user_reservations(request):
    """Obtenir les réservations d'un utilisateur par email"""
    email = request.query_params.get('email')

    if not email:
        return Response({
            'error': 'Email requis'
        }, status=status.HTTP_400_BAD_REQUEST)

    reservations = BookReservation.objects.filter(
        reserver_email=email
    ).select_related('book').order_by('-reservation_date')

    serializer = BookReservationSerializer(reservations, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([])
def cancel_reservation(request, reservation_id):
    """Annuler une réservation"""
    reservation = get_object_or_404(BookReservation, id=reservation_id)

    # Vérifier que l'email correspond
    email = request.data.get('email')
    if reservation.reserver_email != email:
        return Response({
            'error': 'Non autorisé'
        }, status=status.HTTP_403_FORBIDDEN)

    if reservation.status not in ['pending', 'ready']:
        return Response({
            'error': 'Cette réservation ne peut pas être annulée'
        }, status=status.HTTP_400_BAD_REQUEST)

    reservation.status = 'cancelled'
    reservation.save()

    # Créer une notification pour l'utilisateur
    from users.models import UserNotification
    from django.contrib.auth.models import User

    try:
        user = User.objects.get(email=email)
        UserNotification.objects.create(
            user=user,
            title=f"📚 Réservation annulée: {reservation.book.title}",
            message=f"Votre réservation pour le livre '{reservation.book.title}' a été annulée avec succès.",
            notification_type='info',
            is_important=False
        )
    except User.DoesNotExist:
        pass

    return Response({
        'success': True,
        'message': 'Réservation annulée avec succès'
    })


@api_view(['GET'])
def download_book(request, book_id):
    """Télécharger un livre (PDF)"""
    book = get_object_or_404(Book, id=book_id)

    if not book.allow_download:
        return Response(
            {'error': 'Le téléchargement n\'est pas autorisé pour ce livre.'},
            status=status.HTTP_403_FORBIDDEN
        )

    if book.require_permission and not request.user.is_authenticated:
        return Response(
            {'error': 'Vous devez être connecté pour télécharger ce livre.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not book.pdf_file:
        return Response(
            {'error': 'Aucun fichier PDF disponible pour ce livre.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Incrémenter le compteur de téléchargements
    book.download_count += 1
    book.save(update_fields=['download_count'])

    # Retourner le fichier
    try:
        response = HttpResponse(book.pdf_file.read(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{book.title}.pdf"'
        return response
    except Exception:
        raise Http404("Fichier non trouvé")


@api_view(['GET'])
def library_stats(request):
    """Statistiques de la bibliothèque"""
    if not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    stats = {
        'total_books': Book.objects.count(),
        'available_books': Book.objects.filter(status='available').count(),
        'borrowed_books': Book.objects.filter(status='borrowed').count(),
        'reserved_books': Book.objects.filter(status='reserved').count(),
        'total_authors': Author.objects.count(),
        'total_publishers': Publisher.objects.count(),
        'total_categories': BookCategory.objects.count(),
        'active_borrows': BookBorrow.objects.filter(status='active').count(),
        'overdue_borrows': BookBorrow.objects.filter(status='overdue').count(),
        'pending_reservations': BookReservation.objects.filter(status='pending').count(),
        'pending_reviews': BookReview.objects.filter(is_approved=False).count(),
        'total_downloads': Book.objects.aggregate(total=models.Sum('download_count'))['total'] or 0,
    }

    return Response(stats)


@api_view(['GET'])
def search_books(request):
    """Recherche de livres"""
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})

    books = Book.objects.filter(
        models.Q(title__icontains=query) |
        models.Q(subtitle__icontains=query) |
        models.Q(description_fr__icontains=query) |
        models.Q(description_ar__icontains=query) |
        models.Q(isbn__icontains=query) |
        models.Q(authors__first_name__icontains=query) |
        models.Q(authors__last_name__icontains=query)
    ).distinct().select_related('category', 'publisher').prefetch_related('authors')[:20]

    serializer = BookListSerializer(books, many=True)
    return Response({'results': serializer.data})
