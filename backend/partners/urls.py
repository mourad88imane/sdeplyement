from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PartnershipViewSet

router = DefaultRouter()
router.register(r'partners', PartnershipViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
