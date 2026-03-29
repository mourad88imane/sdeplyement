from django.urls import path
from . import views

urlpatterns = [
    # Catégories, auteurs, éditeurs
    path('categories/', views.BookCategoryListView.as_view(), name='book-categories'),
    path('authors/', views.AuthorListView.as_view(), name='authors'),
    path('publishers/', views.PublisherListView.as_view(), name='publishers'),
    
    # Livres
    path('books/', views.BookListView.as_view(), name='book-list'),
    path('books/featured/', views.FeaturedBooksView.as_view(), name='featured-books'),
    path('books/new-arrivals/', views.NewArrivalsView.as_view(), name='new-arrivals'),
    path('books/popular/', views.PopularBooksView.as_view(), name='popular-books'),
    path('books/search/', views.search_books, name='search-books'),
    path('books/category/<int:category_id>/', views.BooksByCategoryView.as_view(), name='books-by-category'),
    path('books/author/<int:author_id>/', views.BooksByAuthorView.as_view(), name='books-by-author'),
    path('books/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    
    # Actions sur les livres
    path('books/<int:book_id>/review/', views.add_book_review, name='add-book-review'),
    path('books/<int:book_id>/borrow/', views.borrow_book, name='borrow-book'),
    path('books/<int:book_id>/reserve/', views.reserve_book, name='reserve-book'),
    path('books/<int:book_id>/reservation-status/', views.check_reservation_status, name='check-reservation-status'),
    path('books/<int:book_id>/download/', views.download_book, name='download-book'),

    # Réservations
    path('reservations/', views.user_reservations, name='user-reservations'),
    path('reservations/<int:reservation_id>/cancel/', views.cancel_reservation, name='cancel-reservation'),
    
    # Statistiques
    path('stats/', views.library_stats, name='library-stats'),
]
