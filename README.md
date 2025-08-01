# Site Web Dr. Guiloufi - Psychologue Paris 18

Site web moderne et professionnel pour Dr. Guiloufi, psychologue à Paris 18ème. Construit avec Next.js, TypeScript, Tailwind CSS et shadcn/ui.

## 🌟 Fonctionnalités

- **Design moderne** : Interface minimaliste et professionnelle avec shadcn/ui
- **Animations fluides** : Micro-interactions et animations CSS personnalisées
- **Photo professionnelle** : Intégration d'image du psychologue pour humaniser le site
- **Témoignages patients** : Section dédiée aux avis et évaluations
- **Éléments flottants** : Cards animées et éléments visuels dynamiques
- **Réservation en ligne** : Système complet de prise de rendez-vous en 6 étapes
- **Consultations mixtes** : Support pour consultations au cabinet et en ligne
- **Paiement sécurisé** : Intégration Stripe pour les consultations en ligne
- **Chat en direct** : Système de chat interactif avec réponses automatiques
- **FAQ complète** : Interface accordion avec questions fréquentes
- **Responsive** : Compatible mobile, tablette et desktop
- **Envoi d'emails** : Confirmations automatiques par email

## 🏥 Services proposés

### Spécialités principales
- Dépression et troubles de l'humeur
- Anxiété et gestion du stress
- Thérapie de couple
- Confiance en soi et développement personnel
- Thérapie brève orientée solutions
- EMDR (traitement des traumatismes)

### Services additionnels
- Dépendance affective
- Psychologie enfant et adolescent
- TDAH et troubles de l'attention
- Phobies et troubles anxieux
- Addictions
- Sexologie
- Tests psychométriques (QI)
- Hypnose thérapeutique
- Troubles d'apprentissage (dyslexie)

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Configuration des variables d'environnement
Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Configuration email pour les notifications de réservation
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app-gmail
SMTP_FROM=contact@dr-guiloufi.fr
DOCTOR_EMAIL=guiloufi@example.com

# Configuration Stripe pour les paiements en ligne (optionnel)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# URL du site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note importante :** Pour Gmail, utilisez un "mot de passe d'application" et non votre mot de passe habituel. Activez l'authentification à 2 facteurs puis générez un mot de passe d'application dans les paramètres de sécurité Google.

### Lancement en développement
```bash
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Build pour production
```bash
npm run build
npm start
```

## 📱 Pages du site

- **Accueil** (`/`) : Présentation du psychologue et services
- **À propos** (`/about`) : Formations, qualifications et approche
- **Services** (`/services`) : Détail de toutes les spécialités
- **Réservation** (`/booking`) : Système de prise de rendez-vous
- **Chat** (`/chat`) : Chat en ligne pour questions rapides
- **FAQ** (`/faq`) : Questions fréquentes
- **Contact** (`/contact`) : Informations de contact et formulaire

## 🛠️ Processus de réservation

1. **Sélection de la date** : Calendrier interactif
2. **Choix de l'heure** : Créneaux disponibles
3. **Type de consultation** : Cabinet (70€) ou en ligne (65€)
4. **Formulaire patient** : Informations personnelles et motif
5. **Paiement** : Pour consultations en ligne uniquement (Stripe)
6. **Confirmation** : Email automatique envoyé

## 💳 Système de paiement

- **Cabinet** : Paiement sur place (CB, chèque, espèces)
- **En ligne** : Paiement sécurisé par Stripe
- **Tarifs** : 70€ (cabinet) / 65€ (en ligne)

## 📧 Système d'emails

- Confirmation automatique pour le patient
- Notification pour le psychologue
- Rappels de rendez-vous (à implémenter)
- Liens de connexion pour consultations en ligne

## 🎨 Technologies utilisées

- **Framework** : Next.js 14 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **Components** : shadcn/ui + Radix UI
- **Icons** : Lucide React
- **Email** : Nodemailer
- **Paiement** : Stripe
- **Date** : date-fns + react-day-picker

## 📂 Structure du projet

```
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── about/page.tsx     # À propos
│   ├── services/page.tsx  # Services
│   ├── booking/page.tsx   # Réservation
│   ├── chat/page.tsx      # Chat
│   ├── faq/page.tsx       # FAQ
│   ├── contact/page.tsx   # Contact
│   └── api/               # API Routes
├── components/            # Composants React
│   ├── ui/               # Composants shadcn/ui
│   ├── Header.tsx        # Navigation
│   └── Footer.tsx        # Pied de page
├── lib/                  # Utilitaires
└── public/              # Assets statiques
```

## 🔧 Personnalisation

### Couleurs et thème
Les couleurs sont configurables dans `tailwind.config.js` et `app/globals.css`

### Contenu
- Informations du psychologue dans les composants
- Services et spécialités dans `/services`
- FAQ dans `/faq/page.tsx`

### Emails
Templates d'emails dans `/app/api/booking/route.ts`

## 🚀 Déploiement

Le site peut être déployé sur :
- **Vercel** (recommandé pour Next.js)
- **Netlify**
- **Railway**
- **Tout serveur Node.js**

### Variables d'environnement en production
Assurez-vous de configurer toutes les variables d'environnement sur votre plateforme de déploiement.

## ✨ Améliorations récentes

Suite aux retours utilisateur, plusieurs améliorations ont été apportées pour rendre le site plus chaleureux et personnel :

### 🎨 Améliorations visuelles
- **Photo professionnelle** : Ajout d'une photo du psychologue sur la homepage
- **Animations fluides** : Effets de hover, transitions et micro-interactions
- **Éléments flottants** : Cards avec informations qui flottent autour de la photo
- **Gradients dynamiques** : Arrière-plans colorés et dégradés attrayants
- **Témoignages** : Section dédiée avec avis patients authentiques

### 🚀 Animations personnalisées
- **Fade-in progressif** : Apparition progressive des éléments
- **Hover effects** : Effets au survol sur les boutons et cards
- **Floating animations** : Éléments qui flottent en continu
- **Scale effects** : Agrandissement au survol pour plus d'interactivité
- **Badge de disponibilité** : Indicateur animé de disponibilité en temps réel

### 💫 Expérience utilisateur améliorée
- **Hero section repensée** : Mise en page 2 colonnes avec photo
- **Informations pratiques** : Horaires, localisation et contact visibles
- **Statistiques sociales** : Nombre de patients accompagnés, note moyenne
- **CTA amélioré** : Section d'appel à l'action plus engageante
- **Éléments de confiance** : Badges de confidentialité et d'expérience

## 📞 Support

Pour toute question sur l'installation ou la personnalisation du site, n'hésitez pas à me contacter.

## ⚖️ Licence

Ce projet est destiné à un usage professionnel pour Dr. Guiloufi. Tous droits réservés.