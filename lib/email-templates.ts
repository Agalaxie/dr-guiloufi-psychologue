export interface AppointmentEmailData {
  clientName: string
  date: string
  time: string
  consultationType: 'cabinet' | 'visio'
  reason: string
  message?: string
  clientEmail: string
  clientPhone: string
}

// Template email de confirmation pour le client
export function getClientConfirmationEmail(data: AppointmentEmailData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const consultationInfo = data.consultationType === 'cabinet' 
    ? `
      <div style="background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #1e40af;"><strong>🏥 Consultation au cabinet</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e40af;">
          📍 Adresse : [Votre adresse cabinet]<br>
          🚗 Parking : [Informations parking]<br>
          🔔 Merci d'arriver 5 minutes avant votre rendez-vous
        </p>
      </div>
    `
    : `
      <div style="background: #dcfce7; padding: 15px; border-radius: 8px; margin: 15px 0;">
        <p style="margin: 0; color: #166534;"><strong>💻 Consultation en visioconférence</strong></p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #166534;">
          🔗 Le lien de connexion vous sera envoyé 24h avant le rendez-vous<br>
          💻 Assurez-vous d'avoir une bonne connexion internet<br>
          🎥 Vérifiez votre caméra et micro avant la séance
        </p>
      </div>
    `

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #2563eb; margin: 0;">✅ Rendez-vous confirmé</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0;">Consultation avec Dr. Guiloufi</p>
      </div>

      <p>Bonjour <strong>${data.clientName}</strong>,</p>
      <p>Votre rendez-vous a été confirmé et payé avec succès !</p>
      
      <div style="background: #f9fafb; border: 2px solid #e5e7eb; padding: 25px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #374151;">📋 Détails de votre rendez-vous</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>📅 Date :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>🕒 Heure :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>📍 Type :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${data.consultationType === 'cabinet' ? '🏥 Au cabinet' : '💻 En visioconférence'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>🎯 Motif :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${data.reason}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>💰 Montant :</strong></td>
            <td style="padding: 8px 0; color: #16a34a; font-weight: bold;">60€ ✅ Payé</td>
          </tr>
        </table>
      </div>

      ${consultationInfo}

      <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h4 style="margin-top: 0; color: #92400e;">⚠️ Informations importantes</h4>
        <ul style="margin: 0; padding-left: 20px; color: #92400e;">
          <li>En cas d'empêchement, merci de prévenir au moins 24h à l'avance</li>
          <li>Apportez votre carte d'identité si c'est votre premier rendez-vous</li>
          <li>Pensez à noter vos questions importantes avant la séance</li>
        </ul>
      </div>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h4 style="margin-top: 0; color: #374151;">📞 Contact</h4>
        <p style="margin: 5px 0; color: #6b7280;">
          📧 Email : ${process.env.PSYCHOLOGIST_EMAIL || 'stephdumaz@gmail.com'}<br>
          🌐 Site web : ${process.env.NEXTAUTH_URL}
        </p>
      </div>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          À bientôt !<br>
          <strong>${process.env.PSYCHOLOGIST_NAME || 'Dr. Guiloufi'}</strong>
        </p>
      </div>
    </div>
  `
}

// Template email de notification pour le psychologue
export function getDoctorNotificationEmail(data: AppointmentEmailData): string {
  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc2626; margin: 0;">🆕 Nouvelle réservation</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0;">Rendez-vous confirmé et payé</p>
      </div>
      
      <div style="background: #fef2f2; border: 2px solid #fca5a5; padding: 25px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">👤 Informations client</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>Nom :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${data.clientName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Email :</strong></td>
            <td style="padding: 8px 0; color: #111827;">
              <a href="mailto:${data.clientEmail}" style="color: #2563eb;">${data.clientEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>Téléphone :</strong></td>
            <td style="padding: 8px 0; color: #111827;">
              <a href="tel:${data.clientPhone}" style="color: #2563eb;">${data.clientPhone}</a>
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #eff6ff; border: 2px solid #93c5fd; padding: 25px; border-radius: 12px; margin: 25px 0;">
        <h3 style="margin-top: 0; color: #1d4ed8;">📅 Détails du rendez-vous</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b7280; width: 120px;"><strong>📅 Date :</strong></td>
            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>🕒 Heure :</strong></td>
            <td style="padding: 8px 0; color: #111827; font-weight: bold;">${data.time}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>📍 Type :</strong></td>
            <td style="padding: 8px 0; color: #111827; font-weight: bold;">
              ${data.consultationType === 'cabinet' ? '🏥 Au cabinet' : '💻 En visioconférence'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b7280;"><strong>🎯 Motif :</strong></td>
            <td style="padding: 8px 0; color: #111827;">${data.reason}</td>
          </tr>
          ${data.message ? `
          <tr>
            <td style="padding: 8px 0; color: #6b7280; vertical-align: top;"><strong>💬 Message :</strong></td>
            <td style="padding: 8px 0; color: #111827; font-style: italic;">${data.message}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <div style="background: #dcfce7; border: 2px solid #86efac; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #166534; font-weight: bold; font-size: 18px;">
          ✅ Paiement confirmé : 60€
        </p>
      </div>

      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <h4 style="margin-top: 0; color: #374151;">🔄 Actions recommandées</h4>
        <ul style="margin: 0; padding-left: 20px; color: #6b7280;">
          <li>Ajouter le rendez-vous à votre calendrier</li>
          <li>Préparer le dossier patient si nécessaire</li>
          ${data.consultationType === 'visio' ? '<li>Préparer le lien de visioconférence</li>' : '<li>Vérifier la disponibilité de la salle</li>'}
          <li>Confirmer la réception si besoin</li>
        </ul>
      </div>

      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Notification automatique du système de réservation<br>
          <strong>${process.env.NEXTAUTH_URL}</strong>
        </p>
      </div>
    </div>
  `
}