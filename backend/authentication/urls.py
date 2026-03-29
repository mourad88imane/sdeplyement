from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    UpdateUserView, UpdateProfileView, ChangePasswordView,
    DeleteAccountView, user_stats, password_reset_request,
    CustomTokenObtainPairView, CustomTokenRefreshView
)

app_name = 'authentication'

urlpatterns = [
    # Authentification de base
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # Gestion du profil utilisateur
    path('user/', CurrentUserView.as_view(), name='current-user'),
    path('user/update/', UpdateUserView.as_view(), name='update-user'),
    path('profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('profile/stats/', user_stats, name='user-stats'),
    
    # Gestion des mots de passe
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/', password_reset_request, name='password-reset'),
    
    # Suppression de compte
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    
    # JWT Token endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token-refresh'),
]
