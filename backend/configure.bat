@echo off
echo === Configuration du Backend Django ===

echo Creation de l'environnement virtuel...
python -m venv venv

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo Installation des dependances...
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install Pillow==10.1.0
pip install django-ckeditor==6.7.0
pip install django-admin-interface==0.26.0
pip install django-colorfield==0.10.1
pip install python-decouple==3.8
pip install django-filter==23.4
pip install django-extensions==3.2.3

echo Creation des dossiers...
mkdir media 2>nul
mkdir static 2>nul
mkdir staticfiles 2>nul

echo Application des migrations...
python manage.py makemigrations courses
python manage.py makemigrations news
python manage.py makemigrations library
python manage.py makemigrations users
python manage.py migrate

echo Creation du superutilisateur...
echo from django.contrib.auth.models import User; from users.models import UserProfile; user = User.objects.create_superuser('admin', 'admin@ent.dz', 'admin123', first_name='Admin', last_name='ENT') if not User.objects.filter(username='admin').exists() else User.objects.get(username='admin'); profile, created = UserProfile.objects.get_or_create(user=user, defaults={'user_type': 'admin', 'is_verified': True}) | python manage.py shell

echo Configuration terminee!
echo.
echo Pour demarrer le serveur, executez: start-backend.bat
echo Ou utilisez: python manage.py runserver
echo.
echo Acces admin: http://localhost:8000/admin/
echo Identifiants: admin / admin123

pause
