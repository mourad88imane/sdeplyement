from django.urls import path
from . import views

app_name = 'contact'

urlpatterns = [
    path('submit/', views.submit_contact, name='submit_contact'),
    path('info/', views.contact_info, name='contact_info'),
]
