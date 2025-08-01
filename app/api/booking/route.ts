import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { date, time, type, firstName, lastName, email, phone, reason, message } = body

    // Configuration du transporteur email (à adapter selon votre fournisseur)
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Email de confirmation pour le patient
    const patientEmailContent = `
      Bonjour ${firstName} ${lastName},

      Votre rendez-vous avec Dr. Guiloufi a été confirmé avec les détails suivants :

      📅 Date : ${new Date(date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
      🕐 Heure : ${time}
      ${type === 'online' ? '💻 Type : Consultation en ligne' : '🏥 Type : Consultation au cabinet'}
      ${reason ? `📝 Motif : ${reason}` : ''}

      ${type === 'online' 
        ? `Le lien de connexion pour votre consultation en ligne vous sera envoyé 30 minutes avant le rendez-vous.

      Informations importantes pour la consultation en ligne :
      - Assurez-vous d'avoir une connexion internet stable
      - Préparez un endroit calme et privé
      - Testez votre caméra et microphone à l'avance`
        : `Adresse du cabinet :
      Dr. Guiloufi
      [Adresse complète]
      Paris 18ème

      Informations pratiques :
      - Merci d'arriver 5 minutes avant l'heure du rendez-vous
      - Pensez à apporter votre carte vitale
      - Le cabinet est accessible en transport en commun`}

      En cas d'empêchement, merci de nous prévenir au moins 24h à l'avance.

      Pour toute question, n'hésitez pas à nous contacter.

      Cordialement,
      Dr. Guiloufi
      Psychologue
    `

    // Email de notification pour le psychologue
    const doctorEmailContent = `
      Nouveau rendez-vous réservé :

      Patient : ${firstName} ${lastName}
      Email : ${email}
      Téléphone : ${phone}
      Date : ${new Date(date).toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
      Heure : ${time}
      Type : ${type === 'online' ? 'Consultation en ligne' : 'Consultation au cabinet'}
      ${reason ? `Motif : ${reason}` : ''}
      ${message ? `Message : ${message}` : ''}
    `

    // Envoi de l'email de confirmation au patient
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'contact@dr-guiloufi.fr',
      to: email,
      subject: 'Confirmation de votre rendez-vous - Dr. Guiloufi',
      text: patientEmailContent,
    })

    // Envoi de l'email de notification au psychologue
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'contact@dr-guiloufi.fr',
      to: process.env.DOCTOR_EMAIL || 'guiloufi@example.com',
      subject: `Nouveau RDV: ${firstName} ${lastName} - ${new Date(date).toLocaleDateString('fr-FR')} ${time}`,
      text: doctorEmailContent,
    })

    // Ici vous pourriez également sauvegarder en base de données
    // await saveBookingToDatabase(body)

    return NextResponse.json({ 
      success: true, 
      message: 'Réservation confirmée et emails envoyés' 
    })

  } catch (error) {
    console.error('Erreur lors de la réservation:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la réservation' },
      { status: 500 }
    )
  }
}