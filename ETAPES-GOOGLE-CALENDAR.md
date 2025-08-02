# 🔧 Configuration Google Calendar - Guide Pas à Pas

## ✅ Étape 1 : Création du Projet Google Cloud (5 min)

### 1.1 Accéder à Google Cloud Console
1. Allez sur [console.cloud.google.com](https://console.cloud.google.com/)
2. Connectez-vous avec votre compte Google (celui que vous voulez utiliser pour le calendrier)

### 1.2 Créer un nouveau projet
1. Cliquez sur le menu déroulant du projet (en haut à gauche)
2. Cliquez "Nouveau projet"
3. **Nom du projet** : `PSY-Calendar-DrGuiloufi`
4. Cliquez "Créer"
5. Sélectionnez ce nouveau projet

## ✅ Étape 2 : Activer l'API Google Calendar (2 min)

### 2.1 Aller dans APIs & Services
1. Menu hamburger (☰) → "APIs & Services" → "Library"
2. Dans la barre de recherche, tapez : `Google Calendar API`
3. Cliquez sur "Google Calendar API"
4. Cliquez "**ENABLE**"

## ✅ Étape 3 : Configurer OAuth Consent Screen (3 min)

### 3.1 Configuration du consentement
1. Menu → "APIs & Services" → "OAuth consent screen"
2. **Type** : Sélectionnez "External"
3. Cliquez "CREATE"

### 3.2 Remplir les informations
1. **App name** : `Cabinet Dr. Guiloufi`
2. **User support email** : Votre email
3. **Developer contact information** : Votre email
4. Cliquez "SAVE AND CONTINUE"
5. **Scopes** : Cliquez "SAVE AND CONTINUE" (rien à ajouter)
6. **Test users** : Cliquez "SAVE AND CONTINUE" (rien à ajouter)
7. **Summary** : Cliquez "BACK TO DASHBOARD"

## ✅ Étape 4 : Créer les Credentials OAuth2 (3 min)

### 4.1 Créer OAuth Client ID
1. Menu → "APIs & Services" → "Credentials"
2. Cliquez "+ CREATE CREDENTIALS" → "OAuth 2.0 Client IDs"

### 4.2 Configurer le Client ID
1. **Application type** : "Web application"
2. **Name** : `PSY Booking System`
3. **Authorized redirect URIs** :
   - Cliquez "ADD URI"
   - Ajoutez : `http://localhost:3000/api/auth/callback/google`
   - (Pour la production plus tard) : `https://votre-domaine.com/api/auth/callback/google`
4. Cliquez "CREATE"

### 4.3 Sauvegarder les clés
Une popup apparaît avec vos clés :
- **Client ID** : `123456789-abc...googleusercontent.com`
- **Client Secret** : `ABCD-EF...`

**⚠️ IMPORTANT** : Copiez ces clés et gardez-les précieusement !

## ✅ Étape 5 : Obtenir le Refresh Token (10 min)

### 5.1 Créer le script de setup
Créez un fichier `setup-google-calendar.js` à la racine de votre projet :

```javascript
const { google } = require('googleapis');
const readline = require('readline');

// REMPLACEZ par vos vraies valeurs
const oauth2Client = new google.auth.OAuth2(
  'VOTRE_CLIENT_ID_ICI',           // Client ID obtenu à l'étape 4
  'VOTRE_CLIENT_SECRET_ICI',       // Client Secret obtenu à l'étape 4
  'http://localhost:3000/api/auth/callback/google'
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});

console.log('🔗 Allez sur cette URL et autorisez l\'application:');
console.log(authUrl);
console.log('');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('📋 Collez le code d\'autorisation ici: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('');
    console.log('✅ SUCCESS! Voici votre Refresh Token:');
    console.log('🔑 REFRESH_TOKEN:', tokens.refresh_token);
    console.log('');
    console.log('⚠️  Gardez ce token secret et copiez-le dans votre .env.local');
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
  rl.close();
});
```

### 5.2 Exécuter le script
1. Remplacez `VOTRE_CLIENT_ID_ICI` et `VOTRE_CLIENT_SECRET_ICI` par vos vraies valeurs
2. Sauvegardez le fichier
3. Dans votre terminal :
```bash
node setup-google-calendar.js
```

### 5.3 Autoriser l'application
1. Une URL s'affiche → Copiez-la dans votre navigateur
2. Connectez-vous avec votre compte Google (celui avec le calendrier)
3. Autorisez l'application `Cabinet Dr. Guiloufi`
4. Google vous donne un code → Copiez ce code
5. Collez le code dans votre terminal
6. Le script affiche votre **REFRESH_TOKEN** → Copiez-le !

## ✅ Étape 6 : Configuration .env.local (2 min)

Créez/modifiez votre fichier `.env.local` :

```bash
# URL de base
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key-changez-en-production

# Google Calendar (NOUVEAU - remplacez par vos vraies valeurs)
GOOGLE_CLIENT_ID=123456789-abc...googleusercontent.com
GOOGLE_CLIENT_SECRET=ABCD-EF...
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
GOOGLE_REFRESH_TOKEN=1//04...votre_refresh_token_ici
GOOGLE_CALENDAR_ID=primary

# Stripe (vos clés existantes)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (vos paramètres existants)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
SMTP_FROM=contact@dr-guiloufi.fr

# Psychologue
PSYCHOLOGIST_EMAIL=dr.guiloufi@gmail.com
PSYCHOLOGIST_NAME=Dr. Guiloufi
```

## ✅ Étape 7 : Test de Fonctionnement (5 min)

### 7.1 Redémarrer l'application
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

### 7.2 Test simple
1. Allez sur http://localhost:3000/booking
2. Sélectionnez une date et heure
3. Remplissez le formulaire
4. Cliquez "Réserver et payer 60€"

### 7.3 Test Google Calendar
1. **Créer un événement "Occupé"** dans votre Google Calendar
   - Date : Demain
   - Heure : 14h-15h
   - Titre : "Occupé"
2. **Tester sur le site** : Essayer de réserver demain 14h
3. **Résultat attendu** : Le créneau doit être indisponible

## 🎯 Vérification de Succès

### ✅ Configuration réussie si :
- Pas d'erreurs dans le terminal
- Page de réservation fonctionne
- Créneaux "Occupés" dans Calendar sont bien bloqués
- Emails de test reçus

### ❌ Problèmes fréquents :
- **"Calendar not found"** → Vérifier GOOGLE_CALENDAR_ID=primary
- **"Insufficient permissions"** → Refaire l'étape 5 (refresh token)
- **"Invalid credentials"** → Vérifier Client ID/Secret

## 🚀 Prochaines Étapes

1. **Tester complètement** en local avec vraies cartes Stripe test
2. **Configurer Stripe webhook** pour production
3. **Déployer sur Vercel** quand tout fonctionne

## 📞 Support

Si vous avez des problèmes, les erreurs les plus communes sont dans le terminal. Regardez les messages d'erreur Google Calendar API pour diagnostiquer.