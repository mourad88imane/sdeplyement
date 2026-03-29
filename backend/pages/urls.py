from django.urls import path
from .views import MissionView

urlpatterns = [
    path('mission/', MissionView.as_view(), name='mission'),
]
