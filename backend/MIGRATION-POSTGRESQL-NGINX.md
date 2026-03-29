# Guide: Migration SQLite vers PostgreSQL + Déploiement Nginx

## Configuration actuelle identifiée
- ** 5.2.3 avec DRProjet** : DjangoF
- **Base actuelle** : SQLite (settings.py)
- **Serveur** : gunicorn déjà installé

---

## Étape 1 : Installer PostgreSQL

### Ubuntu/Debian :
```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
```

### Windows :
Télécharger depuis https://www.postgresql.org/download/windows/

### CentOS/RHEL :
```bash
sudo dnf install postgresql-server postgresql-contrib
sudo postgresql-setup --initdb
sudo systemctl start postgresql
```

---

## Étape 2 : Créer la base de données

```bash
sudo -u postgres psql

CREATE USER mon_user WITH PASSWORD 'mot_de_passe_secure';
CREATE DATABASE ma_base OWNER mon_user;
ALTER ROLE mon_user CREATEDB;
\q
```

---

## Étape 3 : Installer le driver PostgreSQL

```bash
cd vend-main/backend
pip install psycopg2-binary dj-database-url
```

Ajouter à requirements.txt :
```
psycopg2-binary==2.9.10
dj-database-url==2.1.0
```

---

## Étape 4 : Modifier settings.py

Remplacer la configuration DATABASE dans school_backend/settings.py :

```python
import os
import dj_database_url
from dotenv import load_dotenv

load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME', 'ma_base'),
        'USER': os.environ.get('DB_USER', 'mon_user'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'mot_de_passe_secure'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

Créer un fichier .env à la racine du backend :
```env
SECRET_KEY=votre-cle-secrete
DEBUG=False
DB_NAME=ma_base
DB_USER=mon_user
DB_PASSWORD=mot_de_passe_secure
DB_HOST=localhost
DB_PORT=5432
```

---

## Étape 5 : Migrer les données

### Option A : Exporter/Importer
```bash
cd vend-main/backend

# Sauvegarder SQLite
cp db.sqlite3 db.sqlite3.backup

# Exporter les données
python manage.py dumpdata --all > dump.json

# Appliquer les migrations sur PostgreSQL
python manage.py migrate

# Importer les données
python manage.py loaddata dump.json
```

### Option B : Avec pgloader (plus rapide)
```bash
sudo apt install pgloader

pgloader sqlite:///db.sqlite3 postgresql://mon_user:mot_de_passe@localhost/ma_base
```

---

## Étape 6 : Configurer Gunicorn

Créer gunicorn.conf.py à la racine du backend :

```python
import multiprocessing

bind = '127.0.0.1:8000'
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = 'sync'
timeout = 120
keepalive = 5
accesslog = '-'
errorlog = '-'
loglevel = 'info'
max_requests = 1000
max_requests_jitter = 50
```

Tester :
```bash
gunicorn school_backend.wsgi:application --bind 0.0.0.0:8000 --config gunicorn.conf.py
```

---

## Étape 7 : Configuration Nginx

Installer Nginx :
```bash
sudo apt install nginx
```

Créer /etc/nginx/sites-available/monprojet :

```nginx
upstream django_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    client_max_body_size 50M;

    # Fichiers statiques
    location /static/ {
        alias /chemin/vers/vend-main/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control 'public, immutable';
    }

    # Fichiers medias
    location /media/ {
        alias /chemin/vers/vend-main/backend/media/;
        expires 7d;
    }

    # Proxy vers Gunicorn
    location / {
        proxy_pass http://django_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Activer la configuration :
```bash
sudo ln -s /etc/nginx/sites-available/monprojet /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Étape 8 : Service systemd

Créer /etc/systemd/system/gunicorn.service :

```ini
[Unit]
Description=Gunicorn instance for Django Project
After=network.target

[Service]
Type=notify
WorkingDirectory=/chemin/vers/vend-main/backend
Environment='PATH=/chemin/vers/venv/bin'
ExecStart=/chemin/vers/venv/bin/gunicorn --config gunicorn.conf.py school_backend.wsgi:application
Restart=always
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Activer le service :
```bash
sudo systemctl daemon-reload
sudo systemctl enable gunicorn
sudo systemctl start gunicorn
sudo systemctl status gunicorn
```

---

## Commandes finales

```bash
# 1. Vérifier installation PostgreSQL
sudo systemctl status postgresql

# 2. Tester connexion Django
cd vend-main/backend
python manage.py dbshell

# 3. Collecter les fichiers statiques
python manage.py collectstatic

# 4. Redémarrer les services
sudo systemctl restart gunicorn
sudo systemctl restart nginx
```

---

## Architecture finale

```
Navigateur → Nginx (:80) → Gunicorn (:8000) → Django → PostgreSQL
                                      ↑
                                 Fichiers statiques/media
```

---

## Notes importantes

1. **DEBUG = False** en production
2. **ALLOWED_HOSTS** doit contenir votre domaine
3. **SECRET_KEY** doit être généré et sécurisé
4. Configurer un certificat SSL (Let's Encrypt) pour HTTPS
5. Configurer les sauvegardes automatiques de PostgreSQL
