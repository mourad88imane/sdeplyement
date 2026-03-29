#!/usr/bin/env python3
"""
Script de configuration initiale pour le backend Django
"""

import os
import sys
import django
from django.core.management import execute_from_command_line
from django.contrib.auth.models import User

def setup_django():
    """Configuration de Django"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
    django.setup()

def create_superuser():
    """Créer un superutilisateur"""
    from django.contrib.auth.models import User
    from users.models import UserProfile
    
    if not User.objects.filter(username='admin').exists():
        print("Création du superutilisateur...")
        user = User.objects.create_superuser(
            username='admin',
            email='admin@ent.dz',
            password='admin123',
            first_name='Administrateur',
            last_name='ENT'
        )
        
        # Créer le profil
        UserProfile.objects.create(
            user=user,
            user_type='admin',
            phone='+213555000000',
            department='Administration',
            is_verified=True
        )
        
        print("Superutilisateur créé: admin / admin123")
    else:
        print("Superutilisateur déjà existant")

def create_sample_data():
    """Créer des données d'exemple"""
    from courses.models import CourseCategory, Course
    from news.models import NewsCategory, News
    from library.models import BookCategory, Author, Publisher, Book
    
    print("Création des données d'exemple...")
    
    # Catégories de cours
    course_categories = [
        {
            'name_fr': 'Réseaux et Télécommunications',
            'name_ar': 'الشبكات والاتصالات',
            'icon': 'network'
        },
        {
            'name_fr': 'Informatique et Programmation',
            'name_ar': 'الإعلام الآلي والبرمجة',
            'icon': 'cpu'
        },
        {
            'name_fr': 'Cybersécurité',
            'name_ar': 'الأمن السيبراني',
            'icon': 'shield'
        }
    ]
    
    for cat_data in course_categories:
        CourseCategory.objects.get_or_create(**cat_data)
    
    # Catégories d'actualités
    news_categories = [
        {
            'name_fr': 'Actualités Générales',
            'name_ar': 'أخبار عامة',
            'color': '#3B82F6'
        },
        {
            'name_fr': 'Événements',
            'name_ar': 'فعاليات',
            'color': '#10B981'
        },
        {
            'name_fr': 'Formations',
            'name_ar': 'تكوينات',
            'color': '#F59E0B'
        }
    ]
    
    for cat_data in news_categories:
        NewsCategory.objects.get_or_create(**cat_data)
    
    # Catégories de livres
    book_categories = [
        {
            'name_fr': 'Télécommunications',
            'name_ar': 'الاتصالات',
            'icon': 'radio'
        },
        {
            'name_fr': 'Informatique',
            'name_ar': 'الإعلام الآلي',
            'icon': 'monitor'
        },
        {
            'name_fr': 'Mathématiques',
            'name_ar': 'الرياضيات',
            'icon': 'calculator'
        }
    ]
    
    for cat_data in book_categories:
        BookCategory.objects.get_or_create(**cat_data)
    
    print("Données d'exemple créées avec succès!")

def main():
    """Fonction principale"""
    print("=== Configuration du Backend Django ===")
    
    # Configuration Django
    setup_django()
    
    # Migrations
    print("Application des migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Création du superutilisateur
    create_superuser()
    
    # Création des données d'exemple
    create_sample_data()
    
    # Collecte des fichiers statiques
    print("Collecte des fichiers statiques...")
    execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
    
    print("\n=== Configuration terminée ===")
    print("Vous pouvez maintenant démarrer le serveur avec:")
    print("python manage.py runserver")
    print("\nAccès admin: http://localhost:8000/admin/")
    print("Identifiants: admin / admin123")

if __name__ == '__main__':
    main()
