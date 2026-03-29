@echo off
echo === Creation de l'environnement virtuel Django ===

echo 1. Creation de l'environnement virtuel...
python -m venv venv

echo 2. Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo 3. Installation de Django et dependances...
pip install Django==4.2.7
pip install djangorestframework==3.14.0
pip install django-cors-headers==4.3.1
pip install Pillow==10.1.0

echo 4. Verification de l'installation...
python -c "import django; print('Django version:', django.get_version())"

echo 5. Configuration de la base de donnees...
python manage.py migrate

echo 6. Creation du superutilisateur...
echo from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@ent.dz', 'admin123') if not User.objects.filter(username='admin').exists() else print('Admin deja existant') | python manage.py shell

echo.
echo === Configuration terminee ===
echo.
echo Pour demarrer le serveur:
echo 1. Activez l'environnement: venv\Scripts\activate
echo 2. Lancez le serveur: python manage.py runserver
echo.
echo Acces admin: http://localhost:8000/admin/
echo Identifiants: admin / admin123
echo.

pause
