from rest_framework import generics
from .models import Banner
from .serializers import BannerSerializer

class ActiveBannerView(generics.ListAPIView):
    queryset = Banner.objects.filter(is_active=True).order_by('id')
    serializer_class = BannerSerializer
