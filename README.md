# Achaire-ZOGO-18N2824-IAAS-FIRECRACKER
# Frontend - Interface Utilisateur IaaS Firecracker

Interface utilisateur moderne basée sur React pour la plateforme IaaS Firecracker. Cette application fournit une interface web complète pour la gestion des machines virtuelles, des utilisateurs, des clusters et des images système.

## 🚀 Fonctionnalités

- **Dashboard interactif** avec gestion complète des VMs
- **Authentification sécurisée** (login, register, reset password)
- **Gestion des utilisateurs** avec interface d'administration
- **Gestion des machines virtuelles** (création, démarrage, arrêt, suppression)
- **Gestion des offres de VMs** avec configuration personnalisée
- **Gestion des clusters** de services
- **Gestion des images système** pour les VMs
- **Profil utilisateur** avec modification des données personnelles
- **Interface responsive** avec Material-UI

## 🛠️ Technologies Utilisées

- **React 19.0.0** - Framework JavaScript moderne
- **Material-UI (MUI)** - Composants d'interface utilisateur
- **Redux Toolkit** - Gestion d'état centralisée
- **React Router DOM** - Navigation et routage
- **Axios** - Client HTTP pour les appels API
- **Motion** - Animations et transitions
- **Create React App** - Configuration et build

## 📋 Prérequis

- Node.js 16+ et npm/yarn
- Service-proxy en cours d'exécution (port 8079)
- Services backend (user-service, vm-host, etc.) accessibles

## 🛠️ Installation et Démarrage

### Démarrage en Local

1. **Cloner le projet** (si ce n'est pas déjà fait)
```bash
git clone https://github.com/IAAS-FIRECRACKER/Frontend.git
cd Frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement** (optionnel)
```bash
# Créer un fichier .env si nécessaire
echo "REACT_APP_API_URL=http://localhost:8079" > .env
```

4. **Démarrer l'application**
```bash
npm start
# ou
yarn start
```

L'application sera accessible sur : http://localhost:3000

### Démarrage avec Docker

#### Créer un Dockerfile (si nécessaire)

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://service-proxy:8079
    depends_on:
      - service-proxy
    networks:
      - iaas-firecracker-network

networks:
  iaas-firecracker-network:
    external: true
```

## 🏗️ Structure du Projet

```
Frontend/
├── public/                  # Fichiers statiques
├── src/
│   ├── api/                # Services API
│   │   ├── user-backend.js         # API utilisateurs
│   │   ├── vm-host-backend.js      # API machines virtuelles
│   │   ├── vm-offer-backend.js     # API offres VMs
│   │   ├── cluster-service-backend.js # API clusters
│   │   └── system-images-backend.js   # API images système
│   ├── components/         # Composants réutilisables
│   │   ├── auth/          # Composants d'authentification
│   │   ├── layout/        # Composants de mise en page
│   │   └── ui/            # Composants d'interface
│   ├── pages/             # Pages de l'application
│   │   ├── HomePage.jsx           # Page d'accueil
│   │   ├── DashboardPage.jsx      # Dashboard principal
│   │   ├── LoginPage.jsx          # Page de connexion
│   │   ├── SignupPage.jsx         # Page d'inscription
│   │   ├── UserManagementPage.jsx # Gestion des utilisateurs
│   │   ├── VmManagementPage.jsx   # Gestion des VMs
│   │   ├── VmOffersPage.jsx       # Gestion des offres
│   │   ├── ClusterManagementPage.jsx # Gestion des clusters
│   │   └── SystemImagesPage.jsx   # Gestion des images
│   ├── store/             # Configuration Redux
│   ├── theme.jsx          # Thème Material-UI
│   ├── App.js             # Composant principal
│   └── index.js           # Point d'entrée
├── package.json
└── README.md
```

## 🔧 Configuration

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `REACT_APP_API_URL` | URL du service-proxy | `http://localhost:8079` |
| `REACT_APP_TITLE` | Titre de l'application | `IaaS Firecracker` |

### Services API

L'application communique avec les services backend via le service-proxy :

- **USER-SERVICE** - Authentification et gestion des utilisateurs
- **VM-HOST-SERVICE** - Gestion des machines virtuelles
- **VM-OFFER-SERVICE** - Gestion des offres de VMs
- **CLUSTER-SERVICE** - Gestion des clusters
- **SYSTEM-IMAGE-SERVICE** - Gestion des images système

## 📱 Pages et Fonctionnalités

### Pages Publiques
- **HomePage** - Page d'accueil avec présentation
- **LoginPage** - Authentification des utilisateurs
- **SignupPage** - Inscription de nouveaux utilisateurs
- **ResetPasswordPage** - Réinitialisation de mot de passe

### Pages Authentifiées
- **DashboardPage** - Vue d'ensemble des VMs et statistiques
- **UserProfilePage** - Gestion du profil utilisateur

### Pages Administrateur
- **UserManagementPage** - Gestion des utilisateurs (admin)
- **VmManagementPage** - Gestion avancée des VMs
- **VmOffersPage** - Configuration des offres de VMs
- **ClusterManagementPage** - Gestion des clusters
- **SystemImagesPage** - Gestion des images système

## 🔐 Authentification

L'application utilise un système d'authentification basé sur JWT :

- **Login** - Connexion avec email/mot de passe
- **Register** - Inscription avec validation
- **Reset Password** - Réinitialisation par email
- **Profile Management** - Modification des données personnelles
- **Role-based Access** - Accès différencié admin/utilisateur

## 🎨 Thème et Interface

- **Material-UI** pour les composants
- **Thème personnalisé** avec couleurs de la marque
- **Design responsive** pour mobile et desktop
- **Animations fluides** avec Motion
- **Interface intuitive** avec navigation claire

## 📊 Gestion d'État

Utilisation de Redux Toolkit pour :
- **État d'authentification** (utilisateur connecté, rôle)
- **Données des VMs** (liste, statuts, configurations)
- **État de l'interface** (loading, erreurs, notifications)
- **Cache des données** pour optimiser les performances

## 🚀 Scripts Disponibles

```bash
# Démarrage en mode développement
npm start

# Build pour la production
npm run build

# Tests unitaires
npm test

# Analyse du bundle
npm run build && npx serve -s build

# Linting du code
npm run lint
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de connexion API**
   - Vérifier que le service-proxy est démarré (port 8079)
   - Vérifier la variable `REACT_APP_API_URL`

2. **Problèmes de dépendances**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Erreurs de build**
   ```bash
   npm run build
   # Vérifier les warnings et erreurs
   ```

4. **Port déjà utilisé**
   ```bash
   # Trouver le processus utilisant le port 3000
   lsof -i :3000
   # Tuer le processus si nécessaire
   kill -9 <PID>
   ```

### Logs et Debug

```bash
# Logs détaillés en développement
REACT_APP_DEBUG=true npm start

# Analyse des performances
npm run build -- --analyze

# Tests avec couverture
npm test -- --coverage
```

## 🔗 Services Liés

Cette application frontend fonctionne avec :
- **Service-proxy** (port 8079) - Passerelle API
- **User-service** - Gestion des utilisateurs
- **VM-host-service** - Gestion des VMs Firecracker
- **VM-offer-service** - Gestion des offres
- **Cluster-service** - Gestion des clusters
- **System-image-service** - Gestion des images

## 📝 Notes de Développement

- **Hot Reload** activé en mode développement
- **Source Maps** générées pour le debugging
- **Optimisations automatiques** en mode production
- **Code Splitting** pour améliorer les performances
- **PWA Ready** - Peut être configuré comme PWA

## 🤝 Contribution

Pour contribuer au projet :
1. Créer une branche feature
2. Développer les modifications
3. Tester localement
4. Soumettre une pull request

## 📄 License

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
