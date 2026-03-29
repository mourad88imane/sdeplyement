#!/usr/bin/env python
"""
Script pour créer des données de test pour la bibliothèque
"""
import os
import sys
import django
from datetime import date, datetime, timedelta

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from django.contrib.auth.models import User
from library.models import BookCategory, Author, Publisher, Book

def create_test_data():
    print("🚀 Création des données de test pour la bibliothèque...")
    
    # 1. Créer un utilisateur admin si nécessaire
    user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@example.com',
            'is_staff': True,
            'is_superuser': True,
            'first_name': 'Admin',
            'last_name': 'User'
        }
    )
    if created:
        user.set_password('admin123')
        user.save()
        print(f"✅ Utilisateur admin créé: {user.username}")
    else:
        print(f"ℹ️  Utilisateur admin existe déjà: {user.username}")
    
    # 2. Créer des catégories
    categories_data = [
        {
            'name_fr': 'Informatique',
            'name_ar': 'علوم الحاسوب',
            'description_fr': 'Livres sur l\'informatique et la programmation',
            'description_ar': 'كتب حول علوم الحاسوب والبرمجة',
            'icon': 'computer'
        },
        {
            'name_fr': 'Télécommunications',
            'name_ar': 'الاتصالات',
            'description_fr': 'Livres sur les télécommunications et réseaux',
            'description_ar': 'كتب حول الاتصالات والشبكات',
            'icon': 'signal'
        },
        {
            'name_fr': 'Mathématiques',
            'name_ar': 'الرياضيات',
            'description_fr': 'Livres de mathématiques',
            'description_ar': 'كتب الرياضيات',
            'icon': 'calculator'
        },
        {
            'name_fr': 'Physique',
            'name_ar': 'الفيزياء',
            'description_fr': 'Livres de physique',
            'description_ar': 'كتب الفيزياء',
            'icon': 'atom'
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        category, created = BookCategory.objects.get_or_create(
            name_fr=cat_data['name_fr'],
            defaults=cat_data
        )
        categories.append(category)
        if created:
            print(f"✅ Catégorie créée: {category.name_fr}")
        else:
            print(f"ℹ️  Catégorie existe déjà: {category.name_fr}")
    
    # 3. Créer des auteurs
    authors_data = [
        {'first_name': 'John', 'last_name': 'Doe', 'nationality': 'Américain'},
        {'first_name': 'Marie', 'last_name': 'Dupont', 'nationality': 'Français'},
        {'first_name': 'Ahmed', 'last_name': 'Ben Ali', 'nationality': 'Tunisien'},
        {'first_name': 'Sarah', 'last_name': 'Johnson', 'nationality': 'Britannique'},
        {'first_name': 'Mohamed', 'last_name': 'Benali', 'nationality': 'Marocain'},
    ]
    
    authors = []
    for author_data in authors_data:
        author, created = Author.objects.get_or_create(
            first_name=author_data['first_name'],
            last_name=author_data['last_name'],
            defaults=author_data
        )
        authors.append(author)
        if created:
            print(f"✅ Auteur créé: {author.full_name}")
        else:
            print(f"ℹ️  Auteur existe déjà: {author.full_name}")
    
    # 4. Créer des éditeurs
    publishers_data = [
        {'name': 'Éditions Techniques', 'address': 'Paris, France'},
        {'name': 'Tech Books Publishing', 'address': 'New York, USA'},
        {'name': 'Dar Al-Kitab', 'address': 'Tunis, Tunisie'},
        {'name': 'Academic Press', 'address': 'London, UK'},
    ]
    
    publishers = []
    for pub_data in publishers_data:
        publisher, created = Publisher.objects.get_or_create(
            name=pub_data['name'],
            defaults=pub_data
        )
        publishers.append(publisher)
        if created:
            print(f"✅ Éditeur créé: {publisher.name}")
        else:
            print(f"ℹ️  Éditeur existe déjà: {publisher.name}")
    
    # 5. Créer des livres
    books_data = [
        {
            'title': 'Introduction à la Programmation Python',
            'subtitle': 'Guide complet pour débutants',
            'category': categories[0],  # Informatique
            'publisher': publishers[0],
            'isbn': '9781234567890',
            'publication_date': date(2023, 1, 15),
            'pages': 350,
            'language': 'fr',
            'description_fr': 'Un guide complet pour apprendre la programmation Python depuis les bases.',
            'description_ar': 'دليل شامل لتعلم برمجة Python من الأساسيات.',
            'call_number': 'INFO001',
            'location': 'Salle Informatique',
            'copies_total': 5,
            'copies_available': 3,
            'is_featured': True,
            'is_new_arrival': True,
            'allow_download': True,
            'added_by': user,
            'authors_to_add': [authors[0], authors[1]]
        },
        {
            'title': 'Réseaux et Télécommunications',
            'subtitle': 'Principes et Applications',
            'category': categories[1],  # Télécommunications
            'publisher': publishers[1],
            'isbn': '9781234567891',
            'publication_date': date(2022, 6, 20),
            'pages': 480,
            'language': 'fr',
            'description_fr': 'Ouvrage de référence sur les réseaux et télécommunications modernes.',
            'description_ar': 'مرجع حول الشبكات والاتصالات الحديثة.',
            'call_number': 'TELECOM001',
            'location': 'Salle Télécommunications',
            'copies_total': 3,
            'copies_available': 2,
            'is_featured': True,
            'allow_download': False,
            'added_by': user,
            'authors_to_add': [authors[2], authors[3]]
        },
        {
            'title': 'Mathématiques pour l\'Ingénieur',
            'subtitle': 'Analyse et Algèbre Linéaire',
            'category': categories[2],  # Mathématiques
            'publisher': publishers[2],
            'isbn': '9781234567892',
            'publication_date': date(2023, 3, 10),
            'pages': 520,
            'language': 'fr',
            'description_fr': 'Manuel de mathématiques appliquées pour les étudiants en ingénierie.',
            'description_ar': 'كتاب الرياضيات التطبيقية لطلاب الهندسة.',
            'call_number': 'MATH001',
            'location': 'Salle Mathématiques',
            'copies_total': 4,
            'copies_available': 4,
            'is_new_arrival': True,
            'allow_download': True,
            'added_by': user,
            'authors_to_add': [authors[4]]
        },
        {
            'title': 'Physique Quantique Moderne',
            'subtitle': 'Théorie et Applications',
            'category': categories[3],  # Physique
            'publisher': publishers[3],
            'isbn': '9781234567893',
            'publication_date': date(2022, 11, 5),
            'pages': 680,
            'language': 'fr',
            'description_fr': 'Introduction moderne à la physique quantique avec applications pratiques.',
            'description_ar': 'مقدمة حديثة للفيزياء الكمية مع التطبيقات العملية.',
            'call_number': 'PHYS001',
            'location': 'Salle Physique',
            'copies_total': 2,
            'copies_available': 1,
            'status': 'borrowed',
            'allow_download': False,
            'added_by': user,
            'authors_to_add': [authors[0], authors[4]]
        },
        {
            'title': 'Algorithmes et Structures de Données',
            'subtitle': 'Approche Pratique',
            'category': categories[0],  # Informatique
            'publisher': publishers[1],
            'isbn': '9781234567894',
            'publication_date': date(2023, 8, 12),
            'pages': 420,
            'language': 'fr',
            'description_fr': 'Guide pratique des algorithmes et structures de données essentiels.',
            'description_ar': 'دليل عملي للخوارزميات وهياكل البيانات الأساسية.',
            'call_number': 'INFO002',
            'location': 'Salle Informatique',
            'copies_total': 6,
            'copies_available': 5,
            'is_featured': True,
            'is_new_arrival': True,
            'allow_download': True,
            'rating': 4.5,
            'views_count': 150,
            'download_count': 45,
            'added_by': user,
            'authors_to_add': [authors[1], authors[3]]
        }
    ]
    
    books = []
    for book_data in books_data:
        # Extraire les auteurs à ajouter
        authors_to_add = book_data.pop('authors_to_add', [])
        
        book, created = Book.objects.get_or_create(
            isbn=book_data['isbn'],
            defaults=book_data
        )
        
        if created:
            # Ajouter les auteurs
            for author in authors_to_add:
                book.authors.add(author)
            book.save()
            print(f"✅ Livre créé: {book.title}")
        else:
            print(f"ℹ️  Livre existe déjà: {book.title}")
        
        books.append(book)
    
    # 6. Statistiques finales
    print("\n📊 Statistiques des données créées:")
    print(f"   👥 Utilisateurs: {User.objects.count()}")
    print(f"   📂 Catégories: {BookCategory.objects.count()}")
    print(f"   ✍️  Auteurs: {Author.objects.count()}")
    print(f"   🏢 Éditeurs: {Publisher.objects.count()}")
    print(f"   📚 Livres: {Book.objects.count()}")
    print(f"   ✅ Livres disponibles: {Book.objects.filter(status='available').count()}")
    print(f"   ⭐ Livres mis en avant: {Book.objects.filter(is_featured=True).count()}")
    print(f"   🆕 Nouvelles acquisitions: {Book.objects.filter(is_new_arrival=True).count()}")
    
    print("\n🎉 Données de test créées avec succès!")
    print("🌐 Vous pouvez maintenant tester l'API: http://localhost:8000/api/library/books/")

if __name__ == '__main__':
    create_test_data()
