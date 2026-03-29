from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import login
from django.utils.translation import gettext_lazy as _
from .models import User, UserProfile
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    ChangePasswordSerializer, UserUpdateSerializer, 
    UserProfileSerializer, PasswordResetSerializer
)
import logging

logger = logging.getLogger(__name__)


class RegisterView(generics.CreateAPIView):
    """Vue pour l'inscription d'un nouvel utilisateur"""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Sérialiser les données utilisateur
            user_serializer = UserSerializer(user)
            
            logger.info(f"Nouvel utilisateur inscrit: {user.username} ({user.email})")
            
            return Response({
                'user': user_serializer.data,
                'access': str(access_token),
                'refresh': str(refresh),
                'message': 'Compte créé avec succès'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            logger.error(f"Erreur lors de l'inscription: {str(e)}")
            return Response({
                'error': 'Une erreur est survenue lors de la création du compte'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(APIView):
    """Vue pour la connexion utilisateur"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            # Connecter l'utilisateur
            login(request, user)
            
            # Générer les tokens JWT
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            
            # Sérialiser les données utilisateur
            user_serializer = UserSerializer(user)
            
            logger.info(f"Utilisateur connecté: {user.username}")
            
            return Response({
                'user': user_serializer.data,
                'access': str(access_token),
                'refresh': str(refresh),
                'message': 'Connexion réussie'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """Vue pour la déconnexion utilisateur"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                
            logger.info(f"Utilisateur déconnecté: {request.user.username}")
            return Response({
                'message': 'Déconnexion réussie'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erreur lors de la déconnexion: {str(e)}")
            return Response({
                'error': 'Erreur lors de la déconnexion'
            }, status=status.HTTP_400_BAD_REQUEST)


class CurrentUserView(generics.RetrieveAPIView):
    """Vue pour récupérer les informations de l'utilisateur actuel"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UpdateUserView(generics.UpdateAPIView):
    """Vue pour mettre à jour les informations utilisateur"""
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Retourner les données utilisateur complètes
        user_serializer = UserSerializer(user)
        
        logger.info(f"Profil utilisateur mis à jour: {user.username}")
        
        return Response({
            'user': user_serializer.data,
            'message': 'Profil mis à jour avec succès'
        }, status=status.HTTP_200_OK)


class UpdateProfileView(generics.UpdateAPIView):
    """Vue pour mettre à jour le profil utilisateur"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        profile = serializer.save()
        
        logger.info(f"Profil utilisateur mis à jour: {request.user.username}")
        
        return Response({
            'profile': serializer.data,
            'message': 'Profil mis à jour avec succès'
        }, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """Vue pour changer le mot de passe"""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            
            logger.info(f"Mot de passe changé pour: {request.user.username}")
            
            return Response({
                'message': 'Mot de passe changé avec succès'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    """Vue pour supprimer le compte utilisateur"""
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        username = user.username
        
        try:
            # Supprimer l'avatar s'il existe
            if hasattr(user, 'profile') and user.profile.avatar:
                user.profile.delete_avatar()
            
            # Supprimer l'utilisateur
            user.delete()
            
            logger.info(f"Compte supprimé: {username}")
            
            return Response({
                'message': 'Compte supprimé avec succès'
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"Erreur lors de la suppression du compte {username}: {str(e)}")
            return Response({
                'error': 'Erreur lors de la suppression du compte'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Statistiques utilisateur"""
    user = request.user
    
    # Ici vous pouvez ajouter des statistiques spécifiques
    # comme le nombre de livres empruntés, réservations, etc.
    
    stats = {
        'user_id': user.id,
        'username': user.username,
        'date_joined': user.date_joined,
        'last_login': user.last_login,
        'is_verified': user.is_verified,
        # Ajoutez d'autres statistiques selon vos besoins
    }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def password_reset_request(request):
    """Demande de réinitialisation de mot de passe"""
    serializer = PasswordResetSerializer(data=request.data)
    
    if serializer.is_valid():
        email = serializer.validated_data['email']
        
        # Ici vous pouvez implémenter l'envoi d'email
        # pour la réinitialisation de mot de passe
        
        logger.info(f"Demande de réinitialisation de mot de passe pour: {email}")
        
        return Response({
            'message': 'Un email de réinitialisation a été envoyé'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vues personnalisées pour JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    """Vue personnalisée pour obtenir les tokens JWT"""
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Ajouter les informations utilisateur à la réponse
            username = request.data.get('username')
            
            # Permettre la connexion avec email
            if '@' in username:
                try:
                    user = User.objects.get(email__iexact=username)
                except User.DoesNotExist:
                    return response
            else:
                try:
                    user = User.objects.get(username=username)
                except User.DoesNotExist:
                    return response
            
            user_serializer = UserSerializer(user)
            response.data['user'] = user_serializer.data
            
        return response


class CustomTokenRefreshView(TokenRefreshView):
    """Vue personnalisée pour rafraîchir les tokens JWT"""
    pass
