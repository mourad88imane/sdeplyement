from rest_framework import viewsets
from .models import TeamMember, Director
from .serializers import TeamMemberSerializer, DirectorSerializer

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by('order')
    serializer_class = TeamMemberSerializer


class DirectorViewSet(viewsets.ModelViewSet):
    """ViewSet pour les directeurs"""
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer

    def get_queryset(self):
        # Optionnel: filtrer pour obtenir seulement le directeur actuel
        current = self.request.query_params.get('current')
        if current == 'true':
            return Director.objects.filter(is_current=True)
        return Director.objects.all()
