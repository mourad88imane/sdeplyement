# 📡 Guide des Endpoints de l'API

## 🏠 **Pages principales**

- **🏠 Accueil** : http://localhost:8000/
- **📡 API Root** : http://localhost:8000/api/
- **⚙️ Admin** : http://localhost:8000/admin/

## 🎓 **Cours OHB** (`/api/courses/`)

### Endpoints publics
- `GET /api/courses/` - Liste des cours
- `GET /api/courses/categories/` - Catégories de cours
- `GET /api/courses/featured/` - Cours mis en avant
- `GET /api/courses/popular/` - Cours populaires
- `GET /api/courses/{slug}/` - Détails d'un cours

### Endpoints d'inscription
- `POST /api/courses/{slug}/enroll/` - S'inscrire à un cours

### Endpoints admin
- `POST /api/courses/` - Créer un cours (admin)
- `GET /api/courses/stats/` - Statistiques (admin)

## 📰 **Actualités** (`/api/news/`)

### Endpoints publics
- `GET /api/news/` - Liste des actualités
- `GET /api/news/categories/` - Catégories d'actualités
- `GET /api/news/featured/` - Actualités mises en avant
- `GET /api/news/latest/` - Dernières actualités
- `GET /api/news/popular/` - Actualités populaires
- `GET /api/news/search/` - Recherche d'actualités
- `GET /api/news/{slug}/` - Détails d'une actualité
- `GET /api/news/alumni/` - Liste des succès des anciens
- `GET /api/news/alumni/{slug}/` - Détails d'un succès d'ancien
- `POST /api/news/alumni/` - Créer un succès d'ancien (admin)

> Photos supplémentaires : les photos liées à un succès sont gérées via le modèle `AlumniPhoto` et peuvent être ajoutées via l'interface d'administration (admin).

### Endpoints d'interaction
- `POST /api/news/{slug}/comment/` - Ajouter un commentaire
- `POST /api/news/newsletter/subscribe/` - S'abonner à la newsletter
- `POST /api/news/newsletter/unsubscribe/` - Se désabonner

### Endpoints admin
- `POST /api/news/` - Créer une actualité (admin)
- `GET /api/news/stats/` - Statistiques (admin)

## 📚 **Bibliothèque** (`/api/library/`)

### Endpoints publics
- `GET /api/library/books/` - Liste des livres
- `GET /api/library/categories/` - Catégories de livres
- `GET /api/library/authors/` - Liste des auteurs
- `GET /api/library/publishers/` - Liste des éditeurs
- `GET /api/library/books/featured/` - Livres mis en avant
- `GET /api/library/books/new-arrivals/` - Nouvelles acquisitions
- `GET /api/library/books/popular/` - Livres populaires
- `GET /api/library/books/search/` - Recherche de livres
- `GET /api/library/books/{id}/` - Détails d'un livre

### Endpoints d'interaction
- `POST /api/library/books/{id}/review/` - Ajouter un avis
- `POST /api/library/books/{id}/borrow/` - Emprunter un livre (auth)
- `POST /api/library/books/{id}/reserve/` - Réserver un livre
- `GET /api/library/books/{id}/download/` - Télécharger un livre

### Endpoints admin
- `POST /api/library/books/` - Ajouter un livre (admin)
- `GET /api/library/stats/` - Statistiques (admin)

## 👥 **Utilisateurs** (`/api/users/`)

### Authentification
- `POST /api/users/register/` - Inscription
- `POST /api/users/login/` - Connexion
- `POST /api/users/logout/` - Déconnexion (auth)

### Profil utilisateur
- `GET /api/users/profile/` - Profil utilisateur (auth)
- `PUT /api/users/profile/` - Mettre à jour le profil (auth)
- `POST /api/users/change-password/` - Changer le mot de passe (auth)
- `GET /api/users/dashboard/` - Données du tableau de bord (auth)

### Notifications
- `GET /api/users/notifications/` - Liste des notifications (auth)
- `POST /api/users/notifications/{id}/read/` - Marquer comme lu (auth)
- `POST /api/users/notifications/mark-all-read/` - Tout marquer comme lu (auth)

### Administration
- `GET /api/users/activities/` - Activités utilisateur (auth)
- `GET /api/users/stats/` - Statistiques utilisateurs (admin)
- `GET /api/users/list/` - Liste des utilisateurs (admin)

## 🔐 **Authentification**

### Token Authentication
Pour les endpoints nécessitant une authentification, incluez le header :
```
Authorization: Token YOUR_TOKEN_HERE
```

### Obtenir un token
```bash
POST /api/users/login/
{
    "username": "votre_username",
    "password": "votre_password"
}
```

Réponse :
```json
{
    "message": "Connexion réussie!",
    "user": {...},
    "token": "your_token_here"
}
```

## 📊 **Formats de réponse**

### Succès
```json
{
    "data": [...],
    "message": "Succès"
}
```

### Erreur
```json
{
    "error": "Message d'erreur",
    "details": {...}
}
```

### Pagination
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/courses/?page=2",
    "previous": null,
    "results": [...]
}
```

## 🧪 **Test des endpoints**

### Avec curl
```bash
# Liste des cours
curl http://localhost:8000/api/courses/

# Connexion
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Avec token
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/users/profile/
```

### Avec un navigateur
- Visitez http://localhost:8000/api/ pour voir tous les endpoints
- Utilisez l'interface admin pour tester les données

## 🔍 **Filtres et recherche**

### Paramètres de recherche
- `?search=terme` - Recherche textuelle
- `?ordering=field` - Tri (ajoutez `-` pour décroissant)
- `?page=2` - Pagination

### Exemples
```
GET /api/courses/?search=réseau
GET /api/news/?ordering=-created_at
GET /api/library/books/?search=python&ordering=title
```

## ✅ **Statut du serveur**

Vérifiez que le serveur fonctionne :
- http://localhost:8000/ - Page d'accueil
- http://localhost:8000/api/ - Documentation API
- http://localhost:8000/admin/ - Interface admin

## 📄 **Pages éditables** (`/api/pages/`)

- `GET /api/pages/mission/` - Récupère la page "mission" (public)
- `PUT /api/pages/mission/` - Mettre à jour la page "mission" (admin)

> La page "mission" est créée automatiquement lors de la migration initiale et contient des champs pour FR/EN/AR.
