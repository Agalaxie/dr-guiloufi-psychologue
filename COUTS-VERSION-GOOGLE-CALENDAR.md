# 💰 Coûts Version Google Calendar - Cabinet Dr. Guiloufi

## 🎯 Résumé Exécutif

La version Google Calendar maintient les coûts très bas tout en ajoutant la gestion professionnelle des créneaux. **Coût annuel estimé : 50-300€**.

## 🔧 Architecture Google Calendar

- ✅ **Frontend** : Next.js sur Vercel (gratuit)
- ✅ **Paiements** : Stripe Checkout direct
- ✅ **Emails** : SMTP gratuit (Gmail)
- ✅ **Calendrier** : Google Calendar API (gratuit)
- ✅ **Vérification temps réel** : Évite les doubles réservations
- ❌ **Base de données** : Supprimée
- ❌ **Authentification** : Supprimée

## 💸 Détail des Coûts Annuels

### 🟢 Coûts Fixes (Gratuits)

| Service | Plan | Quota | Coût |
|---------|------|-------|------|
| **Vercel Hosting** | Hobby | Illimité | €0/an |
| **Google Calendar API** | Gratuit | 1M req/jour | €0/an |
| **Gmail SMTP** | Gratuit | 500 emails/jour | €0/an |
| **Google Cloud** | Gratuit | Quota généreux | €0/an |
| **Domaine** | .fr/.com | - | €10-15/an |

### 🟡 Coûts Variables (Par Usage)

| Service | Tarif | Usage Faible | Usage Moyen | 
|---------|-------|-------------|-------------|
| **Stripe** | 1.4% + 0.25€ | 10-50 RDV/mois | 50-100 RDV/mois |
| | | €9-36/mois | €44-86/mois |
| | | €108-432/an | €528-1032/an |

## 📊 Scénarios de Coûts Totaux

### 🟢 **Trafic Faible** (10-20 RDV/mois)
| Composant | Coût Annuel |
|-----------|-------------|
| Hébergement | €0 |
| Domaine | €15 |
| Google APIs | €0 |
| Stripe (15 RDV/mois × 60€) | €189 |
| **TOTAL** | **€204/an** |
| **Par mois** | **€17/mois** |

### 🟡 **Trafic Moyen** (50-80 RDV/mois)
| Composant | Coût Annuel |
|-----------|-------------|
| Hébergement | €0 |
| Domaine | €15 |
| Google APIs | €0 |
| Stripe (65 RDV/mois × 60€) | €662 |
| **TOTAL** | **€677/an** |
| **Par mois** | **€56/mois** |

## 🆚 Comparaison avec Concurrents

| Solution | Coût Mensuel | Fonctionnalités |
|----------|-------------|-----------------|
| **Votre solution** | €17-56 | Paiement + Calendar + Site |
| Doctolib Pro | €129/mois | Prise RDV seulement |
| Calendly Premium | €8/mois | Calendar seul (pas de paiement) |
| Square Appointments | €50/mois | RDV + Paiement basique |

## ✅ Avantages Économiques

### **ROI Immédiat**
- **Break-even** : Dès le 1er rendez-vous payé
- **Doctolib** : €129/mois = 2+ RDV juste pour les frais
- **Votre solution** : €17/mois = Rentable dès 1 RDV

### **Évolutivité**
- **0-100 RDV/mois** : Même infrastructure
- **Pas de paliers** : Coûts proportionnels uniquement
- **Pas d'abonnement** : Payez seulement ce que vous utilisez

### **Simplicité**
- **Pas de formation** : Google Calendar familier
- **Pas de migration** : Gardez vos outils existants
- **Maintenance minimale** : Google s'occupe de tout

## 📈 Projection 3 Ans

### Croissance Progressive
| Année | RDV/mois | Coût Total | CA (60€/RDV) | Marge |
|-------|----------|------------|--------------|-------|
| **An 1** | 20 | €356/an | €14,400 | 97.5% |
| **An 2** | 50 | €677/an | €36,000 | 98.1% |
| **An 3** | 80 | €1,032/an | €57,600 | 98.2% |

### **Économies vs Doctolib**
- **3 ans Doctolib** : €4,644 d'abonnement
- **3 ans votre solution** : €2,065 total
- **Économie** : €2,579 sur 3 ans

## 🚀 Optimisations Possibles

### **Réduire Stripe**
- **Virement bancaire** : 0% commission pour clients fidèles
- **Stripe Elements** : Interface personnalisée (même prix)
- **Promotion** : "Paiement sur place = -5€" (€55 au lieu de €60)

### **Monétiser davantage**
- **Consultations vidéo** : +30€ supplement
- **Rapports** : PDF automatique +10€
- **Rappels SMS** : Service premium +5€

## 🔧 Alternatives si Budget Serré

### **Version 100% Gratuite**
- Supprimer Stripe → Paiement sur place
- Garder Google Calendar pour la gestion
- **Coût** : €15/an (domaine uniquement)

### **Freemium progressif**
- Démarrer gratuit (paiement sur place)
- Activer Stripe quand 20+ RDV/mois
- Migrer sans interruption

## 📋 Recommandation

**Pour démarrer** : Version Google Calendar complète
- Coût prévisible et proportionnel
- Gestion professionnelle
- Évolutif sans migration
- ROI immédiat dès le premier patient

La version Google Calendar offre le meilleur compromis **fonctionnalités/coût/simplicité** pour un cabinet en développement.