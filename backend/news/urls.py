from django.urls import path
from . import views

urlpatterns = [
    # Catégories
    path('categories/', views.NewsCategoryListView.as_view(), name='news-categories'),
    
    # Actualités
    path('', views.NewsListView.as_view(), name='news-list'),
    path('featured/', views.FeaturedNewsView.as_view(), name='featured-news'),
    path('latest/', views.LatestNewsView.as_view(), name='latest-news'),
    path('popular/', views.popular_news, name='popular-news'),
    path('search/', views.search_news, name='search-news'),
    path('stats/', views.news_stats, name='news-stats'),
    path('category/<int:category_id>/', views.NewsByCategoryView.as_view(), name='news-by-category'),
    # Alumni Success
    path('alumni/', views.AlumniListView.as_view(), name='alumni-list'),
    path('alumni/<slug:slug>/', views.AlumniDetailView.as_view(), name='alumni-detail'),
    # Upload a photo for a specific alumni success (staff only)
    path('alumni/<slug:slug>/photos/', views.AlumniPhotoUploadView.as_view(), name='alumni-photo-upload'),
    path('alumni/photos/<int:pk>/', views.AlumniPhotoDetailView.as_view(), name='alumni-photo-detail'),

    path('<slug:slug>/', views.NewsDetailView.as_view(), name='news-detail'),
    
    # Commentaires
    path('<slug:news_slug>/comment/', views.add_comment, name='add-comment'),
    
    # Tags
    path('tags/', views.NewsTagListView.as_view(), name='news-tags'),
    
    # Newsletter
    path('newsletter/subscribe/', views.subscribe_newsletter, name='subscribe-newsletter'),
    path('newsletter/unsubscribe/', views.unsubscribe_newsletter, name='unsubscribe-newsletter'),
]
