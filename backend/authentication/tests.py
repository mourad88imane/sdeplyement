from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import UserProfile

User = get_user_model()


class UserModelTest(TestCase):
    """Tests pour le modèle User"""
    
    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_create_user(self):
        """Test de création d'un utilisateur"""
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.full_name, 'Test User')
        self.assertTrue(user.check_password('testpass123'))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
    
    def test_create_superuser(self):
        """Test de création d'un superutilisateur"""
        user = User.objects.create_superuser(**self.user_data)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
    
    def test_user_profile_creation(self):
        """Test de création automatique du profil utilisateur"""
        user = User.objects.create_user(**self.user_data)
        self.assertTrue(hasattr(user, 'profile'))
        self.assertIsInstance(user.profile, UserProfile)
    
    def test_email_normalization(self):
        """Test de normalisation de l'email"""
        user_data = self.user_data.copy()
        user_data['email'] = 'TEST@EXAMPLE.COM'
        user = User.objects.create_user(**user_data)
        self.assertEqual(user.email, 'test@example.com')


class AuthenticationAPITest(APITestCase):
    """Tests pour l'API d'authentification"""
    
    def setUp(self):
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.user_url = reverse('authentication:current-user')
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123',
            'password_confirm': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_user_registration(self):
        """Test d'inscription d'un utilisateur"""
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        
        # Vérifier que l'utilisateur a été créé
        user = User.objects.get(username='testuser')
        self.assertEqual(user.email, 'test@example.com')
    
    def test_user_registration_password_mismatch(self):
        """Test d'inscription avec mots de passe non correspondants"""
        data = self.user_data.copy()
        data['password_confirm'] = 'differentpassword'
        response = self.client.post(self.register_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_registration_duplicate_username(self):
        """Test d'inscription avec nom d'utilisateur existant"""
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.register_url, self.user_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_user_login(self):
        """Test de connexion utilisateur"""
        # Créer un utilisateur
        User.objects.create_user(**self.user_data)
        
        # Tenter la connexion
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
    
    def test_user_login_with_email(self):
        """Test de connexion avec email"""
        # Créer un utilisateur
        User.objects.create_user(**self.user_data)
        
        # Tenter la connexion avec email
        login_data = {
            'username': 'test@example.com',
            'password': 'testpass123'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_user_login_invalid_credentials(self):
        """Test de connexion avec identifiants invalides"""
        login_data = {
            'username': 'nonexistent',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_current_user_authenticated(self):
        """Test de récupération du profil utilisateur authentifié"""
        # Créer et authentifier un utilisateur
        user = User.objects.create_user(**self.user_data)
        refresh = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')
    
    def test_get_current_user_unauthenticated(self):
        """Test de récupération du profil sans authentification"""
        response = self.client.get(self.user_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserProfileTest(APITestCase):
    """Tests pour le profil utilisateur"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        self.profile_url = reverse('authentication:update-profile')
    
    def test_update_profile(self):
        """Test de mise à jour du profil"""
        profile_data = {
            'phone': '+213123456789',
            'bio': 'Test bio',
            'language_preference': 'ar'
        }
        response = self.client.patch(self.profile_url, profile_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que le profil a été mis à jour
        self.user.profile.refresh_from_db()
        self.assertEqual(self.user.profile.phone, '+213123456789')
        self.assertEqual(self.user.profile.bio, 'Test bio')
        self.assertEqual(self.user.profile.language_preference, 'ar')


class PasswordChangeTest(APITestCase):
    """Tests pour le changement de mot de passe"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='oldpassword123',
            first_name='Test',
            last_name='User'
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
        self.change_password_url = reverse('authentication:change-password')
    
    def test_change_password_success(self):
        """Test de changement de mot de passe réussi"""
        data = {
            'old_password': 'oldpassword123',
            'new_password': 'newpassword123'
        }
        response = self.client.post(self.change_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Vérifier que le mot de passe a été changé
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))
    
    def test_change_password_wrong_old_password(self):
        """Test de changement avec mauvais ancien mot de passe"""
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpassword123'
        }
        response = self.client.post(self.change_password_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
