# 🎓 Yool Education - Plateforme d'apprentissage en ligne

Une plateforme d'apprentissage moderne inspirée de Yool.education, construite avec Next.js, TypeScript, Prisma et Tailwind CSS.

## ✨ Fonctionnalités

### 👥 Système multi-rôles

- **Administrateur** : Validation des comptes, gestion des cours, statistiques globales
- **Enseignant** : Création de cours, gestion des revenus, suivi des étudiants  
- **Étudiant** : Inscription aux cours, suivi de progression, badges et certificats

### 🚀 Fonctionnalités principales

- ✅ **Authentification sécurisée** avec NextAuth.js
- ✅ **Tableaux de bord personnalisés** pour chaque rôle
- ✅ **Interface responsive** optimisée mobile
- ✅ **Design moderne** avec Tailwind CSS
- 🔄 **Système de paiement** avec Stripe (en cours)
- 🔄 **Support multilingue** (français, anglais, arabe) (en cours)
- 🔄 **Gamification** avec badges et points (en cours)
- 🔄 **Forum Q&A** par cours (en cours)
- 🔄 **Classes en direct** avec Zoom/Google Meet (en cours)
- 🔄 **Recommandations IA** (en cours)

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 14, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes, Prisma ORM
- **Base de données** : PostgreSQL
- **Authentification** : NextAuth.js
- **UI Components** : Radix UI
- **Paiements** : Stripe
- **Déploiement** : Vercel (recommandé)

## 📦 Installation

### Prérequis

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### 1. Cloner le projet

```bash
git clone <repository-url>
cd yool-education
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copiez le fichier `.env` et configurez vos variables :

```bash
cp .env .env.local
```

Modifiez les variables dans `.env.local` :

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/yool_education"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (optionnel)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# Autres services (optionnels)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
OPENAI_API_KEY="your-openai-key"
```

### 4. Configuration de la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma migrate dev --name init

# (Optionnel) Seed avec des données de test
npx prisma db seed
```

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📱 Utilisation

### Comptes de test

Après l'installation, vous pouvez créer des comptes via l'interface d'inscription :

1. **Étudiant** : Inscription automatiquement approuvée
2. **Enseignant** : Nécessite validation par un administrateur
3. **Administrateur** : Doit être créé manuellement en base

### Navigation

- **Page d'accueil** : `/`
- **Connexion** : `/auth/signin`
- **Inscription** : `/auth/signup`
- **Tableau de bord admin** : `/admin/dashboard`
- **Tableau de bord enseignant** : `/teacher/dashboard`
- **Tableau de bord étudiant** : `/student/dashboard`

## 🏗️ Architecture

```
src/
├── app/                    # Pages Next.js 14 (App Router)
│   ├── api/               # API Routes
│   ├── admin/             # Pages administrateur
│   ├── teacher/           # Pages enseignant
│   ├── student/           # Pages étudiant
│   └── auth/              # Pages d'authentification
├── components/            # Composants réutilisables
│   ├── ui/                # Composants UI de base
│   └── layout/            # Composants de mise en page
├── lib/                   # Utilitaires et configuration
│   ├── auth.ts            # Configuration NextAuth
│   ├── prisma.ts          # Client Prisma
│   └── utils.ts           # Fonctions utilitaires
└── prisma/                # Schéma et migrations
```

## 🔧 Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting
npm run lint

# Base de données
npx prisma studio          # Interface graphique DB
npx prisma migrate dev      # Nouvelle migration
npx prisma generate         # Générer le client
npx prisma db push          # Push schema sans migration
```

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Variables d'environnement de production

Assurez-vous de configurer toutes les variables nécessaires :

- `DATABASE_URL`
- `NEXTAUTH_SECRET` 
- `NEXTAUTH_URL`
- `STRIPE_SECRET_KEY` (si paiements activés)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 TODO

- [ ] Système de paiement Stripe complet
- [ ] Support multilingue avec next-intl
- [ ] Module IA pour recommandations
- [ ] Système de gamification complet
- [ ] Forum/Q&A par cours
- [ ] Intégration vidéo (Zoom/Google Meet)
- [ ] Upload de fichiers (Cloudinary/S3)
- [ ] Notifications en temps réel
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**Développé avec ❤️ pour l'éducation en ligne**
