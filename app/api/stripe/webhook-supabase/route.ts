import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { headers } from 'next/headers';
import { confirmAppointment } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Traiter l'événement de paiement réussi
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('🎉 Webhook reçu pour session:', session.id);

    try {
      // 1. Confirmer la réservation dans Supabase
      console.log('📝 Tentative de confirmation...');
      const confirmed = await confirmAppointment(session.id);
      
      if (!confirmed) {
        console.error('Erreur confirmation réservation dans Supabase');
        return NextResponse.json({ error: 'Erreur confirmation réservation' }, { status: 500 });
      }

      // 2. Récupérer les métadonnées de la réservation
      const metadata = session.metadata;
      if (!metadata) {
        console.log('Pas de métadonnées trouvées');
        return NextResponse.json({ received: true });
      }

      const appointmentData = {
        date: metadata.appointment_date,
        time: metadata.appointment_time,
        clientName: metadata.client_name,
        clientEmail: metadata.client_email,
        clientPhone: metadata.client_phone,
        reason: metadata.reason,
        message: metadata.message || '',
      };

      // 3. Configurer le transporteur d'email
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // 4. Email de confirmation au client
      const clientEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">✅ Réservation Confirmée</h2>
          <p>Bonjour <strong>${appointmentData.clientName}</strong>,</p>
          <p>Votre rendez-vous a été confirmé et payé avec succès !</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Détails du rendez-vous :</h3>
            <p><strong>📅 Date :</strong> ${new Date(appointmentData.date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>🕒 Heure :</strong> ${appointmentData.time}</p>
            <p><strong>🎯 Motif :</strong> ${appointmentData.reason}</p>
            <p><strong>💰 Montant payé :</strong> 60€</p>
          </div>

          <p>En cas de besoin, vous pouvez nous contacter :</p>
          <p>📧 Email : ${process.env.PSYCHOLOGIST_EMAIL}<br>
          📞 Téléphone : [Votre numéro]</p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            À bientôt !<br>
            ${process.env.PSYCHOLOGIST_NAME || 'Dr. Guiloufi'}
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: appointmentData.clientEmail,
        subject: `✅ Rendez-vous confirmé - ${new Date(appointmentData.date).toLocaleDateString('fr-FR')} à ${appointmentData.time}`,
        html: clientEmailHtml,
      });

      // 5. Email de notification au psychologue
      const doctorEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">🆕 Nouvelle Réservation</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin-top: 0; color: #dc2626;">Détails du rendez-vous :</h3>
            <p><strong>👤 Client :</strong> ${appointmentData.clientName}</p>
            <p><strong>📧 Email :</strong> ${appointmentData.clientEmail}</p>
            <p><strong>📞 Téléphone :</strong> ${appointmentData.clientPhone}</p>
            <p><strong>📅 Date :</strong> ${new Date(appointmentData.date).toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
            <p><strong>🕒 Heure :</strong> ${appointmentData.time}</p>
            <p><strong>🎯 Motif :</strong> ${appointmentData.reason}</p>
            ${appointmentData.message ? `<p><strong>💬 Message :</strong> ${appointmentData.message}</p>` : ''}
          </div>

          <p style="background: #dcfce7; padding: 15px; border-radius: 8px; color: #166534;">
            ✅ <strong>Paiement confirmé :</strong> 60€
          </p>

          <p style="background: #dbeafe; padding: 15px; border-radius: 8px; color: #1e40af;">
            📅 <strong>Réservation confirmée</strong> dans la base de données
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.PSYCHOLOGIST_EMAIL,
        subject: `🆕 Nouveau RDV - ${appointmentData.clientName} le ${new Date(appointmentData.date).toLocaleDateString('fr-FR')}`,
        html: doctorEmailHtml,
      });

      console.log('Réservation traitée avec succès:', {
        client: appointmentData.clientName,
        date: appointmentData.date,
        time: appointmentData.time,
        confirmed: true
      });

    } catch (error) {
      console.error('Erreur traitement réservation:', error);
      return NextResponse.json({ error: 'Erreur traitement réservation' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}