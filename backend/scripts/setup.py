#!/usr/bin/env python
"""
Script de configuration initiale du projet Django
"""
import os
import sys
import django
from django.core.management import execute_from_command_line
from django.contrib.auth import get_user_model

# Ajouter le répertoire parent au path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ent_backend.settings')
django.setup()

def create_superuser():
    """Crée un superutilisateur par défaut"""
    User = get_user_model()
    
    if not User.objects.filter(username='admin').exists():
        print("Création du superutilisateur...")
        User.objects.create_superuser(
            username='admin',
            email='admin@ent.dz',
            password='admin123',
            first_name='Admin',
            last_name='ENT'
        )
        print("✅ Superutilisateur créé: admin / admin123")
    else:
        print("ℹ️ Le superutilisateur existe déjà")

def create_test_users():
    """Crée des utilisateurs de test"""
    User = get_user_model()
    
    test_users = [
        {
            'username': 'student1',
            'email': 'student1@ent.dz',
            'password': 'password123',
            'first_name': 'Ahmed',
            'last_name': 'Benali'
        },
        {
            'username': 'teacher1',
            'email': 'teacher1@ent.dz',
            'password': 'password123',
            'first_name': 'Fatima',
            'last_name': 'Khelifi'
        },
        {
            'username': 'librarian1',
            'email': 'librarian1@ent.dz',
            'password': 'password123',
            'first_name': 'Mohamed',
            'last_name': 'Boudiaf'
        }
    ]
    
    for user_data in test_users:
        if not User.objects.filter(username=user_data['username']).exists():
            user = User.objects.create_user(**user_data)
            print(f"✅ Utilisateur de test créé: {user.username}")
        else:
            print(f"ℹ️ L'utilisateur {user_data['username']} existe déjà")

def main():
    """Fonction principale de configuration"""
    print("🚀 Configuration initiale du projet ENT...")
    
    # Créer les répertoires nécessaires
    os.makedirs('logs', exist_ok=True)
    os.makedirs('media/avatars', exist_ok=True)
    os.makedirs('static', exist_ok=True)
    
    # Migrations
    print("\n📦 Application des migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Créer les utilisateurs
    print("\n👥 Création des utilisateurs...")
    create_superuser()
    create_test_users()
    
    # Collecter les fichiers statiques
    print("\n📁 Collecte des fichiers statiques...")
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
    
    print("\n✅ Configuration terminée!")
    print("\n🌐 Vous pouvez maintenant démarrer le serveur avec:")
    print("   python manage.py runserver")
    print("\n🔐 Connexion admin:")
    print("   URL: http://127.0.0.1:8000/admin/")
    print("   Username: admin")
    print("   Password: admin123")

if __name__ == '__main__':
    main()
