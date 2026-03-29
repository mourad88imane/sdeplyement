@echo off
echo === DEMARRAGE SERVEUR DJANGO POUR DEVELOPPEMENT ===
echo.

echo Activation de l'environnement virtuel...
call venv\Scripts\activate.bat

echo Configuration CORS permissive pour le developpement...
echo.

echo Demarrage du serveur sur toutes les interfaces...
echo Serveur accessible sur:
echo - http://localhost:8000
echo - http://127.0.0.1:8000
echo - http://10.10.10.56:8000
echo.
echo API accessible sur:
echo - http://localhost:8000/api/
echo - http://10.10.10.56:8000/api/
echo.
echo Admin accessible sur:
echo - http://localhost:8000/admin/
echo - http://10.10.10.56:8000/admin/
echo.

python manage.py runserver 0.0.0.0:8000
