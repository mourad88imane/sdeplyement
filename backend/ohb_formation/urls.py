from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'ohb_formation'

router = DefaultRouter()
router.register(r'categories', views.FormationCategoryViewSet, basename='formation-category')
router.register(r'', views.FormationViewSet, basename='formation')

urlpatterns = [
    path('', include(router.urls)),
]
