# 🔧 Solution Erreur Google OAuth 403

## ❌ **Problème**
```
Erreur 403 : access_denied
Cabinet Dr. Guiloufi n'a pas terminé la procédure de validation de Google
```

## ✅ **Solution Simple (2 minutes)**

### **Étape 1 : Ajouter votre email comme testeur**
1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Sélectionner votre projet "PSY-Calendar-DrGuiloufi"
3. Menu → **"APIs & Services"** → **"OAuth consent screen"**
4. Faire défiler jusqu'à **"Test users"**
5. Cliquer **"+ ADD USERS"**
6. Ajouter votre email : `stephdumaz@gmail.com`
7. Cliquer **"SAVE"**

### **Étape 2 : Relancer le script**
```bash
node setup-google-calendar.js
```

## 🎯 **Pourquoi cette erreur ?**

- **Google OAuth** en mode développement nécessite des "testeurs approuvés"
- Votre application est en **"testing"** (normal pour un développement)
- Seuls les emails ajoutés peuvent autoriser l'application
- **Alternative** : Publier l'app (mais pas nécessaire pour développement)

## 🔄 **Étapes Suivantes**

1. **Ajouter testeur** → **Relancer script** → **Obtenir refresh token**
2. **Configurer .env.local** avec le token
3. **Tester l'application** complète

## 📱 **Pour Production (Plus tard)**

Quand votre application sera prête :
1. **OAuth consent screen** → **"PUBLISH APP"**
2. Google review (7-14 jours)
3. **Public access** pour tous les utilisateurs

Mais pour le développement, ajouter votre email comme testeur suffit !