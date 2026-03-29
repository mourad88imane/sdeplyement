@echo off
echo === Demarrage du serveur Django ===

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo Verification de Django...
python -c "import django; print('Django OK -', django.get_version())" 2>nul || (
    echo Django non trouve, installation...
    pip install Django djangorestframework django-cors-headers Pillow
)

echo Demarrage du serveur...
echo.
echo Serveur disponible sur: http://localhost:8000
echo Admin disponible sur: http://localhost:8000/admin
echo Identifiants: admin / admin123
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

python manage.py runserver 0.0.0.0:8000
