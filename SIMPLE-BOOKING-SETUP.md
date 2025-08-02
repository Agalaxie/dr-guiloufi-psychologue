# 🚀 Configuration Version Simplifiée

Cette version ultra-simplifiée permet la réservation et le paiement direct sans base de données ni authentification.

## ⚙️ Variables d'environnement requises

Créez un fichier `.env.local` avec ces variables :

```bash
# URL de base (pour Stripe redirections)
NEXTAUTH_URL=http://localhost:3000  # ou votre domaine en prod

# Stripe (OBLIGATOIRE pour le paiement)
STRIPE_PUBLISHABLE_KEY=pk_test_...  # Clé publique Stripe
STRIPE_SECRET_KEY=sk_test_...       # Clé secrète Stripe
STRIPE_WEBHOOK_SECRET=whsec_...     # Secret webhook Stripe

# Email SMTP (OBLIGATOIRE pour les confirmations)
SMTP_HOST=smtp.gmail.com            # Serveur SMTP
SMTP_PORT=587                       # Port SMTP
SMTP_USER=votre-email@gmail.com     # Email d'envoi
SMTP_PASS=votre-mot-de-passe-app    # Mot de passe d'application
SMTP_FROM=contact@dr-guiloufi.fr    # Adresse d'expéditeur

# Email du psychologue (pour recevoir les notifications)
DOCTOR_EMAIL=guiloufi@example.com   # Email où recevoir les notifications

# Variables optionnelles (pour la compatibilité avec l'ancien code)
NEXTAUTH_SECRET=random-secret-key
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
NEXT_PUBLIC_SUPABASE_URL=optional
NEXT_PUBLIC_SUPABASE_ANON_KEY=optional
SUPABASE_SERVICE_ROLE_KEY=optional
```

## 🛠️ Configuration Stripe

1. **Créer un compte Stripe** (gratuit) : https://stripe.com
2. **Récupérer les clés** :
   - Dashboard > Développeurs > Clés API
   - Copier la clé publique et secrète
3. **Configurer le webhook** :
   - Dashboard > Développeurs > Webhooks
   - Ajouter un endpoint : `https://votre-domaine.com/api/stripe/webhook-simple`
   - Sélectionner l'événement : `checkout.session.completed`
   - Copier le secret de signature

## 📧 Configuration Email

### Option 1 : Gmail (recommandé pour tester)
1. Activer l'authentification 2FA sur Gmail
2. Générer un mot de passe d'application
3. Utiliser ce mot de passe dans `SMTP_PASS`

### Option 2 : Autre fournisseur SMTP
- Modifier `SMTP_HOST` et `SMTP_PORT` selon votre fournisseur
- SendGrid, Mailgun, etc.

## 🏃‍♂️ Comment ça marche

1. **Client remplit le formulaire** sur `/booking`
2. **Clique "Réserver et payer 60€"**
3. **Redirection vers Stripe Checkout**
4. **Après paiement réussi** :
   - Webhook Stripe déclenché
   - 2 emails envoyés automatiquement :
     - ✅ Client : confirmation avec détails
     - 📧 Psychologue : notification de nouveau RDV

## 💰 Coûts de cette version

- **Vercel** : Gratuit (plan Hobby suffit largement)
- **Stripe** : 1,4% + 0,25€ par transaction (≈ 1,10€ par RDV de 60€)
- **Email** : Gratuit avec Gmail
- **Total mensuel** : ~0-5€ selon le nombre de RDV

## ✅ Avantages

- ✅ 10x plus simple à maintenir
- ✅ Pas de base de données
- ✅ Pas d'authentification
- ✅ Fonctionne immédiatement
- ✅ Coûts très faibles
- ✅ Emails automatiques
- ✅ Paiement sécurisé

## ⚠️ Inconvénients

- ❌ Pas de vérification de disponibilité en temps réel
- ❌ Gestion manuelle pour le psychologue
- ❌ Pas de dashboard admin
- ❌ Pas d'historique des RDV

## 🚀 Déploiement

1. **Push sur Vercel** : Le site se déploie automatiquement
2. **Configurer les variables d'environnement** dans Vercel Dashboard
3. **Tester un paiement** avec les cartes de test Stripe
4. **Configurer le webhook** avec l'URL de production

## 🔧 Maintenance

La seule maintenance nécessaire :
- Vérifier que les emails arrivent bien
- Gérer manuellement les conflits de créneaux
- Répondre aux questions clients par email/téléphone

C'est tout ! 🎉