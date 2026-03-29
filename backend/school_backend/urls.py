"""
URL configuration for school_backend project.
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from users.dashboard_views import dashboard

# Importer les vues d'authentification
from auth_api_fixed import register_user_fixed, login_user_fixed, check_auth_fixed, test_cors
from events.admin import categories_dashboard_view

urlpatterns = [
    path('', views.home_view, name='home'),
    path('admin/', admin.site.urls),

    # Tableau de bord des catégories d'événements
    path('admin/events/categories-dashboard/', categories_dashboard_view, name='categories_dashboard'),

    # Dashboard principal
    path('dashboard/', dashboard, name='dashboard'),

    # Gestion des utilisateurs
    path('dashboard/users/', views.users_management, name='users_management'),
    path('dashboard/users/<int:user_id>/', views.user_detail, name='user_detail'),

    # Gestion des cours
    path('dashboard/courses/', views.courses_management, name='courses_management'),
    path('dashboard/courses/add/', views.course_add, name='course_add'),
    path('dashboard/courses/<int:course_id>/', views.course_detail, name='course_detail'),
    path('dashboard/courses/<int:course_id>/edit/', views.course_edit, name='course_edit'),
    path('dashboard/formation/', views.formation_management, name='formation_management'),
    path('dashboard/formation/add/', views.formation_add, name='formation_add'),

    # Gestion de la bibliothèque
    path('dashboard/library/', views.library_management, name='library_management'),
    path('dashboard/library/books/<int:book_id>/', views.book_detail, name='book_detail'),

    # Gestion des actualités
    path('dashboard/news/', views.news_management, name='news_management'),

    # Statistiques avancées
    path('dashboard/statistics/', views.advanced_statistics, name='advanced_statistics'),

    # API endpoints
    path('api/', views.api_root, name='api-root'),
    path('api/courses/', include('courses.urls')),
    path('api/news/', include('news.urls')),
    path('api/library/', include('library.urls')),
    path('api/users/', include('users.urls')),
    path('api/events/', include('events.urls')),
    path('events/', include('events.urls')),
    path('api/banner/', include('banner.urls')),
    path('api/reviews/', include('reviews.urls')),
    path('api/alumni-success/', include('alumni_success.urls')),
    path('api/team/', include('team.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/ohb-formations/', include('ohb_formation.urls')),
    path('api/partners/', include('partners.urls')),
    path('api/museum/', include('museum.urls')),



    # API d'authentification principale
    path('api/auth/register/', register_user_fixed, name='api_register'),
    path('api/auth/login/', login_user_fixed, name='api_login'),
    path('api/auth/check/', check_auth_fixed, name='api_check_auth'),

    # Test CORS simple
    path('api/test-cors/', test_cors, name='test_cors'),

    # Page de debug pour tester l'API
    path('debug-api/', views.debug_api_view, name='debug_api'),
    path('api-docs/', views.api_docs_view, name='api_docs'),

    # APIs principales pour les événements
    path('api/events/', views.api_events_main, name='api_events_main'),
    path('api/conferences/', views.api_conferences_main, name='api_conferences_main'),

    # APIs spécialisées par type d'événement
    path('api/events/<str:event_type>/', views.api_events_by_type, name='api_events_by_type'),
    path('api/hackathon/', include('hackathon.urls')),

    # Catch-all pour debug - doit être à la fin
    re_path(r'^api/.*', views.catch_all_api, name='catch_all_api'),



]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "École Nationale des Transmissions - Admin Imane"
admin.site.site_title = "ENT Admin"
admin.site.index_title = "Panneau d'Administration"
