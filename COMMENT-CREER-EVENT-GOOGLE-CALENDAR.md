# 📅 Comment Créer un Événement Google Calendar (Test)

## 🎯 **Objectif**
Créer un événement "Occupé" dans Google Calendar pour tester que votre application bloque bien les créneaux réservés.

## 📱 **Méthode 1 : Sur Ordinateur (Recommandée)**

### **Étape 1 : Aller sur Google Calendar**
1. **Ouvrir** : [calendar.google.com](https://calendar.google.com)
2. **Se connecter** avec `stephdumaz@gmail.com` (le même compte autorisé)

### **Étape 2 : Créer l'événement de test**
1. **Cliquer** sur le bouton **"+ Créer"** (en haut à gauche)
2. **Ou cliquer** directement sur une heure dans le calendrier

### **Étape 3 : Remplir les détails**
```
📝 Titre : "Occupé"
📅 Date : Demain (ou aujourd'hui)
🕐 Heure : 14:00 - 15:00
📍 Lieu : (laisser vide)
📝 Description : Test pour l'application
```

### **Étape 4 : Sauvegarder**
1. **Cliquer** "Enregistrer"
2. L'événement apparaît dans votre calendrier

## 📱 **Méthode 2 : Sur Téléphone**

### **Application Google Calendar**
1. **Ouvrir** l'app Google Calendar
2. **Appuyer** sur le **"+"** en bas à droite
3. **Sélectionner** "Événement"
4. **Remplir** :
   - Titre : "Occupé"
   - Date : Demain
   - Heure : 14h-15h
5. **Appuyer** "Enregistrer"

## 🧪 **Test de l'Application**

### **Étape 1 : Vérifier l'événement créé**
1. **Retourner** sur [calendar.google.com](https://calendar.google.com)
2. **Vérifier** que l'événement "Occupé" est bien visible

### **Étape 2 : Tester sur votre site**
1. **Aller** sur : http://localhost:3000/booking
2. **Sélectionner** la même date que votre événement
3. **Vérifier** que 14h n'est PAS dans la liste des créneaux disponibles

### **Résultat Attendu**
- ✅ **14h absent** de la liste des heures disponibles
- ✅ **Autres heures visibles** : 9h, 10h, 11h, 15h, 16h, 17h
- ❌ **Si 14h est toujours disponible** = Problème de configuration

## 🔧 **Types d'événements qui bloquent**

### **✅ Events qui BLOQUENT les créneaux :**
- Titre : "Occupé", "Indisponible", "Congés"
- Titre : "RDV Patient X"
- **Tout événement** dans le calendrier bloque le créneau

### **🎯 Conseils Pratiques**
- **"Occupé"** : Bloquer des créneaux génériques
- **"Congés"** : Vacances, jours off
- **"Formation"** : Formations, réunions
- **"RDV [Nom]"** : Rendez-vous existants

## 📋 **Événements de Test Recommandés**

```
Event 1:
📝 Titre : "Occupé"
📅 Date : Demain
🕐 Heure : 14:00-15:00

Event 2:
📝 Titre : "Congés"
📅 Date : Après-demain
🕐 Heure : 09:00-17:00 (journée complète)

Event 3:
📝 Titre : "RDV Test"
📅 Date : Dans 3 jours
🕐 Heure : 10:00-11:00
```

## 🎯 **Vérification Finale**

### **✅ Test Réussi Si :**
1. **Événement visible** dans Google Calendar
2. **Créneau bloqué** sur le site de réservation
3. **Autres créneaux disponibles** normalement

### **❌ Si ça ne marche pas :**
1. **Vérifier** le `.env.local` avec le bon REFRESH_TOKEN
2. **Redémarrer** l'application : `npm run dev`
3. **Vérifier** que vous utilisez le bon compte Google
4. **Regarder** les erreurs dans le terminal

## 🚀 **Prochaine Étape**

Une fois le test réussi, vous pourrez :
1. **Configurer Stripe** pour les paiements
2. **Configurer les emails** SMTP
3. **Tester** une réservation complète
4. **Déployer** en production

**Allez créer votre premier événement "Occupé" maintenant !** 📅