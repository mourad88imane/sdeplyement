from rest_framework import routers
from .views import TeamMemberViewSet, DirectorViewSet

from django.urls import path
from .views import TeamMemberViewSet, DirectorViewSet

team_list = TeamMemberViewSet.as_view({
	'get': 'list',
	'post': 'create',
})
team_detail = TeamMemberViewSet.as_view({
	'get': 'retrieve',
	'put': 'update',
	'patch': 'partial_update',
	'delete': 'destroy',
})

director_list = DirectorViewSet.as_view({
	'get': 'list',
	'post': 'create',
})
director_detail = DirectorViewSet.as_view({
	'get': 'retrieve',
	'put': 'update',
	'patch': 'partial_update',
	'delete': 'destroy',
})

urlpatterns = [
	path('', team_list, name='team-list'),
	path('<int:pk>/', team_detail, name='team-detail'),
	path('directors/', director_list, name='director-list'),
	path('directors/<int:pk>/', director_detail, name='director-detail'),
]
