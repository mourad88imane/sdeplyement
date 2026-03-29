#!/usr/bin/env python3
"""
API d'authentification avec CORS corrigé pour l'ENT
"""
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.utils import timezone
from users.models import UserProfile
import json
import re

def cors_json_response(data, status=200):
    """Créer une réponse JSON avec headers CORS"""
    response = JsonResponse(data, status=status)
    response['Access-Control-Allow-Origin'] = '*'
    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With'
    response['Access-Control-Allow-Credentials'] = 'true'
    return response

@csrf_exempt
def register_user_fixed(request):
    """Endpoint d'inscription avec CORS corrigé"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    # Gérer les requêtes GET pour afficher les informations de l'API
    if request.method == 'GET':
        return cors_json_response({
            'message': 'API d\'inscription ENT',
            'method': 'POST',
            'endpoint': '/api/auth/register/',
            'required_fields': [
                'username', 'email', 'password', 'password_confirm',
                'first_name', 'last_name'
            ],
            'optional_fields': ['phone', 'address'],
            'example': {
                'username': 'john_doe',
                'email': 'john@ent.dz',
                'password': 'password123',
                'password_confirm': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'phone': '+213 555 000 000',
                'address': 'Alger, Algérie'
            }
        })

    if request.method != 'POST':
        return cors_json_response({'error': 'Seules les requêtes POST sont autorisées pour l\'inscription'}, status=405)
    
    try:
        # Parser les données JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return cors_json_response({'error': 'Données JSON invalides'}, status=400)
        
        # Validation des champs requis
        required_fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data or not str(data[field]).strip():
                return cors_json_response({
                    'error': f'Le champ {field} est requis'
                }, status=400)
        
        username = str(data['username']).strip()
        email = str(data['email']).strip().lower()
        password = str(data['password'])
        password_confirm = str(data['password_confirm'])
        first_name = str(data['first_name']).strip()
        last_name = str(data['last_name']).strip()
        
        # Validation du nom d'utilisateur
        if len(username) < 3:
            return cors_json_response({
                'error': 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
            }, status=400)
        
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            return cors_json_response({
                'error': 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'
            }, status=400)
        
        # Validation de l'email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return cors_json_response({
                'error': 'Format d\'email invalide'
            }, status=400)
        
        # Validation du mot de passe
        if len(password) < 6:
            return cors_json_response({
                'error': 'Le mot de passe doit contenir au moins 6 caractères'
            }, status=400)
        
        # Vérifier que les mots de passe correspondent
        if password != password_confirm:
            return cors_json_response({
                'error': 'Les mots de passe ne correspondent pas'
            }, status=400)
        
        # Vérifier si l'utilisateur existe déjà
        if User.objects.filter(username=username).exists():
            return cors_json_response({
                'error': 'Ce nom d\'utilisateur est déjà utilisé'
            }, status=400)
        
        if User.objects.filter(email=email).exists():
            return cors_json_response({
                'error': 'Cette adresse email est déjà utilisée'
            }, status=400)
        
        # Créer l'utilisateur
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        # Créer le profil utilisateur
        profile = UserProfile.objects.create(
            user=user,
            user_type='student',  # Par défaut, les nouveaux utilisateurs sont des étudiants
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            date_of_birth=data.get('date_of_birth', None)
        )
        
        # Préparer les données de réponse
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_active': user.is_active,
            'date_joined': user.date_joined.isoformat(),
            'profile': {
                'user_type': profile.user_type,
                'phone': profile.phone,
                'address': profile.address
            }
        }
        
        return cors_json_response({
            'message': 'Inscription réussie ! Votre compte a été créé.',
            'user': user_data,
            'success': True
        }, status=201)
        
    except Exception as e:
        return cors_json_response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=500)

@csrf_exempt
def login_user_fixed(request):
    """Endpoint de connexion avec CORS corrigé"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    # Gérer les requêtes GET pour afficher les informations de l'API
    if request.method == 'GET':
        return cors_json_response({
            'message': 'API de connexion ENT',
            'method': 'POST',
            'endpoint': '/api/auth/login/',
            'required_fields': ['username', 'password'],
            'example': {
                'username': 'john_doe',
                'password': 'password123'
            }
        })

    if request.method != 'POST':
        return cors_json_response({'error': 'Seules les requêtes POST sont autorisées pour la connexion'}, status=405)
    
    try:
        # Parser les données JSON
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return cors_json_response({'error': 'Données JSON invalides'}, status=400)
        
        # Validation des champs requis
        if 'username' not in data or 'password' not in data:
            return cors_json_response({
                'error': 'Nom d\'utilisateur et mot de passe requis'
            }, status=400)
        
        username = str(data['username']).strip()
        password = str(data['password'])
        
        # Authentifier l'utilisateur
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            if user.is_active:
                # Connecter l'utilisateur
                login(request, user)
                
                # Récupérer le profil
                try:
                    profile = user.profile
                except UserProfile.DoesNotExist:
                    # Créer un profil s'il n'existe pas
                    profile = UserProfile.objects.create(
                        user=user,
                        user_type='student'
                    )
                
                # Préparer les données de réponse
                user_data = {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_active': user.is_active,
                    'is_staff': user.is_staff,
                    'last_login': user.last_login.isoformat() if user.last_login else None,
                    'profile': {
                        'user_type': profile.user_type,
                        'phone': profile.phone,
                        'address': profile.address
                    }
                }
                
                return cors_json_response({
                    'message': 'Connexion réussie',
                    'user': user_data,
                    'success': True
                }, status=200)
            else:
                return cors_json_response({
                    'error': 'Votre compte est désactivé'
                }, status=401)
        else:
            return cors_json_response({
                'error': 'Nom d\'utilisateur ou mot de passe incorrect'
            }, status=401)
            
    except Exception as e:
        return cors_json_response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=500)

@csrf_exempt
def check_auth_fixed(request):
    """Vérifier si l'utilisateur est connecté avec CORS"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    try:
        if request.user.is_authenticated:
            try:
                profile = request.user.profile
            except UserProfile.DoesNotExist:
                profile = UserProfile.objects.create(
                    user=request.user,
                    user_type='student'
                )

            user_data = {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'is_active': request.user.is_active,
                'is_staff': request.user.is_staff,
                'profile': {
                    'user_type': profile.user_type,
                    'phone': profile.phone,
                    'address': profile.address
                }
            }

            return cors_json_response({
                'authenticated': True,
                'user': user_data
            })
        else:
            return cors_json_response({
                'authenticated': False
            })
    except Exception as e:
        return cors_json_response({
            'error': f'Erreur serveur: {str(e)}'
        }, status=500)

@csrf_exempt
def debug_request(request):
    """Endpoint de debug pour analyser les requêtes"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'ok'})

    # Collecter toutes les informations sur la requête
    debug_info = {
        'method': request.method,
        'path': request.path,
        'headers': dict(request.headers),
        'origin': request.headers.get('Origin', 'Non spécifié'),
        'user_agent': request.headers.get('User-Agent', 'Non spécifié'),
        'content_type': request.content_type,
        'remote_addr': request.META.get('REMOTE_ADDR', 'Non spécifié'),
        'query_params': dict(request.GET),
        'timestamp': timezone.now().isoformat(),
    }

    # Si c'est une requête POST, essayer de lire le body
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                body_data = json.loads(request.body)
                # Masquer les mots de passe pour la sécurité
                if 'password' in body_data:
                    body_data['password'] = '***MASQUÉ***'
                if 'password_confirm' in body_data:
                    body_data['password_confirm'] = '***MASQUÉ***'
                debug_info['body'] = body_data
            else:
                debug_info['body'] = 'Non-JSON ou vide'
        except Exception as e:
            debug_info['body_error'] = str(e)

    return cors_json_response({
        'message': 'Debug request reçue avec succès',
        'request_info': debug_info
    })

@csrf_exempt
def test_cors(request):
    """Test simple pour vérifier CORS depuis votre frontend"""

    # Gérer les requêtes OPTIONS pour CORS
    if request.method == 'OPTIONS':
        return cors_json_response({'status': 'preflight_ok'})

    # Informations sur la requête
    info = {
        'method': request.method,
        'origin': request.headers.get('Origin', 'Non spécifié'),
        'user_agent': request.headers.get('User-Agent', 'Non spécifié'),
        'timestamp': timezone.now().isoformat(),
        'message': 'CORS fonctionne correctement !',
        'frontend_ready': True
    }

    return cors_json_response(info)
