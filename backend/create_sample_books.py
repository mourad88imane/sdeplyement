#!/usr/bin/env python3
"""
Script pour créer des livres de démonstration
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from library.models import Book, BookCategory, Author, Publisher
from django.utils import timezone

def create_sample_books():
    print("🔧 Création des livres de démonstration...")

    # Créer des catégories
    cat_telecom, _ = BookCategory.objects.get_or_create(
        name_fr="Télécommunications",
        name_ar="الاتصالات",
        defaults={
            'description_fr': "Livres sur les télécommunications et réseaux",
            'description_ar': "كتب حول الاتصالات والشبكات"
        }
    )

    cat_informatique, _ = BookCategory.objects.get_or_create(
        name_fr="Informatique",
        name_ar="المعلوماتية",
        defaults={
            'description_fr': "Livres d'informatique et programmation",
            'description_ar': "كتب المعلوماتية والبرمجة"
        }
    )

    cat_electronique, _ = BookCategory.objects.get_or_create(
        name_fr="Électronique",
        name_ar="الإلكترونيات",
        defaults={
            'description_fr': "Livres d'électronique et circuits",
            'description_ar': "كتب الإلكترونيات والدوائر"
        }
    )

    # Créer des auteurs
    author1, _ = Author.objects.get_or_create(
        first_name="Ahmed",
        last_name="Benali",
        defaults={
            'bio_fr': "Professeur en télécommunications à l'ENT",
            'bio_ar': "أستاذ في الاتصالات بالمدرسة الوطنية للاتصالات"
        }
    )

    author2, _ = Author.objects.get_or_create(
        first_name="Fatima",
        last_name="Khelifi",
        defaults={
            'bio_fr': "Experte en réseaux informatiques",
            'bio_ar': "خبيرة في الشبكات المعلوماتية"
        }
    )

    author3, _ = Author.objects.get_or_create(
        first_name="Mohamed",
        last_name="Saidi",
        defaults={
            'bio_fr': "Spécialiste en électronique numérique",
            'bio_ar': "متخصص في الإلكترونيات الرقمية"
        }
    )

    # Créer des éditeurs
    publisher1, _ = Publisher.objects.get_or_create(
        name="Éditions ENT",
        defaults={
            'address': "Alger, Algérie",
            'website': "https://ent.dz"
        }
    )

    publisher2, _ = Publisher.objects.get_or_create(
        name="Dar El Kitab",
        defaults={
            'address': "Alger, Algérie",
            'website': "https://darelkitab.dz"
        }
    )

    # Obtenir un utilisateur pour le champ added_by
    from django.contrib.auth import get_user_model
    User = get_user_model()
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        print("❌ Aucun superuser trouvé. Créez d'abord un superuser.")
        return

    # Créer des livres
    books_data = [
        {
            'title': "Introduction aux Télécommunications",
            'publisher': publisher1,
            'category': cat_telecom,
            'isbn': "978-9961-123-456-7",
            'pages': 320,
            'publication_date': timezone.now().date(),
            'language': 'fr',
            'description_fr': "Un guide complet sur les principes fondamentaux des télécommunications modernes.",
            'description_ar': "دليل شامل حول المبادئ الأساسية للاتصالات الحديثة.",
            'copies_available': 5,
            'copies_total': 10,
            'call_number': "TEL001",
            'location': "Salle de lecture - Section A",
            'cover_image': 'books/covers/default.jpg',
            'added_by': admin_user
        },
        {
            'title': "Réseaux Informatiques Avancés",
            'publisher': publisher1,
            'category': cat_informatique,
            'isbn': "978-9961-123-457-4",
            'pages': 450,
            'publication_date': timezone.now().date(),
            'language': 'fr',
            'description_fr': "Concepts avancés des réseaux TCP/IP, sécurité et administration.",
            'description_ar': "مفاهيم متقدمة للشبكات TCP/IP والأمان والإدارة.",
            'copies_available': 3,
            'copies_total': 8,
            'call_number': "INF001",
            'location': "Salle de lecture - Section B",
            'cover_image': 'books/covers/default.jpg',
            'added_by': admin_user
        },
        {
            'title': "Électronique Numérique",
            'publisher': publisher2,
            'category': cat_electronique,
            'isbn': "978-9961-123-458-1",
            'pages': 280,
            'publication_date': timezone.now().date(),
            'language': 'fr',
            'description_fr': "Circuits logiques, microprocesseurs et systèmes embarqués.",
            'description_ar': "الدوائر المنطقية والمعالجات الدقيقة والأنظمة المدمجة.",
            'copies_available': 7,
            'copies_total': 12,
            'call_number': "ELE001",
            'location': "Salle de lecture - Section C",
            'cover_image': 'books/covers/default.jpg',
            'added_by': admin_user
        },
        {
            'title': "Sécurité des Réseaux",
            'publisher': publisher1,
            'category': cat_informatique,
            'isbn': "978-9961-123-459-8",
            'pages': 380,
            'publication_date': timezone.now().date(),
            'language': 'fr',
            'description_fr': "Cryptographie, pare-feu et détection d'intrusions.",
            'description_ar': "التشفير وجدران الحماية وكشف التسلل.",
            'copies_available': 4,
            'copies_total': 6,
            'call_number': "SEC001",
            'location': "Salle de lecture - Section B",
            'cover_image': 'books/covers/default.jpg',
            'added_by': admin_user
        },
        {
            'title': "Systèmes de Communication",
            'publisher': publisher2,
            'category': cat_telecom,
            'isbn': "978-9961-123-460-4",
            'pages': 420,
            'publication_date': timezone.now().date(),
            'language': 'fr',
            'description_fr': "Modulation, démodulation et transmission de données.",
            'description_ar': "التضمين وإزالة التضمين ونقل البيانات.",
            'copies_available': 6,
            'copies_total': 10,
            'call_number': "COM001",
            'location': "Salle de lecture - Section A",
            'cover_image': 'books/covers/default.jpg',
            'added_by': admin_user
        }
    ]

    created_count = 0
    for book_data in books_data:
        book, created = Book.objects.get_or_create(
            isbn=book_data['isbn'],
            defaults=book_data
        )
        if created:
            # Ajouter les auteurs (relation ManyToMany)
            if book_data['isbn'] == "978-9961-123-456-7" or book_data['isbn'] == "978-9961-123-460-4":
                book.authors.add(author1)
            elif book_data['isbn'] == "978-9961-123-457-4" or book_data['isbn'] == "978-9961-123-459-8":
                book.authors.add(author2)
            else:
                book.authors.add(author3)

            created_count += 1
            print(f"✅ Livre créé: {book.title}")
        else:
            print(f"📚 Livre existant: {book.title}")

    print(f"\n🎉 {created_count} nouveaux livres créés!")
    print(f"📊 Total des livres: {Book.objects.count()}")
    print(f"📊 Total des catégories: {BookCategory.objects.count()}")
    print(f"📊 Total des auteurs: {Author.objects.count()}")
    print(f"📊 Total des éditeurs: {Publisher.objects.count()}")

if __name__ == "__main__":
    create_sample_books()
