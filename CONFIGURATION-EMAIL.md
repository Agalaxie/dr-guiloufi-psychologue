# 📧 Configuration du système d'envoi d'emails

## ✅ Système déjà configuré

Le système d'envoi d'emails est déjà implémenté avec :
- **Nodemailer** pour l'envoi d'emails
- **Templates HTML professionnels** pour client et psychologue  
- **Support cabinet/visio** avec icons et informations spécifiques
- **Gestion d'erreurs robuste** avec logs détaillés

## 🔧 Configuration requise

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env.local` (ou sur Vercel) :

```bash
# Configuration SMTP (choisir une option ci-dessous)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-application
SMTP_FROM=votre-email@gmail.com
PSYCHOLOGIST_EMAIL=stephdumaz@gmail.com
PSYCHOLOGIST_NAME=Dr. Guiloufi
```

### 2. Options de configuration SMTP

#### Option A: Gmail (Gratuit, recommandé pour test)
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=mot-de-passe-application-gmail
SMTP_FROM=votre-email@gmail.com
```

**📝 Étapes pour Gmail :**
1. Activez la vérification en 2 étapes sur votre compte Google
2. Générez un mot de passe d'application : [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Utilisez ce mot de passe (16 caractères) dans `SMTP_PASS`

#### Option B: SendGrid (Recommandé pour production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=votre_cle_api_sendgrid
SMTP_FROM=noreply@votre-domaine.com
```

**📝 Étapes pour SendGrid :**
1. Créez un compte sur [SendGrid](https://sendgrid.com)
2. Créez une API Key dans Settings > API Keys
3. Vérifiez votre domaine d'envoi

#### Option C: MailJet (Alternative)
```bash
SMTP_HOST=in-v3.mailjet.com
SMTP_PORT=587
SMTP_USER=votre_cle_publique_mailjet
SMTP_PASS=votre_cle_privee_mailjet
SMTP_FROM=noreply@votre-domaine.com
```

## 🧪 Test du système

### 1. Test de configuration
```bash
curl https://votre-domaine.vercel.app/api/test/email
```

### 2. Test d'envoi d'email
```bash
curl -X POST https://votre-domaine.vercel.app/api/test/email \
  -H "Content-Type: application/json" \
  -d '{"test_email": "votre-email@example.com"}'
```

## 📨 Templates d'emails inclus

### Email client
- ✅ Confirmation de réservation
- 📅 Détails complets du RDV (date, heure, type, motif)
- 🏥 Instructions spécifiques cabinet vs visio
- 📞 Informations de contact
- ⚠️ Rappels importants

### Email psychologue
- 🆕 Notification nouvelle réservation
- 👤 Informations complètes du client
- 💰 Confirmation de paiement
- 📋 Actions recommandées
- 🔗 Liens cliquables (email, téléphone)

## 🔄 Déclenchement automatique

Les emails se déclenchent automatiquement :
1. **Client effectue un paiement** via Stripe
2. **Webhook Stripe** confirmé
3. **Réservation confirmée** en base de données
4. **Emails envoyés** au client ET au psychologue

## 🛠️ Debugging

### Vérifier les logs
Sur Vercel, consultez les logs des fonctions :
- Onglet "Functions" dans votre dashboard Vercel
- Cherchez les logs de `/api/stripe/webhook-supabase`

### Messages d'erreur courants

**"Variables SMTP manquantes"**
→ Vérifiez que `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` sont configurées

**"EAUTH: Authentication failed"**
→ Vérifiez vos identifiants SMTP (surtout le mot de passe d'application pour Gmail)

**"Connection timeout"**
→ Vérifiez `SMTP_HOST` et `SMTP_PORT`

## 📋 Checklist de mise en production

- [ ] Variables SMTP configurées sur Vercel
- [ ] Webhook Stripe configuré et testé
- [ ] Test d'envoi d'email réussi
- [ ] Email psychologue correct dans `PSYCHOLOGIST_EMAIL`
- [ ] Templates d'emails vérifiés
- [ ] Logs de débogage activés

## 🔐 Sécurité

- ✅ Mots de passe d'application Gmail (pas le mot de passe principal)
- ✅ Variables d'environnement sécurisées (pas dans le code)
- ✅ TLS/SSL activé pour toutes les connexions SMTP
- ✅ Gestion d'erreurs sans exposition de données sensibles

## 📞 Support

Si vous rencontrez des problèmes :
1. Testez d'abord avec l'endpoint `/api/test/email`
2. Vérifiez les logs Vercel
3. Confirmez que le webhook Stripe fonctionne
4. Testez avec un autre fournisseur SMTP si nécessaire