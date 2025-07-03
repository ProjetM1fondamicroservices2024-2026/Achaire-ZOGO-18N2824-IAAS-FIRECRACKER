# Service Proxy - API Gateway

Service de passerelle (gateway) intelligent basé sur FastAPI qui fournit un proxy sécurisé avec authentification JWT, load balancing et découverte de services via Eureka.

## 🚀 Fonctionnalités

- **Proxy intelligent** avec load balancing (round-robin, least_connections, random)
- **Authentification JWT** avec middleware automatique
- **Enregistrement automatique** avec Eureka Service Registry
- **Endpoints publics** configurables (login, register, reset password)
- **Gestion CORS** complète
- **Health checks** et endpoints d'information

## 📋 Prérequis

- Python 3.9+
- Docker et Docker Compose (pour le démarrage avec Docker)
- Service Registry (Eureka) en cours d'exécution

## 🛠️ Installation et Démarrage

### Démarrage en Local

1. **Cloner le projet** (si ce n'est pas déjà fait)
```bash
git clone https://github.com/IAAS-FIRECRACKER/service-proxy.git
cd service-proxy
```

2. **Créer un environnement virtuel**
```bash
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows
```

3. **Installer les dépendances**
```bash
pip install -r requirements.txt
```

4. **Configurer les variables d'environnement**
```bash
cp .env.example .env  # Si disponible, sinon créer le fichier .env
```

Contenu du fichier `.env` :
```env
APP_NAME=fastapi-proxy
APP_HOST=0.0.0.0
APP_PORT=8079
EUREKA_URL=http://localhost:8761/eureka
```

5. **Démarrer le service**
```bash
cd src/app
uvicorn main:app --host 0.0.0.0 --port 8079 --reload
```

Le service sera accessible sur : http://localhost:8079

### Démarrage avec Docker

#### Option 1: Docker Compose (Recommandé)

1. **Démarrer avec Docker Compose**
```bash
docker-compose up -d
```

2. **Voir les logs**
```bash
docker-compose logs -f proxy
```

3. **Arrêter le service**
```bash
docker-compose down
```

#### Option 2: Docker seul

1. **Construire l'image**
```bash
docker build -t service-proxy .
```

2. **Démarrer le conteneur**
```bash
docker run -d \
  --name service-proxy \
  -p 8079:8079 \
  -e EUREKA_URL=http://service-registry:8761/eureka \
  --network iaas-firecracker-network \
  service-proxy
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `APP_NAME` | Nom de l'application | `fastapi-proxy` |
| `APP_HOST` | Adresse d'écoute | `0.0.0.0` |
| `APP_PORT` | Port d'écoute | `8079` |
| `EUREKA_URL` | URL du service registry | `http://localhost:8761/eureka` |

### Endpoints publics (sans authentification)

Les endpoints suivants sont accessibles sans token JWT :
- `USER-SERVICE/api/auth/login`
- `USER-SERVICE/api/auth/register`
- `USER-SERVICE/api/auth/users/send-reset-code`
- `USER-SERVICE/api/auth/users/verify-code`
- `USER-SERVICE/api/auth/users/reset-password`

## 📡 API Endpoints

### Health Check
```bash
GET /health
```

### Information du service
```bash
GET /info
```

### Proxy vers les services
```bash
{METHOD} /{service_name}/{path}?lb_strategy={strategy}
```

**Paramètres :**
- `service_name` : Nom du service cible (ex: USER-SERVICE)
- `path` : Chemin de l'endpoint sur le service cible
- `lb_strategy` : Stratégie de load balancing (optionnel)
  - `round_robin` (défaut)
  - `least_connections`
  - `random`

**Exemple :**
```bash
# Appel avec round-robin (défaut)
GET /USER-SERVICE/api/users

# Appel avec stratégie least_connections
GET /USER-SERVICE/api/users?lb_strategy=least_connections
```

## 🔐 Authentification

Le service utilise l'authentification JWT. Le token peut être fourni :
- Dans un cookie nommé `token`
- Dans l'header `Authorization: Bearer <token>`

Les endpoints publics ne nécessitent pas d'authentification.

## 🏗️ Architecture

```
service-proxy/
├── src/
│   ├── app/
│   │   ├── main.py              # Point d'entrée FastAPI
│   │   ├── eureka.py            # Client Eureka
│   │   ├── config/
│   │   │   └── settings.py      # Configuration
│   │   └── proxy/
│   │       ├── routes.py        # Routes du proxy
│   │       └── security.py     # Sécurité JWT
│   └── start.sh                 # Script de démarrage
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
├── .env
└── README.md
```

## 🐛 Dépannage

### Problèmes courants

1. **Service Registry non accessible**
   - Vérifier que Eureka est démarré sur le port 8761
   - Vérifier la variable `EUREKA_URL`

2. **Erreur de dépendances**
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```

3. **Port déjà utilisé**
   ```bash
   # Trouver le processus utilisant le port 8079
   lsof -i :8079
   # Tuer le processus si nécessaire
   kill -9 <PID>
   ```

### Logs et Debug

```bash
# Logs en local
uvicorn main:app --host 0.0.0.0 --port 8079 --log-level debug

# Logs Docker
docker-compose logs -f proxy

# Logs détaillés Docker
docker run --rm -it service-proxy /bin/bash
```

## 🔗 Services liés

Ce service proxy fonctionne avec :
- **Service Registry** (Eureka) - Port 8761
- **USER-SERVICE** - Service d'authentification
- **Autres microservices** enregistrés dans Eureka

## 📝 Notes de développement

- Le service s'enregistre automatiquement auprès d'Eureka au démarrage
- Le load balancer maintient des statistiques sur les instances
- Les erreurs de proxy sont loggées avec des détails complets
- Le middleware d'authentification est appliqué automatiquement

## 🤝 Contribution

Pour contribuer au projet :
1. Créer une branche feature
2. Implémenter les modifications
3. Tester en local et avec Docker
4. Soumettre une pull request
