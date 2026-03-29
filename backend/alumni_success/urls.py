from rest_framework.routers import DefaultRouter
from .views import AlumniSuccessViewSet

router = DefaultRouter()
router.register(r'', AlumniSuccessViewSet, basename='alumnisuccess')

urlpatterns = router.urls
