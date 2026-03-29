#!/usr/bin/env python
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'school_backend.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Créer un superutilisateur
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser(
        username='admin',
        email='admin@ent.dz',
        password='admin123',
        first_name='Admin',
        last_name='ENT'
    )
    print(f"✅ Superutilisateur créé: {user.username}")
else:
    print("ℹ️ Le superutilisateur existe déjà")

# Créer quelques utilisateurs de test
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
    }
]

for user_data in test_users:
    if not User.objects.filter(username=user_data['username']).exists():
        user = User.objects.create_user(**user_data)
        print(f"✅ Utilisateur de test créé: {user.username}")
    else:
        print(f"ℹ️ L'utilisateur {user_data['username']} existe déjà")

print("\n🎉 Configuration terminée !")
print("👤 Admin: admin / admin123")
print("👤 Test: student1 / password123")
