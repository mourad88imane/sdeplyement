from django.urls import path
from . import views
from .admin import categories_dashboard_view

urlpatterns = [
    # Tableau de bord admin
    path('admin/categories-dashboard/', categories_dashboard_view, name='categories_dashboard'),

    # Gestion admin des événements
    path('management/', views.events_management, name='events_management'),
    path('detail/<int:event_id>/', views.event_detail, name='event_detail'),
    path('statistics/', views.events_statistics, name='events_statistics'),
    
    # Actions utilisateur
    path('register/<int:event_id>/', views.event_register, name='event_register'),
    path('cancel/<int:event_id>/', views.event_cancel_registration, name='event_cancel_registration'),
    
    # API pour les actions admin
    path('api/update-registration-status/', views.update_registration_status, name='update_registration_status'),

    # API REST pour le frontend (note: included at /api/events/ so paths here become /api/events/api/...)
    path('events/', views.api_events_paginated, name='api_events_paginated'),
    path('conferences/', views.api_conferences_paginated, name='api_conferences_paginated'),
    path('events-simple/', views.api_events_list, name='api_events_list'),
    path('conferences-simple/', views.api_conferences_list, name='api_conferences_list'),
    path('event/<slug:slug>/', views.api_event_by_slug, name='api_event_by_slug'),


]
