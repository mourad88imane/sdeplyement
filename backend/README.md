# Backend Django - École Nationale des Transmissions

Backend API pour le site web de l'École Nationale des Transmissions avec dashboard administratif.

## Fonctionnalités

### 🎓 Gestion des Cours OHB
- Création et gestion des cours spécialisés
- Catégories de cours avec support multilingue (FR/AR)
- Modules de cours et instructeurs
- Système d'inscription avec validation
- Statistiques et rapports

### 📰 Gestion des Actualités
- Création et publication d'articles
- Catégories et tags
- Système de commentaires avec modération
- Newsletter avec abonnements
- Support multilingue complet

### 📚 Gestion de la Bibliothèque
- Catalogue de livres avec métadonnées complètes
- Gestion des auteurs et éditeurs
- Système d'emprunt et de réservation
- Téléchargement de fichiers PDF
- Avis et évaluations

### 👥 Gestion des Utilisateurs
- Profils utilisateur étendus
- Types d'utilisateurs (étudiant, enseignant, personnel, admin)
- Système de notifications
- Suivi des activités
- Gestion des sessions

### 🎨 Interface d'Administration
- Dashboard moderne avec django-admin-interface
- Statistiques en temps réel
- Actions en lot
- Filtres et recherche avancés
- Éditeur WYSIWYG pour le contenu

## Installation

### Prérequis
- Python 3.8+
- pip
- virtualenv (recommandé)

### Installation rapide

1. **Cloner et configurer l'environnement**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt
```

2. **Configuration**
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. **Installation automatique**
```bash
python setup.py
```

### Installation manuelle

1. **Migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

2. **Superutilisateur**
```bash
python manage.py createsuperuser
```

3. **Fichiers statiques**
```bash
python manage.py collectstatic
```

## Démarrage

```bash
python manage.py runserver
```

L'API sera disponible sur `http://localhost:8000/`
L'interface d'administration sur `http://localhost:8000/admin/`

## Structure de l'API

### Cours OHB
- `GET /api/courses/` - Liste des cours
- `POST /api/courses/` - Créer un cours (admin)
- `GET /api/courses/{slug}/` - Détails d'un cours
- `POST /api/courses/{slug}/enroll/` - S'inscrire à un cours
- `GET /api/courses/featured/` - Cours mis en avant
- `GET /api/courses/stats/` - Statistiques (admin)

### Actualités
- `GET /api/news/` - Liste des actualités
- `POST /api/news/` - Créer une actualité (admin)
- `GET /api/news/{slug}/` - Détails d'une actualité
- `POST /api/news/{slug}/comment/` - Ajouter un commentaire
- `GET /api/news/featured/` - Actualités mises en avant
- `POST /api/news/newsletter/subscribe/` - S'abonner à la newsletter

### Bibliothèque
- `GET /api/library/books/` - Liste des livres
- `POST /api/library/books/` - Ajouter un livre (admin)
- `GET /api/library/books/{id}/` - Détails d'un livre
- `POST /api/library/books/{id}/borrow/` - Emprunter un livre
- `POST /api/library/books/{id}/reserve/` - Réserver un livre
- `GET /api/library/books/{id}/download/` - Télécharger un livre
- `GET /api/library/books/featured/` - Livres mis en avant

### Utilisateurs
- `POST /api/users/register/` - Inscription
- `POST /api/users/login/` - Connexion
- `POST /api/users/logout/` - Déconnexion
- `GET /api/users/profile/` - Profil utilisateur
- `PUT /api/users/profile/` - Mettre à jour le profil
- `GET /api/users/notifications/` - Notifications
- `GET /api/users/dashboard/` - Données du tableau de bord

## Configuration

### Variables d'environnement (.env)

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Base de données

Par défaut, SQLite est utilisé pour le développement. Pour la production, configurez PostgreSQL :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/school_db
```

### Médias et fichiers statiques

```env
MEDIA_ROOT=/path/to/media
STATIC_ROOT=/path/to/static
```

## Fonctionnalités du Dashboard Admin

### Cours OHB
- ✅ Création de cours avec éditeur riche
- ✅ Gestion des modules et instructeurs
- ✅ Suivi des inscriptions
- ✅ Statistiques détaillées
- ✅ Actions en lot (publier, archiver)

### Actualités
- ✅ Éditeur WYSIWYG pour le contenu
- ✅ Gestion des catégories et tags
- ✅ Modération des commentaires
- ✅ Planification de publication
- ✅ Gestion de la newsletter

### Bibliothèque
- ✅ Catalogue complet avec métadonnées
- ✅ Gestion des emprunts et réservations
- ✅ Upload de fichiers PDF
- ✅ Modération des avis
- ✅ Rapports de circulation

### Utilisateurs
- ✅ Profils utilisateur étendus
- ✅ Gestion des types d'utilisateurs
- ✅ Suivi des activités
- ✅ Système de notifications
- ✅ Gestion des sessions

## Sécurité

- Authentification par token
- Permissions basées sur les rôles
- Validation des données
- Protection CSRF
- Limitation du taux de requêtes (à configurer)

## Déploiement

### Avec Gunicorn

```bash
pip install gunicorn
gunicorn school_backend.wsgi:application
```

### Variables d'environnement de production

```env
DEBUG=False
SECRET_KEY=your-production-secret-key
ALLOWED_HOSTS=your-domain.com
DATABASE_URL=postgresql://user:password@localhost:5432/school_db
```

## Support

Pour toute question ou problème :
- Consultez la documentation Django
- Vérifiez les logs dans `logs/`
- Contactez l'équipe de développement

## Licence

Ce projet est développé pour l'École Nationale des Transmissions.
