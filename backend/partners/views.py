from rest_framework import viewsets, permissions
from .models import Partnership
from .serializers import PartnershipSerializer

class PartnershipViewSet(viewsets.ModelViewSet):
    queryset = Partnership.objects.all()
    serializer_class = PartnershipSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
