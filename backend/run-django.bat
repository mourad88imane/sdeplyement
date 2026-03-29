@echo off
echo === Demarrage du Backend Django ===

echo 1. Verification de l'environnement virtuel...
if not exist "venv" (
    echo Creation de l'environnement virtuel...
    python -m venv venv
)

echo 2. Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo 3. Installation des dependances...
pip install Django djangorestframework django-cors-headers Pillow

echo 4. Creation des dossiers necessaires...
if not exist "static" mkdir static
if not exist "media" mkdir media
if not exist "staticfiles" mkdir staticfiles

echo 5. Application des migrations...
python manage.py migrate

echo 6. Creation du superutilisateur...
python manage.py shell -c "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@ent.dz', 'admin123') if not User.objects.filter(username='admin').exists() else print('Admin existe deja')"

echo 7. Collecte des fichiers statiques...
python manage.py collectstatic --noinput

echo.
echo === SERVEUR DJANGO PRET ===
echo.
echo API: http://localhost:8000/api/
echo Admin: http://localhost:8000/admin/
echo Identifiants: admin / admin123
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

python manage.py runserver 0.0.0.0:8000
