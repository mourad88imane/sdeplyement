@echo off
echo === Demarrage du Backend Django ===

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo Installation des dependances...
pip install -r requirements.txt

echo Application des migrations...
python manage.py makemigrations
python manage.py migrate

echo Creation du superutilisateur...
echo from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@ent.dz', 'admin123') if not User.objects.filter(username='admin').exists() else print('Superuser already exists') | python manage.py shell

echo Collecte des fichiers statiques...
python manage.py collectstatic --noinput

echo === Demarrage du serveur ===
python manage.py runserver 0.0.0.0:8000

pause
