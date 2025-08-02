# 📅 Configuration Google Calendar

## 🎯 Avantages de cette approche

✅ **Gestion centralisée** : Le docteur gère tout depuis Google Calendar  
✅ **Synchronisation** : Accessible sur téléphone, ordinateur, tablette  
✅ **Blocage facile** : Créer un événement "Occupé" pour bloquer un créneau  
✅ **Pas de base de données** : Plus simple et moins cher  
✅ **Notifications** : Rappels automatiques intégrés  

## ⚙️ Configuration Étape par Étape

### 1. **Créer un Projet Google Cloud**

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créer un nouveau projet → "PSY-Calendar"
3. Activer l'API Google Calendar :
   - Menu → APIs & Services → Library
   - Chercher "Google Calendar API"
   - Cliquer "Enable"

### 2. **Créer les Credentials OAuth2**

1. Menu → APIs & Services → Credentials
2. "+ CREATE CREDENTIALS" → OAuth 2.0 Client IDs
3. Configure OAuth consent screen (si demandé) :
   - Type : External
   - App name : "Cabinet Dr. Guiloufi"
   - User support email : votre email
   - Developer contact : votre email
4. Create OAuth client ID :
   - Application type : Web application
   - Name : "PSY Booking System"
   - Authorized redirect URIs : 
     - `http://localhost:3000/api/auth/callback/google` (développement)
     - `https://votre-domaine.com/api/auth/callback/google` (production)

### 3. **Récupérer le Refresh Token**

Utilisez ce script Node.js une seule fois :

```javascript
// setup-google-calendar.js
const { google } = require('googleapis');
const readline = require('readline');

const oauth2Client = new google.auth.OAuth2(
  'VOTRE_CLIENT_ID',
  'VOTRE_CLIENT_SECRET',
  'http://localhost:3000/api/auth/callback/google'
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Allez sur cette URL:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Collez le code ici: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh Token:', tokens.refresh_token);
  } catch (error) {
    console.error('Erreur:', error);
  }
  rl.close();
});
```

Exécutez : `node setup-google-calendar.js`

### 4. **Variables d'Environnement**

Ajoutez dans votre `.env.local` :

```bash
# Google Calendar Configuration
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/callback/google
GOOGLE_REFRESH_TOKEN=votre_refresh_token_obtenu
GOOGLE_CALENDAR_ID=primary

# Autres variables existantes...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
SMTP_HOST=smtp.gmail.com
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
PSYCHOLOGIST_EMAIL=dr.guiloufi@gmail.com
PSYCHOLOGIST_NAME=Dr. Guiloufi
```

## 🔧 Comment ça marche

### **Pour les Patients :**
1. Va sur le site → Page réservation
2. Choisit date + heure
3. **Vérification temps réel** : Le système vérifie si le créneau est libre
4. Remplit le formulaire
5. Paye 60€ via Stripe
6. **Automatique** : RDV créé dans votre Google Calendar + emails envoyés

### **Pour le Docteur :**
1. **Consulter** : Tous les RDV dans Google Calendar
2. **Bloquer** : Créer événement "Occupé" / "Congés" pour rendre indisponible
3. **Gérer** : Déplacer, modifier, supprimer les RDV directement dans Calendar
4. **Notifications** : Rappels automatiques sur téléphone

## 📱 Gestion des Créneaux

### **Bloquer des créneaux :**
```
Titre: "Occupé" ou "Congés" ou "Indisponible"
Date: Jour à bloquer
Heure: Créneaux à bloquer
```

### **Créneaux disponibles :**
- Le système vérifie automatiquement Google Calendar
- Si événement existe = créneau occupé
- Si pas d'événement = créneau libre

### **Horaires par défaut :**
- 9h, 10h, 11h, 14h, 15h, 16h, 17h
- Modifiables dans le code si besoin

## 🚀 Test de Fonctionnement

1. **Créer un événement test** dans Google Calendar
2. **Aller sur la page réservation** 
3. **Sélectionner la même date/heure**
4. **Vérifier** : Le créneau doit apparaître indisponible

## ⚠️ Important

- **Refresh Token** : À garder secret et sauvegarder
- **Calendar ID** : "primary" pour le calendrier principal
- **Timezone** : Europe/Paris (configuré automatiquement)
- **Durée RDV** : 1 heure par défaut (modifiable)

## 🔧 Dépannage

### Erreur "Calendar not found"
- Vérifier GOOGLE_CALENDAR_ID
- S'assurer que le calendrier est accessible

### Erreur "Insufficient permissions"
- Regénérer le refresh token
- Vérifier les scopes OAuth

### Créneaux toujours "occupés"
- Vérifier la timezone
- Contrôler les événements existants dans Calendar

Cette configuration permet une gestion professionnelle et automatisée des rendez-vous sans complexité technique pour le docteur !