#!/usr/bin/env python3
"""
Script pour créer des réservations et notifications d'exemple
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
django.setup()

from library.models import Book, BookReservation, BookBorrow
from users.models import UserProfile, UserNotification, AdminUserMessage
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import datetime, timedelta

def create_reservations():
    """Créer des réservations d'exemple"""
    print("📋 Création de réservations...")
    
    # Récupérer les livres et utilisateurs
    books = Book.objects.all()[:4]
    students = User.objects.filter(username__contains='student')
    admin_user = User.objects.get(username='admin')
    
    if not books.exists():
        print("❌ Aucun livre trouvé. Veuillez d'abord ajouter des livres.")
        return
    
    if not students.exists():
        print("❌ Aucun étudiant trouvé. Création d'étudiants d'exemple...")
        # Créer des étudiants d'exemple
        students_data = [
            {'username': 'ahmed_student', 'first_name': 'Ahmed', 'last_name': 'Benali', 'email': 'ahmed@ent.dz'},
            {'username': 'fatima_student', 'first_name': 'Fatima', 'last_name': 'Khelifi', 'email': 'fatima@ent.dz'},
            {'username': 'youssef_student', 'first_name': 'Youssef', 'last_name': 'Mansouri', 'email': 'youssef@ent.dz'}
        ]
        
        created_students = []
        for student_data in students_data:
            user, created = User.objects.get_or_create(
                username=student_data['username'],
                defaults=student_data
            )
            if created:
                user.set_password('student123')
                user.save()
                
                # Créer le profil
                UserProfile.objects.get_or_create(
                    user=user,
                    defaults={
                        'user_type': 'student',
                        'phone': f'+213 555 {len(created_students):03d} {len(created_students):03d}',
                        'address': f'Adresse étudiant {len(created_students) + 1}',
                        'date_of_birth': '2000-01-01'
                    }
                )
            created_students.append(user)
        students = created_students
    
    # Données de réservations
    reservations_data = [
        {
            'book': books[0],
            'user': students[0],
            'days_from_now': 1,
            'notes': 'Réservation pour projet de fin d\'études'
        },
        {
            'book': books[1] if len(books) > 1 else books[0],
            'user': students[1] if len(students) > 1 else students[0],
            'days_from_now': 2,
            'notes': 'Réservation pour cours d\'algorithmique'
        },
        {
            'book': books[2] if len(books) > 2 else books[0],
            'user': students[2] if len(students) > 2 else students[0],
            'days_from_now': 3,
            'notes': 'Réservation pour lecture personnelle'
        }
    ]
    
    created_reservations = []
    for res_data in reservations_data:
        # Vérifier si une réservation existe déjà
        existing = BookReservation.objects.filter(
            book=res_data['book'],
            reserver_email=res_data['user'].email,
            status='active'
        ).first()
        
        if existing:
            print(f"⚠️ Réservation déjà existante: {res_data['book'].title} → {res_data['user'].first_name}")
            continue
        
        # Calculer la date de réservation
        reservation_date = timezone.now() + timedelta(days=res_data['days_from_now'])
        
        # Créer la réservation
        reservation = BookReservation.objects.create(
            book=res_data['book'],
            reserver_name=f"{res_data['user'].first_name} {res_data['user'].last_name}",
            reserver_email=res_data['user'].email,
            reserver_phone=getattr(res_data['user'].profile, 'phone', '+213 555 000 000'),
            reservation_date=reservation_date,
            status='active',
            notes=res_data['notes']
        )
        
        # Mettre à jour le statut du livre si nécessaire
        book = res_data['book']
        if book.status == 'available' and book.copies_available > 0:
            book.status = 'reserved'
            book.save()
        
        created_reservations.append(reservation)
        print(f"✅ Réservation créée: {reservation.book.title} → {reservation.reserver_name}")
    
    print(f"📋 {len(created_reservations)} nouvelles réservations créées!")
    return created_reservations

def create_notifications():
    """Créer des notifications d'exemple"""
    print("\n🔔 Création de notifications...")
    
    students = User.objects.filter(username__contains='student')
    admin_user = User.objects.get(username='admin')
    
    if not students.exists():
        print("❌ Aucun étudiant trouvé pour les notifications.")
        return
    
    # Notifications d'exemple
    notifications_data = [
        {
            'user': students[0],
            'title': 'Bienvenue dans la bibliothèque ENT',
            'message': 'Votre compte a été activé. Vous pouvez maintenant emprunter et réserver des livres.',
            'type': 'welcome',
            'priority': 'normal'
        },
        {
            'user': students[1] if len(students) > 1 else students[0],
            'title': 'Rappel: Retour de livre',
            'message': 'Le livre "Clean Code" doit être retourné dans 3 jours.',
            'type': 'reminder',
            'priority': 'high'
        },
        {
            'user': students[2] if len(students) > 2 else students[0],
            'title': 'Livre disponible',
            'message': 'Le livre que vous avez réservé "Les Misérables" est maintenant disponible.',
            'type': 'book_available',
            'priority': 'urgent'
        }
    ]
    
    created_notifications = []
    for notif_data in notifications_data:
        notification = UserNotification.objects.create(
            user=notif_data['user'],
            title=notif_data['title'],
            message=notif_data['message'],
            type=notif_data['type'],
            priority=notif_data['priority'],
            is_read=False
        )
        created_notifications.append(notification)
        print(f"🔔 Notification créée: {notification.title} → {notification.user.first_name}")
    
    print(f"🔔 {len(created_notifications)} notifications créées!")
    return created_notifications

def create_admin_messages():
    """Créer des messages bidirectionnels admin-utilisateur"""
    print("\n💬 Création de messages admin-utilisateur...")
    
    students = User.objects.filter(username__contains='student')
    admin_user = User.objects.get(username='admin')
    
    if not students.exists():
        print("❌ Aucun étudiant trouvé pour les messages.")
        return
    
    # Messages d'exemple
    messages_data = [
        {
            'user': students[0],
            'subject': 'Question sur l\'emprunt de livres',
            'message': 'Bonjour, combien de livres puis-je emprunter simultanément ?',
            'sender': 'user',
            'response': 'Bonjour Ahmed, vous pouvez emprunter jusqu\'à 3 livres simultanément pour une durée de 2 semaines.'
        },
        {
            'user': students[1] if len(students) > 1 else students[0],
            'subject': 'Prolongation d\'emprunt',
            'message': 'Puis-je prolonger l\'emprunt de "Clean Code" ?',
            'sender': 'user',
            'response': 'Oui, vous pouvez prolonger une fois pour 1 semaine supplémentaire si aucune réservation n\'est en attente.'
        },
        {
            'user': students[2] if len(students) > 2 else students[0],
            'subject': 'Livre endommagé',
            'message': 'J\'ai remarqué que le livre "Les Misérables" a quelques pages abîmées.',
            'sender': 'user',
            'response': 'Merci de nous avoir signalé cela. Nous allons examiner le livre et prendre les mesures nécessaires.'
        }
    ]
    
    created_messages = []
    for msg_data in messages_data:
        # Message de l'utilisateur
        user_message = AdminUserMessage.objects.create(
            user=msg_data['user'],
            admin_user=admin_user,
            subject=msg_data['subject'],
            message=msg_data['message'],
            sender='user',
            is_read=True,  # L'admin l'a lu
            priority='normal'
        )
        
        # Réponse de l'admin
        admin_response = AdminUserMessage.objects.create(
            user=msg_data['user'],
            admin_user=admin_user,
            subject=f"Re: {msg_data['subject']}",
            message=msg_data['response'],
            sender='admin',
            is_read=False,  # L'utilisateur ne l'a pas encore lu
            priority='normal',
            parent_message=user_message
        )
        
        created_messages.extend([user_message, admin_response])
        print(f"💬 Conversation créée: {msg_data['subject']} ({msg_data['user'].first_name})")
    
    print(f"💬 {len(created_messages)} messages créés!")
    return created_messages

def main():
    """Fonction principale"""
    print("🚀 Création du système de réservations et notifications...")
    print("=" * 60)
    
    try:
        # Créer les réservations
        reservations = create_reservations()
        
        # Créer les notifications
        notifications = create_notifications()
        
        # Créer les messages
        messages = create_admin_messages()
        
        print("\n" + "=" * 60)
        print("📊 RÉSUMÉ FINAL:")
        print(f"📋 Réservations: {BookReservation.objects.count()} total")
        print(f"🔔 Notifications: {UserNotification.objects.count()} total")
        print(f"💬 Messages: {AdminUserMessage.objects.count()} total")
        print(f"📚 Livres: {Book.objects.count()} total")
        print(f"👥 Utilisateurs: {User.objects.count()} total")
        
        print("\n✅ Système de réservations et notifications créé avec succès!")
        print("\n🌐 URLs pour tester:")
        print("📋 Réservations: http://127.0.0.1:8000/admin/library/bookreservation/")
        print("🔔 Notifications: http://127.0.0.1:8000/admin/users/usernotification/")
        print("💬 Messages: http://127.0.0.1:8000/admin/users/adminusermessage/")
        print("📚 Bibliothèque: http://127.0.0.1:8000/dashboard/library/")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
