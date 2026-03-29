from django.urls import path
from . import views

urlpatterns = [
    # Équipements - Catégories
    path('equipment/categories/', views.MuseumEquipmentCategoryListView.as_view(), name='equipment-categories'),
    path('equipment/categories/<int:pk>/', views.MuseumEquipmentCategoryDetailView.as_view(), name='equipment-category-detail'),
    
    # Équipements
    path('equipment/', views.MuseumEquipmentListView.as_view(), name='equipment-list'),
    path('equipment/featured/', views.FeaturedEquipmentView.as_view(), name='featured-equipment'),
    path('equipment/category/<int:category_id>/', views.EquipmentByCategoryView.as_view(), name='equipment-by-category'),
    path('equipment/status/<str:status>/', views.EquipmentByStatusView.as_view(), name='equipment-by-status'),
    path('equipment/search/', views.search_equipment, name='search-equipment'),
    path('equipment/<slug:slug>/', views.MuseumEquipmentDetailView.as_view(), name='equipment-detail'),
    
    # Personnalités
    path('personalities/', views.MuseumPersonalityListView.as_view(), name='personalities-list'),
    path('personalities/featured/', views.FeaturedPersonalityView.as_view(), name='featured-personalities'),
    path('personalities/role/<str:role>/', views.PersonalityByRoleView.as_view(), name='personalities-by-role'),
    path('personalities/search/', views.search_personalities, name='search-personalities'),
    path('personalities/<slug:slug>/', views.MuseumPersonalityDetailView.as_view(), name='personality-detail'),
    
    # Statistiques
    path('stats/', views.museum_stats, name='museum-stats'),
]
