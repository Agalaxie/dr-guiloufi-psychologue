# 🚀 Guide de Lancement en Local

## ✅ Prérequis Vérifiés
- ✅ Node.js installé
- ✅ Dépendances installées (`npm list` OK)
- ✅ Fichier `.env.local` créé

## 🔧 Configuration Rapide pour Tests

### 1. **Éditer le fichier `.env.local`**

```bash
# Variables OBLIGATOIRES à configurer :

# Pour Stripe (paiements) - Récupérez vos clés sur https://stripe.com
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique_test
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete_test

# Pour les emails - Gmail recommandé
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app-gmail

# Email qui recevra les réservations
PSYCHOLOGIST_EMAIL=dr.guiloufi@gmail.com
```

### 2. **Configuration Gmail (pour les emails)**

1. Aller dans votre compte Google → Sécurité
2. Activer la "Validation en 2 étapes"
3. Créer un "Mot de passe d'application"
4. Utiliser ce mot de passe dans `SMTP_PASS`

### 3. **Configuration Stripe (pour les paiements)**

1. Créer un compte sur [stripe.com](https://stripe.com)
2. Mode Test activé
3. Récupérer les clés dans "Développeurs" → "Clés API"
4. Copier `pk_test_...` et `sk_test_...` dans `.env.local`

## 🚀 Lancement

```bash
# Démarrer le serveur de développement
npm run dev
```

## 🌐 Accès Local

- **Site** : http://localhost:3000
- **Page de réservation** : http://localhost:3000/booking

## 🧪 Test Complet

1. Aller sur http://localhost:3000/booking
2. Remplir le formulaire
3. Choisir une date/heure
4. Cliquer "Réserver et payer 60€"
5. Utiliser une carte de test Stripe : `4242 4242 4242 4242`

## ⚠️ Limitations en Local

- **Webhooks Stripe** : Ne fonctionneront pas en local sans tunnel (ngrok)
- **Emails** : Fonctionnent si Gmail configuré
- **Paiements** : Mode test uniquement

## 🔧 Dépannage

### Erreur "Module not found"
```bash
npm install
```

### Erreur Stripe
- Vérifier les clés dans `.env.local`
- S'assurer d'être en mode test

### Emails non envoyés
- Vérifier les paramètres Gmail
- Utiliser un mot de passe d'application