# Guide d'Installation du Backend Django

## Étapes d'installation manuelle

### 1. Prérequis
- Python 3.8+ installé
- pip installé

### 2. Installation des dépendances

Ouvrez un terminal dans le dossier `backend` et exécutez :

```bash
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
```

### 3. Configuration de la base de données

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Création du superutilisateur

```bash
python manage.py createsuperuser
```

Ou utilisez ces identifiants prédéfinis :
- Username: admin
- Email: admin@ent.dz  
- Password: admin123

### 5. Collecte des fichiers statiques

```bash
python manage.py collectstatic --noinput
```

### 6. Démarrage du serveur

```bash
python manage.py runserver 0.0.0.0:8000
```

## Accès

- **API** : http://localhost:8000/api/
- **Admin** : http://localhost:8000/admin/
- **Identifiants admin** : admin / admin123

## Endpoints principaux

- `/api/courses/` - Gestion des cours OHB
- `/api/news/` - Gestion des actualités
- `/api/library/` - Gestion de la bibliothèque  
- `/api/users/` - Gestion des utilisateurs

## Résolution des problèmes

### Erreur de migration
```bash
python manage.py makemigrations courses
python manage.py makemigrations news
python manage.py makemigrations library
python manage.py makemigrations users
python manage.py migrate
```

### Erreur de dépendances
Installez les dépendances une par une :
```bash
pip install Django
pip install djangorestframework
pip install django-cors-headers
pip install Pillow
```

### Port déjà utilisé
Changez le port :
```bash
python manage.py runserver 8001
```

## Configuration CORS

Le fichier `.env` est configuré pour accepter les connexions depuis :
- http://localhost:3000 (React)
- http://localhost:5173 (Vite)

## Structure des données

Le backend inclut :
- ✅ Modèles pour cours, actualités, bibliothèque, utilisateurs
- ✅ API REST complète
- ✅ Interface d'administration
- ✅ Système d'authentification
- ✅ Support multilingue (FR/AR)

## Test de l'installation

1. Accédez à http://localhost:8000/admin/
2. Connectez-vous avec admin/admin123
3. Vérifiez que toutes les sections sont présentes :
   - Cours OHB
   - Actualités
   - Bibliothèque
   - Utilisateurs

## Support

Si vous rencontrez des problèmes :
1. Vérifiez que Python 3.8+ est installé
2. Vérifiez que toutes les dépendances sont installées
3. Consultez les logs d'erreur dans le terminal
