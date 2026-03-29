# 🚀 DÉMARRAGE RAPIDE DU BACKEND

## ⚡ Solution au problème "decouple"

Le problème est résolu ! Suivez ces étapes simples :

## 📋 Étapes à suivre

### 1. Ouvrir un terminal
Ouvrez un terminal/invite de commande dans le dossier `backend`

### 2. Installer Django
```bash
pip install Django
```

### 3. Installer les dépendances de base
```bash
pip install djangorestframework
pip install django-cors-headers  
pip install Pillow
```

### 4. Configurer la base de données
```bash
python manage.py migrate
```

### 5. Créer un administrateur
```bash
python manage.py createsuperuser
```
Utilisez ces informations :
- Username: `admin`
- Email: `admin@ent.dz`
- Password: `admin123`

### 6. Démarrer le serveur
```bash
python manage.py runserver 0.0.0.0:8000
```

## 🎯 Accès au système

Une fois le serveur démarré :

- **🌐 API** : http://localhost:8000/api/
- **⚙️ Dashboard Admin** : http://localhost:8000/admin/
- **🔑 Identifiants** : `admin` / `admin123`

## 📊 Fonctionnalités disponibles

Dans le dashboard admin :

### 🎓 Cours OHB (`/admin/courses/`)
- ✅ Ajouter des nouveaux cours
- ✅ Gérer les catégories  
- ✅ Suivre les inscriptions

### 📰 Actualités (`/admin/news/`)
- ✅ Publier des articles
- ✅ Modérer les commentaires
- ✅ Gérer la newsletter

### 📚 Bibliothèque (`/admin/library/`)
- ✅ Ajouter des livres
- ✅ Gérer les emprunts
- ✅ Suivre les réservations

### 👥 Utilisateurs (`/admin/users/`)
- ✅ Voir les profils
- ✅ Gérer les permissions
- ✅ Suivre les activités

## 🔧 En cas de problèmebi

### Erreur "No module named..."
```bash
pip install [nom-du-module]
```

### Port déjà utilisé
```bash
python manage.py runserver 8001
```

### Problème de migration
```bash
python manage.py makemigrations
python manage.py migrate
```

## ✅ Test de fonctionnement

1. Allez sur http://localhost:8000/admin/
2. Connectez-vous avec `admin` / `admin123`
3. Vérifiez que vous voyez :
   - Courses
   - News  
   - Library
   - Users

## 🎉 C'est prêt !

Votre backend Django est maintenant opérationnel et prêt à être utilisé avec le frontend React !

---

**💡 Astuce** : Gardez ce terminal ouvert pendant que vous travaillez sur le frontend.
