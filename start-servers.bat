@echo off
echo 🚀 Démarrage des serveurs ENT...
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installé ou pas dans le PATH
    pause
    exit /b 1
)

echo ✅ Python et Node.js détectés
echo.

REM Démarrer le serveur Django en arrière-plan
echo 🐍 Démarrage du serveur Django...
start "Django Server" cmd /k "cd backend && python manage.py runserver localhost:8000"

REM Attendre un peu pour que Django démarre
timeout /t 3 /nobreak >nul

REM Démarrer le serveur Vite en arrière-plan
echo ⚡ Démarrage du serveur Vite...
start "Vite Server" cmd /k "npm run dev --prefix fontend"

REM Attendre un peu pour que Vite démarre
timeout /t 5 /nobreak >nul

echo.
echo 🎉 Serveurs démarrés !
echo.
echo 📍 URLs disponibles :
echo    🌐 Frontend (Vite) : http://localhost:5173
echo    🔧 Backend (Django): http://localhost:8000
echo    👤 Admin Django    : http://localhost:8000/admin
echo.
echo 🔑 Compte admin : admin / admin123
echo.
echo ⚠️  Pour arrêter les serveurs, fermez les fenêtres de commande ouvertes
echo.
pause
