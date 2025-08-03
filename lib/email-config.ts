import nodemailer from 'nodemailer'

// Configuration du transporteur email
export function createEmailTransporter() {
  // Vérifier que les variables d'environnement sont présentes
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Variables SMTP manquantes. Vérifiez SMTP_HOST, SMTP_USER, SMTP_PASS dans votre .env')
  }

  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    // Configuration pour éviter les erreurs SSL communes
    tls: {
      rejectUnauthorized: false
    }
  })
}

// Test de la configuration email
export async function testEmailConfig() {
  try {
    const transporter = createEmailTransporter()
    
    // Vérifier la connexion
    await transporter.verify()
    
    console.log('✅ Configuration email valide')
    return { success: true, message: 'Configuration email valide' }
  } catch (error) {
    console.error('❌ Erreur configuration email:', error)
    return { 
      success: false, 
      message: `Erreur configuration email: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    }
  }
}

// Interface pour les données d'email
export interface EmailData {
  to: string
  subject: string
  html: string
  from?: string
}

// Fonction d'envoi d'email avec gestion d'erreurs
export async function sendEmail(emailData: EmailData) {
  try {
    const transporter = createEmailTransporter()
    
    const mailOptions = {
      from: emailData.from || process.env.SMTP_FROM,
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('✅ Email envoyé avec succès:', result.messageId)
    
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('❌ Erreur envoi email:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    }
  }
}