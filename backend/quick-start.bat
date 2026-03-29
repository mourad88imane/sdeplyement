@echo off
echo === Demarrage Rapide du Backend Django ===

echo Installation de Django...
pip install Django djangorestframework django-cors-headers Pillow

echo Application des migrations de base...
python manage.py migrate

echo Creation du superutilisateur...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@ent.dz', 'admin123') if not User.objects.filter(username='admin').exists() else print('Admin existe deja')"

echo === Demarrage du serveur ===
echo Serveur disponible sur: http://localhost:8000
echo Admin disponible sur: http://localhost:8000/admin
echo Identifiants: admin / admin123
echo.

python manage.py runserver 0.0.0.0:8000
